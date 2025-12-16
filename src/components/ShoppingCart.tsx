import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2, Heart, Package, Truck, Shield } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/priceHelpers';
import { useTranslation } from '../context/TranslationContext';
import { CheckoutFlow } from './CheckoutFlow';
import { useAuth } from '../context/AuthContext';

export const ShoppingCart: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    items: cartItems,
    isOpen,
    loading,
    updateQuantity: updateCartLine,
    removeFromCart,
    getTotalPrice,
    getTotalQuantity,
    getCheckoutUrl,
    closeCart,
    cart
  } = useCart();
  const [showCheckoutFlow, setShowCheckoutFlow] = useState(false);

  // Debug: Track cart state changes
  useEffect(() => {
    console.log('🔄 Cart state changed:', {
      isOpen,
      itemCount: cartItems.length,
      loading,
      hasCart: !!cart,
      cartId: cart?.id
    });
  }, [isOpen, cartItems.length, loading, cart]);

  // Handle Escape key to close cart
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        console.log('⌨️  Escape key pressed, closing cart');
        closeCart();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when cart is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  const updateQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(lineId);
    } else {
      updateCartLine(lineId, quantity);
    }
  };

  const removeItem = (lineId: string) => {
    removeFromCart(lineId);
  };

  const proceedToCheckout = () => {
    console.log('🚀 Proceeding to checkout...');
    console.log('📊 Cart state:', {
      hasCart: !!cart,
      cartId: cart?.id,
      checkoutUrl: cart?.checkoutUrl,
      itemCount: cartItems.length
    });

    const checkoutUrl = getCheckoutUrl();
    console.log('🔗 Retrieved checkout URL:', checkoutUrl);

    if (!checkoutUrl) {
      console.error('❌ No checkout URL available');
      console.error('Cart:', cart);
      alert('Er is een probleem met de checkout. Probeer het opnieuw of ververs de pagina.');
      return;
    }

    if (!cart) {
      console.error('❌ No cart available');
      alert('Winkelwagen niet gevonden. Probeer het opnieuw.');
      return;
    }

    // Direct redirect to Shopify checkout
    console.log('✅ Redirecting to Shopify checkout:', checkoutUrl);
    window.location.href = checkoutUrl;
  };

  const handleCloseCheckoutFlow = () => {
    setShowCheckoutFlow(false);
    closeCart();
  };
  
  const formatDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14); // 14 days from now
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  console.log('🎨 ShoppingCart render:', { isOpen, loading, itemCount: cartItems.length });

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="cart-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-0 sm:p-4 overflow-hidden"
          style={{
            top: 'env(safe-area-inset-top)',
            bottom: 'env(safe-area-inset-bottom)',
            left: 'env(safe-area-inset-left)',
            right: 'env(safe-area-inset-right)'
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-title"
          onClick={(e) => {
            // Close cart when clicking backdrop
            if (e.target === e.currentTarget) {
              closeCart();
            }
          }}
        >
          <motion.div
            key="cart-content"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="glass-card rounded-none sm:rounded-3xl w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-primary-200 flex-shrink-0">
          <div className="flex items-center">
            <ShoppingBag className="h-5 sm:h-6 w-5 sm:w-6 text-primary-500 mr-2 sm:mr-3" aria-hidden="true" />
            <h2 id="cart-title" className="text-lg sm:text-xl font-semibold text-primary-800">{t('Shopping Cart')}</h2>
            <span className="ml-2 sm:ml-3 bg-primary-500 text-white text-xs sm:text-sm px-2 py-1 rounded-full">
              {cartItems.length}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-3 sm:p-2 hover:bg-primary-100 transition-colors duration-200 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
          >
            <X className="h-5 sm:h-6 w-5 sm:w-6 text-primary-800" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <ShoppingBag className="h-12 sm:h-16 w-12 sm:w-16 text-accent-500 mx-auto mb-3 sm:mb-4" />
              <div className="text-lg sm:text-xl font-semibold text-primary-800 mb-2">{t('Your cart is empty')}</div>
              <div className="text-sm sm:text-base text-accent-500 mb-4 sm:mb-6 px-4">{t('Add some beautiful jewelry to get started')}</div>
              <button
                onClick={closeCart}
                className="btn-primary px-6 py-3 text-sm sm:text-base"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
            <div className="space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-primary-50 rounded-lg sm:rounded-xl">
                  {/* Mobile: Image and basic info in row */}
                  <div className="flex items-center gap-3 sm:hidden">
                    <img
                      src={item.image || '/images/product-placeholder.jpg'}
                      alt={item.productTitle}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-primary-800 leading-tight line-clamp-2">{item.productTitle}</h4>
                      <p className="text-xs text-accent-500 truncate">{item.variantTitle}</p>

                      {/* Show ring size prominently on mobile */}
                      {Object.entries(item.attributes).map(([key, value]) => {
                        const isRingSize = key.toLowerCase().includes('ringmaat') || key.toLowerCase().includes('size');
                        if (isRingSize) {
                          return (
                            <span
                              key={key}
                              className="inline-block text-xs bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded border border-green-300 mt-1"
                            >
                              💍 {key}: {value}
                            </span>
                          );
                        }
                        return null;
                      })}

                      <p className="text-sm font-bold text-primary-500 mt-1">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                  
                  {/* Desktop: Original layout */}
                  <img
                    src={item.image || '/images/product-placeholder.jpg'}
                    alt={item.productTitle}
                    className="hidden sm:block w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="hidden sm:block flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-semibold text-primary-800 leading-tight line-clamp-2">{item.productTitle}</h4>
                    <p className="text-accent-500 text-xs sm:text-sm truncate">{item.variantTitle}</p>

                    {/* Show selected options */}
                    {Object.keys(item.selectedOptions).length > 0 && (
                      <div className="text-primary-500 text-xs mt-1 space-x-2">
                        {Object.entries(item.selectedOptions).map(([key, value]) => (
                          <span key={key} className="inline-block bg-primary-100 px-2 py-0.5 rounded">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Show custom attributes with special highlighting for ring size */}
                    {Object.keys(item.attributes).length > 0 && (
                      <div className="text-primary-500 text-xs mt-1 space-x-2">
                        {Object.entries(item.attributes).map(([key, value]) => {
                          const isRingSize = key.toLowerCase().includes('ringmaat') || key.toLowerCase().includes('size');
                          return (
                            <span
                              key={key}
                              className={`inline-block px-2 py-0.5 rounded ${
                                isRingSize
                                  ? 'bg-green-100 text-green-800 font-semibold border border-green-300'
                                  : 'bg-primary-100'
                              }`}
                            >
                              {isRingSize && '💍 '}{key}: {value}
                            </span>
                          );
                        })}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-1 sm:mt-2">
                      <p className="text-sm sm:text-base font-bold text-primary-500">{formatPrice(item.price)}</p>
                      <p className="text-xs sm:text-sm text-gray-700">
                        Totaal: {formatPrice(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Mobile: Quantity and actions in separate row */}
                  <div className="flex items-center justify-between sm:hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-700">Qty:</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={loading}
                          className="p-1.5 hover:bg-primary-200 rounded transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        >
                          <Minus className="h-3 w-3 text-primary-500" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-primary-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={loading}
                          className="p-1.5 hover:bg-primary-200 rounded transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        >
                          <Plus className="h-3 w-3 text-primary-500" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary-500">{formatPrice(item.totalPrice)}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={loading}
                        className="p-2 hover:bg-red-100 transition-colors duration-200 rounded min-w-[44px] min-h-[44px] flex items-center justify-center"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Desktop: Original quantity controls */}
                  <div className="hidden sm:flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={loading}
                      className="p-1.5 hover:bg-primary-200 rounded transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <Minus className="h-3 sm:h-4 w-3 sm:w-4 text-primary-500" />
                    </button>
                    <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-semibold text-primary-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={loading}
                      className="p-1.5 hover:bg-primary-200 rounded transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <Plus className="h-3 sm:h-4 w-3 sm:w-4 text-primary-500" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={loading}
                    className="hidden sm:block p-2 hover:bg-red-100 transition-colors duration-200 rounded min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Delivery Info */}
            <div className="mt-4 sm:mt-6 bg-primary-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3">
                <div className="flex items-center">
                  <Truck className="h-4 sm:h-5 w-4 sm:w-5 text-primary-500 mr-2" />
                  <span className="text-sm sm:text-base font-medium text-primary-800">{t('Expected Delivery')}</span>
                </div>
                <span className="text-xs sm:text-sm text-primary-500 font-semibold">{formatDeliveryDate()}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center text-xs sm:text-sm">
                <div className="flex flex-col items-center">
                  <Package className="h-3 sm:h-4 w-3 sm:w-4 text-primary-500 mb-1" />
                  <span className="text-accent-500">{t('Handmade')}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Shield className="h-3 sm:h-4 w-3 sm:w-4 text-green-600 mb-1" />
                  <span className="text-accent-500">{t('Warranty')}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Heart className="h-3 sm:h-4 w-3 sm:w-4 text-red-500 mb-1" />
                  <span className="text-accent-500">{t('Made with Love')}</span>
                </div>
              </div>
            </div>
            </>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-primary-200 p-4 sm:p-6 flex-shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
              <div>
                <span className="text-base sm:text-lg font-semibold text-primary-800">Total:</span>
                <div className="text-xs sm:text-sm text-gray-700">({getTotalQuantity()} items)</div>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-primary-500">{formatPrice(getTotalPrice())}</span>
            </div>
            <p className="text-xs sm:text-sm text-accent-500 mb-3 sm:mb-4 text-center leading-relaxed px-2">
              *Prijzen zijn inclusief BTW. Gratis verzending boven €500. Maatwerk duurt 10-14 dagen.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={closeCart}
                className="flex-1 btn-secondary py-3 sm:py-4 text-sm sm:text-base"
              >
                Continue Shopping
              </button>
              <button
                onClick={proceedToCheckout}
                disabled={loading || cartItems.length === 0}
                className="flex-1 btn-primary flex items-center justify-center py-3 sm:py-4 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {showCheckoutFlow && cart && (
          <CheckoutFlow
            checkoutUrl={cart.checkoutUrl}
            checkoutId={cart.id}
            cartItems={cartItems}
            totalPrice={getTotalPrice()}
            customerEmail={user?.email}
            onClose={handleCloseCheckoutFlow}
          />
        )}
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};