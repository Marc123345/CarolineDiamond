import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

interface WishlistIconProps {
  isTransparent?: boolean;
}

export const WishlistIcon: React.FC<WishlistIconProps> = ({ isTransparent = false }) => {
  const { state, dispatch } = useWishlist();

  return (
    <button
      onClick={() => dispatch({ type: 'TOGGLE_WISHLIST' })}
      className={`relative transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
        isTransparent
          ? 'text-[#CDBCAB] hover:text-white'
          : 'text-black hover:text-Color-Champagne-Gold'
      }`}
      aria-label="Open wishlist"
    >
      <Heart className={`h-6 w-6 ${state.items.length > 0 ? 'fill-current text-red-500' : ''}`} />
      {state.items.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1.5 flex items-center justify-center font-semibold rounded-full shadow-lg">
          {state.items.length}
        </span>
      )}
    </button>
  );
};