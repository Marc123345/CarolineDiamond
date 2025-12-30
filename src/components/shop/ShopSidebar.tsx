import React, { useState } from 'react';
import { Filter, Package, ChevronUp, ChevronDown } from 'lucide-react';
import { ProcessedProduct } from '../../types'; // Fixed import path

interface ShopSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: string;
  onPriceRangeChange: (range: string) => void;
  products: ProcessedProduct[];
  onShowCustomization?: (productType: string) => void;
  showInStockOnly?: boolean;
  onInStockFilterChange?: (value: boolean) => void;
}

export const ShopSidebar: React.FC<ShopSidebarProps> = ({
  selectedCategory,
  onCategoryChange,
  // priceRange, // Not used in this UI version yet, but kept for interface compatibility
  // onPriceRangeChange,
  // products, // Can be used for dynamic counts in the future
  onShowCustomization,
  showInStockOnly = false,
  onInStockFilterChange
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    availability: true,
    diamondShapes: true,
    goldColors: true,
    sizes: true
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedGoldColors, setSelectedGoldColors] = useState<string[]>([]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleGoldColorToggle = (color: string) => {
    setSelectedGoldColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  // Categories with counts from the image
  const categories = [
    { value: 'Engagement Ring', label: 'Engagement Rings', count: 120 },
    { value: 'Ring', label: 'Rings', count: 240 },
    { value: 'Necklaces', label: 'Necklaces', count: 175 },
    { value: 'Bracelets', label: 'Bracelets', count: 120 },
    { value: 'Earrings', label: 'Earrings', count: 90 }
  ];

  // Diamond shapes with counts
  const diamondShapes = [
    { value: 'round', label: 'Round', count: 80, image: 'https://ik.imagekit.io/qcvroy8xpd/20165%201.png?updatedAt=1757410423367' },
    { value: 'princess', label: 'Princess', count: 45, image: 'https://ik.imagekit.io/qcvroy8xpd/20165%208.png?updatedAt=1757410329778' },
    { value: 'emerald', label: 'Emerald', count: 35, image: 'https://ik.imagekit.io/qcvroy8xpd/20165%209.png?updatedAt=1757410329689' },
    { value: 'pear', label: 'Pear', count: 20, image: 'https://ik.imagekit.io/qcvroy8xpd/20165%2012.png?updatedAt=1757410329677' },
    { value: 'cushion', label: 'Cushion', count: 60, image: 'https://ik.imagekit.io/qcvroy8xpd/20165%204.png?updatedAt=1757410329815' },
    { value: 'oval', label: 'Oval', count: 90, image: 'https://ik.imagekit.io/qcvroy8xpd/20165%203.png?updatedAt=1757410329720' }
  ];

  // Ring sizes with counts
  const ringSizes = [
    { value: '4.0', count: 120 },
    { value: '4.5', count: 240 },
    { value: '5.0', count: 175 },
    { value: '6.0', count: 120 },
    { value: '6.5', count: 90 },
    { value: '7.0', count: 85 },
    { value: '7.5', count: 50 },
    { value: '8.0', count: 35 }
  ];

  // Gold colors with counts
  const goldColors = [
    { value: 'Rose Gold', count: 22 },
    { value: 'Yellow Gold', count: 22 },
    { value: 'White Gold', count: 22 }
  ];

  return (
    <div className="hidden lg:block lg:col-span-1">
      <div className="bg-white p-6 shadow-lg rounded-lg sticky top-32 border border-Color-Champagne-Gold/20">
        <h3 className="font-semibold text-Color-Netural-Black mb-6 flex items-center text-xl">
          <Filter className="h-5 w-5 text-Color-Netural-Black mr-2" /> Filters
        </h3>

        {/* Availability Section */}
        <div className="mb-8 border-b border-gray-100 pb-6">
          <button
            onClick={() => toggleSection('availability')}
            className="w-full flex items-center justify-between mb-4 text-left"
          >
            <h4 className="font-semibold text-Color-Netural-Black text-lg">Availability</h4>
            {expandedSections.availability ? (
              <ChevronUp className="h-5 w-5 text-Color-Netural-Black" />
            ) : (
              <ChevronDown className="h-5 w-5 text-Color-Netural-Black" />
            )}
          </button>

          {expandedSections.availability && (
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                <input
                  type="checkbox"
                  checked={showInStockOnly}
                  onChange={(e) => onInStockFilterChange?.(e.target.checked)}
                  className="mr-3 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                />
                <Package className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-Color-Netural-Black font-medium">In Stock Only</span>
              </label>
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div className="mb-8 border-b border-gray-100 pb-6">
          <button
            onClick={() => toggleSection('categories')}
            className="w-full flex items-center justify-between mb-4 text-left"
          >
            <h4 className="font-semibold text-Color-Netural-Black text-lg">Categories</h4>
            {expandedSections.categories ? (
              <ChevronUp className="h-5 w-5 text-Color-Netural-Black" />
            ) : (
              <ChevronDown className="h-5 w-5 text-Color-Netural-Black" />
            )}
          </button>
          
          {expandedSections.categories && (
            <div className="space-y-1">
              {categories.map(category => (
                <label
                  key={category.value}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategory === category.value}
                      onChange={() => onCategoryChange(category.value)}
                      className="mr-3 w-4 h-4 text-Color-Champagne-Gold border-gray-300 rounded focus:ring-Color-Champagne-Gold cursor-pointer"
                    />
                    <span className="text-Color-Netural-Black font-medium">{category.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">({category.count})</span>
                    {category.value === 'Ring' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowCustomization?.('halo-ring');
                        }}
                        className="text-xs text-Color-Champagne-Gold hover:underline ml-1"
                        title="Customize Ring"
                      >
                        Customize
                      </button>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Ring by Diamond Section */}
        <div className="mb-8 border-b border-gray-100 pb-6">
          <button
            onClick={() => toggleSection('diamondShapes')}
            className="w-full flex items-center justify-between mb-4 text-left"
          >
            <h4 className="font-semibold text-Color-Netural-Black text-lg">Ring by Diamond</h4>
            {expandedSections.diamondShapes ? (
              <ChevronUp className="h-5 w-5 text-Color-Netural-Black" />
            ) : (
              <ChevronDown className="h-5 w-5 text-Color-Netural-Black" />
            )}
          </button>

          {expandedSections.diamondShapes && (
            <div className="space-y-1">
              {diamondShapes.map(shape => (
                <button
                  key={shape.value}
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors duration-200 text-left group"
                >
                  <div className="flex items-center">
                    <img
                      src={shape.image}
                      alt={shape.label}
                      className="w-6 h-6 mr-3 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <span className="text-Color-Netural-Black font-medium group-hover:text-Color-Champagne-Gold transition-colors">{shape.label}</span>
                  </div>
                  <span className="text-gray-400 text-sm">({shape.count})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Gold Colors Section */}
        <div className="mb-8 border-b border-gray-100 pb-6">
          <button
            onClick={() => toggleSection('goldColors')}
            className="w-full flex items-center justify-between mb-4 text-left"
          >
            <h4 className="font-semibold text-Color-Netural-Black text-lg">Gold Color</h4>
            {expandedSections.goldColors ? (
              <ChevronUp className="h-5 w-5 text-Color-Netural-Black" />
            ) : (
              <ChevronDown className="h-5 w-5 text-Color-Netural-Black" />
            )}
          </button>

          {expandedSections.goldColors && (
            <div className="space-y-2">
              {goldColors.map(color => (
                <label
                  key={color.value}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedGoldColors.includes(color.value)}
                      onChange={() => handleGoldColorToggle(color.value)}
                      className="mr-3 w-4 h-4 text-Color-Champagne-Gold border-gray-300 rounded focus:ring-Color-Champagne-Gold cursor-pointer"
                    />
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-2 border shadow-sm"
                        style={{
                          backgroundColor:
                            color.value === 'Rose Gold' ? '#B76E79' :
                            color.value === 'Yellow Gold' ? '#D3B275' :
                            '#FFFFFF',
                          borderColor:
                            color.value === 'Rose Gold' ? '#9D5D66' :
                            color.value === 'Yellow Gold' ? '#B8985E' :
                            '#D1D1D1'
                        }}
                      />
                      <span className="text-Color-Netural-Black font-medium">{color.value}</span>
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm">({color.count})</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Size Section */}
        <div className="mb-2">
          <button
            onClick={() => toggleSection('sizes')}
            className="w-full flex items-center justify-between mb-4 text-left"
          >
            <h4 className="font-semibold text-Color-Netural-Black text-lg">Size</h4>
            {expandedSections.sizes ? (
              <ChevronUp className="h-5 w-5 text-Color-Netural-Black" />
            ) : (
              <ChevronDown className="h-5 w-5 text-Color-Netural-Black" />
            )}
          </button>
          
          {expandedSections.sizes && (
            <div className="grid grid-cols-2 gap-2">
              {ringSizes.map(size => (
                <label
                  key={size.value}
                  className={`flex items-center justify-center cursor-pointer p-2 rounded border transition-all duration-200 text-sm ${
                    selectedSizes.includes(size.value)
                      ? 'bg-Color-Netural-Black text-white border-Color-Netural-Black'
                      : 'hover:border-Color-Champagne-Gold hover:text-Color-Champagne-Gold border-gray-200 text-Color-Netural-Black'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size.value)}
                    onChange={() => handleSizeToggle(size.value)}
                    className="hidden"
                  />
                  <span>{size.value}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};