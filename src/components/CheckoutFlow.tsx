import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  ArrowRight, 
  Gem, 
  Loader2 
} from 'lucide-react';
import { createCheckoutOrder } from '../lib/ordersDb';
import { ProcessedCartItem } from '../types/shopify';

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
  const [orderCreated, setOrderCreated] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    const createOrder = async () => {
      setCreatingOrder(true);
      try {
        await createCheckoutOrder(checkoutId, cartItems, totalPrice, customerEmail);
        setOrderCreated(true);
      } catch (err) {
        console.error('Tracking Error:', err);
      } finally {
        setCreatingOrder(false);
      }
    };
    createOrder();
  }, [checkoutId, cartItems, totalPrice, customerEmail]);

  useEffect(() => {
    if (!creatingOrder) {
      const timer = setTimeout(() => {
        window.location.href = checkoutUrl;
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [checkoutUrl, creatingOrder]);

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
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-Color-Dark-500/60"
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
              Secure Handover
            </motion.h2>
            <p className="text-[10px] uppercase tracking-[0.4em] font-black text-Color-Light-300">
              {creatingOrder ? "Validating Selection..." : "Redirecting to Vault"}
            </p>
          </div>

          {/* Security Features (Staggered) */}
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.15 }}
            className="space-y-6 mb-12"
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
                <span className="text-[11px] uppercase tracking-widest font-bold text-Color-Gray-500">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress Bar (Liquid Style) */}
          <div className="relative w-full h-px bg-black/10 mb-10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 h-full bg-Color-Champagne-Gold shadow-[0_0_15px_rgba(201,168,106,0.5)]"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => window.location.href = checkoutUrl}
              className="w-full bg-Color-Dark-500 text-white py-5 px-8 uppercase text-xs tracking-[0.4em] font-black flex items-center justify-center gap-4 group transition-all hover:bg-black"
            >
              Enter Secure Checkout
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
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