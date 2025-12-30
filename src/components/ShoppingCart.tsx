import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2, Heart, Package, Truck, Shield, Gem, AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/priceHelpers';
import { useTranslation } from '../context/TranslationContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CheckoutFlow } from './CheckoutFlow';

export const ShoppingCart: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const toast = useToast();
  const {
    items: cartItems,
    isOpen,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    getTotalQuantity,
    getCheckoutUrl,
    closeCart,
    loading,
    cart
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);
  const [isPreparingCheckout, setIsPreparingCheckout] = useState(false);

  // Check for out-of-stock items
  const outOfStockItems = useMemo(() => {
    return cartItems.filter(item =>
      !item.availableForSale ||
      (item.quantityAvailable !== undefined && item.quantityAvailable < item.quantity)
    );
  }, [cartItems]);

  const hasOutOfStockItems = outOfStockItems.length > 0;

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const proceedToCheckout = async () => {
    // Validate cart is not empty
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Prevent checkout if there are out-of-stock items
    if (hasOutOfStockItems) {
      toast.error('Please remove out-of-stock items before checkout');
      return;
    }

    setIsPreparingCheckout(true);

    // Small delay to ensure cart state is synced
    await new Promise(resolve => setTimeout(resolve, 300));

    const url = getCheckoutUrl();
    if (!url) {
      toast.error('Unable to generate checkout URL. Please try again.');
      setIsPreparingCheckout(false);
      return;
    }

    setShowCheckout(true);
    setIsPreparingCheckout(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-Color-Dark-500/40 backdrop-blur-sm"
          />

          {/* Side Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg bg-white h-full shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden"
          >
            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* --- HEADER --- */}
            <header className="p-8 border-b border-black/[0.05] flex items-center justify-between relative z-10">
              <div>
                <h2 className="text-2xl font-serif text-Color-Dark-500">{t('Your Selection')}</h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-Color-Light-300 font-bold mt-1">
                  {getTotalQuantity()} {t('Exquisite Pieces')}
                </p>
              </div>
              <button 
                onClick={closeCart}
                className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-500"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* --- CART ITEMS LIST --- */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 no-scrollbar relative z-10">
              <AnimatePresence mode="popLayout">
                {cartItems.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-6"
                  >
                    <div className="w-20 h-20 rounded-full bg-Color-Secondary/30 flex items-center justify-center">
                      <Gem className="w-8 h-8 text-Color-Light-300 opacity-50" />
                    </div>
                    <p className="font-serif italic text-xl text-Color-Gray-500">Your collection is empty</p>
                    <button 
                      onClick={closeCart}
                      className="text-xs uppercase tracking-[0.3em] font-bold text-Color-Dark-500 border-b border-Color-Dark-500 pb-2"
                    >
                      Explore Collections
                    </button>
                  </motion.div>
                ) : (
                  cartItems.map((item, idx) => {
                    const isOutOfStock = !item.availableForSale;
                    const hasInsufficientStock = item.quantityAvailable !== undefined && item.quantityAvailable < item.quantity;
                    const isUnavailable = isOutOfStock || hasInsufficientStock;

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: idx * 0.1 } }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`flex gap-6 group ${isUnavailable ? 'opacity-60' : ''}`}
                      >
                        {/* Image Thumbnail */}
                        <div className="relative w-24 h-32 bg-gray-50 flex-shrink-0 overflow-hidden">
                          <img src={item.image} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isUnavailable ? 'grayscale' : ''}`} alt={item.productTitle} />
                          {isUnavailable && (
                            <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                              <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="text-sm font-bold text-Color-Dark-500 uppercase tracking-wide line-clamp-1">{item.productTitle}</h4>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-[11px] text-Color-Gray-500 italic mb-2">{item.variantTitle}</p>

                            {/* Out of Stock Warning */}
                            {isUnavailable && (
                              <div className="mb-2 flex items-center gap-1 text-red-600">
                                <AlertTriangle className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                  {isOutOfStock
                                    ? 'Out of Stock'
                                    : `Only ${item.quantityAvailable} Available`
                                  }
                                </span>
                              </div>
                            )}

                            {/* Attribute Badges (Ring Size, etc) */}
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(item.attributes).map(([key, val]) => (
                                <span key={key} className="text-[9px] uppercase tracking-widest font-black px-2 py-1 bg-Color-Secondary/40 text-Color-Dark-500 rounded-sm">
                                  {key}: {val}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-end justify-between mt-4">
                            {/* Minimalist Quantity Control */}
                            <div className="flex items-center border border-black/5 rounded-full p-1 bg-gray-50/50">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:text-Color-Light-300"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={hasInsufficientStock && item.quantityAvailable !== undefined && item.quantity >= item.quantityAvailable}
                                className="w-8 h-8 flex items-center justify-center hover:text-Color-Light-300 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-sm font-bold text-Color-Dark-500 tracking-tighter">
                              {formatPrice(item.totalPrice)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* --- FOOTER SECTION --- */}
            {cartItems.length > 0 && (
              <footer className="p-8 bg-Color-Primary-Beige/30 border-t border-black/[0.05] space-y-8 relative z-10">
                {/* Concierge Trust Row */}
                <div className="grid grid-cols-3 gap-4 pb-6 border-b border-black/[0.03]">
                  <div className="flex flex-col items-center text-center gap-2">
                    <Shield className="w-4 h-4 text-Color-Light-300" />
                    <span className="text-[8px] uppercase tracking-widest font-bold">2Y Warranty</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <Truck className="w-4 h-4 text-Color-Light-300" />
                    <span className="text-[8px] uppercase tracking-widest font-bold">Safe Shipping</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-[8px] uppercase tracking-widest font-bold">Antwerp Craft</span>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-Color-Gray-500">Subtotal</span>
                    <span className="text-2xl font-serif text-Color-Dark-500">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <p className="text-[10px] text-Color-Gray-400 leading-relaxed italic">
                    *Prices include 21% VAT. Complimentary luxury packaging included with every order.
                  </p>
                </div>

                {/* Out of Stock Alert */}
                {hasOutOfStockItems && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-red-900 mb-1">Cannot Proceed to Checkout</p>
                      <p className="text-[10px] text-red-700 leading-relaxed">
                        Some items in your cart are out of stock or have insufficient quantity. Please remove them or adjust quantities to continue.
                      </p>
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={proceedToCheckout}
                  disabled={loading || hasOutOfStockItems || isPreparingCheckout || cartItems.length === 0}
                  className={`w-full relative group overflow-hidden py-6 uppercase text-xs tracking-[0.4em] font-bold transition-all duration-500 ${
                    hasOutOfStockItems || cartItems.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-Color-Dark-500 text-white hover:bg-Color-Dark-500'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isPreparingCheckout || loading
                      ? "Preparing..."
                      : hasOutOfStockItems
                      ? "Remove Unavailable Items"
                      : cartItems.length === 0
                      ? "Cart Empty"
                      : "Begin Checkout"}
                    {!hasOutOfStockItems && !isPreparingCheckout && !loading && cartItems.length > 0 && (
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    )}
                  </span>
                  {!hasOutOfStockItems && cartItems.length > 0 && !isPreparingCheckout && (
                    <div className="absolute inset-0 bg-Color-Champagne-Gold -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
                  )}
                </button>
              </footer>
            )}
          </motion.div>
        </div>
      )}

      {showCheckout && (
        <CheckoutFlow
          checkoutUrl={getCheckoutUrl() || ''}
          checkoutId={cart?.id || ''}
          cartItems={cartItems}
          totalPrice={getTotalPrice()}
          customerEmail={user?.email}
          onClose={() => {
            setShowCheckout(false);
            closeCart();
          }}
        />
      )}
    </AnimatePresence>
  );
};