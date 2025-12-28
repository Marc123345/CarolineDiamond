import React, { useState, useMemo } from 'react';
import { X, ChevronDown, RotateCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ProductFilters as FilterType,
  JEWELRY_CATEGORIES,
  RING_STYLES,
  ALL_SHAPES,
  getAvailableShapes,
  shouldShowShapeFilter,
} from '../../config/filterConfig';
import type { ProcessedProduct } from '../../types/shopify';
import { applyFilterChange } from '../../lib/shop/filterRules';

interface AdvancedProductFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onClose?: () => void;
  isMobile?: boolean;
  products?: ProcessedProduct[];
  isLoading?: boolean;
}

const SectionHeader: React.FC<{
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  description?: string;
  activeCount?: number;
}> = ({ title, isExpanded, onToggle, description, activeCount }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between py-5 border-b border-black/[0.05] group"
  >
    <div className="text-left">
      <div className="flex items-center gap-3">
        <h3 className="text-xs uppercase tracking-[0.3em] font-black text-Color-Dark-500">
          {title}
        </h3>
        {activeCount ? (
          <span className="w-5 h-5 rounded-full bg-Color-Champagne-Gold text-white text-[10px] flex items-center justify-center font-bold">
            {activeCount}
          </span>
        ) : null}
      </div>
      {description && !isExpanded && (
        <p className="text-[10px] text-Color-Gray-400 uppercase tracking-widest mt-1">
          {description}
        </p>
      )}
    </div>
    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
      <ChevronDown className="h-4 w-4 text-Color-Light-300" />
    </motion.div>
  </button>
);

export const AdvancedProductFilters: React.FC<AdvancedProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
  isMobile = false,
  products = [],
  isLoading = false,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['jewelryType', 'ringStyle', 'shape'])
  );

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(section) ? next.delete(section) : next.add(section);
      return next;
    });
  };

  const handleFilterChange = (key: keyof FilterType, value: any) => {
    const updated = applyFilterChange(filters, key, value);
    onFiltersChange(updated);
  };

  const handleToggleArrayFilter = (key: keyof FilterType, value: string) => {
    const currentArray = (filters[key] as string[]) || [];
    const isSelected = currentArray.includes(value);

    const newArray = isSelected
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];

    handleFilterChange(key, newArray.length > 0 ? newArray : undefined);
  };

  const handleClearAll = () => {
    onFiltersChange({});
  };

  const availableShapes = useMemo(() => {
    if (filters.ringStyle) return getAvailableShapes(filters.ringStyle);
    if (!filters.jewelryCategory || filters.jewelryCategory === 'Rings') return ALL_SHAPES;
    return [];
  }, [filters.ringStyle, filters.jewelryCategory]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.jewelryCategory) count++;
    if (filters.ringStyle) count++;
    if (filters.shapes && filters.shapes.length > 0) count += filters.shapes.length;
    if (filters.metalColors && filters.metalColors.length > 0) count += filters.metalColors.length;
    if (filters.stoneType) count++;
    if (filters.caratWeights && filters.caratWeights.length > 0) count += filters.caratWeights.length;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
    if (filters.inStockOnly) count++;
    return count;
  }, [filters]);

  return (
    <div className={`flex flex-col bg-white ${isMobile ? 'h-full' : ''}`}>
      {/* Header */}
      <div
        className={`px-6 py-6 border-b border-black/[0.03] ${
          isMobile ? 'sticky top-0 z-20 bg-white/80 backdrop-blur-md' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-serif text-Color-Dark-500">Refine Collection</h2>
          {isMobile && (
            <button onClick={onClose} className="p-2 -mr-2" aria-label="Close filters">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isLoading ? 'bg-Color-Champagne-Gold animate-pulse' : 'bg-green-500'
            }`}
          />
          <span className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-400">
            {products.length} Masterpieces Found
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar space-y-2">
        {/* Reset Button */}
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handleClearAll}
              className="w-full py-3 mb-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-Color-Champagne-Gold border border-Color-Champagne-Gold/20 hover:bg-Color-Primary-Beige/10 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All Filters ({activeFilterCount})
            </motion.button>
          )}
        </AnimatePresence>

        {/* 1. Jewelry Category */}
        <SectionHeader
          title="Category"
          isExpanded={expandedSections.has('jewelryType')}
          onToggle={() => toggleSection('jewelryType')}
          description={filters.jewelryCategory}
        />
        <AnimatePresence>
          {expandedSections.has('jewelryType') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2 py-4">
                {JEWELRY_CATEGORIES.map(cat => {
                  const isSelected = filters.jewelryCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() =>
                        handleFilterChange('jewelryCategory', isSelected ? undefined : cat)
                      }
                      className={`relative p-4 text-left border transition-all duration-500 ${
                        isSelected
                          ? 'border-Color-Dark-500 bg-Color-Dark-500 text-white'
                          : 'border-black/[0.05] hover:border-Color-Champagne-Gold'
                      }`}
                    >
                      <span
                        className={`text-[11px] uppercase tracking-widest font-bold ${
                          isSelected ? 'text-white' : 'text-Color-Dark-500'
                        }`}
                      >
                        {cat}
                      </span>
                      {isSelected && (
                        <Check className="absolute top-2 right-2 w-3 h-3 text-Color-Champagne-Gold" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. Ring Style */}
        {filters.jewelryCategory === 'Rings' && (
          <>
            <SectionHeader
              title="Style"
              isExpanded={expandedSections.has('ringStyle')}
              onToggle={() => toggleSection('ringStyle')}
              description={filters.ringStyle}
            />
            <AnimatePresence>
              {expandedSections.has('ringStyle') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 gap-2 py-4">
                    {RING_STYLES.map(style => {
                      const isSelected = filters.ringStyle === style;
                      return (
                        <button
                          key={style}
                          onClick={() =>
                            handleFilterChange('ringStyle', isSelected ? undefined : style)
                          }
                          className={`flex items-center justify-between p-4 border transition-all ${
                            isSelected
                              ? 'border-Color-Champagne-Gold bg-Color-Primary-Beige/10'
                              : 'border-black/[0.05]'
                          }`}
                        >
                          <span className="text-xs font-bold text-Color-Dark-500 uppercase tracking-widest">
                            {style}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* 3. Diamond Shape */}
        {shouldShowShapeFilter(filters.jewelryCategory || 'Rings') && (
          <>
            <SectionHeader
              title="Diamond Shape"
              isExpanded={expandedSections.has('shape')}
              onToggle={() => toggleSection('shape')}
              activeCount={filters.shapes?.length}
            />
            <AnimatePresence>
              {expandedSections.has('shape') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-2 py-4">
                    {ALL_SHAPES.map(shape => {
                      const isCompatible = availableShapes.includes(shape);
                      const isSelected = filters.shapes?.includes(shape);
                      return (
                        <button
                          key={shape}
                          disabled={!isCompatible && !isSelected}
                          onClick={() => handleToggleArrayFilter('shapes', shape)}
                          className={`relative p-4 text-left border transition-all ${
                            isSelected
                              ? 'border-Color-Champagne-Gold bg-Color-Primary-Beige/10'
                              : 'border-black/[0.05]'
                          } ${
                            !isCompatible && !isSelected
                              ? 'opacity-30 cursor-not-allowed grayscale'
                              : ''
                          }`}
                        >
                          <span className="text-[11px] uppercase tracking-widest font-bold text-Color-Dark-500">
                            {shape}
                          </span>
                          {isSelected && (
                            <Check className="absolute top-2 right-2 w-3 h-3 text-Color-Champagne-Gold" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};
