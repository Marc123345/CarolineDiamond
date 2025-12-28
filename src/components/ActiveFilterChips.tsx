import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { ProductFilters as FilterType } from '../config/filterConfig';
import { formatPrice } from '../utils/filterUtils';

interface ActiveFilterChipsProps {
  filters: FilterType;
  searchQuery?: string;
  onRemoveFilter: (key: keyof FilterType, value?: any) => void;
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
  // Check if any filters are actually active
  const hasFilters = searchQuery || Object.keys(filters).some(key => {
    const value = filters[key as keyof FilterType];
    return Array.isArray(value) ? value.length > 0 : value !== undefined;
  });

  if (!hasFilters) return null;

  const renderChip = (label: string, onRemove: () => void, key: string) => (
    <button
      key={key}
      onClick={onRemove}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-full hover:bg-Color-Champagne-Gold transition-all duration-200 group shadow-sm"
      aria-label={`Remove ${label} filter`}
    >
      <span>{label}</span>
      <X className="h-3.5 w-3.5 group-hover:rotate-90 transition-transform duration-200 text-gray-400 group-hover:text-white" />
    </button>
  );

  return (
    <div
      className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100"
      role="region"
      aria-label="Active filters"
    >
      <div className="flex items-center gap-2 mr-2 text-gray-500">
        <span className="text-[10px] font-black uppercase tracking-widest">Active Filters</span>
      </div>

      {/* 1. Search Query */}
      {searchQuery && renderChip(`Search: "${searchQuery}"`, onClearSearch, 'search')}

      {/* 2. Jewelry Category */}
      {filters.jewelryCategory && renderChip(
        filters.jewelryCategory, 
        () => onRemoveFilter('jewelryCategory'), 
        'category'
      )}

      {/* 3. Ring Style */}
      {filters.ringStyle && renderChip(
        filters.ringStyle, 
        () => onRemoveFilter('ringStyle'), 
        'style'
      )}

      {/* 4. Shapes (Array of strings) */}
      {filters.shapes?.map(shape => 
        renderChip(shape, () => onRemoveFilter('shapes', shape), `shape-${shape}`)
      )}

      {/* 5. Metal Colors (Array of strings) */}
      {filters.metalColors?.map(color => 
        renderChip(color, () => onRemoveFilter('metalColors', color), `metal-${color}`)
      )}

      {/* 6. Diamond Types (Array of Objects) */}
      {filters.diamondTypes?.map(type => 
        renderChip(
          type.display, 
          () => onRemoveFilter('diamondTypes', type), 
          `type-${type.value}`
        )
      )}

      {/* 7. Carat Weights (Array of Objects) */}
      {filters.caratWeights?.map(carat => 
        renderChip(
          carat.label, 
          () => onRemoveFilter('caratWeights', carat), 
          `carat-${carat.label}`
        )
      )}

      {/* 8. Price Range */}
      {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && renderChip(
        `Price: ${formatPrice(filters.minPrice || 0)} - ${filters.maxPrice ? formatPrice(filters.maxPrice) : '∞'}`,
        () => {
          onRemoveFilter('minPrice');
          onRemoveFilter('maxPrice');
        },
        'price-range'
      )}

      {/* 9. Ring Sizes (Array of strings) */}
      {filters.ringSizes?.map(size => 
        renderChip(`Size: ${size}`, () => onRemoveFilter('ringSizes', size), `size-${size}`)
      )}

      {/* 10. Side Diamonds (Boolean) */}
      {filters.sideDiamonds !== undefined && renderChip(
        filters.sideDiamonds ? 'With Side Diamonds' : 'No Side Diamonds',
        () => onRemoveFilter('sideDiamonds'),
        'side-diamonds'
      )}

      {/* Clear All Button */}
      <button
        onClick={onClearAll}
        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black text-Color-Champagne-Gold hover:text-gray-900 transition-colors uppercase tracking-tighter"
      >
        <RotateCcw className="h-3 w-3" />
        Clear All
      </button>
    </div>
  );
};