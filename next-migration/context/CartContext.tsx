'use client';

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode, useEffect } from 'react';
import { useShopifyCart } from '../hooks/useShopifyCart';
import { ProcessedCartItem, ShopifyCart } from '../types/shopify';
import { useToast } from './ToastContext';

interface CartContextType {
  items: ProcessedCartItem[];
  cart: ShopifyCart | null;
  isOpen: boolean;
  loading: boolean;
  error: string | null;
  addToCart: (variantId: string, quantity?: number, attributes?: { key: string; value: string }[], productId?: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  openCart: () => void;
  getTotalPrice: () => number;
  getTotalQuantity: () => number;
  getCheckoutUrl: () => string | null;
  refetchCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { success, error: showError } = useToast();

  const {
    cart,
    cartItems,
    loading,
    error,
    addToCart: shopifyAddToCart,
    updateCartLine,
    removeFromCart: shopifyRemoveFromCart,
    clearCart: shopifyClearCart,
    getCheckoutUrl,
    getTotalPrice,
    getTotalQuantity,
    refetchCart
  } = useShopifyCart();



  const addToCart = useCallback(async (
    variantId: string,
    quantity: number = 1,
    attributes?: { key: string; value: string }[],
    productId?: string
  ) => {
    try {
      await shopifyAddToCart(variantId, quantity, attributes, productId);
      setIsOpen(true);
      success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`);
    } catch (error) {
      console.error('❌ CartContext: Failed to add to cart:', error);
      showError('Failed to add item to cart. Please try again.');
      throw error;
    }
  }, [shopifyAddToCart, success, showError]);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    try {
      await updateCartLine(lineId, quantity);
      success('Cart updated');
    } catch (error) {
      console.error('Failed to update quantity:', error);
      showError('Failed to update cart. Please try again.');
    }
  }, [updateCartLine, success, showError]);

  const removeFromCart = useCallback(async (lineId: string) => {
    try {
      await shopifyRemoveFromCart(lineId);
      success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove item:', error);
      showError('Failed to remove item. Please try again.');
    }
  }, [shopifyRemoveFromCart, success, showError]);

  const clearCart = useCallback(() => {
    shopifyClearCart();
    setIsOpen(false);
    success('Cart cleared');
  }, [shopifyClearCart, success]);

  const toggleCart = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  const contextValue = useMemo(() => ({
    items: cartItems,
    cart,
    isOpen,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleCart,
    closeCart,
    openCart,
    getTotalPrice,
    getTotalQuantity,
    getCheckoutUrl,
    refetchCart
  }), [
    cartItems,
    cart,
    isOpen,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleCart,
    closeCart,
    openCart,
    getTotalPrice,
    getTotalQuantity,
    getCheckoutUrl,
    refetchCart
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
