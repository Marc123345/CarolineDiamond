import React from 'react';
import { X } from 'lucide-react';
import { ProductFilters as FilterType } from '../config/filterConfig';

interface ActiveFilterChipsProps {
  filters: FilterType;
  searchQuery?: string;
  onRemoveFilter: (key: keyof FilterType, value?: string) => void;
  onClearSearch: () => void;
  onClearAll: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  searchQuery,
  onRemoveFilter,
  onClearSearch,
  onClearAll
}) => {
  const hasFilters = searchQuery || Object.keys(filters).some(key => {
    const value = filters[key as keyof FilterType];
    return Array.isArray(value) ? value.length > 0 : value !== undefined;
  });

  if (!hasFilters) return null;

  const renderChip = (label: string, onRemove: () => void) => (
    <button
      onClick={onRemove}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-Color-Netural-Black text-white text-sm rounded-full hover:bg-Color-Champagne-Gold transition-all duration-200 group"
      aria-label={`Remove ${label} filter`}
    >
      <span>{label}</span>
      <X className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
    </button>
  );

  return (
    <div
      className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-Color-Primary-Beige/30 rounded-lg border border-Color-Champagne-Gold/20"
      role="region"
      aria-label="Active filters"
    >
      <span className="text-sm font-semibold text-Color-Netural-Black mr-2">Active Filters:</span>

      {searchQuery && renderChip(`Search: "${searchQuery}"`, onClearSearch)}

      {filters.ringStyle && renderChip(`Style: ${filters.ringStyle}`, () => onRemoveFilter('ringStyle'))}

      {filters.shapes?.map(shape =>
        <React.Fragment key={`shape-${shape}`}>
          {renderChip(`Shape: ${shape}`, () => {
            onRemoveFilter('shapes', shape);
          })}
        </React.Fragment>
      )}

      {filters.metalColors?.map(color =>
        <React.Fragment key={`metal-${color}`}>
          {renderChip(`Metal: ${color}`, () => {
            onRemoveFilter('metalColors', color);
          })}
        </React.Fragment>
      )}

      {filters.stoneType && renderChip(`Stone: ${filters.stoneType}`, () => onRemoveFilter('stoneType'))}

      {filters.diamondOrigin && renderChip(`Origin: ${filters.diamondOrigin}`, () => onRemoveFilter('diamondOrigin'))}

      {filters.gemstoneVariant && renderChip(`Gemstone: ${filters.gemstoneVariant}`, () => onRemoveFilter('gemstoneVariant'))}

      {(filters.minPrice || filters.maxPrice) && renderChip(
        `Price: €${filters.minPrice || 0} - €${filters.maxPrice || '∞'}`,
        () => {
          onRemoveFilter('minPrice');
          onRemoveFilter('maxPrice');
        }
      )}

      {filters.ringSizes?.map(size =>
        <React.Fragment key={`size-${size}`}>
          {renderChip(`Size: ${size}`, () => {
            onRemoveFilter('ringSizes', size);
          })}
        </React.Fragment>
      )}

      {filters.inStockOnly && renderChip('In Stock Only', () => onRemoveFilter('inStockOnly'))}

      <button
        onClick={onClearAll}
        className="ml-auto text-sm font-medium text-Color-Champagne-Gold hover:text-Color-Netural-Black transition-colors underline"
        aria-label="Clear all filters"
      >
        Clear All
      </button>
    </div>
  );
};
