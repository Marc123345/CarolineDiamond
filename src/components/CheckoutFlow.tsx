import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  ArrowRight,
  Gem,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { createCheckoutOrder } from '../lib/ordersDb';
import { ProcessedCartItem } from '../types/shopify';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/priceHelpers';

interface CheckoutFlowProps {
  checkoutUrl: string;
  checkoutId: string;
  cartItems: ProcessedCartItem[];
  totalPrice: number;
  customerEmail?: string;
  onClose?: () => void;
}

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  checkoutUrl,
  checkoutId,
  cartItems,
  totalPrice,
  customerEmail,
  onClose
}) => {
  const toast = useToast();
  const [orderCreated, setOrderCreated] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const createOrder = async () => {
      setCreatingOrder(true);
      try {
        await createCheckoutOrder(checkoutId, cartItems, totalPrice, customerEmail);
        setOrderCreated(true);
      } catch (err) {
        console.error('Tracking Error:', err);
        setOrderError(true);
        toast.warning('Order tracking unavailable, but checkout is ready');
      } finally {
        setCreatingOrder(false);
      }
    };
    createOrder();
  }, [checkoutId, cartItems, totalPrice, customerEmail, toast]);

  const handleProceedToCheckout = () => {
    if (!checkoutUrl) {
      toast.error('Checkout URL unavailable. Please try again.');
      return;
    }

    // CRITICAL FIX: Only redirect after order tracking completes or fails
    if (!orderCreated && !orderError && creatingOrder) {
      toast.warning('Please wait while we prepare your checkout...');
      return;
    }

    setIsRedirecting(true);
    toast.info('Redirecting to secure checkout...');
    window.location.href = checkoutUrl;
  };

  // Motion Variants
  const containerVars = {
    initial: { opacity: 0, scale: 0.9, backdropFilter: "blur(0px)" },
    animate: { opacity: 1, scale: 1, backdropFilter: "blur(12px)" },
    exit: { opacity: 0, scale: 1.1, filter: "blur(10px)" }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVars}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-Color-Dark-500/60"
    >
      {/* --- LUXURY OVERLAY CONTENT --- */}
      <div className="relative bg-white w-full max-w-lg overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.4)] rounded-sm">
        
        {/* Background Texture & Watermark */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <Gem className="absolute -right-12 -top-12 w-64 h-64 text-Color-Champagne-Gold/10 rotate-12" />

        <div className="relative z-10 p-8 md:p-12">
          {/* Header State */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative w-20 h-20 mb-8">
              <AnimatePresence mode="wait">
                {creatingOrder ? (
                  <motion.div
                    key="loading"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute inset-0 border-t-2 border-Color-Champagne-Gold rounded-full"
                  />
                ) : (
                  <motion.div
                    key="done"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 bg-Color-Champagne-Gold/10 rounded-full flex items-center justify-center"
                  >
                    <ShieldCheck className="w-10 h-10 text-Color-Champagne-Gold" />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute inset-2 border border-black/5 rounded-full" />
            </div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl font-serif text-Color-Dark-500 mb-2"
            >
              {orderError ? 'Ready to Checkout' : 'Secure Handover'}
            </motion.h2>
            <p className="text-[10px] uppercase tracking-[0.4em] font-black text-Color-Light-300">
              {creatingOrder ? "Validating Selection..." : orderError ? "Proceed When Ready" : "Ready for Secure Payment"}
            </p>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-Color-Primary-Beige/30 border border-black/5 rounded-lg p-6 mb-8"
          >
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-Color-Dark-500 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-Color-Gray-500">Items</span>
                <span className="text-sm font-bold text-Color-Dark-500">{cartItems.length}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-black/5">
                <span className="text-[11px] uppercase tracking-wider font-bold text-Color-Gray-500">Total</span>
                <span className="text-xl font-serif text-Color-Dark-500">{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </motion.div>

          {/* Security Features (Staggered) */}
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.15, delayChildren: 0.5 }}
            className="space-y-4 mb-10"
          >
            {[
              { icon: Lock, label: "SSL 256-bit Encrypted Connection" },
              { icon: CreditCard, label: "Authenticated Shopify Payment Gateway" },
              { icon: Gem, label: "Insurance & Authenticity Tracking Active" }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="flex items-center gap-4 group"
              >
                <div className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-Color-Secondary transition-colors">
                  <item.icon className="w-3.5 h-3.5 text-Color-Dark-500" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-500">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Order Error Alert */}
          {orderError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 mb-8"
            >
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-yellow-900 leading-relaxed">
                  Order tracking is temporarily unavailable, but you can still proceed with checkout safely.
                </p>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <button
              onClick={handleProceedToCheckout}
              disabled={creatingOrder || isRedirecting}
              className="w-full bg-Color-Dark-500 text-white py-5 px-8 uppercase text-xs tracking-[0.4em] font-black flex items-center justify-center gap-4 group transition-all hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creatingOrder ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Preparing Checkout...
                </>
              ) : isRedirecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  Enter Secure Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
            
            {onClose && (
              <button 
                onClick={onClose}
                className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-400 hover:text-Color-Dark-500 transition-colors"
              >
                Return to Boutique
              </button>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-Color-Primary-Beige/20 p-4 border-t border-black/[0.03]">
          <p className="text-[9px] text-center uppercase tracking-widest text-Color-Gray-400">
            You are being transferred to the official Diamonds by CS checkout.
          </p>
        </div>
      </div>
    </motion.div>
  );
};