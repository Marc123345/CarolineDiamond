/**
 * src/components/FilterSidebar.tsx
 * Implementing the dynamic filtering UI for Diamonds By CS
 */
import React from 'react';
import {
  ALL_SHAPES,
  RING_STYLES,
  METAL_COLORS,
  DIAMOND_TYPES,
  METAL_DISPLAY_TO_CANONICAL,
  RingStyle,
  Shape
} from '../config/filterConfig';
import { getShapeAvailability } from '../utils/shapeUtils';

interface FilterSidebarProps {
  filters: any;
  updateFilter: (key: string, value: any) => void;
  clearFilters: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  updateFilter,
  clearFilters
}) => {
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

      {/* 1. Jewelry Type / Product Type */}
      <section>
        <h3 className="mb-3 text-sm font-medium">Jewelry Type</h3>
        <div className="space-y-2">
          {['Engagement Ring', 'Necklace', 'Earrings'].map((type) => (
            <label key={type} className="flex items-center space-x-2 text-sm">
              <input
                type="radio"
                name="productType"
                checked={filters.productType === type}
                onChange={() => updateFilter('productType', type)}
                className="text-black focus:ring-black"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </section>

      {/* 2. Ring Style (Only for Engagement Rings) */}
      {filters.productType === 'Engagement Ring' && (
        <section>
          <h3 className="mb-3 text-sm font-medium">Ring Style</h3>
          <div className="grid grid-cols-1 gap-2">
            {RING_STYLES.map((style) => (
              <button
                key={style}
                onClick={() => updateFilter('ringStyle', style)}
                className={`border px-3 py-2 text-left text-xs transition-colors ${
                  filters.ringStyle === style
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-black'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 3. Diamond Shape - CRITICAL RULE: Disable incompatible, don't hide */}
      <section>
        <h3 className="mb-3 text-sm font-medium">Diamond Shape</h3>
        <div className="grid grid-cols-2 gap-2">
          {ALL_SHAPES.map((shape) => {
            const availability = getShapeAvailability(shape as Shape, filters.ringStyle as RingStyle);
            const isDisabled = availability === 'disabled';
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
                {/* Icon Placeholder */}
                <span className="text-[10px]">{shape}</span>
                {isDisabled && <span className="mt-1 text-[8px] text-red-500">N/A for Style</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Metal Color - Normalized Mapping */}
      <section>
        <h3 className="mb-3 text-sm font-medium">Metal</h3>
        <div className="flex space-x-3">
          {METAL_COLORS.map((color) => {
            const canonical = METAL_DISPLAY_TO_CANONICAL[color];
            const isSelected = filters.metalColors?.includes(canonical);

            return (
              <button
                key={color}
                title={color}
                onClick={() => {
                  const current = filters.metalColors || [];
                  const next = isSelected
                    ? current.filter((c: string) => c !== canonical)
                    : [...current, canonical];
                  updateFilter('metalColors', next);
                }}
                className={`h-8 w-8 rounded-full border-2 transition-transform ${
                  isSelected ? 'scale-110 border-black' : 'border-transparent'
                }`}
                style={{ backgroundColor: color.includes('White') ? '#D4D6D8' : color.includes('Yellow') ? '#E6BE8A' : '#E8C4B8' }}
              />
            );
          })}
        </div>
      </section>

      {/* 5. Diamond Type */}
      <section>
        <h3 className="mb-3 text-sm font-medium">Diamond Type</h3>
        <div className="flex flex-wrap gap-2">
          {DIAMOND_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => updateFilter('diamondType', type)}
              className={`rounded-full border px-4 py-1 text-xs transition-colors ${
                filters.diamondType === type
                  ? 'bg-black text-white'
                  : 'border-gray-300 hover:border-black'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
};
