import React, { useState, useMemo } from 'react';
import { X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import {
  ProductFilters as FilterType,
  JEWELRY_CATEGORIES,
  RING_STYLES,
  METAL_COLORS,
  // METAL_COLOR_LABELS, // We use getMetalColorDisplayLabel util instead
  ALL_SHAPES,
  // CARAT_WEIGHTS, // Using variant extraction instead
  // PRICE_RANGES,
  STONE_TYPES,
  DIAMOND_ORIGINS,
  GEMSTONE_VARIANTS,
  getAvailableShapes,
  shouldShowShapeFilter,
  RingStyle,
  Shape,
} from '../../config/filterConfig';
import { ProcessedProduct } from '../../types'; // Fixed import path
import { ShapeIcon, RingStyleIcon } from './ShapeIcons';
import { getMetalColorDisplayInfo } from '../../utils/metalUtils'; // Fixed import path
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
  const type = (product.category || product.productType || '').toLowerCase();
  if (type.includes('necklace')) return 'Necklaces';
  if (type.includes('earring')) return 'Earrings';
  if (type.includes('engagement') || type.includes('ring')) return 'Rings';
  return undefined;
};

// 2. Ring Style Logic (Based on Tags)
const getRingStyle = (product: ProcessedProduct): string | undefined => {
  if (!product || !product.tags) return undefined;
  const tags = product.tags;
  
  if (tags.some(t => t.toLowerCase().includes('solitaire') && t.toLowerCase().includes('side'))) return 'Solitaire + Side Diamonds';
  if (tags.some(t => t.toLowerCase().includes('solitaire'))) return 'Solitaire';
  if (tags.some(t => t.toLowerCase().includes('halo') && t.toLowerCase().includes('side'))) return 'Halo + Side Diamonds';
  if (tags.some(t => t.toLowerCase().includes('halo'))) return 'Halo';
  
  return undefined;
};

