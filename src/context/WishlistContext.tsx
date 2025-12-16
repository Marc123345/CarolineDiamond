import React, { createContext, useContext, useReducer, useMemo, ReactNode, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { addToWishlistDb, removeFromWishlistDb } from '../lib/wishlistDb';
import { isBrowser, safeJSONParse, safeLocalStorageGetItem, safeLocalStorageSetItem } from '../utils/safeHydration.tsx';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
  isOpen: boolean;
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'TOGGLE_WISHLIST' }
  | { type: 'CLOSE_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] };

const initialState: WishlistState = {
  items: [],
  isOpen: false
};

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const exists = state.items.find(item => item.id === action.payload.id);
      if (exists) return state;
      addToWishlistDb(action.payload).catch(err => {
        console.error('Failed to add item to wishlist database:', err);
      });
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case 'REMOVE_ITEM':
      removeFromWishlistDb(action.payload).catch(err => {
        console.error('Failed to remove item from wishlist database:', err);
      });
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'TOGGLE_WISHLIST':
      return {
        ...state,
        isOpen: !state.isOpen
      };

    case 'CLOSE_WISHLIST':
      return {
        ...state,
        isOpen: false
      };

    case 'LOAD_WISHLIST':
      return {
        ...state,
        items: action.payload
      };

    default:
      return state;
  }
};

const WishlistContext = createContext<{
  state: WishlistState;
  dispatch: React.Dispatch<WishlistAction>;
} | null>(null);

const WISHLIST_STORAGE_KEY = 'wishlist_items';

const loadLocalWishlist = (): WishlistItem[] => {
  if (!isBrowser()) return [];

  const stored = safeLocalStorageGetItem(WISHLIST_STORAGE_KEY);
  return safeJSONParse(stored, []);
};

const saveLocalWishlist = (items: WishlistItem[]) => {
  if (!isBrowser()) return;

  try {
    safeLocalStorageSetItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save wishlist to localStorage:', err);
  }
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    saveLocalWishlist(state.items);
  }, [state.items]);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const localItems = loadLocalWishlist();
        if (localItems.length > 0) {
          dispatch({ type: 'LOAD_WISHLIST', payload: localItems });
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (user && !isSyncingRef.current) {
          isSyncingRef.current = true;
          const { data, error } = await supabase
            .from('wishlist_items')
            .select('*')
            .eq('user_id', user.id);

          if (error) {
            console.error('Error loading wishlist:', error);
            isSyncingRef.current = false;
            return;
          }

          if (data) {
            const dbItems: WishlistItem[] = data.map(item => ({
              id: item.product_id,
              name: item.product_name,
              price: parseFloat(item.product_price),
              image: item.product_image || undefined,
              category: item.product_category
            }));

            const mergedItems = [...dbItems];
            localItems.forEach(localItem => {
              if (!mergedItems.find(item => item.id === localItem.id)) {
                mergedItems.push(localItem);
                addToWishlistDb(localItem).catch(err =>
                  console.error('Failed to sync local item to DB:', err)
                );
              }
            });

            dispatch({ type: 'LOAD_WISHLIST', payload: mergedItems });
          }
          isSyncingRef.current = false;
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
        isSyncingRef.current = false;
      }
    };
    loadWishlist();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user && !isSyncingRef.current) {
        loadWishlist();
      } else if (event === 'SIGNED_OUT') {
        const localItems = loadLocalWishlist();
        dispatch({ type: 'LOAD_WISHLIST', payload: localItems });
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);


  const contextValue = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};