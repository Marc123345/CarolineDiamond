import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode, useEffect } from 'react';
import { useShopifyCart } from '../hooks/useShopifyCart';
import { ProcessedCartItem, ShopifyCart } from '../types/shopify';

interface CartContextType {
  items: ProcessedCartItem[];
  cart: ShopifyCart | null;
  isOpen: boolean;
  loading: boolean;
  error: string | null;
  addToCart: (variantId: string, quantity?: number, attributes?: { key: string; value: string }[]) => Promise<void>;
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

  // Debug: Log when cart data changes
  useEffect(() => {
    console.log('📦 CartContext: Cart data updated', {
      hasCart: !!cart,
      cartId: cart?.id,
      itemCount: cartItems.length,
      isOpen,
      loading
    });
  }, [cart, cartItems.length, isOpen, loading]);

  const addToCart = useCallback(async (
    variantId: string,
    quantity: number = 1,
    attributes?: { key: string; value: string }[]
  ) => {
    console.log('🛒 CartContext: addToCart called', { variantId, quantity, attributes });
    try {
      await shopifyAddToCart(variantId, quantity, attributes);
      console.log('✅ CartContext: Item added successfully, opening cart...');
      setIsOpen(true);
      console.log('✅ CartContext: Cart opened (isOpen set to true)');
    } catch (error) {
      console.error('❌ CartContext: Failed to add to cart:', error);
      // Re-throw so the calling component can handle it
      throw error;
    }
  }, [shopifyAddToCart]);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    await updateCartLine(lineId, quantity);
  }, [updateCartLine]);

  const removeFromCart = useCallback(async (lineId: string) => {
    await shopifyRemoveFromCart(lineId);
  }, [shopifyRemoveFromCart]);

  const clearCart = useCallback(() => {
    shopifyClearCart();
    setIsOpen(false);
  }, [shopifyClearCart]);

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
