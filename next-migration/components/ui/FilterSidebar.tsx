/**
 * src/components/FilterSidebar.tsx
 * Dynamic filtering UI with real-time product counts
 * ADDED: Shows how many products match each filter option
 */
import React from 'react';
import {
  ALL_SHAPES,
  RING_STYLES,
  METAL_COLORS,
  DIAMOND_TYPE_OPTIONS,
  RING_SIZES,
  JEWELRY_CATEGORIES,
  METAL_DISPLAY_TO_CANONICAL,
  RingStyle,
  Shape
} from '../config/filterConfig';
import { getShapeAvailability } from '../utils/shapeUtils';
import { useFilterCounts } from '../hooks/useFilterCounts';
import { ProcessedProduct } from '../types/shopify';

interface FilterSidebarProps {
  filters: any;
  updateFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  allProducts: ProcessedProduct[];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  updateFilter,
  clearFilters,
  allProducts
}) => {
  // Calculate dynamic counts for each filter option
  const counts = useFilterCounts(allProducts, filters);

  const isEngagementRings = filters.productType === 'Engagement Rings';

  return (
    <aside className="w-64 space-y-8 pr-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-xs text-gray-500 underline hover:text-black"
        >
          Clear all
        </button>
      </div>

      {/* 1. Primary Category Filter */}
      <section>
        <h3 className="mb-3 text-sm font-medium">Category</h3>
        <div className="space-y-2">
          {JEWELRY_CATEGORIES.map((type) => {
            const count = counts.productTypes[type] || 0;
            return (
              <label key={type} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="productType"
                    checked={filters.productType === type}
                    onChange={() => updateFilter('productType', type)}
                    className="text-black focus:ring-black"
                  />
                  <span>{type}</span>
                </div>
                <span className="text-xs text-gray-400">({count})</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* 2. Ring Style (Only for Engagement Rings) */}
      {isEngagementRings && (
        <section>
          <h3 className="mb-3 text-sm font-medium">Ring Style</h3>
          <div className="grid grid-cols-1 gap-2">
            {RING_STYLES.map((style) => {
              const count = counts.ringStyles[style] || 0;
              return (
                <button
                  key={style}
                  onClick={() => updateFilter('ringStyle', style)}
                  disabled={count === 0}
                  className={`border px-3 py-2 text-left text-xs transition-colors flex justify-between items-center ${
                    filters.ringStyle === style
                      ? 'border-black bg-black text-white'
                      : count === 0
                      ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                      : 'border-gray-200 hover:border-black'
                  }`}
                >
                  <span>{style}</span>
                  <span className={`text-[10px] ${filters.ringStyle === style ? 'text-gray-300' : 'text-gray-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Diamond Shape */}
      <section>
        <h3 className="mb-3 text-sm font-medium">Diamond Shape</h3>
        <div className="grid grid-cols-2 gap-2">
          {ALL_SHAPES.map((shape) => {
            const availability = getShapeAvailability(shape as Shape, filters.ringStyle as RingStyle);
            const isDisabled = isEngagementRings && availability === 'disabled';
            const isSelected = filters.shapes?.includes(shape);

            return (
              <button
                key={shape}
                disabled={isDisabled}
                onClick={() => {
                  const current = filters.shapes || [];
                  const next = isSelected
                    ? current.filter((s: string) => s !== shape)
                    : [...current, shape];
                  updateFilter('shapes', next);
                }}
                className={`flex flex-col items-center border p-2 transition-all ${
                  isDisabled
                    ? 'cursor-not-allowed opacity-30 grayscale'
                    : isSelected
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 hover:border-black'
                }`}
              >
                <span className="text-[10px]">{shape}</span>
                {isDisabled && <span className="mt-1 text-[8px] text-red-500">N/A for Style</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Metal Color */}
      <section>
        <h3 className="mb-3 text-sm font-medium">Metal</h3>
        <div className="flex flex-col space-y-2">
          {METAL_COLORS.map((color) => {
            const canonical = METAL_DISPLAY_TO_CANONICAL[color];
            const isSelected = filters.metalColors?.includes(canonical);

            return (
              <label key={color} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {
                    const current = filters.metalColors || [];
                    const next = isSelected
                      ? current.filter((c: string) => c !== canonical)
                      : [...current, canonical];
                    updateFilter('metalColors', next);
                  }}
                  className="text-black focus:ring-black rounded"
                />
                <div className="flex items-center space-x-2">
                  <div
                    className="h-6 w-6 rounded-full border border-gray-300"
                    style={{
                      backgroundColor: color.includes('White') ? '#D4D6D8' :
                                      color.includes('Yellow') ? '#E6BE8A' : '#E8C4B8'
                    }}
                  />
                  <span className="text-sm">{color}</span>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      {/* 5. Diamond Type + Carat Combined */}
      <section>
        <h3 className="mb-3 text-sm font-medium">Diamond Type</h3>
        <div className="space-y-2">
          {DIAMOND_TYPE_OPTIONS.map((option) => (
            <label key={option.label} className="flex items-center space-x-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="diamondTypeOption"
                checked={filters.diamondTypeOption === option.label}
                onChange={() => updateFilter('diamondTypeOption', option.label)}
                className="text-black focus:ring-black"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* 6. Ring Size (Only for Engagement Rings) */}
      {isEngagementRings && (
        <section>
          <h3 className="mb-3 text-sm font-medium">Ring Size</h3>
          <select
            value={filters.ringSize || ''}
            onChange={(e) => updateFilter('ringSize', e.target.value || undefined)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black focus:ring-black"
          >
            <option value="">Select Size</option>
            {RING_SIZES.map((size) => (
              <option key={size} value={size}>
                Size {size}
              </option>
            ))}
          </select>
        </section>
      )}
    </aside>
  );
};
