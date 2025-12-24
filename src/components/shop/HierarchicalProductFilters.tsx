import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import {
  ProductFilters as FilterType,
  JEWELRY_CATEGORIES,
  RING_STYLES,
  METAL_COLORS,
  METAL_COLOR_LABELS,
  STONE_TYPES,
  DIAMOND_ORIGINS,
  GEMSTONE_VARIANTS,
  getAvailableShapes,
  shouldShowShapeFilter
} from '../../config/filterConfig';
import { ProcessedProduct } from '../../types/shopify';
import { ShapeIcon, RingStyleIcon } from './ShapeIcons';
import { getMetalColorDisplayInfo } from '../../utils/metalColorUtils';
import { useEnhancedFilterCounts } from '../../hooks/useEnhancedFilterCounts';

interface HierarchicalProductFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onClose?: () => void;
  isMobile?: boolean;
  products?: ProcessedProduct[];
}

export const HierarchicalProductFilters: React.FC<HierarchicalProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
  isMobile = false,
  products = []
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['jewelryType', 'ringType', 'metalColor', 'shape', 'stoneType'])
  );

  const { counts: filterCounts } = useEnhancedFilterCounts(products, filters);

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

  const updateFilter = (key: keyof FilterType, value: FilterType[keyof FilterType]) => {
    const newFilters = { ...filters, [key]: value };

    if (key === 'jewelryCategory') {
      if (value !== 'Rings') {
        newFilters.ringStyle = undefined;
        newFilters.shapes = undefined;
      }
    }

    if (key === 'ringStyle') {
      newFilters.shapes = undefined;
    }

    if (key === 'stoneType') {
      newFilters.diamondOrigin = undefined;
      newFilters.gemstoneVariant = undefined;
    }

    onFiltersChange(newFilters);
  };

  const toggleArrayItem = <T extends string>(array: T[] | undefined, item: T): T[] => {
    const current = array || [];
    return current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const availableShapes = getAvailableShapes(filters.ringStyle, filters.jewelryCategory);
  const showShapeFilter = shouldShowShapeFilter(filters.jewelryCategory);

  const activeFilterCount = [
    filters.jewelryCategory,
    filters.ringStyle,
    filters.shapes?.length,
    filters.metalColors?.length,
    filters.stoneType,
    filters.diamondOrigin,
    filters.gemstoneVariant
  ].filter(Boolean).length;

  const SectionHeader: React.FC<{
    title: string;
    section: string;
    label: string;
    required?: boolean;
  }> = ({ title, section, label, required = false }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between py-3 px-4 bg-Color-Primary-Beige/10 hover:bg-Color-Primary-Beige/20 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-Color-Netural-Black text-white flex items-center justify-center text-sm font-bold">
          {label}
        </div>
        <div className="text-left">
          <h3 className="text-base font-bold text-Color-Netural-Black">{title}</h3>
          {required && <p className="text-xs text-Color-Gray-700">Required selection</p>}
        </div>
      </div>
      {expandedSections.has(section) ? (
        <ChevronUp className="h-5 w-5 text-Color-Champagne-Gold" />
      ) : (
        <ChevronDown className="h-5 w-5 text-Color-Champagne-Gold" />
      )}
    </button>
  );

  return (
    <div className={`${isMobile ? 'h-full flex flex-col' : ''}`}>
      {isMobile && (
        <div className="flex items-center justify-between pb-4 border-b border-Color-Champagne-Gold/30 flex-shrink-0 px-4">
          <h2 className="text-2xl font-bold text-Color-Netural-Black">Solitaire Rings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-Color-Primary-Beige/30 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close filters"
          >
            <X className="h-6 w-6 text-Color-Netural-Black" />
          </button>
        </div>
      )}

      <div className={`${isMobile ? 'flex-1 overflow-y-auto px-4' : ''} space-y-4 py-4`}>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="w-full py-3 text-sm font-medium text-Color-Champagne-Gold hover:text-Color-Netural-Black transition-colors border border-Color-Champagne-Gold/30 rounded-lg hover:bg-Color-Primary-Beige/20"
          >
            Clear all filters ({activeFilterCount})
          </button>
        )}

        {/* Jewelry Type (before ring type) */}
        <div className="space-y-2">
          <SectionHeader title="JEWELRY TYPE" section="jewelryType" label="0" required />
          {expandedSections.has('jewelryType') && (
            <div className="pl-4 space-y-2 animate-fadeIn">
              <div className="grid grid-cols-3 gap-3">
                {JEWELRY_CATEGORIES.map(category => {
                  const isSelected = filters.jewelryCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => updateFilter('jewelryCategory', isSelected ? undefined : category)}
                      className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-Color-Netural-Black text-white'
                          : 'bg-white border border-Color-Champagne-Gold/30 hover:bg-Color-Primary-Beige/20'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* A: Ring Type (only show if Rings is selected or no jewelry category is selected) */}
        {(!filters.jewelryCategory || filters.jewelryCategory === 'Rings') && (
          <div className="space-y-2">
            <SectionHeader title="RING STYLE" section="ringType" label="A" required />
            {expandedSections.has('ringType') && (
              <div className="pl-4 space-y-2 animate-fadeIn">
                <div className="grid grid-cols-2 gap-3">
                  {RING_STYLES.map(style => {
                    const count = filterCounts.ringStyles[style] || 0;
                    const isSelected = filters.ringStyle === style;
                    return (
                      <button
                      key={style}
                      onClick={() => updateFilter('ringStyle', isSelected ? undefined : style)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 min-h-[100px] ${
                        isSelected
                          ? 'border-Color-Netural-Black bg-Color-Netural-Black text-white shadow-lg'
                          : 'border-Color-Champagne-Gold/30 hover:border-Color-Champagne-Gold hover:shadow-md'
                      }`}
                    >
                      <RingStyleIcon
                        style={style}
                        size={36}
                        className={isSelected ? 'text-white' : 'text-Color-Netural-Black'}
                      />
                      <div className="text-center">
                        <div className="text-xs font-semibold">{style}</div>
                        <div className={`text-xs opacity-70 ${isSelected ? 'text-white' : 'text-Color-Gray-700'}`}>
                          ({count})
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        )}

        {/* B: Color Gold (18 Carat) */}
        <div className="space-y-2">
          <SectionHeader title="COLOR GOLD (18 CARAT)" section="metalColor" label="B" required />
          {expandedSections.has('metalColor') && (
            <div className="pl-4 space-y-3 animate-fadeIn">
              <div className="flex gap-4 justify-center">
                {METAL_COLORS.map(color => {
                  const displayInfo = getMetalColorDisplayInfo(color);
                  const count = filterCounts.metalColors[color] || 0;
                  const isSelected = filters.metalColors?.includes(color);
                  const label = METAL_COLOR_LABELS[color];

                  return (
                    <button
                      key={color}
                      onClick={() => updateFilter('metalColors', toggleArrayItem(filters.metalColors, color))}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div
                        className={`w-16 h-16 rounded-full transition-all duration-200 flex items-center justify-center relative ${
                          isSelected
                            ? 'ring-4 ring-Color-Netural-Black ring-offset-2 scale-110 shadow-lg'
                            : 'ring-2 ring-gray-200 hover:ring-Color-Champagne-Gold hover:scale-105'
                        }`}
                        style={{
                          backgroundColor: displayInfo.hexColor,
                          border: `3px solid ${isSelected ? '#000' : '#e5e7eb'}`
                        }}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-3 bg-Color-Netural-Black rounded-full shadow"></div>
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-semibold text-Color-Netural-Black">{color}</div>
                        <div className="text-xs text-Color-Gray-700">({count})</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* C: Shape Diamond - Only show for Rings */}
        {showShapeFilter && (
          <div className="space-y-2">
            <SectionHeader title="SHAPE DIAMOND" section="shape" label="C" />
            {expandedSections.has('shape') && (
              <div className="pl-4 space-y-2 animate-fadeIn">
                {filters.ringStyle && (
                  <p className="text-xs text-Color-Gray-700 italic mb-2">
                    Available shapes for {filters.ringStyle}
                  </p>
                )}
                <div className="grid grid-cols-3 gap-3">
                  {availableShapes.map(shape => {
                    const isSelected = filters.shapes?.includes(shape);
                    return (
                      <button
                        key={shape}
                        onClick={() => updateFilter('shapes', toggleArrayItem(filters.shapes, shape))}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                          isSelected
                            ? 'border-Color-Netural-Black bg-Color-Netural-Black text-white shadow-lg'
                            : 'border-Color-Champagne-Gold/30 hover:border-Color-Champagne-Gold hover:shadow-md'
                        }`}
                      >
                        <ShapeIcon
                          shape={shape}
                          size={32}
                          className={isSelected ? 'text-white' : 'text-Color-Netural-Black'}
                        />
                        <div className="text-xs font-semibold text-center">{shape}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* D: Stone Type (Diamond or Gemstone) */}
        <div className="space-y-2">
          <SectionHeader title="STONE TYPE" section="stoneType" label="D" />
          {expandedSections.has('stoneType') && (
            <div className="pl-4 space-y-4 animate-fadeIn">
              {/* Parent: Diamond or Gemstone */}
              <div className="grid grid-cols-2 gap-3">
                {STONE_TYPES.map(stoneType => {
                  const isSelected = filters.stoneType === stoneType;
                  return (
                    <button
                      key={stoneType}
                      onClick={() => updateFilter('stoneType', isSelected ? undefined : stoneType)}
                      className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all duration-200 ${
                        isSelected
                          ? 'border-Color-Netural-Black bg-Color-Netural-Black text-white'
                          : 'border-Color-Champagne-Gold/30 hover:border-Color-Champagne-Gold'
                      }`}
                    >
                      {stoneType}
                    </button>
                  );
                })}
              </div>

              {/* Sub-option: Diamond Origin */}
              {filters.stoneType === 'Diamond' && (
                <div className="pl-6 border-l-2 border-Color-Champagne-Gold/30 space-y-2">
                  <p className="text-sm font-semibold text-Color-Netural-Black mb-2">Diamond Type</p>
                  <div className="space-y-2">
                    {DIAMOND_ORIGINS.map(origin => {
                      const isSelected = filters.diamondOrigin === origin;
                      return (
                        <button
                          key={origin}
                          onClick={() => updateFilter('diamondOrigin', isSelected ? undefined : origin)}
                          className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
                            isSelected
                              ? 'border-Color-Netural-Black bg-Color-Netural-Black text-white'
                              : 'border-Color-Champagne-Gold/30 hover:border-Color-Champagne-Gold'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full border-2 ${
                              isSelected ? 'bg-white border-white' : 'border-Color-Champagne-Gold'
                            }`} />
                            {origin}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-option: Gemstone Variant */}
              {filters.stoneType === 'Gemstone' && (
                <div className="pl-6 border-l-2 border-Color-Champagne-Gold/30 space-y-2">
                  <p className="text-sm font-semibold text-Color-Netural-Black mb-2">Gemstone Type</p>
                  <div className="space-y-2">
                    {GEMSTONE_VARIANTS.map(variant => {
                      const isSelected = filters.gemstoneVariant === variant;
                      const colorMap: Record<string, string> = {
                        'Sapphire (Blue)': '#0F52BA',
                        'Sapphire (Pink)': '#FF69B4',
                        'Sapphire (Yellow)': '#FFD700',
                        'Morganite (Pink)': '#FFB6C1',
                        'Ruby (Red)': '#E0115F'
                      };
                      const gemColor = colorMap[variant] || '#ccc';

                      return (
                        <button
                          key={variant}
                          onClick={() => updateFilter('gemstoneVariant', isSelected ? undefined : variant)}
                          className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
                            isSelected
                              ? 'border-Color-Netural-Black bg-Color-Netural-Black text-white'
                              : 'border-Color-Champagne-Gold/30 hover:border-Color-Champagne-Gold'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full border-2 border-white shadow"
                              style={{ backgroundColor: gemColor }}
                            />
                            {variant}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Apply Button for Mobile */}
      {isMobile && (
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-Color-Champagne-Gold/30 p-4 flex-shrink-0 shadow-lg">
          <button
            onClick={onClose}
            className="w-full py-4 bg-Color-Netural-Black text-white font-semibold rounded-lg hover:bg-Color-Champagne-Gold hover:text-Color-Netural-Black transition-all duration-300 min-h-[48px]"
          >
            Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>
      )}
    </div>
  );
};
