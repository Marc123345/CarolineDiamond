'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartIconProps {
  isTransparent?: boolean;
}

const CartIconComponent: React.FC<CartIconProps> = ({ isTransparent = false }) => {
  const { getTotalQuantity, toggleCart } = useCart();
  const [isPulsing, setIsPulsing] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  const totalItems = getTotalQuantity();

  // Trigger pulse animation when count increases
  useEffect(() => {
    if (totalItems > prevCount && prevCount !== 0) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 600);
      return () => clearTimeout(timer);
    }
    setPrevCount(totalItems);
  }, [totalItems, prevCount]);

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
      } ${isPulsing ? 'animate-pulse' : ''}`}
      aria-label="Open shopping cart"
    >
      <ShoppingBag className={`h-6 w-6 ${isPulsing ? 'scale-110' : ''} transition-transform duration-300`} />
      {totalItems > 0 && (
        <span className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1.5 flex items-center justify-center font-semibold rounded-full shadow-lg transition-transform ${isPulsing ? 'scale-125' : ''}`}>
          {totalItems}
        </span>
      )}
    </button>
  );
};

export const CartIcon = React.memo(CartIconComponent);