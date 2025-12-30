import React from 'react';
import { X, ShoppingBag, Heart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export const Wishlist: React.FC = () => {
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const { dispatch: cartDispatch } = useCart();

  const moveToCart = (item: { id: string; name: string; price: number; image?: string; category: string; quantity?: number }) => {
    const cartItem = {
      ...item,
      quantity: 1
    };
    cartDispatch({ type: 'ADD_ITEM', payload: cartItem });
    wishlistDispatch({ type: 'REMOVE_ITEM', payload: item.id });
  };

  const removeFromWishlist = (id: string) => {
    wishlistDispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  if (!wishlistState.isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4 w-full max-w-full safe-area-top safe-area-bottom safe-area-left safe-area-right">
      <div className="bg-surface-elevated rounded-none sm:rounded-2xl w-full max-w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-primary-200 flex-shrink-0">
          <div className="flex items-center">
            <Heart className="h-5 sm:h-6 w-5 sm:w-6 text-red-500 mr-2 sm:mr-3 fill-current" />
            <div className="text-lg sm:text-xl font-semibold text-primary-800">Wishlist</div>
            <span className="ml-2 sm:ml-3 bg-red-500 text-white text-xs sm:text-sm px-2 py-1 rounded-full">
              {wishlistState.items.length}
            </span>
          </div>
          <button
            onClick={() => wishlistDispatch({ type: 'CLOSE_WISHLIST' })}
            className="p-3 sm:p-2 hover:bg-[#f3ede8] transition-colors duration-200 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
          >
            <X className="h-5 sm:h-6 w-5 sm:w-6 text-primary-800" />
          </button>
        </div>

        {/* Wishlist Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 w-full max-w-full">
          {wishlistState.items.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Heart className="h-12 sm:h-16 w-12 sm:w-16 text-accent-500 mx-auto mb-3 sm:mb-4" />
              <div className="text-lg sm:text-xl font-semibold text-primary-800 mb-2">Your wishlist is empty</div>
              <div className="text-sm sm:text-base text-accent-500 mb-4 sm:mb-6 px-4">Add items you love to your wishlist</div>
              <button
                onClick={() => wishlistDispatch({ type: 'CLOSE_WISHLIST' })}
                className="btn-primary px-6 py-3 text-sm sm:text-base"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4 w-full max-w-full">
              {wishlistState.items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-primary-50 hover:bg-primary-100 transition-colors duration-200 rounded-lg sm:rounded-xl w-full max-w-full">
                  {/* Mobile: Image and basic info in row */}
                  <div className="flex items-center gap-3 sm:hidden w-full max-w-full">
                    <img
                      src={item.image || 'https://images.pexels.com/photos/1454155/pexels-photo-1454155.jpeg?auto=compress&cs=tinysrgb&w=200'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0 max-w-full"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-primary-800 leading-tight break-words overflow-wrap-anywhere">{item.name}</h4>
                      <p className="text-xs text-accent-500 break-words overflow-wrap-anywhere">{item.category}</p>
                      <p className="text-sm font-bold text-primary-500">€{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* Desktop: Original layout */}
                  <img
                    src={item.image || 'https://images.pexels.com/photos/1454155/pexels-photo-1454155.jpeg?auto=compress&cs=tinysrgb&w=200'}
                    alt={item.name}
                    className="hidden sm:block w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-lg flex-shrink-0 max-w-full"
                  />
                  <div className="hidden sm:block flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-semibold text-primary-800 leading-tight break-words overflow-wrap-anywhere">{item.name}</h4>
                    <p className="text-accent-500 text-xs sm:text-sm break-words overflow-wrap-anywhere">{item.category}</p>
                    <p className="text-sm sm:text-base font-bold text-primary-500 mt-1">€{item.price.toLocaleString()}</p>
                  </div>
                  
                  {/* Mobile: Actions in separate row */}
                  <div className="flex items-center justify-between gap-2 sm:hidden w-full max-w-full">
                    <button
                      onClick={() => moveToCart(item)}
                      className="flex-1 btn-primary px-3 py-2 text-xs flex items-center justify-center"
                      style={{ minHeight: '44px' }}
                    >
                      <ShoppingBag className="mr-1.5 h-3 w-3" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 hover:bg-red-100 transition-colors duration-200 rounded min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                  
                  {/* Desktop: Original actions */}
                  <div className="hidden sm:flex flex-col gap-2">
                    <button
                      onClick={() => moveToCart(item)}
                      className="btn-primary px-3 sm:px-4 py-2 text-xs sm:text-sm flex items-center justify-center"
                    >
                      <ShoppingBag className="mr-1.5 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 hover:bg-red-100 transition-colors duration-200 rounded flex items-center justify-center min-w-[44px] min-h-[44px]"
                    >
                      <Trash2 className="h-3 sm:h-4 w-3 sm:w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};