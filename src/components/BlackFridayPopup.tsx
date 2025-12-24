import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Tag } from 'lucide-react';

interface BlackFridayPopupProps {
  onClose?: () => void;
}

export const BlackFridayPopup: React.FC<BlackFridayPopupProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('blackFridayPopupSeen');

    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('blackFridayPopupSeen', 'true');
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101]
                       w-[90%] max-w-2xl"
          >
            <div className="relative bg-gradient-to-br from-black via-gray-900 to-black
                          rounded-2xl shadow-2xl overflow-hidden border-2 border-Color-Champagne-Gold/50">

              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20
                         rounded-full transition-colors min-w-[44px] min-h-[44px]
                         flex items-center justify-center backdrop-blur-sm"
                aria-label="Close popup"
              >
                <X className="h-5 w-5 text-white" />
              </button>

              <div className="relative p-8 sm:p-12">
                <div className="absolute top-0 right-0 w-64 h-64 bg-Color-Champagne-Gold/20
                              rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-Color-Light-300/20
                              rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="inline-flex items-center justify-center w-16 h-16
                             bg-Color-Champagne-Gold/20 rounded-full mb-2"
                  >
                    <Sparkles className="h-8 w-8 text-Color-Champagne-Gold" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="inline-block px-4 py-1.5 bg-red-600 rounded-full mb-4">
                      <span className="text-white text-sm font-bold uppercase tracking-wider">
                        Limited Time Offer
                      </span>
                    </div>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white mb-4"
                  >
                    Black Friday
                    <span className="block text-Color-Champagne-Gold mt-2">Exclusive</span>
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-white/10
                             rounded-full backdrop-blur-sm border border-white/20"
                  >
                    <Tag className="h-6 w-6 text-Color-Champagne-Gold" />
                    <span className="text-3xl sm:text-4xl font-bold text-white">
                      20% OFF
                    </span>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-white/80 text-lg max-w-md mx-auto leading-relaxed"
                  >
                    Celebrate this Black Friday with exceptional savings on our entire collection of fine jewelry
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="pt-4 space-y-4"
                  >
                    <button
                      onClick={handleClose}
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r
                               from-Color-Champagne-Gold to-Color-Light-300
                               text-white font-semibold rounded-xl shadow-lg
                               hover:shadow-xl hover:scale-105 transition-all duration-300
                               text-lg"
                    >
                      Shop Now
                    </button>

                    <p className="text-white/60 text-sm">
                      Valid until November 30th
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center justify-center gap-4 pt-4 flex-wrap"
                  >
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>Easy Returns</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-Color-Champagne-Gold rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
