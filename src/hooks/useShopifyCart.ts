// Custom hook for managing Shopify cart
import { useState, useEffect, useCallback } from 'react';
import { shopifyClient } from '../utils/shopifyClient';
import {
  CREATE_CART,
  ADD_TO_CART,
  UPDATE_CART_LINES,
  REMOVE_FROM_CART,
  GET_CART
} from '../utils/shopifyQueries';
import { ShopifyCart, ProcessedCartItem, CartLineInput } from '../types/shopify';
import { transformCartLine } from '../utils/shopifyHelpers';
import { trackCartAdd } from '../utils/inventoryHelpers';
import { isBrowser, safeLocalStorageGetItem, safeLocalStorageSetItem, safeLocalStorageRemoveItem } from '../utils/safeHydration.tsx';

const CART_ID_KEY = 'shopify_cart_id';

export const useShopifyCart = () => {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [cartItems, setCartItems] = useState<ProcessedCartItem[]>([]);
  const [loading, setLoading] = useState(true); // Start as loading to prevent flash
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Get cart ID from localStorage (safe for SSR)
  const getStoredCartId = (): string | null => {
    if (!isBrowser()) return null;
    return safeLocalStorageGetItem(CART_ID_KEY);
  };

  // Store cart ID in localStorage (safe for SSR)
  const storeCartId = (cartId: string) => {
    if (!isBrowser()) return;
    safeLocalStorageSetItem(CART_ID_KEY, cartId);
  };

  // Clear stored cart ID (safe for SSR)
  const clearStoredCartId = () => {
    if (!isBrowser()) return;
    safeLocalStorageRemoveItem(CART_ID_KEY);
  };

  // Update cart state and items
  const updateCartState = (newCart: ShopifyCart) => {
    setCart(newCart);
    if (newCart?.lines?.edges && Array.isArray(newCart.lines.edges)) {
      const transformedItems = newCart.lines.edges.map(edge => transformCartLine(edge.node));
      setCartItems(transformedItems);
    } else {
      setCartItems([]);
    }
  };

  // Fetch existing cart
  const fetchCart = useCallback(async (cartId: string) => {
    if (!shopifyClient) {
      console.warn('Shopify client not available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await shopifyClient.request(GET_CART, { cartId });

      if (response.cart) {
        updateCartState(response.cart);
      } else {
        // Cart not found, clear stored ID
        clearStoredCartId();
        setCart(null);
        setCartItems([]);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to fetch cart');
      clearStoredCartId();
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new cart
  const createCart = async (lines: CartLineInput[] = []) => {
    if (!shopifyClient) {
      const error = new Error('Shopify client not available');
      setError('Store not available');
      throw error;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🛒 Creating new cart with lines:', JSON.stringify(lines, null, 2));

      const response = await shopifyClient.request(CREATE_CART, {
        input: {
          lines
        }
      });

      // Check for user errors first
      if (response.cartCreate.userErrors && response.cartCreate.userErrors.length > 0) {
        const errorMessages = response.cartCreate.userErrors
          .map((err: any) => `${err.field}: ${err.message}`)
          .join(', ');
        throw new Error(`Cart creation failed: ${errorMessages}`);
      }

      if (response.cartCreate.cart) {
        const newCart = response.cartCreate.cart;
        storeCartId(newCart.id);
        updateCartState(newCart);
        return newCart;
      } else {
        throw new Error('Failed to create cart - no cart in response');
      }
    } catch (err) {
      console.error('Error creating cart:', err);
      setError('Failed to create cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (
    variantId: string,
    quantity: number = 1,
    attributes?: { key: string; value: string }[],
    productId?: string
  ) => {
    if (!shopifyClient) {
      const error = new Error('Shopify client not available');
      setError('Store not available');
      throw error;
    }

    try {
      setLoading(true);
      setError(null);

      // Build line input - only include attributes if they exist and are not empty
      const lineInput: CartLineInput = {
        merchandiseId: variantId,
        quantity
      };

      // Only add attributes if they exist and array is not empty
      if (attributes && attributes.length > 0) {
        lineInput.attributes = attributes;
      }

      let currentCartId = getStoredCartId();

      if (!currentCartId) {
        // Create new cart with the item
        await createCart([lineInput]);
      } else {
        // Add to existing cart
        const response = await shopifyClient.request(ADD_TO_CART, {
          cartId: currentCartId,
          lines: [lineInput]
        });

        // Check for user errors
        if (response.cartLinesAdd.userErrors && response.cartLinesAdd.userErrors.length > 0) {
          const errorMessages = response.cartLinesAdd.userErrors
            .map((err: any) => `${err.field}: ${err.message}`)
            .join(', ');
          throw new Error(`Add to cart failed: ${errorMessages}`);
        }

        if (response.cartLinesAdd.cart) {
          updateCartState(response.cartLinesAdd.cart);
        } else {
          throw new Error('Failed to add item to cart');
        }
      }

      // Track cart addition for analytics
      if (productId) {
        trackCartAdd(productId, variantId, quantity).catch(err =>
          console.error('Failed to track cart add:', err)
        );
      }
    } catch (err) {
      console.error('❌ Error adding to cart:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        variantId,
        quantity,
        hasClient: !!shopifyClient,
        hasStoredCartId: !!getStoredCartId()
      });
      setError('Failed to add item to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update cart line quantity
  const updateCartLine = async (lineId: string, quantity: number) => {
    const cartId = getStoredCartId();
    if (!cartId || !shopifyClient) return;

    try {
      setLoading(true);
      setError(null);

      const response = await shopifyClient.request(UPDATE_CART_LINES, {
        cartId,
        lines: [{ id: lineId, quantity }]
      });

      if (response.cartLinesUpdate.cart) {
        updateCartState(response.cartLinesUpdate.cart);
      }
    } catch (err) {
      console.error('Error updating cart line:', err);
      setError('Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (lineId: string) => {
    const cartId = getStoredCartId();
    if (!cartId || !shopifyClient) return;

    try {
      setLoading(true);
      setError(null);

      const response = await shopifyClient.request(REMOVE_FROM_CART, {
        cartId,
        lineIds: [lineId]
      });

      if (response.cartLinesRemove.cart) {
        updateCartState(response.cartLinesRemove.cart);
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = () => {
    clearStoredCartId();
    setCart(null);
    setCartItems([]);
  };

  // Get checkout URL (with preview token cleaning)
  const getCheckoutUrl = (): string | null => {
    if (!cart?.checkoutUrl) return null;

    try {
      // Remove preview token parameters (temporary workaround until Shopify Admin is updated)
      const url = new URL(cart.checkoutUrl);
      url.searchParams.delete('profile_preview_token');
      url.searchParams.delete('_r');

      return url.toString();
    } catch (error) {
      console.error('Error cleaning checkout URL:', error);
      // Fallback to original URL if parsing fails
      return cart.checkoutUrl;
    }
  };

  // Get total price
  const getTotalPrice = (): number => {
    return cart ? parseFloat(cart.cost.totalAmount.amount) : 0;
  };

  // Get total quantity
  const getTotalQuantity = (): number => {
    return cart?.totalQuantity || 0;
  };

  // Initialize cart on mount (after hydration)
  useEffect(() => {
    if (!isBrowser()) {
      setLoading(false);
      return;
    }

    const storedCartId = getStoredCartId();
    if (storedCartId) {
      fetchCart(storedCartId);
    } else {
      setLoading(false);
    }
    setIsHydrated(true);
  }, [fetchCart]);

  return {
    cart,
    cartItems,
    loading,
    error,
    addToCart,
    updateCartLine,
    removeFromCart,
    clearCart,
    getCheckoutUrl,
    getTotalPrice,
    getTotalQuantity,
    refetchCart: () => {
      const cartId = getStoredCartId();
      if (cartId) fetchCart(cartId);
    }
  };
};