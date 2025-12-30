import React from 'react';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, Sparkles } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (page: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-Color-Primary-Beige via-white to-Color-Secondary relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-Color-Champagne-Gold rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-1/4 w-48 h-48 bg-Color-Champagne-Gold rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/6 w-32 h-32 bg-Color-Champagne-Gold rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="mb-8"
        >
          <h1 className="text-9xl md:text-[12rem] font-serif font-light text-Color-Champagne-Gold leading-none">
            404
          </h1>
        </motion.div>

        {/* Sparkle Icon */}
        <motion.div
          initial={{ rotate: 0, scale: 0 }}
          animate={{ rotate: 360, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-block mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-Color-Champagne-Gold to-Color-Light-300 rounded-full flex items-center justify-center shadow-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4 mb-12"
        >
          <h2 className="typography-h3 text-Color-Dark-500">
            Page Not Found
          </h2>
          <p className="typography-body-lg text-gray-600 max-w-2xl mx-auto">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back to discovering beautiful jewelry.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 px-8 py-4 bg-Color-Champagne-Gold text-white rounded-lg hover:bg-Color-Dark-500 transition-colors text-lg font-medium"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>

          <button
            onClick={() => onNavigate('shop')}
            className="flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-Color-Champagne-Gold text-Color-Champagne-Gold rounded-lg hover:bg-Color-Champagne-Gold hover:text-white transition-colors text-lg font-medium"
          >
            <ShoppingBag className="w-5 h-5" />
            Shop Collection
          </button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-Color-Champagne-Gold/20"
        >
          <p className="text-sm text-gray-500 mb-4">Popular pages:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => onNavigate('engagement-rings')}
              className="text-Color-Champagne-Gold hover:text-Color-Dark-500 transition-colors text-sm font-medium"
            >
              Engagement Rings
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => onNavigate('wedding-rings')}
              className="text-Color-Champagne-Gold hover:text-Color-Dark-500 transition-colors text-sm font-medium"
            >
              Wedding Rings
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => onNavigate('juwelen')}
              className="text-Color-Champagne-Gold hover:text-Color-Dark-500 transition-colors text-sm font-medium"
            >
              Fine Jewelry
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => onNavigate('contact')}
              className="text-Color-Champagne-Gold hover:text-Color-Dark-500 transition-colors text-sm font-medium"
            >
              Contact Us
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
