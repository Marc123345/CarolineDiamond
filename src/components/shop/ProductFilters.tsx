import React, { useState, useEffect } from 'react';
import { X, Bookmark, Search as SearchIcon, Info, Sparkles } from 'lucide-react';
import {
  ProductFilters as FilterType,
  PRODUCT_TYPES,
  RING_STYLES,
  METAL_COLORS,
  CARAT_OPTIONS,
  STONE_TYPES,
  DIAMOND_ORIGINS,
  GEMSTONE_VARIANTS,
  EARRING_TYPES,
  EARRING_BACKINGS,
  CHAIN_LENGTHS,
  PRICE_RANGES,
  getAvailableShapes,
  shouldShowShapeFilter
} from '../../config/filterConfig';
import { useRingSizes } from '../../hooks/useRingSizes';
import { useEnhancedFilterCounts } from '../../hooks/useEnhancedFilterCounts';
import { ProcessedProduct } from '../../types/shopify';
import { PriceRangeHistogram } from './PriceRangeHistogram';
import { FilterPresetsPanel } from './FilterPresetsPanel';
import { SavedSearchesPanel } from './SavedSearchesPanel';
import { MetalColorComparison } from './MetalColorComparison';
import { MetalColorRecommendations } from './MetalColorRecommendations';
import { ModernFilterUI } from './ModernFilterUI';
import { CustomSizeRequestModal } from './CustomSizeRequestModal';
import { calculateDynamicPriceRanges } from '../../utils/filterUtils';
import { getMetalColorDisplayInfo } from '../../utils/metalColorUtils';
import { trackMetalColorFilter } from '../../lib/metalColorDb';
import { useAuth } from '../../context/AuthContext';