// 3. Diamond Shape Logic (Extract from Name)
const getDiamondShape = (product: ProcessedProduct): string | undefined => {
  if (!product || !product.name) return undefined;
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

// ... FilterOption and SectionHeader components (Same as your provided code) ...
const FilterOption: React.FC<any> = ({
  id, label, count, isSelected, isDisabled, isCompatible, onChange, icon, showCount = true, isLoading = false
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isDisabled || isSelected) onChange();
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
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <input
          id={id}
          type="checkbox"
          checked={isSelected}
          onChange={onChange}
          disabled={isDisabled && !isSelected}
          className="w-5 h-5 rounded border-2 border-Color-Champagne-Gold text-Color-Champagne-Gold focus:ring-2 focus:ring-Color-Champagne-Gold/50 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
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
              ${isSelected ? 'bg-Color-Champagne-Gold text-white' : isDisabled ? 'bg-gray-200 text-gray-400' : count === 0 ? 'bg-red-100 text-red-600' : 'bg-Color-Primary-Beige text-Color-Netural-Black'}
            `}>
              {count}
            </span>
          )}
        </div>
      )}
    </label>
  );
};

const SectionHeader: React.FC<any> = ({ title, section, isExpanded, onToggle, label, required, description }) => (
  <button
    onClick={onToggle}
    className={`w-full flex items-center justify-between py-3 px-4 rounded-lg transition-all group ${
      isExpanded ? 'bg-Color-Champagne-Gold/10 border-2 border-Color-Champagne-Gold/30' : 'bg-Color-Primary-Beige/10 hover:bg-Color-Primary-Beige/20 border-2 border-transparent'
    }`}
  >
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className="w-8 h-8 rounded-full bg-Color-Netural-Black text-white flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover:bg-Color-Champagne-Gold transition-colors">
        {label}
      </div>
      <div className="text-left min-w-0 flex-1">
        <h3 className="text-base font-bold text-Color-Netural-Black truncate">{title} {required && <span className="text-Color-Champagne-Gold ml-1">*</span>}</h3>
        {description && <p className="text-xs text-Color-Gray-700 truncate">{description}</p>}
      </div>
    </div>
    {isExpanded ? <ChevronUp className="h-5 w-5 text-Color-Champagne-Gold flex-shrink-0 ml-2" /> : <ChevronDown className="h-5 w-5 text-Color-Champagne-Gold flex-shrink-0 ml-2" />}
  </button>
);

const SkeletonLoader: React.FC = () => (
  <div className="space-y-2 animate-pulse">
    {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-200 rounded-lg" />)}
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
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const toggleArrayItem = <T extends string>(array: T[] | undefined, item: T): T[] => {
    const current = array || [];
    return current.includes(item) ? current.filter(i => i !== item) : [...current, item];
  };

  const handleFilterUpdate = (key: keyof FilterType, value: any) => {
    const updates: Partial<FilterType> = { [key]: value };

    // Dependency Logic: Jewelry Category -> Ring Style -> Shapes
    if (key === 'jewelryCategory') {
      if (value !== 'Rings') {
        updates.ringStyle = undefined;
        updates.shapes = undefined;
      }
    }

    // Dependency Logic: Ring Style -> Shapes
    if (key === 'ringStyle' && value) {
      const availableShapes = getAvailableShapes(value as RingStyle);
      if (optimisticFilters.shapes) {
        const compatibleShapes = optimisticFilters.shapes.filter(shape => availableShapes.includes(shape));
        updates.shapes = compatibleShapes.length > 0 ? compatibleShapes : undefined;
      }
    }

    updateMultipleFilters(updates);
  };

  // Determine available shapes
  const availableShapes = useMemo(() => {
    if (optimisticFilters.ringStyle) return getAvailableShapes(optimisticFilters.ringStyle as RingStyle);
    if (!optimisticFilters.jewelryCategory || optimisticFilters.jewelryCategory === 'Rings') return ALL_SHAPES;
    return [];
  }, [optimisticFilters.ringStyle, optimisticFilters.jewelryCategory]);

  const showShapeFilter = !optimisticFilters.jewelryCategory || shouldShowShapeFilter(optimisticFilters.jewelryCategory);

  // Shape Availability Calculation
  const shapeAvailability = useMemo(() => {
    return ALL_SHAPES.map(shape => {
      const isCompatible = availableShapes.includes(shape);
      const count = products.filter(p => {
        if (!p) return false;
        const pShape = getDiamondShape(p);
        const matchCategory = !optimisticFilters.jewelryCategory || getJewelryCategory(p) === optimisticFilters.jewelryCategory;
        const matchStyle = !optimisticFilters.ringStyle || getRingStyle(p) === optimisticFilters.ringStyle;
        return matchCategory && matchStyle && pShape === shape;
      }).length;

      const isSelected = optimisticFilters.shapes?.includes(shape) || false;
      const isDisabled = !isCompatible || (count === 0 && !isSelected);

      return { shape, isCompatible, count, isDisabled, isSelected };
    });
  }, [availableShapes, products, optimisticFilters.shapes, optimisticFilters.jewelryCategory, optimisticFilters.ringStyle]);

  // Variant-Based Filters (Metal & Carat)
  const availableMetalColors = useMemo(() => extractMetalColorsFromVariants(products), [products]);
  const availableCaratWeights = useMemo(() => extractCaratWeightsFromVariants(products), [products]);

  const metalColorCounts = useMemo(() => {
    return availableMetalColors.map(metalColor => {
      const count = products.filter(p => {
        if (!p) return false;
        const matchCategory = !optimisticFilters.jewelryCategory || getJewelryCategory(p) === optimisticFilters.jewelryCategory;
        const matchStyle = !optimisticFilters.ringStyle || getRingStyle(p) === optimisticFilters.ringStyle;
        const pShape = getDiamondShape(p);
        const matchShape = !optimisticFilters.shapes?.length || (pShape && optimisticFilters.shapes.includes(pShape as Shape));
        const hasMetalColor = productHasMetalColor(p, metalColor);
        return matchCategory && matchStyle && matchShape && hasMetalColor;
      }).length;

      const isSelected = optimisticFilters.variantMetalColors?.includes(metalColor) || false;
      return { metalColor, count, isSelected, isDisabled: count === 0 && !isSelected };
    });
  }, [availableMetalColors, products, optimisticFilters]);

  const caratWeightCounts = useMemo(() => {
    return availableCaratWeights.map(caratWeight => {
      const count = products.filter(p => {
        if (!p) return false;
        const matchCategory = !optimisticFilters.jewelryCategory || getJewelryCategory(p) === optimisticFilters.jewelryCategory;
        const matchStyle = !optimisticFilters.ringStyle || getRingStyle(p) === optimisticFilters.ringStyle;
        const pShape = getDiamondShape(p);
        const matchShape = !optimisticFilters.shapes?.length || (pShape && optimisticFilters.shapes.includes(pShape as Shape));
        const matchMetalColor = !optimisticFilters.variantMetalColors?.length || optimisticFilters.variantMetalColors.some(mc => productHasMetalColor(p, mc));
        const hasCaratWeight = productHasCaratWeight(p, caratWeight);
        return matchCategory && matchStyle && matchShape && matchMetalColor && hasCaratWeight;
      }).length;

      const isSelected = optimisticFilters.variantCaratWeights?.includes(caratWeight) || false;
      return { caratWeight, count, isSelected, isDisabled: count === 0 && !isSelected };
    });
  }, [availableCaratWeights, products, optimisticFilters]);

  const activeFilterCount = [
    optimisticFilters.jewelryCategory,
    optimisticFilters.ringStyle,
    optimisticFilters.shapes?.length,
    optimisticFilters.variantMetalColors?.length,
    optimisticFilters.variantCaratWeights?.length,
    optimisticFilters.stoneType,
    optimisticFilters.diamondOrigin,
    optimisticFilters.gemstoneVariant
  ].filter(Boolean).length;

  const totalMatchingProducts = products.length; // Simplified for display, real count handled by parent

  return (
    <div className={`${isMobile ? 'h-full flex flex-col' : ''} bg-white`}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between pb-4 border-b border-Color-Champagne-Gold/30 px-4 pt-4">
          <h2 className="text-2xl font-bold text-Color-Netural-Black">Filters</h2>
          <button onClick={onClose} className="p-2 hover:bg-Color-Primary-Beige/30 rounded-lg">
            <X className="h-6 w-6 text-Color-Netural-Black" />
          </button>
        </div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-Color-Netural-Black mb-1">Filter Products</h2>
          <p className="text-sm text-Color-Gray-700">{isLoading ? 'Loading...' : `${totalMatchingProducts} found`}</p>
        </div>
      )}

      <div className={`${isMobile ? 'flex-1 overflow-y-auto px-4' : ''} space-y-4 py-4`}>
        {activeFilterCount > 0 && (
          <button onClick={resetFilters} className="w-full py-3 text-sm font-medium text-Color-Champagne-Gold border border-Color-Champagne-Gold/30 rounded-lg flex items-center justify-center gap-2 hover:bg-Color-Primary-Beige/20">
            <X className="h-4 w-4" /> Clear all filters ({activeFilterCount})
          </button>
        )}

        {/* 1. Jewelry Category */}
        <div className="space-y-2">
          <SectionHeader title="Jewelry Type" section="jewelryType" label="1" isExpanded={expandedSections.has('jewelryType')} onToggle={() => toggleSection('jewelryType')} required />
          {expandedSections.has('jewelryType') && (
            <div className="pl-2 pt-2 grid grid-cols-3 gap-3">
              {JEWELRY_CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => handleFilterUpdate('jewelryCategory', optimisticFilters.jewelryCategory === category ? undefined : category)}
                  className={`py-4 px-3 rounded-lg text-sm font-bold transition-all ${optimisticFilters.jewelryCategory === category ? 'bg-Color-Netural-Black text-white' : 'bg-white border-2 border-Color-Champagne-Gold/30'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Ring Style */}
        {(!optimisticFilters.jewelryCategory || optimisticFilters.jewelryCategory === 'Rings') && (
          <div className="space-y-2">
            <SectionHeader title="Ring Style" section="ringStyle" label="2" isExpanded={expandedSections.has('ringStyle')} onToggle={() => toggleSection('ringStyle')} required />
            {expandedSections.has('ringStyle') && (
              <div className="pl-2 pt-2 grid grid-cols-2 gap-3">
                {RING_STYLES.map(style => (
                  <button
                    key={style}
                    onClick={() => handleFilterUpdate('ringStyle', optimisticFilters.ringStyle === style ? undefined : style)}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${optimisticFilters.ringStyle === style ? 'bg-Color-Netural-Black text-white border-Color-Netural-Black' : 'border-Color-Champagne-Gold/30'}`}
                  >
                    <RingStyleIcon style={style} className={`h-9 w-9 ${optimisticFilters.ringStyle === style ? 'text-white' : 'text-Color-Netural-Black'}`} />
                    <span className="text-xs font-semibold">{style}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Shape */}
        {showShapeFilter && availableShapes.length > 0 && (
          <div className="space-y-2">
            <SectionHeader title="Diamond Shape" section="shape" label="3" isExpanded={expandedSections.has('shape')} onToggle={() => toggleSection('shape')} />
            {expandedSections.has('shape') && (
              <div className="pl-2 pt-2 grid grid-cols-2 gap-3">
                {shapeAvailability.map(({ shape, isCompatible, count, isDisabled, isSelected }) => (
                  <button
                    key={shape}
                    onClick={() => !isDisabled && updateFilter('shapes', toggleArrayItem(optimisticFilters.shapes, shape))}
                    disabled={isDisabled}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${isSelected ? 'border-Color-Champagne-Gold bg-Color-Champagne-Gold/10' : isDisabled ? 'opacity-50 bg-gray-50' : 'border-Color-Champagne-Gold/30'}`}
                  >
                    <ShapeIcon shape={shape} className={`h-9 w-9 ${isSelected ? 'text-Color-Champagne-Gold' : 'text-Color-Netural-Black'}`} />
                    <span className="text-xs font-semibold">{shape}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. Stone Type */}
        <div className="space-y-2">
          <SectionHeader title="Stone Type" section="stoneType" label="4" isExpanded={expandedSections.has('stoneType')} onToggle={() => toggleSection('stoneType')} />
          {expandedSections.has('stoneType') && (
            <div className="pl-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {STONE_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => handleFilterUpdate('stoneType', optimisticFilters.stoneType === type ? undefined : type)}
                    className={`px-4 py-3 rounded-lg border-2 font-semibold ${optimisticFilters.stoneType === type ? 'bg-Color-Netural-Black text-white' : 'border-Color-Champagne-Gold/30'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              
              {/* Diamond Origins Sub-filter */}
              {optimisticFilters.stoneType === 'Diamond' && (
                <div className="pl-4 border-l-2 border-Color-Champagne-Gold/30 space-y-2">
                  <p className="text-sm font-semibold">Origin</p>
                  {DIAMOND_ORIGINS.map(origin => (
                    <button
                      key={origin}
                      onClick={() => handleFilterUpdate('diamondOrigin', optimisticFilters.diamondOrigin === origin ? undefined : origin)}
                      className={`w-full px-4 py-2 text-left rounded-lg border ${optimisticFilters.diamondOrigin === origin ? 'bg-Color-Netural-Black text-white' : 'border-Color-Champagne-Gold/30'}`}
                    >
                      {origin}
                    </button>
                  ))}
                </div>
              )}

              {/* Gemstone Variant Sub-filter */}
              {optimisticFilters.stoneType === 'Gemstone' && (
                <div className="pl-4 border-l-2 border-Color-Champagne-Gold/30 space-y-2">
                  <p className="text-sm font-semibold">Gemstone</p>
                  {GEMSTONE_VARIANTS.map(variant => (
                    <button
                      key={variant}
                      onClick={() => handleFilterUpdate('gemstoneVariant', optimisticFilters.gemstoneVariant === variant ? undefined : variant)}
                      className={`w-full px-4 py-2 text-left rounded-lg border ${optimisticFilters.gemstoneVariant === variant ? 'bg-Color-Netural-Black text-white' : 'border-Color-Champagne-Gold/30'}`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 5. Metal Color (Variant Based) */}
        {availableMetalColors.length > 0 && (
          <div className="space-y-2">
            <SectionHeader title="Metal Color" section="metalColor" label="5" isExpanded={expandedSections.has('metalColor')} onToggle={() => toggleSection('metalColor')} />
            {expandedSections.has('metalColor') && (
              <div className="pl-2 pt-2 grid grid-cols-1 gap-2">
                {metalColorCounts.map(({ metalColor, count, isSelected, isDisabled }) => (
                  <FilterOption
                    key={metalColor}
                    id={`metal-${metalColor}`}
                    label={getMetalColorDisplayLabel(metalColor)}
                    count={count}
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                    isCompatible={true}
                    onChange={() => updateFilter('variantMetalColors', toggleArrayItem(optimisticFilters.variantMetalColors, metalColor))}
                    isLoading={isUpdating && isSelected}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. Carat Weight (Variant Based) */}
        {availableCaratWeights.length > 0 && (
          <div className="space-y-2">
            <SectionHeader title="Carat Weight" section="caratWeight" label="6" isExpanded={expandedSections.has('caratWeight')} onToggle={() => toggleSection('caratWeight')} />
            {expandedSections.has('caratWeight') && (
              <div className="pl-2 pt-2 grid grid-cols-1 gap-2">
                {caratWeightCounts.map(({ caratWeight, count, isSelected, isDisabled }) => (
                  <FilterOption
                    key={caratWeight}
                    id={`carat-${caratWeight}`}
                    label={getCaratWeightDisplayLabel(caratWeight)}
                    count={count}
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                    isCompatible={true}
                    onChange={() => updateFilter('variantCaratWeights', toggleArrayItem(optimisticFilters.variantCaratWeights, caratWeight))}
                    isLoading={isUpdating && isSelected}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isMobile && (
        <div className="border-t border-Color-Champagne-Gold/30 p-4 bg-white">
          <button onClick={onClose} className="w-full py-4 bg-Color-Champagne-Gold text-white rounded-lg font-bold">
            Show {totalMatchingProducts} Products
          </button>
        </div>
      )}
    </div>
  );
};