import React from 'react';
import { X, Filter } from 'lucide-react';

interface ActiveFiltersProps {
  selectedCategory: string;
  priceRange: string;
  selectedMaterials: string[];
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onPriceRangeChange: (range: string) => void;
  onMaterialsChange: (materials: string[]) => void;
  onSearchChange: (query: string) => void;
  onClearAll: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  selectedCategory,
  priceRange,
  selectedMaterials,
  searchQuery,
  onCategoryChange,
  onPriceRangeChange,
  onMaterialsChange,
  onSearchChange,
  onClearAll
}) => {
  const hasActiveFilters =
    selectedCategory !== 'all' ||
    priceRange !== 'all' ||
    selectedMaterials.length > 0 ||
    searchQuery;

  if (!hasActiveFilters) return null;

  const removeCategory = () => onCategoryChange('all');
  const removePriceRange = () => onPriceRangeChange('all');
  const removeMaterial = (material: string) =>
    onMaterialsChange(selectedMaterials.filter(m => m !== material));
  const removeSearch = () => onSearchChange('');

  const getPriceRangeLabel = (range: string) => {
    switch (range) {
      case '0-500':
        return '€0 - €500';
      case '500-1000':
        return '€500 - €1.000';
      case '1000-2000':
        return '€1.000 - €2.000';
      case '2000+':
        return '€2.000+';
      default:
        return '';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'Engagement Ring':
        return 'Engagement Rings';
      case 'Wedding Ring':
        return 'Wedding Rings';
      case 'Jewelry':
        return 'Jewelry';
      default:
        return category;
    }
  };

  return (
    <div className="bg-Color-Netural-White p-3 sm:p-4 rounded-lg border border-Color-Light-300 mb-4 sm:mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center text-Color-Netural-Black font-medium">
          <Filter className="h-3 sm:h-4 w-3 sm:w-4 text-Color-Champagne-Gold mr-2" />
          <span className="text-sm sm:text-base">Active Filters</span>
        </div>
        <button
          onClick={onClearAll}
          className="text-Color-Champagne-Gold hover:text-Color-Dark-500 text-xs sm:text-sm font-medium transition-colors duration-200"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          Clear All
        </button>
      </div>

      {/* Active filter tags */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {searchQuery && (
          <span className="flex items-center bg-Color-Champagne-Gold text-Color-Netural-Black px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm shadow-lg">
            <span className="hidden sm:inline">Search: </span>"<span className="break-words overflow-wrap-anywhere">{searchQuery}</span>"
            <button onClick={removeSearch} className="ml-1 sm:ml-2 hover:bg-white/20 p-0.5 sm:p-1 rounded-full" style={{ minWidth: '44px', minHeight: '44px' }}>
              <X className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
            </button>
          </span>
        )}

        {selectedCategory !== 'all' && (
          <span className="flex items-center bg-Color-Champagne-Gold text-Color-Netural-Black px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm shadow-lg">
            {getCategoryLabel(selectedCategory)}
            <button onClick={removeCategory} className="ml-1 sm:ml-2 hover:bg-white/20 p-0.5 sm:p-1 rounded-full" style={{ minWidth: '44px', minHeight: '44px' }}>
              <X className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
            </button>
          </span>
        )}

        {priceRange !== 'all' && (
          <span className="flex items-center bg-Color-Champagne-Gold text-Color-Netural-Black px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm shadow-lg">
            {getPriceRangeLabel(priceRange)}
            <button onClick={removePriceRange} className="ml-1 sm:ml-2 hover:bg-white/20 p-0.5 sm:p-1 rounded-full" style={{ minWidth: '44px', minHeight: '44px' }}>
              <X className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
            </button>
          </span>
        )}

        {selectedMaterials.map(material => (
          <span
            key={material}
            className="flex items-center bg-Color-Champagne-Gold text-Color-Netural-Black px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm shadow-lg break-words overflow-wrap-anywhere"
          >
            {material}
            <button onClick={() => removeMaterial(material)} className="ml-1 sm:ml-2 hover:bg-white/20 p-0.5 sm:p-1 rounded-full" style={{ minWidth: '44px', minHeight: '44px' }}>
              <X className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};