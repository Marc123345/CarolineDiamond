import React, { useState, useMemo } from 'react';
import { X, ChevronDown, ChevronUp, Loader2, Sparkles } from 'lucide-react';
import {
  ProductFilters as FilterType,
  JEWELRY_CATEGORIES,
  RING_STYLES,
  METAL_COLORS,
  ALL_SHAPES,
  DIAMOND_TYPES,
  CARAT_WEIGHTS,
  PRICE_RANGES,
  getAvailableShapes,
  shouldShowShapeFilter,
  RingStyle,
} from '../../config/filterConfig';
import { ProcessedProduct } from '../../types/shopify';
import { getMetalColorDisplayInfo } from '../../utils/metalColorUtils';
import { useOptimisticFilters } from '../../hooks/useOptimisticFilters';
import { useOptimizedFilterCounts } from '../../hooks/useOptimizedFilterCounts';
import { formatPrice } from '../../utils/filterUtils';

interface AdvancedProductFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onClose?: () => void;
  isMobile?: boolean;
  products?: ProcessedProduct[];
  isLoading?: boolean;
}

/**
 * SECTION HEADER: Includes numbering and status logic
 */
const SectionHeader: React.FC<{
  title: string;
  step: number;
  isExpanded: boolean;
  onToggle: () => void;
  description?: string;
  required?: boolean;
}> = ({ title, step, isExpanded, onToggle, description, required }) => (
  <button
    onClick={onToggle}
    className={`w-full flex items-center justify-between py-4 px-4 rounded-xl transition-all border-2 ${
      isExpanded 
        ? 'bg-white border-gray-900 shadow-sm' 
        : 'bg-gray-50 border-transparent hover:bg-gray-100'
    }`}
  >
    <div className="flex items-center gap-4 text-left">
      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
        isExpanded ? 'bg-gray-900 text-white' : 'bg-gray-300 text-white'
      }`}>
        {step}
      </span>
      <div>
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1">
          {title} {required && <span className="text-Color-Champagne-Gold">*</span>}
        </h3>
        {description && <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">{description}</p>}
      </div>
    </div>
    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
  </button>
);

export const AdvancedProductFilters: React.FC<AdvancedProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
  isMobile = false,
  products = [],
  isLoading = false
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['jewelryType', 'ringStyle', 'shape'])
  );

  // 1. Hook: Optimistic State for snappy UI
  const { optimisticFilters, isUpdating, updateFilter, toggleArrayFilter, resetFilters } = useOptimisticFilters({
    onFiltersChange,
    initialFilters: filters
  });

  // 2. Hook: Optimized Counting based on CSV data pool
  const { counts } = useOptimizedFilterCounts(products, optimisticFilters);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // 3. Logic: Determine Shape Compatibility (Cascades from Style)
  const availableShapes = useMemo(() => {
    return getAvailableShapes(optimisticFilters.ringStyle, optimisticFilters.jewelryCategory);
  }, [optimisticFilters.ringStyle, optimisticFilters.jewelryCategory]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Refine Search</h2>
          <p className="text-xs text-gray-500">{products.length} Items matching</p>
        </div>
        {isMobile && (
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {/* Step 1: Category */}
        <div className="space-y-2">
          <SectionHeader 
            title="Category" step={1} section="jewelryType" 
            isExpanded={expandedSections.has('jewelryType')} 
            onToggle={() => toggleSection('jewelryType')}
            required
          />
          {expandedSections.has('jewelryType') && (
            <div className="grid grid-cols-3 gap-2 px-1">
              {JEWELRY_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => updateFilter('jewelryCategory', cat)}
                  className={`py-3 px-2 rounded-lg text-xs font-bold border-2 transition-all ${
                    optimisticFilters.jewelryCategory === cat 
                      ? 'border-gray-900 bg-gray-900 text-white shadow-md' 
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Ring Style (Only if Rings selected) */}
        {optimisticFilters.jewelryCategory === 'Rings' && (
          <div className="space-y-2">
            <SectionHeader 
              title="Style" step={2} section="ringStyle" 
              isExpanded={expandedSections.has('ringStyle')} 
              onToggle={() => toggleSection('ringStyle')}
              description="Choose your setting"
            />
            {expandedSections.has('ringStyle') && (
              <div className="grid grid-cols-1 gap-2">
                {RING_STYLES.map(style => {
                  const count = counts.ringStyles[style] || 0;
                  const isSelected = optimisticFilters.ringStyle === style;
                  return (
                    <button
                      key={style}
                      disabled={count === 0 && !isSelected}
                      onClick={() => updateFilter('ringStyle', isSelected ? undefined : style)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-gray-900 bg-gray-900/5' 
                          : 'border-gray-100 bg-white opacity-80 hover:opacity-100'
                      } ${count === 0 && !isSelected ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
                    >
                      <span className="text-sm font-semibold">{style}</span>
                      <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded-full">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Shape */}
        {shouldShowShapeFilter(optimisticFilters.jewelryCategory) && (
          <div className="space-y-2">
            <SectionHeader 
              title="Diamond Shape" step={3} section="shape" 
              isExpanded={expandedSections.has('shape')} 
              onToggle={() => toggleSection('shape')}
            />
            {expandedSections.has('shape') && (
              <div className="grid grid-cols-2 gap-2">
                {ALL_SHAPES.map(shape => {
                  const isCompatible = availableShapes.includes(shape);
                  const isSelected = optimisticFilters.shapes?.includes(shape);
                  const count = counts.shapes[shape] || 0;
                  
                  return (
                    <button
                      key={shape}
                      disabled={!isCompatible && !isSelected}
                      onClick={() => toggleArrayFilter('shapes', shape)}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-Color-Champagne-Gold bg-Color-Champagne-Gold/5' 
                          : 'border-gray-100 bg-white'
                      } ${!isCompatible && !isSelected ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
                    >
                      <span className="text-xs font-bold mb-1">{shape}</span>
                      <span className="text-[10px] text-gray-400">({count})</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Metal Color */}
        <div className="space-y-2">
          <SectionHeader 
            title="Metal Color" step={4} section="metal" 
            isExpanded={expandedSections.has('metal')} 
            onToggle={() => toggleSection('metal')}
            description="18K Certified Gold"
          />
          {expandedSections.has('metal') && (
            <div className="flex gap-2">
              {METAL_COLORS.map(color => {
                const info = getMetalColorDisplayInfo(color);
                const isSelected = optimisticFilters.metalColors?.includes(color);
                const count = counts.metalColors[color] || 0;
                return (
                  <button
                    key={color}
                    onClick={() => toggleArrayFilter('metalColors', color)}
                    className={`flex-1 flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                      isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-100 bg-white'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full mb-2 shadow-inner border border-gray-200" style={{ background: info.hex }} />
                    <span className="text-[10px] font-bold text-center leading-tight">{color.replace(' Gold', '')}</span>
                    <span className="text-[9px] text-gray-400 mt-1">{count}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 5: Diamond Type (Option 2 in CSV) */}
        <div className="space-y-2">
          <SectionHeader 
            title="Diamond Type" step={5} section="type" 
            isExpanded={expandedSections.has('type')} 
            onToggle={() => toggleSection('type')}
            description="Origin & Carat"
          />
          {expandedSections.has('type') && (
            <div className="space-y-1.5">
              {DIAMOND_TYPES.map(type => {
                const isSelected = optimisticFilters.diamondTypes?.some(t => t.value === type.value);
                const count = counts.diamondTypes[type.value] || 0;
                return (
                  <button
                    key={type.value}
                    onClick={() => toggleArrayFilter('diamondTypes', type)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                      isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-100 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className={`h-3 w-3 ${type.origin === 'Natural' ? 'text-blue-400' : 'text-green-400'}`} />
                      <span className="text-xs font-bold">{type.display}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{count}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 6: Price Range */}
        <div className="space-y-2">
          <SectionHeader 
            title="Price Range" step={6} section="price" 
            isExpanded={expandedSections.has('price')} 
            onToggle={() => toggleSection('price')}
          />
          {expandedSections.has('price') && (
            <div className="grid grid-cols-1 gap-2">
              {PRICE_RANGES.map(range => {
                const isSelected = optimisticFilters.minPrice === range.min && optimisticFilters.maxPrice === range.max;
                const count = counts.priceRanges?.[range.label.toLowerCase().replace(/ /g, '-')] || 0;
                return (
                  <button
                    key={range.label}
                    onClick={() => {
                      updateFilter('minPrice', isSelected ? undefined : range.min);
                      updateFilter('maxPrice', isSelected ? undefined : range.max);
                    }}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                      isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-100 bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold">{range.label}</span>
                    <span className="text-[10px] text-gray-400">{count}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Footer / Clear All */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3">
        <button
          onClick={resetFilters}
          className="flex-1 py-3 text-xs font-bold text-gray-500 hover:text-gray-900"
        >
          RESET ALL
        </button>
        {isMobile && (
          <button
            onClick={onClose}
            className="flex-[2] py-3 bg-gray-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-gray-200"
          >
            SHOW {products.length} PRODUCTS
          </button>
        )}
      </div>
    </div>
  );
};