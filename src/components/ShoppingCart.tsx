import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2, Heart, Package, Truck, Shield, Gem } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/priceHelpers';
import { useTranslation } from '../context/TranslationContext';
import { useAuth } from '../context/AuthContext';
import { CheckoutFlow } from './CheckoutFlow';

export const ShoppingCart: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
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

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const proceedToCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      setShowCheckout(true);
    }
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
                  cartItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: idx * 0.1 } }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-6 group"
                    >
                      {/* Image Thumbnail */}
                      <div className="relative w-24 h-32 bg-gray-50 flex-shrink-0 overflow-hidden">
                        <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.productTitle} />
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
                              className="w-8 h-8 flex items-center justify-center hover:text-Color-Light-300"
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
                  ))
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

                {/* CTA Button */}
                <button 
                  onClick={proceedToCheckout}
                  disabled={loading}
                  className="w-full relative group overflow-hidden bg-Color-Dark-500 text-white py-6 uppercase text-xs tracking-[0.4em] font-bold transition-all duration-500 hover:bg-Color-Dark-500"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? "Preparing..." : "Begin Checkout"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-Color-Champagne-Gold -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
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