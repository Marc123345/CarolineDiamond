import React from 'react';
import { Filter, X, Gem, Sparkles, Ring } from 'lucide-react';

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

  // --- NEW: Core Unified Product Lines ---
  const coreProductLines = [
    { value: 'all', label: 'All Jewelry', icon: <Gem className="w-4 h-4" /> },
    { value: 'necklace', label: 'Necklaces', icon: <Sparkles className="w-4 h-4" /> },
    { value: 'earrings', label: 'Earrings', icon: <Gem className="w-4 h-4" /> },
    { value: 'rings', label: 'Engagement Rings', icon: <Ring className="w-4 h-4" /> },
  ];

  const jewelryCategories = [
    { value: 'Wedding Ring', label: 'Wedding Rings', count: 6 },
    { value: 'Eternity Ring', label: 'Eternity Rings', count: 3 },
    { value: 'Statement Ring', label: 'Statement Rings', count: 4 },
  ];

  const materialFilters = [
    '18k Yellow Gold',
    '18k White Gold',
    '18k Rose Gold',
    'Platinum',
    'Natural Diamonds',
    'Lab-grown Diamonds',
    'Birthstones'
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] lg:hidden overflow-hidden"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      onClick={onClose}
    >
      <div
        className="absolute right-0 top-0 h-full w-[85vw] max-w-[360px] bg-white shadow-2xl overflow-y-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-[#CDBCAB] mr-3" />
              <h2 className="text-xl text-gray-900 font-medium tracking-tight">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              aria-label="Close filters"
            >
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          {/* 1. Core Product Lines (Unified System) */}
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">Collections</h3>
            <div className="grid grid-cols-1 gap-2">
              {coreProductLines.map((item) => (
                <button
                  key={item.value}
                  onClick={() => onCategoryChange(item.value)}
                  className={`flex items-center gap-3 p-4 rounded-xl transition-all border ${
                    selectedCategory === item.value
                      ? 'bg-[#CDBCAB] border-[#CDBCAB] text-white shadow-md'
                      : 'bg-white border-gray-100 text-gray-600 hover:border-[#CDBCAB]/30'
                  }`}
                >
                  <span className={selectedCategory === item.value ? 'text-white' : 'text-[#CDBCAB]'}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Price Range */}
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">Price Range</h3>
            <div className="grid grid-cols-1 gap-2">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => onPriceRangeChange(range.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${
                    priceRange === range.value
                      ? 'bg-gray-900 text-white font-medium'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Materials */}
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">Material & Stones</h3>
            <div className="space-y-1">
              {materialFilters.map((material) => (
                <label
                  key={material}
                  className="flex items-center px-2 py-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-lg group"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(material)}
                      onChange={() => handleMaterialToggle(material)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-[#CDBCAB] checked:border-[#CDBCAB] transition-all"
                    />
                    <X className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none rotate-45" />
                  </div>
                  <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900">{material}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100">
            <button
              onClick={clearAllFilters}
              className="w-full py-4 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-gray-900 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};