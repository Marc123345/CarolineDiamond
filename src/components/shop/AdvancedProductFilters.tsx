import React, { useState, useMemo } from 'react';
import { X, ChevronDown, ChevronUp, Loader2, Check } from 'lucide-react';

// CORRECTED PATHS: Climbing two levels (../../) to reach the root folders
import {
  ProductFilters as FilterType,
  JEWELRY_CATEGORIES,
  RING_STYLES,
  METAL_COLORS,
  METAL_COLOR_LABELS,
  ALL_SHAPES,
  CARAT_WEIGHTS,
  getAvailableShapes,
  shouldShowShapeFilter,
  RingStyle
} from '../../config/filterConfig';

import { ProcessedProduct } from '../../types/shopify';
import { ShapeIcon, RingStyleIcon } from './ShapeIcons';
import { getMetalColorDisplayInfo } from '../../utils/metalColorUtils';
import { useEnhancedFilterCounts } from '../../hooks/useEnhancedFilterCounts';
import { useOptimisticFilters } from '../../hooks/useOptimisticFilters';
import { useTranslate } from '../../hooks/useTranslate';

interface AdvancedProductFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onClose?: () => void;
  isMobile?: boolean;
  products?: ProcessedProduct[];
  isLoading?: boolean;
}

export const AdvancedProductFilters: React.FC<AdvancedProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
  isMobile = false,
  products = [],
  isLoading = false
}) => {
  const t = useTranslate();
  
  // State for Accordion Sections
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['jewelryType', 'ringStyle', 'shape', 'metalColor', 'caratWeight'])
  );

  // Optimistic UI Hook for instant feedback
  const { 
    optimisticFilters, 
    isUpdating, 
    updateMultipleFilters, 
    resetFilters 
  } = useOptimisticFilters({
    debounceMs: 300,
    onFiltersChange,
    initialFilters: filters
  });

  // Calculate product counts for each filter option
  const { counts: filterCounts } = useEnhancedFilterCounts(products, optimisticFilters);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const handleFilterUpdate = (key: keyof FilterType, value: any) => {
    const updates: Partial<FilterType> = { [key]: value };

    // Cascading Logic: Reset child filters when parent categories change
    if (key === 'jewelryCategory' && value !== 'Rings') {
      updates.ringStyle = undefined;
      updates.shapes = undefined;
    }

    // Reset shapes if they aren't compatible with the new Ring Style
    if (key === 'ringStyle' && value) {
      const availableShapes = getAvailableShapes(value as RingStyle);
      if (optimisticFilters.shapes) {
        const compatibleShapes = optimisticFilters.shapes.filter(s => availableShapes.includes(s));
        updates.shapes = compatibleShapes.length > 0 ? compatibleShapes : undefined;
      }
    }

    updateMultipleFilters(updates);
  };

  const toggleArrayItem = (current: string[] | undefined, item: string) => {
    const arr = current || [];
    return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
  };

  const activeFilterCount = [
    optimisticFilters.jewelryCategory,
    optimisticFilters.ringStyle,
    optimisticFilters.shapes?.length,
    optimisticFilters.metalColors?.length,
    optimisticFilters.caratWeights?.length
  ].filter(Boolean).length;

  return (
    <div className={`${isMobile ? 'h-full flex flex-col' : 'space-y-6'} bg-white`}>
      {/* 1. Header Section */}
      <div className={`flex items-center justify-between ${isMobile ? 'p-6 border-b border-gray-100' : 'mb-4'}`}>
        <div>
          <h2 className="text-xl font-medium text-gray-900 tracking-tight">{t('Curate Selection')}</h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">
            {isLoading ? t('Syncing inventory...') : `${products.length} ${t('Items Matched')}`}
          </p>
        </div>
        {isMobile && (
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <X className="h-6 w-6 text-gray-400" />
          </button>
        )}
      </div>

      <div className={`${isMobile ? 'flex-1 overflow-y-auto p-6' : ''} space-y-6`}>
        {/* Reset Button */}
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="w-full py-3 text-[10px] font-bold uppercase tracking-widest text-[#CDBCAB] border border-[#CDBCAB]/20 rounded-xl hover:bg-[#CDBCAB]/5 transition-all flex items-center justify-center gap-2"
          >
            <X className="h-3 w-3" />
            {t('Reset all filters')} ({activeFilterCount})
          </button>
        )}

        {/* 2. Collection (Category) Accordion */}
        <div className="space-y-3">
          <FilterHeader title="Collection" label="01" isOpen={expandedSections.has('jewelryType')} onToggle={() => toggleSection('jewelryType')} />
          {expandedSections.has('jewelryType') && (
            <div className="grid grid-cols-2 gap-2 animate-fadeIn">
              {JEWELRY_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleFilterUpdate('jewelryCategory', optimisticFilters.jewelryCategory === cat ? undefined : cat)}
                  className={`py-3 px-4 rounded-xl text-[10px] font-bold uppercase transition-all border-2 ${
                    optimisticFilters.jewelryCategory === cat ? 'bg-gray-900 border-gray-900 text-white shadow-lg' : 'bg-white border-gray-50 text-gray-500 hover:border-[#CDBCAB]/30'
                  }`}
                >
                  {t(cat)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Ring Style Accordion (Conditional) */}
        {optimisticFilters.jewelryCategory === 'Rings' && (
          <div className="space-y-3">
            <FilterHeader title="Ring Style" label="02" isOpen={expandedSections.has('ringStyle')} onToggle={() => toggleSection('ringStyle')} />
            {expandedSections.has('ringStyle') && (
              <div className="grid grid-cols-2 gap-2 animate-fadeIn">
                {RING_STYLES.map(style => {
                  const isSelected = optimisticFilters.ringStyle === style;
                  const count = filterCounts.ringStyles[style] || 0;
                  return (
                    <button
                      key={style}
                      onClick={() => handleFilterUpdate('ringStyle', isSelected ? undefined : style)}
                      disabled={count === 0 && !isSelected}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                        isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-50 hover:border-[#CDBCAB]/30'
                      } ${count === 0 ? 'opacity-30' : ''}`}
                    >
                      <RingStyleIcon style={style} size={32} className={isSelected ? 'text-gray-900' : 'text-gray-300'} />
                      <div className="text-center">
                        <span className="block text-[10px] font-bold uppercase text-gray-900">{t(style)}</span>
                        <span className="text-[9px] text-gray-400 font-bold">({count})</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 4. Diamond Shape Accordion */}
        {shouldShowShapeFilter(optimisticFilters.jewelryCategory) && (
          <div className="space-y-3">
            <FilterHeader title="Diamond Shape" label="03" isOpen={expandedSections.has('shape')} onToggle={() => toggleSection('shape')} />
            {expandedSections.has('shape') && (
              <div className="grid grid-cols-3 gap-2 animate-fadeIn">
                {ALL_SHAPES.map(shape => {
                  const isSelected = optimisticFilters.shapes?.includes(shape);
                  const isCompatible = !optimisticFilters.ringStyle || getAvailableShapes(optimisticFilters.ringStyle as RingStyle).includes(shape);
                  return (
                    <button
                      key={shape}
                      onClick={() => handleFilterUpdate('shapes', toggleArrayItem(optimisticFilters.shapes, shape))}
                      disabled={!isCompatible}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-50 hover:border-[#CDBCAB]/30'
                      } ${!isCompatible ? 'opacity-20 grayscale cursor-not-allowed' : ''}`}
                    >
                      <ShapeIcon shape={shape} size={24} className={isSelected ? 'text-gray-900' : 'text-gray-300'} />
                      <span className="text-[9px] font-bold uppercase text-gray-900">{t(shape)}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Sticky Footer */}
      {isMobile && (
        <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full py-4 bg-gray-900 text-white font-bold uppercase tracking-widest rounded-xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3"
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : `${t('Show Results')} (${products.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

// Internal Header Helper
const FilterHeader = ({ title, label, isOpen, onToggle }: { title: string; label: string; isOpen: boolean; onToggle: () => void }) => (
  <button onClick={onToggle} className="w-full flex items-center justify-between py-4 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-transparent hover:border-[#CDBCAB]/20">
    <div className="flex items-center gap-4">
      <span className="text-[10px] font-bold text-[#CDBCAB]">{label}</span>
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">{title}</h3>
    </div>
    {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
  </button>
);