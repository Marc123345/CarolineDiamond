import React, { useState, useMemo } from 'react';
import { X, ChevronDown, ChevronUp, Loader2, Sparkles } from 'lucide-react';
import {
  ProductFilters as FilterType,
  JEWELRY_CATEGORIES,
  RING_STYLES,
  METAL_COLORS,
  ALL_SHAPES,
  DIAMOND_TYPES,
  PRICE_RANGES,
  getAvailableShapes,
  shouldShowShapeFilter,
} from '../../config/filterConfig';
import { ProcessedProduct } from '../../types/shopify';
import { getMetalColorDisplayInfo } from '../../utils/metalColorUtils';
import { useOptimisticFilters } from '../../hooks/useOptimisticFilters';
import { useOptimizedFilterCounts } from '../../hooks/useOptimizedFilterCounts';

interface HierarchicalProductFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onClose?: () => void;
  isMobile?: boolean;
  products?: ProcessedProduct[];
}

/**
 * SECTION HEADER: Numbered steps for the hierarchical flow
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
        ? 'bg-Color-Champagne-Gold/5 border-gray-900 shadow-sm' 
        : 'bg-gray-50 border-transparent hover:bg-gray-100'
    }`}
  >
    <div className="flex items-center gap-4 text-left">
      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
        isExpanded ? 'bg-gray-900 text-white' : 'bg-gray-300 text-white'
      }`}>
        {step}
      </span>
      <div>
        <h3 className="text-base font-bold text-gray-900">
          {title} {required && <span className="text-Color-Champagne-Gold">*</span>}
        </h3>
        {description && <p className="text-xs text-gray-500 font-medium">{description}</p>}
      </div>
    </div>
    {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
  </button>
);

export const HierarchicalProductFilters: React.FC<HierarchicalProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
  isMobile = false,
  products = []
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['jewelryType', 'ringStyle', 'shape'])
  );

  // 1. Snappy UI Hook: Handles Cascading resets (e.g. Category -> Style)
  const { optimisticFilters, updateFilter, toggleArrayFilter, resetFilters } = useOptimisticFilters({
    onFiltersChange,
    initialFilters: filters
  });

  // 2. High-Performance Counting: Aggregates CSV data batches
  const { counts } = useOptimizedFilterCounts(products, optimisticFilters);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const availableShapes = useMemo(() => {
    return getAvailableShapes(optimisticFilters.ringStyle, optimisticFilters.jewelryCategory);
  }, [optimisticFilters.ringStyle, optimisticFilters.jewelryCategory]);

  return (
    <div className={`${isMobile ? 'h-full flex flex-col' : ''} bg-white`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Customize Your Selection</h2>
        {isMobile && (
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className={`${isMobile ? 'flex-1 overflow-y-auto px-4' : ''} space-y-4 py-4`}>
        
        {/* Step 1: Category Selection */}
        <div className="space-y-2">
          <SectionHeader 
            title="Category" step={1} section="jewelryType" 
            isExpanded={expandedSections.has('jewelryType')} 
            onToggle={() => toggleSection('jewelryType')}
            required
          />
          {expandedSections.has('jewelryType') && (
            <div className="grid grid-cols-3 gap-2 px-1 animate-fadeIn">
              {JEWELRY_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => updateFilter('jewelryCategory', cat)}
                  className={`py-4 rounded-lg text-xs font-bold border-2 transition-all ${
                    optimisticFilters.jewelryCategory === cat 
                      ? 'border-gray-900 bg-gray-900 text-white' 
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Ring Style (Conditional Visibility) */}
        {optimisticFilters.jewelryCategory === 'Rings' && (
          <div className="space-y-2">
            <SectionHeader 
              title="Ring Style" step={2} section="ringStyle" 
              isExpanded={expandedSections.has('ringStyle')} 
              onToggle={() => toggleSection('ringStyle')}
              description="Primary setting style"
            />
            {expandedSections.has('ringStyle') && (
              <div className="grid grid-cols-1 gap-2 px-1 animate-fadeIn">
                {RING_STYLES.map(style => {
                  const count = counts.ringStyles[style] || 0;
                  const isSelected = optimisticFilters.ringStyle === style;
                  return (
                    <button
                      key={style}
                      disabled={count === 0 && !isSelected}
                      onClick={() => updateFilter('ringStyle', isSelected ? undefined : style)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-gray-900 bg-gray-50' 
                          : 'border-gray-100 bg-white'
                      } ${count === 0 && !isSelected ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
                    >
                      <span className="text-sm font-bold">{style}</span>
                      <span className="text-[11px] font-bold bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Shape (Cascades from Style) */}
        {shouldShowShapeFilter(optimisticFilters.jewelryCategory) && (
          <div className="space-y-2">
            <SectionHeader 
              title="Diamond Shape" step={3} section="shape" 
              isExpanded={expandedSections.has('shape')} 
              onToggle={() => toggleSection('shape')}
            />
            {expandedSections.has('shape') && (
              <div className="grid grid-cols-3 gap-2 px-1 animate-fadeIn">
                {ALL_SHAPES.map(shape => {
                  const isCompatible = availableShapes.includes(shape);
                  const isSelected = optimisticFilters.shapes?.includes(shape);
                  const count = counts.shapes[shape] || 0;
                  return (
                    <button
                      key={shape}
                      disabled={!isCompatible && !isSelected}
                      onClick={() => toggleArrayFilter('shapes', shape)}
                      className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                        isSelected ? 'border-Color-Champagne-Gold bg-Color-Champagne-Gold/5' : 'border-gray-100 bg-white'
                      } ${!isCompatible && !isSelected ? 'opacity-20 cursor-not-allowed' : ''}`}
                    >
                      <span className="text-[11px] font-bold text-gray-900">{shape}</span>
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
            description="18K Gold Options"
          />
          {expandedSections.has('metal') && (
            <div className="flex gap-2 px-1">
              {METAL_COLORS.map(color => {
                const info = getMetalColorDisplayInfo(color);
                const isSelected = optimisticFilters.metalColors?.includes(color);
                const count = counts.metalColors[color] || 0;
                return (
                  <button
                    key={color}
                    onClick={() => toggleArrayFilter('metalColors', color)}
                    className={`flex-1 flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                      isSelected ? 'border-gray-900 bg-gray-50 shadow-inner' : 'border-gray-100 bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full mb-2 border border-gray-200" style={{ background: info.hex }} />
                    <span className="text-[10px] font-bold text-gray-900">{color.replace(' Gold', '')}</span>
                    <span className="text-[9px] text-gray-400">({count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 5: Diamond Type (Option 2 Mapping) */}
        <div className="space-y-2">
          <SectionHeader 
            title="Diamond Type" step={5} section="type" 
            isExpanded={expandedSections.has('type')} 
            onToggle={() => toggleSection('type')}
          />
          {expandedSections.has('type') && (
            <div className="space-y-1.5 px-1">
              {DIAMOND_TYPES.map(type => {
                const isSelected = optimisticFilters.diamondTypes?.some(t => t.value === type.value);
                const count = counts.diamondTypes[type.value] || 0;
                return (
                  <button
                    key={type.value}
                    onClick={() => toggleArrayFilter('diamondTypes', type)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      isSelected ? 'border-gray-900 bg-gray-50 shadow-inner' : 'border-gray-100 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className={`h-4 w-4 ${type.origin === 'Natural' ? 'text-blue-400' : 'text-green-400'}`} />
                      <span className="text-sm font-bold text-gray-900">{type.display}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-400">{count}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Footer / Results Preview */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3">
        <button onClick={resetFilters} className="flex-1 py-3 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">
          Reset
        </button>
        {isMobile && (
          <button onClick={onClose} className="flex-[3] py-4 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-xl active:scale-[0.98] transition-transform">
            VIEW {products.length} PRODUCTS
          </button>
        )}
      </div>
    </div>
  );
};