'use client';

import React from 'react';
import { Filter, Grid, List, Package, TrendingUp, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProcessedProduct } from '../../types/shopify';

interface ShopFiltersProps {
  onNavigate: (page: string) => void;
  searchQuery: string;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onFiltersOpen: () => void;
  onSearchOpen: () => void;
  products?: ProcessedProduct[];
  totalResults?: number;
}

export const ShopFilters: React.FC<ShopFiltersProps> = ({
  searchQuery,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onFiltersOpen,
  onSearchOpen,
  totalResults = 0
}) => {
  return (
    <motion.section
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-20 sm:top-24 z-40 w-full"
    >
      {/* --- GLASSMOPRHIC BAR --- */}
      <div className="bg-white/70 backdrop-blur-2xl border-b border-black/[0.03] shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-6 h-20 sm:h-24 flex items-center justify-between">
          
          {/* LEFT: Selection Ledger */}
          <div className="flex items-center gap-8">
            <div className="hidden lg:flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-Color-Light-300">Selection</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-serif text-Color-Dark-500">{totalResults}</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-400">Masterpieces</span>
              </div>
            </div>

            {/* Mobile Count Badge */}
            <div className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-black/5 bg-white">
               <span className="text-xs font-bold">{totalResults}</span>
            </div>
            
            {/* Active Search Badge */}
            <AnimatePresence>
              {searchQuery && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="hidden md:flex items-center gap-3 px-4 py-2 bg-Color-Champagne-Gold/10 border border-Color-Champagne-Gold/20 rounded-full"
                >
                  <TrendingUp className="w-3 h-3 text-Color-Champagne-Gold" />
                  <span className="text-[10px] uppercase tracking-widest font-black text-Color-Dark-500">
                    Results: "{searchQuery}"
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Action Suite */}
          <div className="flex items-center gap-2 sm:gap-6">
            
            {/* Search Trigger */}
            <button
              onClick={onSearchOpen}
              className="p-3 text-Color-Dark-500 hover:text-Color-Champagne-Gold transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <div className="h-8 w-px bg-black/[0.05] hidden sm:block" />

            {/* Filter Toggle */}
            <button
              onClick={onFiltersOpen}
              className="group flex items-center gap-3 px-5 py-2.5 bg-Color-Dark-500 text-white rounded-sm hover:bg-black transition-all shadow-lg"
            >
              <Filter className="w-4 h-4 text-Color-Champagne-Gold" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-black">Refine</span>
            </button>

            {/* Custom Sort Styled Select */}
            <div className="relative hidden sm:block group">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="appearance-none bg-transparent pl-4 pr-10 py-2 text-[11px] uppercase tracking-widest font-bold text-Color-Dark-500 border-none focus:ring-0 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Value: Low-High</option>
                <option value="price-high">Value: High-Low</option>
                <option value="name">A-Z</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-Color-Light-300" />
            </div>

            <div className="h-8 w-px bg-black/[0.05] hidden lg:block" />

            {/* View Toggles (Kinetic) */}
            <div className="hidden lg:flex items-center bg-black/5 p-1 rounded-sm relative">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`relative z-10 p-2 transition-colors duration-500 ${viewMode === 'grid' ? 'text-Color-Dark-500' : 'text-Color-Gray-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`relative z-10 p-2 transition-colors duration-500 ${viewMode === 'list' ? 'text-Color-Dark-500' : 'text-Color-Gray-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
              
              {/* Shared Motion Background */}
              <motion.div
                layoutId="view-pill"
                className="absolute inset-y-1 bg-white shadow-sm rounded-[1px] w-8"
                animate={{ x: viewMode === 'grid' ? 4 : 36 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Selection Summary Dropdown (Sub-bar) */}
      <AnimatePresence>
        {searchQuery && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-Color-Champagne-Gold text-white px-6 py-2 flex justify-center items-center gap-2"
          >
            <TrendingUp className="w-3 h-3" />
            <span className="text-[9px] uppercase tracking-widest font-black">
              Showing Results for "{searchQuery}"
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};