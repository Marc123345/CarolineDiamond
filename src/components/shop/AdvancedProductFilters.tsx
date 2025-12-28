import React, { useState, useMemo } from 'react';
import { X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import {
  ProductFilters as FilterType,
  JEWELRY_CATEGORIES,
  RING_STYLES,
  METAL_COLORS,
  METAL_COLOR_LABELS,
  ALL_SHAPES,
  CARAT_WEIGHTS,
  DIAMOND_TYPES,
  PRICE_RANGES,
  getAvailableShapes,
  shouldShowShapeFilter,
  RingStyle,
  Shape,
  CaratWeight,
  DiamondType
} from '../../config/filterConfig';
import { ProcessedProduct } from '../../types/shopify';
import { getMetalColorDisplayInfo } from '../../utils/metalColorUtils';
import { useEnhancedFilterCounts } from '../../hooks/useEnhancedFilterCounts';
import { useOptimisticFilters } from '../../hooks/useOptimisticFilters';
import { SmartFilterSuggestions } from './SmartFilterSuggestions';
import { FilterAnalyticsDashboard } from './FilterAnalyticsDashboard';
import { useOptimizedFilterCounts } from '../../hooks/useOptimizedFilterCounts';

interface AdvancedProductFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onClose?: () => void;
  isMobile?: boolean;
  products?: ProcessedProduct[];
  isLoading?: boolean;
}

interface FilterOptionProps {
  id: string;
  label: string;
  count: number;
  isSelected: boolean;
  isDisabled: boolean;
  isCompatible: boolean;
  onChange: () => void;
  icon?: React.ReactNode;
  showCount?: boolean;
  isLoading?: boolean;
}

