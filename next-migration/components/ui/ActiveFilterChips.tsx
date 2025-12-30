'use client';

import React from 'react';
import { X, RotateCcw, Tag, Ruler, Sparkles, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductFilters as FilterType } from '../../config/filterConfig';

interface ActiveFilterChipsProps {
  filters: FilterType;
  searchQuery?: string;
  onRemoveFilter: (key: keyof FilterType, value?: string) => void;
  onClearSearch: () => void;
  onClearAll: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  searchQuery,
  onRemoveFilter,
  onClearSearch,
  onClearAll
}) => {
  const hasFilters = searchQuery || Object.keys(filters).some(key => {
    const value = filters[key as keyof FilterType];
    return Array.isArray(value) ? value.length > 0 : value !== undefined;
  });

  if (!hasFilters) return null;

  const Chip = ({ label, onRemove, icon: Icon }: { label: string; onRemove: () => void; icon?: any }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, x: -10 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 10 }}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md border border-Color-Champagne-Gold/20 rounded-full shadow-sm group hover:border-Color-Champagne-Gold hover:bg-white transition-all duration-300"
    >
      {Icon && <Icon className="w-3 h-3 text-Color-Light-300 group-hover:text-Color-Champagne-Gold transition-colors" />}
      <span className="text-[11px] uppercase tracking-widest font-bold text-Color-Dark-500 whitespace-nowrap">
        {label}
      </span>
      <button
        onClick={onRemove}
        className="ml-1 p-0.5 rounded-full hover:bg-Color-Secondary/50 transition-colors"
        aria-label={`Remove ${label}`}
      >
        <X className="h-3 w-3 text-Color-Gray-400 group-hover:text-Color-Dark-500 group-hover:rotate-90 transition-all duration-300" />
      </button>
    </motion.div>
  );

  return (
    <div className="relative mb-10 overflow-hidden">
      <div className="flex flex-wrap items-center gap-3">
        <motion.div 
          layout
          className="flex items-center gap-2 mr-4 text-Color-Light-300"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-black">Refining by:</span>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {searchQuery && (
            <Chip key="search" label={`"${searchQuery}"`} onRemove={onClearSearch} icon={Tag} />
          )}

          {filters.ringStyle && (
            <Chip key="style" label={filters.ringStyle} onRemove={() => onRemoveFilter('ringStyle')} />
          )}

          {filters.shapes?.map(shape => (
            <Chip key={`shape-${shape}`} label={shape} onRemove={() => onRemoveFilter('shapes', shape)} />
          ))}

          {(filters.minPrice || filters.maxPrice) && (
            <Chip 
              key="price" 
              label={`${filters.minPrice || 0} - ${filters.maxPrice || '∞'}`} 
              onRemove={() => { onRemoveFilter('minPrice'); onRemoveFilter('maxPrice'); }} 
              icon={Tag} 
            />
          )}

          {filters.ringSizes?.map(size => (
            <Chip key={`size-${size}`} label={`Size ${size}`} onRemove={() => onRemoveFilter('ringSizes', size)} icon={Ruler} />
          ))}

          {filters.inStockOnly && (
            <Chip key="stock" label="Available Now" onRemove={() => onRemoveFilter('inStockOnly')} icon={Box} />
          )}

          <motion.button
            layout
            key="clear-all"
            onClick={onClearAll}
            whileHover={{ x: 3 }}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-Color-Champagne-Gold hover:text-Color-Dark-500 transition-colors ml-2"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </motion.button>
        </AnimatePresence>
      </div>
      
      {/* Decorative hairline underline */}
      <div className="w-full h-px bg-gradient-to-r from-Color-Champagne-Gold/20 via-transparent to-transparent mt-6" />
    </div>
  );
};