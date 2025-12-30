import React, { useState, useMemo } from 'react';
import { X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import {
  ProductFilters as FilterType,
  JEWELRY_CATEGORIES,
  RING_STYLES,
  METAL_COLORS,
  // METAL_COLOR_LABELS, // Removed if not defined in config, using helper instead
  ALL_SHAPES,
  CARAT_WEIGHTS,
  // PRICE_RANGES,
  getAvailableShapes,
  shouldShowShapeFilter,
  RingStyle,
  Shape,
  // CaratWeight
} from '../../config/filterConfig';
import { ProcessedProduct } from '../../types'; // FIXED IMPORT
import { ShapeIcon, RingStyleIcon } from './ShapeIcons';
// import { getMetalColorDisplayInfo } from '../../utils/metalUtils'; // Optional if needed for tooltips
import { useEnhancedFilterCounts } from '../../hooks/useEnhancedFilterCounts';
import { useOptimisticFilters } from '../../hooks/useOptimisticFilters';
import {
  extractMetalColorsFromVariants,
  extractCaratWeightsFromVariants,
  productHasMetalColor,
  productHasCaratWeight,
  getMetalColorDisplayLabel,
  getCaratWeightDisplayLabel
} from '../../utils/variantFilterUtils';

// ==========================================
// 💎 BUSINESS LOGIC & DATA NORMALIZATION
// ==========================================

// 1. Jewelry Type Logic
const getJewelryCategory = (product: ProcessedProduct): string | undefined => {
  if (!product) return undefined;
  // Check category field first, then productType
  const type = (product.category || product.productType || '').toLowerCase();
  
  if (type.includes('necklace')) return 'Necklaces';
  if (type.includes('earring')) return 'Earrings'; // Fixed: 'earring' singular check catches plural too
  if (type.includes('engagement') || type.includes('ring')) return 'Rings';
  return undefined;
};

// 2. Ring Style Logic (Based on Tags)
const getRingStyle = (product: ProcessedProduct): string | undefined => {
  if (!product || !product.tags) return undefined;
  const tags = product.tags;
  
  if (tags.includes('Solitaire + Side Diamonds')) return 'Solitaire + Side Diamonds'; // Fixed exact match from config
  if (tags.includes('solitaire')) return 'Solitaire';
  if (tags.includes('Halo + Side Diamonds')) return 'Halo + Side Diamonds'; // Fixed exact match
  if (tags.includes('halo')) return 'Halo';
  
  return undefined;
};

// 3. Diamond Shape Logic (Extract from Title)
const getDiamondShape = (product: ProcessedProduct): string | undefined => {
  if (!product || !product.name) return undefined; // Changed title to name
  const title = product.name.toLowerCase();
  const shapes = ["Round", "Oval", "Princess", "Pear", "Marquise", "Emerald", "Cushion", "Heart"];
  
  // Return the first shape found in the title (case-insensitive search, returns proper Case string)
  const foundShape = shapes.find(shape => title.includes(shape.toLowerCase()));
  return foundShape;
};

// ==========================================
// 🧩 COMPONENT IMPLEMENTATION
// ==========================================

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
    new Set(['jewelryType', 'ringStyle', 'shape'])
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
      // @ts-ignore - Assuming getAvailableShapes accepts undefined
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
      return getAvailableShapes(optimisticFilters.ringStyle as RingStyle);
    }
    // Show all shapes if Rings is selected OR if no category is selected (default to rings)
    // @ts-ignore
    if (!optimisticFilters.jewelryCategory || optimisticFilters.jewelryCategory === 'Rings' || (Array.isArray(optimisticFilters.jewelryCategory) && optimisticFilters.jewelryCategory.includes('Rings'))) {
      return ALL_SHAPES;
    }
    return [];
  }, [optimisticFilters.ringStyle, optimisticFilters.jewelryCategory]);

  // Show shape filter if no category selected (default) or if Rings is selected
  // @ts-ignore
  const showShapeFilter = !optimisticFilters.jewelryCategory || shouldShowShapeFilter(Array.isArray(optimisticFilters.jewelryCategory) ? optimisticFilters.jewelryCategory[0] : optimisticFilters.jewelryCategory);

  // Calculate shape compatibility
  const shapeAvailability = useMemo(() => {
    return ALL_SHAPES.map(shape => {
      const isCompatible = availableShapes.includes(shape);

      // Safe counting logic
      const count = products.filter(p => {
        if (!p) return false;
        const pShape = getDiamondShape(p);

        // @ts-ignore
        const matchCategory = !optimisticFilters.jewelryCategory || getJewelryCategory(p) === optimisticFilters.jewelryCategory || (Array.isArray(optimisticFilters.jewelryCategory) && optimisticFilters.jewelryCategory.includes(getJewelryCategory(p)));
        const matchStyle = !optimisticFilters.ringStyle || getRingStyle(p) === optimisticFilters.ringStyle;
        const matchShape = pShape === shape;

        return matchCategory && matchStyle && matchShape;
      }).length;

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
  }, [availableShapes, products, optimisticFilters.shapes, optimisticFilters.jewelryCategory, optimisticFilters.ringStyle]);

  // Extract available metal colors from all products
  const availableMetalColors = useMemo(() => {
    return extractMetalColorsFromVariants(products);
  }, [products]);

  // Calculate metal color counts
  const metalColorCounts = useMemo(() => {
    return availableMetalColors.map(metalColor => {
      const count = products.filter(p => {
        if (!p) return false;

        // Apply existing filters
        // @ts-ignore
        const matchCategory = !optimisticFilters.jewelryCategory || getJewelryCategory(p) === optimisticFilters.jewelryCategory || (Array.isArray(optimisticFilters.jewelryCategory) && optimisticFilters.jewelryCategory.includes(getJewelryCategory(p)));
        const matchStyle = !optimisticFilters.ringStyle || getRingStyle(p) === optimisticFilters.ringStyle;

        const pShape = getDiamondShape(p);
        const matchShape = !optimisticFilters.shapes?.length || (pShape && optimisticFilters.shapes.includes(pShape as Shape));

        const hasMetalColor = productHasMetalColor(p, metalColor);

        return matchCategory && matchStyle && matchShape && hasMetalColor;
      }).length;

      // @ts-ignore - variantMetalColors vs metalColors
      const isSelected = optimisticFilters.metalColors?.includes(metalColor) || false;

      return {
        metalColor,
        count,
        isSelected,
        isDisabled: count === 0 && !isSelected
      };
    });
  }, [availableMetalColors, products, optimisticFilters]);

  // Extract available carat weights from all products
  const availableCaratWeights = useMemo(() => {
    return extractCaratWeightsFromVariants(products);
  }, [products]);

  // Calculate carat weight counts
  const caratWeightCounts = useMemo(() => {
    return availableCaratWeights.map(caratWeight => {
      const count = products.filter(p => {
        if (!p) return false;

        // Apply existing filters
        // @ts-ignore
        const matchCategory = !optimisticFilters.jewelryCategory || getJewelryCategory(p) === optimisticFilters.jewelryCategory || (Array.isArray(optimisticFilters.jewelryCategory) && optimisticFilters.jewelryCategory.includes(getJewelryCategory(p)));
        const matchStyle = !optimisticFilters.ringStyle || getRingStyle(p) === optimisticFilters.ringStyle;

        const pShape = getDiamondShape(p);
        const matchShape = !optimisticFilters.shapes?.length || (pShape && optimisticFilters.shapes.includes(pShape as Shape));

        // Apply metal color filter if selected
        const matchMetalColor = !optimisticFilters.metalColors?.length ||
          // @ts-ignore
          optimisticFilters.metalColors.some(mc => productHasMetalColor(p, mc));

        const hasCaratWeight = productHasCaratWeight(p, caratWeight);

        return matchCategory && matchStyle && matchShape && matchMetalColor && hasCaratWeight;
      }).length;

      // @ts-ignore
      const isSelected = optimisticFilters.caratWeights?.includes(caratWeight) || false;

      return {
        caratWeight,
        count,
        isSelected,
        isDisabled: count === 0 && !isSelected
      };
    });
  }, [availableCaratWeights, products, optimisticFilters]);

  const activeFilterCount = [
    optimisticFilters.jewelryCategory,
    optimisticFilters.ringStyle,
    optimisticFilters.shapes?.length,
    optimisticFilters.metalColors?.length,
    optimisticFilters.caratWeights?.length,
    optimisticFilters.minPrice || optimisticFilters.maxPrice ? 1 : 0
  ].filter(Boolean).length;

  // Filter products based on all criteria for the total count display
  const totalMatchingProducts = useMemo(() => {
    return products.filter(p => {
        if (!p) return false;
        // @ts-ignore
        const cat = !optimisticFilters.jewelryCategory || getJewelryCategory(p) === optimisticFilters.jewelryCategory || (Array.isArray(optimisticFilters.jewelryCategory) && optimisticFilters.jewelryCategory.includes(getJewelryCategory(p)));
        const style = !optimisticFilters.ringStyle || getRingStyle(p) === optimisticFilters.ringStyle;

        // Shape check
        const pShape = getDiamondShape(p);
        const shape = !optimisticFilters.shapes?.length || (pShape && optimisticFilters.shapes.includes(pShape as Shape));

        // Metal color check (variant-based)
        const metalColor = !optimisticFilters.metalColors?.length ||
          // @ts-ignore
          optimisticFilters.metalColors.some(mc => productHasMetalColor(p, mc));

        // Carat weight check (variant-based)
        const caratWeight = !optimisticFilters.caratWeights?.length ||
          // @ts-ignore
          optimisticFilters.caratWeights.some(cw => productHasCaratWeight(p, cw));

        return cat && style && shape && metalColor && caratWeight;
    }).length;
  }, [products, optimisticFilters]);

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
                  const isSelected = optimisticFilters.jewelryCategory === category || (Array.isArray(optimisticFilters.jewelryCategory) && optimisticFilters.jewelryCategory.includes(category));
                  const count = products.filter(p => getJewelryCategory(p) === category).length;

                  return (
                    <button
                      key={category}
                      onClick={() => handleFilterUpdate('jewelryCategory', isSelected ? undefined : [category])}
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
        {/* @ts-ignore - Assuming array or string */}
        {(optimisticFilters.jewelryCategory === 'Rings' || (Array.isArray(optimisticFilters.jewelryCategory) && optimisticFilters.jewelryCategory.includes('Rings'))) && (
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
                      const count = products.filter(p => getRingStyle(p) === style).length;

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
                          <RingStyleIcon
                            style={style}
                            className={`h-9 w-9 ${isSelected ? 'text-white' : 'text-Color-Netural-Black'}`}
                          />
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
                          <ShapeIcon
                            shape={shape}
                            className={`h-9 w-9 ${
                              isSelected
                                ? 'text-Color-Champagne-Gold'
                                : isDisabled || !isCompatible
                                ? 'text-gray-400'
                                : 'text-Color-Netural-Black'
                            }`}
                          />
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
        {availableMetalColors.length > 0 && (
          <div className="space-y-2">
            <SectionHeader
              title="Metal Color"
              section="metalColor"
              label="4"
              isExpanded={expandedSections.has('metalColor')}
              onToggle={() => toggleSection('metalColor')}
              description="All pieces are 18K Gold"
            />

            {expandedSections.has('metalColor') && (
              <div id="filter-section-metalColor" className="space-y-2 pt-2" role="group" aria-labelledby="metal-color-label">
                {isLoading ? (
                  <SkeletonLoader />
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {metalColorCounts.map(({ metalColor, count, isSelected, isDisabled }) => (
                      <FilterOption
                        key={metalColor}
                        id={`metal-${metalColor}`}
                        label={getMetalColorDisplayLabel(metalColor)}
                        count={count}
                        isSelected={isSelected}
                        isDisabled={isDisabled}
                        isCompatible={true}
                        onChange={() => {
                          updateFilter('metalColors', toggleArrayItem(optimisticFilters.metalColors, metalColor));
                        }}
                        isLoading={isUpdating && isSelected}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Carat Weight Filter */}
        {availableCaratWeights.length > 0 && (
          <div className="space-y-2">
            <SectionHeader
              title="Carat Weight"
              section="caratWeight"
              label="5"
              isExpanded={expandedSections.has('caratWeight')}
              onToggle={() => toggleSection('caratWeight')}
              description="Diamond weight options"
            />

            {expandedSections.has('caratWeight') && (
              <div id="filter-section-caratWeight" className="space-y-2 pt-2" role="group" aria-labelledby="carat-weight-label">
                {isLoading ? (
                  <SkeletonLoader />
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {caratWeightCounts.map(({ caratWeight, count, isSelected, isDisabled }) => (
                      <FilterOption
                        key={caratWeight}
                        id={`carat-${caratWeight}`}
                        label={getCaratWeightDisplayLabel(caratWeight)}
                        count={count}
                        isSelected={isSelected}
                        isDisabled={isDisabled}
                        isCompatible={true}
                        onChange={() => {
                          updateFilter('caratWeights', toggleArrayItem(optimisticFilters.caratWeights, caratWeight));
                        }}
                        isLoading={isUpdating && isSelected}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

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