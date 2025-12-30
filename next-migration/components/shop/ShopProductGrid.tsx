'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Search, WifiOff, Package, AlertTriangle, ArrowDown, Sparkles } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { ProductGridSkeleton } from '../product/ProductCardSkeleton';
import { ProcessedProduct } from '../../types/shopify';
import { ProductFilters as FilterType } from '../../config/filterConfig';

interface ShopProductGridProps {
  products: ProcessedProduct[];
  loading?: boolean;
  error?: string | null;
  usingFallback?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  viewMode: 'grid' | 'list';
  filters: FilterType;
  searchQuery: string;
  onFiltersChange: (filters: FilterType) => void;
  onClearAll: () => void;
  onQuickView: (product: ProcessedProduct) => void;
  onNavigate: (page: string) => void;
  isMobile?: boolean;
}

export const ShopProductGrid: React.FC<ShopProductGridProps> = React.memo(({
  products,
  loading = false,
  error = null,
  usingFallback = false,
  hasNextPage = false,
  onLoadMore,
  viewMode,
  filters,
  searchQuery,
  onClearAll,
  onQuickView,
}) => {
  const hasActiveFilters = searchQuery || Object.keys(filters).some(key => filters[key as keyof FilterType]);

  // Luxury Easing for the grid movement
  const transition = { type: "spring", stiffness: 300, damping: 30, mass: 1 };

  return (
    <div className="lg:col-span-3 space-y-10">
      {/* --- EDITORIAL RESULTS HEADER --- */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/[0.03] pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3 h-3 text-Color-Champagne-Gold animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-Color-Light-300">Inventory Ledger</span>
          </div>
          <h2 className="text-3xl font-serif text-Color-Dark-500 italic">
            {products.length} <span className="not-italic text-Color-Gray-400">Masterpieces Found</span>
          </h2>
        </div>

        <AnimatePresence>
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={onClearAll}
              className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-black text-Color-Champagne-Gold hover:text-Color-Dark-500 transition-colors"
            >
              Reset Selection
              <div className="w-8 h-px bg-Color-Champagne-Gold group-hover:w-12 transition-all" />
            </motion.button>
          )}
        </AnimatePresence>
      </header>

      {/* --- STATUS NOTIFICATIONS (Glassmorphism) --- */}
      <AnimatePresence mode="wait">
        {usingFallback && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#F0F7FF] backdrop-blur-xl border border-blue-100 p-6 rounded-sm flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                <WifiOff className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-black text-blue-900 mb-1">Digital Continuity Active</h4>
                <p className="text-xs text-blue-600/80 leading-relaxed">
                  Boutique connection is currently intermittent. We are serving our collection from Antwerp's secure local cache.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- THE KINETIC GRID --- */}
      <LayoutGroup>
        <motion.div
          layout
          className={`grid gap-x-8 gap-y-16 transition-all duration-700 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}
        >
          <AnimatePresence mode="popLayout">
            {loading ? (
              <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <ProductGridSkeleton count={6} />
              </motion.div>
            ) : products.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                transition={{ ...transition, delay: index * 0.05 }}
              >
                <ProductCard
                  product={product}
                  usingFallback={usingFallback}
                  onQuickView={() => onQuickView(product)}
                  activeFilters={{
                    shapes: filters.shapes,
                    metalColors: filters.metalColors,
                    diamondType: filters.diamondType
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* --- PAGINATION & EMPTY STATES --- */}
      <footer className="pt-20 pb-32">
        {hasNextPage && !loading && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-px h-24 bg-gradient-to-b from-Color-Champagne-Gold to-transparent" />
            <button
              onClick={onLoadMore}
              className="relative group overflow-hidden bg-Color-Dark-500 text-white px-12 py-5 uppercase text-[10px] tracking-[0.4em] font-black hover:bg-black transition-all shadow-2xl"
            >
              <span className="relative z-10 flex items-center gap-4">
                Reveal More <ArrowDown className="w-3 h-3 group-hover:translate-y-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-Color-Champagne-Gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </div>
        )}

        {!loading && products.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-40 border border-dashed border-black/5 rounded-sm"
          >
            <div className="relative inline-block mb-10">
              <Search className="w-16 h-16 text-black/5" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Package className="w-6 h-6 text-Color-Light-300 opacity-20" />
              </div>
            </div>
            <h3 className="text-4xl font-serif text-Color-Dark-500 italic mb-4">No match for your curation</h3>
            <p className="text-Color-Gray-400 font-light max-w-sm mx-auto leading-relaxed">
              We couldn't find pieces matching your exact refinement. Try broadening your selection or request a bespoke design.
            </p>
            <button onClick={onClearAll} className="mt-10 px-8 py-3 border border-black text-[10px] uppercase tracking-widest font-black hover:bg-black hover:text-white transition-all">
              Clear All Selections
            </button>
          </motion.div>
        )}
      </footer>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.products.length === nextProps.products.length &&
    prevProps.loading === nextProps.loading &&
    prevProps.error === nextProps.error &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.searchQuery === nextProps.searchQuery &&
    JSON.stringify(prevProps.filters) === JSON.stringify(nextProps.filters)
  );
});