interface ProductFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onClose?: () => void;
  isMobile?: boolean;
  products?: ProcessedProduct[];
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
  isMobile = false,
  products = [],
  searchQuery = '',
  onSearchQueryChange
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'filters' | 'presets' | 'searches'>('filters');
  const [showHistogram, setShowHistogram] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [isCustomSizeModalOpen, setIsCustomSizeModalOpen] = useState(false);

  const availableRingSizes = useRingSizes(products);
  const { counts: filterCounts, availability } = useEnhancedFilterCounts(products, filters);
  const dynamicPriceRanges = calculateDynamicPriceRanges(products);

  // Track metal color filter usage
  useEffect(() => {
    if (filters.metalColors && filters.metalColors.length > 0 && user) {
      filters.metalColors.forEach(color => {
        trackMetalColorFilter(user.id, color);
      });
    }
  }, [filters.metalColors, user]);

  const toggleArrayItem = <T extends string>(array: T[] | undefined, item: T): T[] => {
    const current = array || [];
    return current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
  };

  const updateFilter = (key: keyof FilterType, value: FilterType[keyof FilterType]) => {
    const newFilters = { ...filters, [key]: value };

    // Sync productType with jewelryCategory for backward compatibility
    if (key === 'productType') {
      newFilters.jewelryCategory = value as any;
    } else if (key === 'jewelryCategory') {
      newFilters.productType = value as any;
    }

    // Reset shape selection when ring style changes
    if (key === 'ringStyle') {
      newFilters.shapes = undefined;
    }

    // Reset diamond/gemstone sub-filters when stone type changes
    if (key === 'stoneType') {
      newFilters.diamondOrigin = undefined;
      newFilters.gemstoneVariant = undefined;
    }

    // Clear category-specific filters when category changes
    const categoryKey = key === 'productType' || key === 'jewelryCategory';
    if (categoryKey) {
      const categoryValue = value as string;
      // Clear ring-specific filters
      if (categoryValue !== 'Engagement Ring' && categoryValue !== 'Rings') {
        newFilters.ringStyle = undefined;
        newFilters.shapes = undefined;
        newFilters.stoneType = undefined;
        newFilters.diamondOrigin = undefined;
        newFilters.gemstoneVariant = undefined;
        newFilters.ringSizes = undefined;
      }

      // Clear earring-specific filters
      if (categoryValue !== 'Earrings') {
        newFilters.earringType = undefined;
        newFilters.earringBacking = undefined;
      }

      // Clear necklace-specific filters
      if (categoryValue !== 'Necklace' && categoryValue !== 'Necklaces') {
        newFilters.chainLength = undefined;
      }
    }

    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFilterCount = [
    filters.ringStyle,
    filters.shapes?.length,
    filters.metalColors?.length,
    filters.stoneType,
    filters.diamondOrigin,
    filters.gemstoneVariant,
    filters.ringSizes?.length,
    filters.minPrice,
    filters.maxPrice
  ].filter(Boolean).length;

  // Get shapes available for the selected ring style
  const currentCategory = filters.productType || filters.jewelryCategory;
  const availableShapes = getAvailableShapes(filters.ringStyle, currentCategory);
  const showShapeFilter = shouldShowShapeFilter(currentCategory);

  return (
    <div className={`${isMobile ? 'h-full flex flex-col' : ''} space-y-6`}>
      {isMobile && (
        <div className="flex items-center justify-between pb-4 border-b border-Color-Champagne-Gold/30 flex-shrink-0">
          <h3 className="text-xl font-bold text-Color-Netural-Black">Filters</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-Color-Primary-Beige/30 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close filters"
          >
            <X className="h-5 w-5 text-Color-Netural-Black" />
          </button>
        </div>
      )}

      <div className={`${isMobile ? 'flex-1 overflow-y-auto' : ''} space-y-6`}>
        {/* Tabs for Filters, Presets, Saved Searches */}
        <div className="flex gap-2 border-b border-Color-Champagne-Gold/20">
          <button
            onClick={() => setActiveTab('filters')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              activeTab === 'filters'
                ? 'border-b-2 border-Color-Champagne-Gold text-Color-Netural-Black'
                : 'text-Color-Gray-700 hover:text-Color-Netural-Black'
            }`}
          >
            Filters
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'presets'
                ? 'border-b-2 border-Color-Champagne-Gold text-Color-Netural-Black'
                : 'text-Color-Gray-700 hover:text-Color-Netural-Black'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            Presets
          </button>
          <button
            onClick={() => setActiveTab('searches')}
            className={`flex-1 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'searches'
                ? 'border-b-2 border-Color-Champagne-Gold text-Color-Netural-Black'
                : 'text-Color-Gray-700 hover:text-Color-Netural-Black'
            }`}
          >
            <SearchIcon className="h-4 w-4" />
            Saved
          </button>
        </div>

        {activeTab === 'presets' && (
          <FilterPresetsPanel
            currentFilters={filters}
            onPresetLoad={onFiltersChange}
          />
        )}

        {activeTab === 'searches' && (
          <SavedSearchesPanel
            currentFilters={filters}
            currentSearchQuery={searchQuery}
            onSearchLoad={(newFilters, newQuery) => {
              onFiltersChange(newFilters);
              if (onSearchQueryChange && newQuery !== undefined) {
                onSearchQueryChange(newQuery);
              }
            }}
          />
        )}

        {activeTab === 'filters' && (
          <>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="w-full py-3 text-sm font-medium text-Color-Champagne-Gold hover:text-Color-Netural-Black transition-colors border border-Color-Champagne-Gold/30 rounded-lg hover:bg-Color-Primary-Beige/20"
              >
                Clear all filters ({activeFilterCount})
              </button>
            )}

      {/* Product Type Filter */}
      <div className="border-b border-Color-Champagne-Gold/20 pb-6">
        <label className="block text-sm font-bold text-Color-Netural-Black mb-3">
          Product Type
        </label>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_TYPES.map(type => {
            const count = filterCounts.jewelryCategories?.[type] || 0;
            return (
              <button
                key={type}
                onClick={() => updateFilter('productType', currentCategory === type ? undefined : type)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                  currentCategory === type
                    ? 'border-Color-Netural-Black bg-Color-Netural-Black text-white'
                    : 'border-Color-Champagne-Gold/30 text-Color-Netural-Black hover:border-Color-Champagne-Gold'
                }`}
              >
                {type} <span className="ml-1 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ring Style - Only show for Engagement Ring or no category */}
      {(!currentCategory || currentCategory === 'Engagement Ring' || currentCategory === 'Rings') && (
      <div className="border-b border-Color-Champagne-Gold/20 pb-6">
        <label className="block text-sm font-bold text-Color-Netural-Black mb-3">
          Ring Style
        </label>
        <div className="flex flex-wrap gap-2">
          {RING_STYLES.map(style => {
            const count = filterCounts.ringStyles[style] || 0;
            return (
              <button
                key={style}
                onClick={() => updateFilter('ringStyle', filters.ringStyle === style ? undefined : style)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                  filters.ringStyle === style
                    ? 'border-Color-Netural-Black bg-Color-Netural-Black text-white'
                    : 'border-Color-Champagne-Gold/30 text-Color-Netural-Black hover:border-Color-Champagne-Gold'
                }`}
              >
                {style} <span className="ml-1 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>
      )}

      {/* Center Stone Shape - Only show for Rings */}
      {showShapeFilter && (
        <div className="border-b border-Color-Champagne-Gold/20 pb-6">
          <label className="block text-sm font-bold text-Color-Netural-Black mb-3">
            Center Stone Shape
            {filters.ringStyle && (
              <span className="text-xs text-gray-500 ml-2 font-normal">
                (for {filters.ringStyle})
              </span>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {availableShapes.map(shape => (
              <button
                key={shape}
                onClick={() => updateFilter('shapes', toggleArrayItem(filters.shapes, shape))}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                  filters.shapes?.includes(shape)
                    ? 'border-Color-Netural-Black bg-Color-Netural-Black text-white'
                    : 'border-Color-Champagne-Gold/30 text-Color-Netural-Black hover:border-Color-Champagne-Gold'
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Metal Color Recommendations */}
      {user && showRecommendations && (
        <div className="border-b border-Color-Champagne-Gold/20 pb-6">
          <MetalColorRecommendations
            onAcceptRecommendation={(color) => {
              updateFilter('metalColors', [color]);
              setShowRecommendations(false);
            }}
          />
        </div>
      )}

      {/* Metal Color */}
      <div className="border-b border-Color-Champagne-Gold/20 pb-6">
        <label className="block text-sm font-bold text-Color-Netural-Black mb-3">
          Metal Color
        </label>
        <div className="flex gap-3">
          {METAL_COLORS.map(color => {
            const displayInfo = getMetalColorDisplayInfo(color);
            const count = filterCounts.metalColors[color] || 0;
            const isAvailable = availability.metalColors.has(color);
            const isSelected = filters.metalColors?.includes(color);

            return (
              <button
                key={color}
                onClick={() => updateFilter('metalColors', toggleArrayItem(filters.metalColors, color))}
                disabled={!isAvailable && !isSelected}
                className={`w-11 h-11 rounded-full transition-all flex items-center justify-center relative shadow-sm ${
                  isSelected
                    ? 'ring-3 ring-Color-Champagne-Gold ring-offset-2 scale-110'
                    : !isAvailable
                    ? 'opacity-30 cursor-not-allowed'
                    : 'ring-2 ring-gray-200 hover:ring-gray-300 hover:scale-105'
                }`}
                style={{
                  backgroundColor: displayInfo.hexColor,
                  border: `2px solid ${isSelected ? '#C5A572' : '#e5e7eb'}`
                }}
                title={displayInfo.name}
                aria-label={`Select ${displayInfo.name}`}
                aria-pressed={isSelected}
              >
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-Color-Champagne-Gold rounded-full shadow"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Carat Weight / Diamond Type */}
      {(!currentCategory || currentCategory === 'Engagement Ring' || currentCategory === 'Rings') && (
        <div className="border-b border-Color-Champagne-Gold/20 pb-6">
          <label className="block text-sm font-bold text-Color-Netural-Black mb-3">
            Carat Weight / Diamond Type
          </label>
          <div className="flex flex-wrap gap-2">
            {CARAT_OPTIONS.map(option => {
              const isSelected = filters.caratOptions?.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => updateFilter('caratOptions', toggleArrayItem(filters.caratOptions, option.value))}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                    isSelected
                      ? 'border-Color-Netural-Black bg-Color-Netural-Black text-white'
                      : 'border-Color-Champagne-Gold/30 text-Color-Netural-Black hover:border-Color-Champagne-Gold'
                  } ${option.value === 'natural' ? 'bg-gradient-to-r from-Color-Champagne-Gold/10 to-Color-Primary-Beige/10' : ''}`}
                >
                  {option.label}
                  {option.value === 'natural' && (
                    <span className="ml-1 text-xs opacity-70">(Premium)</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Earring Type - Only show for Earrings */}
      {currentCategory === 'Earrings' && (
      <div className="border-b border-Color-Champagne-Gold/20 pb-6">
        <label className="block text-sm font-bold text-Color-Netural-Black mb-3">
          Earring Type
        </label>
        <div className="flex flex-wrap gap-2">
          {EARRING_TYPES.map(type => (
            <button
              key={type}
              onClick={() => updateFilter('earringType', filters.earringType === type ? undefined : type)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                filters.earringType === type
                  ? 'border-Color-Netural-Black bg-Color-Netural-Black text-white'
                  : 'border-Color-Champagne-Gold/30 text-Color-Netural-Black hover:border-Color-Champagne-Gold'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Earring Backing - Only show for Earrings */}
      {currentCategory === 'Earrings' && (
      <div className="border-b border-Color-Champagne-Gold/20 pb-6">
        <label className="block text-sm font-bold text-Color-Netural-Black mb-3">
          Earring Backing
        </label>
        <div className="flex flex-wrap gap-2">
          {EARRING_BACKINGS.map(backing => (
            <button
              key={backing}
              onClick={() => updateFilter('earringBacking', filters.earringBacking === backing ? undefined : backing)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                filters.earringBacking === backing
                  ? 'border-Color-Netural-Black bg-Color-Netural-Black text-white'
                  : 'border-Color-Champagne-Gold/30 text-Color-Netural-Black hover:border-Color-Champagne-Gold'
              }`}
            >
              {backing}
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Chain Length - Only show for Necklace */}
      {(currentCategory === 'Necklace' || currentCategory === 'Necklaces') && (
      <div className="border-b border-Color-Champagne-Gold/20 pb-6">
        <label className="block text-sm font-bold text-Color-Netural-Black mb-3">
          Chain Length
        </label>
        <div className="flex flex-wrap gap-2">
          {CHAIN_LENGTHS.map(length => (
            <button
              key={length}
              onClick={() => updateFilter('chainLength', filters.chainLength === length ? undefined : length)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                filters.chainLength === length
                  ? 'border-Color-Netural-Black bg-Color-Netural-Black text-white'
                  : 'border-Color-Champagne-Gold/30 text-Color-Netural-Black hover:border-Color-Champagne-Gold'
              }`}
            >
              {length}
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Stone Type - Only show for Engagement Ring or no category */}
      {(!currentCategory || currentCategory === 'Engagement Ring' || currentCategory === 'Rings') && (
      <div className="border-b border-Color-Champagne-Gold/20 pb-6">
        <label className="block text-sm font-bold text-Color-Netural-Black mb-3">
          Center Stone Type
        </label>
        <div className="flex flex-wrap gap-2">
          {STONE_TYPES.map(stoneType => (
            <button
              key={stoneType}
              onClick={() => updateFilter('stoneType', filters.stoneType === stoneType ? undefined : stoneType)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                filters.stoneType === stoneType
                  ? 'border-Color-Netural-Black bg-Color-Netural-Black text-white'
                  : 'border-Color-Champagne-Gold/30 text-Color-Netural-Black hover:border-Color-Champagne-Gold'
              }`}
            >
              {stoneType}
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Diamond Origin - Only show if Diamond is selected AND Engagement Ring category */}
      {(!currentCategory || currentCategory === 'Engagement Ring' || currentCategory === 'Rings') && filters.stoneType === 'Diamond' && (
        <div className="pl-4 border-l-2 border-Color-Champagne-Gold/30 pb-6">
          <label className="block text-sm font-semibold text-Color-Netural-Black mb-3">
            Diamond Origin
          </label>
          <div className="flex flex-wrap gap-2">
            {DIAMOND_ORIGINS.map(origin => (
              <button
                key={origin}
                onClick={() => updateFilter('diamondOrigin', filters.diamondOrigin === origin ? undefined : origin)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                  filters.diamondOrigin === origin
                    ? 'border-Color-Netural-Black bg-Color-Netural-Black text-white'
                    : 'border-Color-Champagne-Gold/30 text-Color-Netural-Black hover:border-Color-Champagne-Gold'
                }`}
              >
                {origin}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Gemstone Variant - Only show if Gemstone is selected AND Engagement Ring category */}
      {(!currentCategory || currentCategory === 'Engagement Ring' || currentCategory === 'Rings') && filters.stoneType === 'Gemstone' && (
        <div className="pl-4 border-l-2 border-Color-Champagne-Gold/30 pb-6">
          <label className="block text-sm font-semibold text-Color-Netural-Black mb-3">
            Gemstone Type
          </label>
          <div className="flex flex-wrap gap-2">
            {GEMSTONE_VARIANTS.map(variant => (
              <button
                key={variant}
                onClick={() => updateFilter('gemstoneVariant', filters.gemstoneVariant === variant ? undefined : variant)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                  filters.gemstoneVariant === variant
                    ? 'border-Color-Netural-Black bg-Color-Netural-Black text-white'
                    : 'border-Color-Champagne-Gold/30 text-Color-Netural-Black hover:border-Color-Champagne-Gold'
                }`}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range with Histogram */}
      <div className="border-b border-Color-Champagne-Gold/20 pb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-bold text-Color-Netural-Black">
            Price Range
          </label>
          <button
            onClick={() => setShowHistogram(!showHistogram)}
            className="text-xs text-Color-Champagne-Gold hover:text-Color-Netural-Black transition-colors"
          >
            {showHistogram ? 'Hide' : 'Show'} Chart
          </button>
        </div>

        {showHistogram && products.length > 0 && (
          <div className="mb-4">
            <PriceRangeHistogram
              products={products}
              selectedMin={filters.minPrice}
              selectedMax={filters.maxPrice}
              onRangeSelect={(min, max) => {
                onFiltersChange({
                  ...filters,
                  minPrice: min,
                  maxPrice: max,
                });
              }}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          {dynamicPriceRanges.map((range, index) => {
            const isActive =
              filters.minPrice === range.min &&
              filters.maxPrice === range.max;

            return (
              <button
                key={index}
                onClick={() => {
                  if (isActive) {
                    updateFilter('minPrice', undefined);
                    updateFilter('maxPrice', undefined);
                  } else {
                    onFiltersChange({
                      ...filters,
                      minPrice: range.min,
                      maxPrice: range.max
                    });
                  }
                }}
                disabled={range.count === 0}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                  isActive
                    ? 'border-Color-Netural-Black bg-Color-Netural-Black text-white'
                    : range.count === 0
                    ? 'border-Color-Light-300 text-Color-Gray-700 opacity-50 cursor-not-allowed'
                    : 'border-Color-Champagne-Gold/30 text-Color-Netural-Black hover:border-Color-Champagne-Gold'
                }`}
              >
                {range.label} {range.count > 0 && `(${range.count})`}
              </button>
            );
          })}
        </div>

        {/* Custom Price Range */}
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={e => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="flex-1 px-4 py-2.5 border border-Color-Champagne-Gold/30 rounded-lg focus:ring-2 focus:ring-Color-Champagne-Gold focus:border-transparent text-sm"
          />
          <span className="text-gray-400 font-medium">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={e => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="flex-1 px-4 py-2.5 border border-Color-Champagne-Gold/30 rounded-lg focus:ring-2 focus:ring-Color-Champagne-Gold focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Ring Size - Only show for Engagement Ring */}
      {(!currentCategory || currentCategory === 'Engagement Ring' || currentCategory === 'Rings') && availableRingSizes.length > 0 && (
        <div className="border-b border-Color-Champagne-Gold/20 pb-6">
          <label className="block text-sm font-bold text-Color-Netural-Black mb-3">
            Ring Size
          </label>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {availableRingSizes.map(size => (
              <button
                key={size}
                onClick={() => updateFilter('ringSizes', toggleArrayItem(filters.ringSizes, size))}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                  filters.ringSizes?.includes(size)
                    ? 'border-Color-Netural-Black bg-Color-Netural-Black text-white'
                    : 'border-Color-Champagne-Gold/30 text-Color-Netural-Black hover:border-Color-Champagne-Gold'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

        {/* In Stock Only */}
        {availability.hasInStock && (
          <div className="flex items-center gap-3 p-4 bg-Color-Primary-Beige/20 rounded-lg border border-Color-Champagne-Gold/20">
            <input
              type="checkbox"
              id="inStockOnly"
              checked={filters.inStockOnly || false}
              onChange={e => updateFilter('inStockOnly', e.target.checked)}
              className="w-5 h-5 text-Color-Netural-Black border-Color-Champagne-Gold/50 rounded focus:ring-Color-Champagne-Gold cursor-pointer"
            />
            <label htmlFor="inStockOnly" className="text-sm font-medium text-Color-Netural-Black cursor-pointer">
              Show only in stock items
            </label>
          </div>
        )}

        {/* Modern Diamond Filter UI */}
        <div className="border-t-2 border-Color-Champagne-Gold/20 pt-6 mt-6">
          <h2 className="text-lg font-bold text-Color-Netural-Black mb-4">Diamond Specifications</h2>
          <ModernFilterUI
            filters={filters}
            onFiltersChange={(newFilters) => {
              onFiltersChange({ ...filters, ...newFilters });
            }}
            productCounts={{
              ...filterCounts.caratWeights,
              ...filterCounts.clarityGrades,
              ...filterCounts.certifications,
            }}
            onRequestCustomSize={() => setIsCustomSizeModalOpen(true)}
          />
        </div>
          </>
        )}
      </div>

      {/* Sticky Apply Button for Mobile */}
      {isMobile && (
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-Color-Champagne-Gold/30 p-4 flex-shrink-0 shadow-lg">
          <button
            onClick={onClose}
            className="w-full py-4 bg-Color-Netural-Black text-white font-semibold rounded-lg hover:bg-Color-Champagne-Gold transition-all duration-300 min-h-[48px]"
          >
            Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>
      )}

      {/* Metal Color Comparison Modal */}
      <MetalColorComparison
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        selectedColors={filters.metalColors}
        onColorSelect={(color) => {
          const current = filters.metalColors || [];
          const newColors = current.includes(color)
            ? current.filter(c => c !== color)
            : [...current, color];
          updateFilter('metalColors', newColors.length > 0 ? newColors : undefined);
        }}
      />

      {/* Custom Size Request Modal */}
      <CustomSizeRequestModal
        isOpen={isCustomSizeModalOpen}
        onClose={() => setIsCustomSizeModalOpen(false)}
        prefilledData={{
          metal_color: filters.metalColors?.[0],
          ring_style: filters.ringStyle,
          shape: filters.shapes?.[0],
          clarity_grade: filters.clarityGrades?.[0],
          certification: filters.certifications?.[0],
        }}
      />
    </div>
  );
};
