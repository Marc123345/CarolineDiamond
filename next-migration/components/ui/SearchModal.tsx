'use client';

import React, { useEffect, useState } from 'react';
import { X, Clock, TrendingUp, Search, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBar } from './SearchBar';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  products?: any[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
  placeholder = "What are you looking for?",
  products
}) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('recent_searches');
      setRecentSearches(stored ? JSON.parse(stored) : []);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
      onSearch(query);
    }
  };

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12"
        >
          {/* --- ULTRA-LUXURY BACKDROP --- */}
          <div className="absolute inset-0 bg-[#FAF9F6]/90 backdrop-blur-2xl" onClick={onClose}>
            {/* Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </div>

          {/* --- SEARCH INTERFACE --- */}
          <motion.div 
            variants={containerVars}
            initial="hidden"
            animate="visible"
            className="relative w-full max-w-4xl z-10"
          >
            {/* Close Button */}
            <motion.button 
              variants={itemVars}
              onClick={onClose}
              className="absolute -top-20 right-0 group flex items-center gap-3 text-Color-Dark-500/40 hover:text-Color-Dark-500 transition-colors"
            >
              <span className="text-[10px] uppercase tracking-[0.4em] font-black">Close ESC</span>
              <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                <X className="w-4 h-4" />
              </div>
            </motion.button>

            {/* Main Spotlight Input */}
            <motion.div variants={itemVars} className="mb-20">
              <div className="relative group">
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 hidden lg:block">
                  <Search className="w-8 h-8 text-Color-Light-300 opacity-20 group-focus-within:opacity-100 transition-opacity duration-500" />
                </div>
                <input 
                  autoFocus
                  placeholder={placeholder}
                  className="w-full bg-transparent border-b-2 border-black/5 focus:border-Color-Champagne-Gold outline-none py-8 text-4xl md:text-6xl font-serif text-Color-Dark-500 placeholder:text-Color-Gray-300 transition-all duration-700"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e.currentTarget.value)}
                />
                <div className="flex justify-between mt-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-Color-Light-300 font-bold">Start your discovery</span>
                  <Sparkles className="w-4 h-4 text-Color-Champagne-Gold animate-pulse" />
                </div>
              </div>
            </motion.div>

            {/* Suggestions Grid */}
            <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
              
              {/* Recent Searches Column */}
              <motion.div variants={itemVars} className="space-y-8">
                <div className="flex items-center gap-4">
                  <h3 className="text-sm uppercase tracking-[0.4em] font-black text-Color-Dark-500">History</h3>
                  <div className="flex-1 h-px bg-black/5" />
                </div>
                
                <div className="flex flex-col gap-4">
                  {recentSearches.length > 0 ? (
                    recentSearches.map((q, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleSearchSubmit(q)}
                        className="flex items-center justify-between group text-left"
                      >
                        <span className="text-xl font-serif text-Color-Gray-500 group-hover:text-Color-Dark-500 group-hover:italic transition-all italic={false}">{q}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-Color-Champagne-Gold" />
                      </button>
                    ))
                  ) : (
                    <p className="text-sm italic text-Color-Gray-400">Your search history is empty.</p>
                  )}
                </div>
              </motion.div>

              {/* Popular Searches Column */}
              <motion.div variants={itemVars} className="space-y-8">
                <div className="flex items-center gap-4">
                  <h3 className="text-sm uppercase tracking-[0.4em] font-black text-Color-Dark-500">Trending</h3>
                  <div className="flex-1 h-px bg-black/5" />
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {['Engagement Rings', 'Halo Collection', 'Lab-Grown', 'Antwerp 18K', 'Solitaire'].map((tag, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearchSubmit(tag)}
                      className="px-5 py-3 border border-black/5 rounded-sm text-[11px] uppercase tracking-widest font-bold text-Color-Dark-500 hover:bg-black hover:text-white transition-all duration-500"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};