const FilterOption: React.FC<FilterOptionProps> = ({
  id,
  label,
  count,
  isSelected,
  isDisabled,
  isCompatible,
  onChange,
  icon,
  showCount = true,
  isLoading = false
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isDisabled || isSelected) {
        onChange();
      }
    }
  };

  return (
    <label
      htmlFor={id}
      className={`
        flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer
        ${isSelected
          ? 'border-Color-Champagne-Gold bg-Color-Champagne-Gold/10'
          : isDisabled
          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
          : 'border-gray-200 hover:border-Color-Champagne-Gold/50 hover:bg-Color-Primary-Beige/20'
        }
        ${!isCompatible && !isSelected ? 'border-red-200 bg-red-50/30' : ''}
        focus-within:ring-2 focus-within:ring-Color-Champagne-Gold/50
      `}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="checkbox"
      aria-checked={isSelected}
      aria-disabled={isDisabled && !isSelected}
      aria-label={`${label}${showCount ? `, ${count} products` : ''}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <input
          id={id}
          type="checkbox"
          checked={isSelected}
          onChange={onChange}
          disabled={isDisabled && !isSelected}
          className="w-5 h-5 rounded border-2 border-Color-Champagne-Gold text-Color-Champagne-Gold focus:ring-2 focus:ring-Color-Champagne-Gold/50 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          aria-hidden="true"
          tabIndex={-1}
        />
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <span className={`text-sm font-medium truncate ${isDisabled && !isSelected ? 'text-gray-400' : 'text-Color-Netural-Black'}`}>
          {label}
        </span>
      </div>
      {showCount && (
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-Color-Champagne-Gold" />
          ) : (
            <span className={`
              text-xs font-bold px-2 py-1 rounded-full
              ${isSelected
                ? 'bg-Color-Champagne-Gold text-white'
                : isDisabled
                ? 'bg-gray-200 text-gray-400'
                : count === 0
                ? 'bg-red-100 text-red-600'
                : 'bg-Color-Primary-Beige text-Color-Netural-Black'
              }
            `}>
              {count}
            </span>
          )}
        </div>
      )}
    </label>
  );
};

const SectionHeader: React.FC<{
  title: string;
  section: string;
  isExpanded: boolean;
  onToggle: () => void;
  label: string;
  required?: boolean;
  description?: string;
}> = ({ title, section, isExpanded, onToggle, label, required, description }) => (
  <button
    onClick={onToggle}
    className={`w-full flex items-center justify-between py-3 px-4 rounded-lg transition-all group ${
      isExpanded
        ? 'bg-Color-Champagne-Gold/10 border-2 border-Color-Champagne-Gold/30'
        : 'bg-Color-Primary-Beige/10 hover:bg-Color-Primary-Beige/20 border-2 border-transparent'
    }`}
    aria-expanded={isExpanded}
    aria-controls={`filter-section-${section}`}
  >
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className="w-8 h-8 rounded-full bg-Color-Netural-Black text-white flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover:bg-Color-Champagne-Gold transition-colors">
        {label}
      </div>
      <div className="text-left min-w-0 flex-1">
        <h3 className="text-base font-bold text-Color-Netural-Black truncate">
          {title}
          {required && <span className="text-Color-Champagne-Gold ml-1">*</span>}
        </h3>
        {description && (
          <p className="text-xs text-Color-Gray-700 truncate">{description}</p>
        )}
      </div>
    </div>
    {isExpanded ? (
      <ChevronUp className="h-5 w-5 text-Color-Champagne-Gold flex-shrink-0 ml-2" />
    ) : (
      <ChevronDown className="h-5 w-5 text-Color-Champagne-Gold flex-shrink-0 ml-2" />
    )}
  </button>
);

const SkeletonLoader: React.FC = () => (
  <div className="space-y-2 animate-pulse" role="status" aria-label="Loading filters">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-12 bg-gray-200 rounded-lg" />
    ))}
  </div>
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
    new Set(['jewelryType', 'ringStyle', 'shape', 'metalColor'])
  );

  const { optimisticFilters, isUpdating, updateFilter, updateMultipleFilters, resetFilters } = useOptimisticFilters({
    debounceMs: 300,
    onFiltersChange,
    initialFilters: filters
  });

  const { counts: filterCounts } = useEnhancedFilterCounts(products, optimisticFilters);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const toggleArrayItem = <T extends string>(array: T[] | undefined, item: T): T[] => {
    const current = array || [];
    return current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
  };

  const handleFilterUpdate = (key: keyof FilterType, value: any) => {
    const updates: Partial<FilterType> = { [key]: value };

    // Handle cascading dependencies
    if (key === 'jewelryCategory') {
      if (value !== 'Rings') {
        updates.ringStyle = undefined;
        updates.shapes = undefined;
      }
    }

    // When Ring Style changes, clear incompatible shapes
    if (key === 'ringStyle' && value) {
      const availableShapes = getAvailableShapes(value as RingStyle);
      if (optimisticFilters.shapes) {
        const compatibleShapes = optimisticFilters.shapes.filter(shape =>
          availableShapes.includes(shape)
        );
        updates.shapes = compatibleShapes.length > 0 ? compatibleShapes : undefined;
      }
    }

    updateMultipleFilters(updates);
  };

  // Determine available and compatible shapes
  const availableShapes = useMemo(() => {
    if (optimisticFilters.ringStyle) {
      return getAvailableShapes(optimisticFilters.ringStyle);
    }
    // Show all shapes if Rings is selected OR if no category is selected (default to rings)
    if (!optimisticFilters.jewelryCategory || optimisticFilters.jewelryCategory === 'Rings') {
      return ALL_SHAPES;
    }
    return [];
  }, [optimisticFilters.ringStyle, optimisticFilters.jewelryCategory]);

  // Show shape filter if no category selected (default) or if Rings is selected
  const showShapeFilter = !optimisticFilters.jewelryCategory || shouldShowShapeFilter(optimisticFilters.jewelryCategory);

  // Calculate shape compatibility
  const shapeAvailability = useMemo(() => {
    return ALL_SHAPES.map(shape => {
      const isCompatible = availableShapes.includes(shape);
      const count = filterCounts.shapes[shape] || 0;
      const isSelected = optimisticFilters.shapes?.includes(shape) || false;
      const isDisabled = !isCompatible || (count === 0 && !isSelected);

      return {
        shape,
        isCompatible,
        count,
        isDisabled,
        isSelected
      };
    });
  }, [availableShapes, filterCounts.shapes, optimisticFilters.shapes]);

  const activeFilterCount = [
    optimisticFilters.jewelryCategory,
    optimisticFilters.ringStyle,
    optimisticFilters.shapes?.length,
    optimisticFilters.metalColors?.length,
    optimisticFilters.minPrice || optimisticFilters.maxPrice ? 1 : 0
  ].filter(Boolean).length;

  const totalMatchingProducts = products.length;

  return (
    <div className={`${isMobile ? 'h-full flex flex-col' : ''} bg-white`}>
      {/* Header */}
      {isMobile && (
        <div className="flex items-center justify-between pb-4 border-b border-Color-Champagne-Gold/30 flex-shrink-0 px-4 pt-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-Color-Netural-Black truncate">Filters</h2>
            <p className="text-sm text-Color-Gray-700">
              {isLoading && products.length === 0 ? (
                <>Loading products...</>
              ) : (
                <>{totalMatchingProducts} {totalMatchingProducts === 1 ? 'product' : 'products'} found</>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-Color-Primary-Beige/30 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0 ml-2"
            aria-label="Close filters"
          >
            <X className="h-6 w-6 text-Color-Netural-Black" />
          </button>
        </div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-Color-Netural-Black mb-1">Filter Products</h2>
          <p className="text-sm text-Color-Gray-700">
            {isLoading && products.length === 0 ? (
              <>Loading products...</>
            ) : (
              <>{totalMatchingProducts} {totalMatchingProducts === 1 ? 'product' : 'products'} found</>
            )}
          </p>
        </div>
      )}

      {/* Filter Content */}
      <div className={`${isMobile ? 'flex-1 overflow-y-auto px-4' : ''} space-y-4 py-4`}>
        {/* Clear Filters Button */}
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="w-full py-3 text-sm font-medium text-Color-Champagne-Gold hover:text-Color-Netural-Black transition-colors border border-Color-Champagne-Gold/30 rounded-lg hover:bg-Color-Primary-Beige/20 flex items-center justify-center gap-2"
            aria-label={`Clear all ${activeFilterCount} active filters`}
          >
            <X className="h-4 w-4" />
            Clear all filters ({activeFilterCount})
          </button>
        )}

        {/* Jewelry Category Filter */}
        <div className="space-y-2">
          <SectionHeader
            title="Jewelry Type"
            section="jewelryType"
            label="1"
            isExpanded={expandedSections.has('jewelryType')}
            onToggle={() => toggleSection('jewelryType')}
            required
            description="Choose your jewelry category"
          />

          {expandedSections.has('jewelryType') && (
            <div id="filter-section-jewelryType" className="pl-2 pt-2" role="group" aria-labelledby="jewelry-type-label">
              <div className="grid grid-cols-3 gap-3">
                {JEWELRY_CATEGORIES.map(category => {
                  const isSelected = optimisticFilters.jewelryCategory === category;
                  const count = products.filter(p =>
                    p.productType?.includes(category) || p.tags?.some(t => t.includes(category))
                  ).length;

                  return (
                    <button
                      key={category}
                      onClick={() => handleFilterUpdate('jewelryCategory', isSelected ? undefined : category)}
                      className={`py-4 px-3 rounded-lg text-sm font-bold transition-all ${
                        isSelected
                          ? 'bg-Color-Netural-Black text-white shadow-lg'
                          : 'bg-white border-2 border-Color-Champagne-Gold/30 hover:border-Color-Champagne-Gold hover:bg-Color-Primary-Beige/20'
                      }`}
                    >
                      <div>{category}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Ring Style Filter */}
        {optimisticFilters.jewelryCategory === 'Rings' && (
          <div className="space-y-2">
            <SectionHeader
              title="Ring Style"
              section="ringStyle"
              label="2"
              isExpanded={expandedSections.has('ringStyle')}
              onToggle={() => toggleSection('ringStyle')}
              required
              description="Primary design style"
            />

            {expandedSections.has('ringStyle') && (
              <div id="filter-section-ringStyle" className="pl-2 pt-2" role="group" aria-labelledby="ring-style-label">
                {isLoading ? (
                  <SkeletonLoader />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {RING_STYLES.map(style => {
                      const isSelected = optimisticFilters.ringStyle === style;
                      const count = filterCounts.ringStyles[style] || 0;

                      return (
                        <button
                          key={style}
                          onClick={() => handleFilterUpdate('ringStyle', isSelected ? undefined : style)}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 min-h-[100px] ${
                            isSelected
                              ? 'border-Color-Netural-Black bg-Color-Netural-Black text-white shadow-lg'
                              : 'border-Color-Champagne-Gold/30 hover:border-Color-Champagne-Gold hover:shadow-md'
                          }`}
                          disabled={count === 0 && !isSelected}
                        >
                          <div className="text-center">
                            <div className="text-xs font-semibold">{style}</div>
                            <div className={`text-xs mt-1 ${isSelected ? 'text-white/70' : 'text-Color-Gray-700'}`}>
                              {isUpdating && isSelected ? (
                                <Loader2 className="h-3 w-3 animate-spin inline" />
                              ) : (
                                `(${count})`
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Shape Filter */}
        {showShapeFilter && availableShapes.length > 0 && (
          <div className="space-y-2">
            <SectionHeader
              title="Diamond Shape"
              section="shape"
              label="3"
              isExpanded={expandedSections.has('shape')}
              onToggle={() => toggleSection('shape')}
              description={optimisticFilters.ringStyle ? `Compatible with ${optimisticFilters.ringStyle}` : 'Select multiple'}
            />

            {expandedSections.has('shape') && (
              <div id="filter-section-shape" className="space-y-2 pt-2" role="group" aria-labelledby="shape-label">
                {isLoading ? (
                  <SkeletonLoader />
                ) : (
                  <>
                    {optimisticFilters.ringStyle && (
                      <div className="text-xs text-Color-Gray-700 bg-Color-Primary-Beige/30 p-2 rounded-lg mb-2" role="note">
                        <strong>Note:</strong> Some shapes are not compatible with {optimisticFilters.ringStyle} and are disabled.
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      {shapeAvailability.map(({ shape, isCompatible, count, isDisabled, isSelected }) => (
                        <button
                          key={shape}
                          onClick={() => {
                            if (isCompatible || isSelected) {
                              updateFilter('shapes', toggleArrayItem(optimisticFilters.shapes, shape));
                            }
                          }}
                          disabled={isDisabled}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 min-h-[100px] ${
                            isSelected
                              ? 'border-Color-Champagne-Gold bg-Color-Champagne-Gold/10 shadow-md'
                              : isDisabled
                              ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                              : !isCompatible
                              ? 'border-red-200 bg-red-50/30 cursor-not-allowed'
                              : 'border-Color-Champagne-Gold/30 hover:border-Color-Champagne-Gold hover:shadow-md'
                          }`}
                        >
                          <div className="text-center">
                            <div className={`text-xs font-semibold ${
                              isDisabled || !isCompatible ? 'text-gray-400' : 'text-Color-Netural-Black'
                            }`}>
                              {shape}
                            </div>
                            <div className={`text-xs mt-1 ${
                              isSelected
                                ? 'text-Color-Champagne-Gold font-bold'
                                : isDisabled
                                ? 'text-gray-400'
                                : 'text-Color-Gray-700'
                            }`}>
                              {isUpdating && isSelected ? (
                                <Loader2 className="h-3 w-3 animate-spin inline" />
                              ) : (
                                `(${count})`
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Metal Color Filter */}
        <div className="space-y-2">
          <SectionHeader
            title="Metal Color"
            section="metalColor"
            label="4"
            isExpanded={expandedSections.has('metalColor')}
            onToggle={() => toggleSection('metalColor')}
            description="18K Gold options"
          />

          {expandedSections.has('metalColor') && (
            <div id="filter-section-metalColor" className="pl-2 pt-2" role="group" aria-labelledby="metal-color-label">
              {isLoading ? (
                <SkeletonLoader />
              ) : (
                <div className="flex gap-3 justify-center">
                  {METAL_COLORS.map(metal => {
                    const isSelected = optimisticFilters.metalColors?.includes(metal) || false;
                    const count = filterCounts.metalColors[metal] || 0;
                    const metalInfo = getMetalColorDisplayInfo(metal);
                    const label = METAL_COLOR_LABELS[metal];

                    return (
                      <button
                        key={metal}
                        onClick={() => updateFilter('metalColors', toggleArrayItem(optimisticFilters.metalColors, metal))}
                        disabled={count === 0 && !isSelected}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-3 min-h-[120px] ${
                          isSelected
                            ? 'border-Color-Champagne-Gold bg-Color-Champagne-Gold/10 shadow-md'
                            : count === 0
                            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                            : 'border-Color-Champagne-Gold/30 hover:border-Color-Champagne-Gold hover:shadow-md'
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-sm"
                          style={{ backgroundColor: metalInfo.hexColor }}
                          aria-hidden="true"
                        />
                        <div className="text-center">
                          <div className="text-xs font-semibold text-Color-Netural-Black">
                            {label.replace('18K ', '')}
                          </div>
                          <div className={`text-xs mt-1 ${
                            isSelected ? 'text-Color-Champagne-Gold font-bold' : 'text-Color-Gray-700'
                          }`}>
                            {isUpdating && isSelected ? (
                              <Loader2 className="h-3 w-3 animate-spin inline" />
                            ) : (
                              `(${count})`
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Empty State */}
        {totalMatchingProducts === 0 && activeFilterCount > 0 && (
          <div className="mt-6 p-6 bg-Color-Primary-Beige/30 rounded-lg text-center border-2 border-dashed border-Color-Champagne-Gold/30" role="status" aria-live="polite">
            <div className="text-4xl mb-3" aria-hidden="true">💎</div>
            <h3 className="text-lg font-bold text-Color-Netural-Black mb-2">
              No products match your selection
            </h3>
            <p className="text-sm text-Color-Gray-700 mb-4">
              Try adjusting your filters or clearing some selections
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-Color-Champagne-Gold text-white rounded-lg hover:bg-Color-Champagne-Gold/90 transition-colors font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Footer - Mobile Apply Button */}
      {isMobile && (
        <div className="border-t border-Color-Champagne-Gold/30 p-4 flex-shrink-0 bg-white">
          <button
            onClick={onClose}
            className="w-full py-4 bg-Color-Champagne-Gold text-white rounded-lg hover:bg-Color-Champagne-Gold/90 transition-colors font-bold text-base"
            aria-label={`Show ${totalMatchingProducts} ${totalMatchingProducts === 1 ? 'product' : 'products'}`}
          >
            Show {totalMatchingProducts} {totalMatchingProducts === 1 ? 'Product' : 'Products'}
          </button>
        </div>
      )}
    </div>
  );
};
