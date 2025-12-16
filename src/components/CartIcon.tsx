import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartIconProps {
  isTransparent?: boolean;
}

const CartIconComponent: React.FC<CartIconProps> = ({ isTransparent = false }) => {
  const { getTotalQuantity, toggleCart } = useCart();

  const totalItems = getTotalQuantity();

  const handleCartClick = () => {
    toggleCart();
  };

  return (
    <button
      onClick={handleCartClick}
      className={`relative transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
        isTransparent
          ? 'text-[#CDBCAB] hover:text-white'
          : 'text-black hover:text-Color-Champagne-Gold'
      }`}
      aria-label="Open shopping cart"
    >
      <ShoppingBag className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#CDBCAB] text-white text-xs min-w-[20px] h-5 px-1.5 flex items-center justify-center font-semibold rounded-full shadow-lg">
          {totalItems}
        </span>
      )}
    </button>
  );
};

export const CartIcon = React.memo(CartIconComponent);