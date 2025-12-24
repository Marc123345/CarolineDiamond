import React from 'react';
import { Filter, X } from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: string;
  onPriceRangeChange: (range: string) => void;
  selectedMaterials: string[];
  onMaterialsChange: (materials: string[]) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedMaterials,
  onMaterialsChange
}) => {
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-500', label: '€0 - €500' },
    { value: '500-1000', label: '€500 - €1.000' },
    { value: '1000-2000', label: '€1.000 - €2.000' },
    { value: '2000+', label: '€2.000+' }
  ];

  const handleMaterialToggle = (material: string) => {
    const newMaterials = selectedMaterials.includes(material)
      ? selectedMaterials.filter(m => m !== material)
      : [...selectedMaterials, material];
    onMaterialsChange(newMaterials);
  };

  const clearAllFilters = () => {
    onCategoryChange('all');
    onPriceRangeChange('all');
    onMaterialsChange([]);
  };

  // Comprehensive category system
  const coreCategories = [
    { value: 'all', label: 'All', count: 24 },
    // Rings
    { value: 'Engagement Ring', label: 'Engagement', count: 8 },
    { value: 'Wedding Ring', label: 'Wedding', count: 6 },
    { value: 'Eternity Ring', label: 'Eternity', count: 3 },
    { value: 'Statement Ring', label: 'Statement', count: 4 },
    { value: 'Cocktail Ring', label: 'Cocktail', count: 2 }
  ];

  const specialtyCategories = [
    { value: 'Anniversary', label: 'Anniversary', count: 8 },
    { value: 'Birthday', label: 'Birthday', count: 6 },
    { value: 'Graduation', label: 'Graduation', count: 3 },
    { value: 'Mens', label: 'Mens', count: 12 },
    { value: 'Minimalist', label: 'Minimalist', count: 15 },
    { value: 'Stackables', label: 'Stackables', count: 8 },
    { value: 'Personalized', label: 'Personalized', count: 20 }
  ];

  const materialFilters = [
    '18k Yellow Gold',
    '18k White Gold',
    '18k Rose Gold',
    'Platinum',
    'Sterling Silver',
    'Mixed Metals',
    'Natural Diamonds',
    'Lab-grown Diamonds',
    'Sapphires',
    'Emeralds',
    'Rubies',
    'Pearls',
    'Birthstones'
  ];
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] lg:hidden overflow-hidden"
      style={{
        top: 'env(safe-area-inset-top)',
        bottom: 'env(safe-area-inset-bottom)',
        left: 'env(safe-area-inset-left)',
        right: 'env(safe-area-inset-right)'
      }}
      onClick={onClose}
    >
      <div
        className="absolute right-0 top-0 h-full w-[85vw] max-w-[360px] bg-white shadow-2xl overflow-y-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Filter className="h-6 w-6 text-primary-500 mr-3" />
              <h2 className="text-lg sm:text-xl text-Color-Dark-500 font-semibold">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-Color-Secondary transition-colors duration-200 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
              aria-label="Close filters"
            >
              <X className="h-6 w-6 text-Color-Dark-500" />
            </button>
          </div>

          {/* Core Jewelry Categories */}
          <div className="mb-8">
            <h3 className="text-sm sm:text-base font-semibold text-Color-Dark-500 mb-4">Jewelry Categories</h3>
            <div className="space-y-2">
              {coreCategories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => onCategoryChange(category.value)}
                  className={`w-full text-left p-3 sm:p-4 rounded-lg transition-all duration-200 flex items-center justify-between min-h-[44px] ${
                    selectedCategory === category.value
                      ? 'bg-Color-Light-300 text-white shadow-lg'
                      : 'hover:bg-Color-Secondary text-Color-Dark-500'
                  }`}
                >
                  <span className="text-sm sm:text-base truncate">{category.label}</span>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                    selectedCategory === category.value
                      ? 'bg-white/20 text-white'
                      : 'bg-Color-Light-300 text-Color-Gray-700'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Specialty & Occasion Categories */}
          <div className="mb-8">
            <h3 className="text-sm sm:text-base font-semibold text-Color-Dark-500 mb-4">Specialty & Occasion</h3>
            <div className="space-y-2">
              {specialtyCategories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => onCategoryChange(category.value)}
                  className={`w-full text-left p-3 sm:p-4 rounded-lg transition-all duration-200 flex items-center justify-between min-h-[44px] ${
                    selectedCategory === category.value
                      ? 'bg-Color-Light-300 text-white shadow-lg'
                      : 'hover:bg-Color-Secondary text-Color-Dark-500'
                  }`}
                >
                  <span className="text-sm sm:text-base truncate">{category.label}</span>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                    selectedCategory === category.value
                      ? 'bg-white/20 text-white'
                      : 'bg-Color-Light-300 text-Color-Gray-700'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
          {/* Price Range */}
          <div className="mb-8">
            <h3 className="text-sm sm:text-base font-semibold text-Color-Dark-500 mb-4">Price Range</h3>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => onPriceRangeChange(range.value)}
                  className={`w-full text-left p-3 sm:p-4 rounded-lg transition-all duration-200 min-h-[44px] ${
                    priceRange === range.value
                      ? 'bg-Color-Light-300 text-white shadow-lg'
                      : 'hover:bg-Color-Secondary text-Color-Dark-500'
                  }`}
                >
                  <span className="text-sm sm:text-base">{range.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Materials */}
          <div className="mb-8">
           <h3 className="text-sm sm:text-base font-semibold text-Color-Dark-500 mb-4">Materials</h3>
            <div className="space-y-2">
              {materialFilters.map((material) => (
                <label
                  key={material}
                  className="flex items-center p-3 hover:bg-Color-Secondary transition-colors duration-200 cursor-pointer rounded-lg min-h-[44px]"
                >
                  <input
                    type="checkbox"
                    checked={selectedMaterials.includes(material)}
                    onChange={() => handleMaterialToggle(material)}
                    className="mr-3 w-5 h-5 text-Color-Champagne-Gold border-Color-Champagne-Gold/30 rounded focus:ring-Color-Champagne-Gold focus:ring-offset-0 flex-shrink-0"
                  />
                  <span className="text-sm sm:text-base text-Color-Dark-500 break-words">{material}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearAllFilters}
            className="w-full btn-secondary py-3 text-sm sm:text-base"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
};
