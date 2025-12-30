import React, { useState, useEffect, useMemo } from 'react';
import { X, Search as SearchIcon, Bookmark } from 'lucide-react';
import {
  ProductFilters as FilterType,
  JEWELRY_CATEGORIES,
  RING_STYLES,
  METAL_COLORS,
  CARAT_WEIGHTS,
  STONE_TYPES,
  DIAMOND_ORIGINS,
  GEMSTONE_VARIANTS,
  getAvailableShapes,
  shouldShowShapeFilter,
  ALL_SHAPES
} from '../../config/filterConfig';
import { ProcessedProduct } from '../../types';
import { useEnhancedFilterCounts } from '../../hooks/useEnhancedFilterCounts';
import { getMetalColorDisplayInfo } from '../../utils/metalUtils';
import { AdvancedProductFilters } from './AdvancedProductFilters'; 

// Placeholder components for future expansion
const PlaceholderPanel = ({ title }: { title: string }) => (
  <div className="p-4 text-center text-gray-500 text-sm bg-gray-50 rounded-lg">
    {title} coming soon
  </div>
);

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
  const [activeTab, setActiveTab] = useState<'filters' | 'presets' | 'searches'>('filters');
  
  // Calculate counts using our hook
  const { counts: filterCounts } = useEnhancedFilterCounts(products, filters);

  return (
    <div className={`${isMobile ? 'h-full flex flex-col' : ''} space-y-6 bg-white`}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 flex-shrink-0 px-4 pt-4">
          <h3 className="text-xl font-bold text-gray-900">Filters</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close filters"
          >
            <X className="h-5 w-5 text-gray-900" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className={`${isMobile ? 'px-4' : ''}`}>
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('filters')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'filters'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Filters
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'presets'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            Presets
          </button>
          <button
            onClick={() => setActiveTab('searches')}
            className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'searches'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <SearchIcon className="h-4 w-4" />
            Saved
          </button>
        </div>
      </div>

      <div className={`${isMobile ? 'flex-1 overflow-y-auto px-4' : ''} pb-20`}>
        {activeTab === 'filters' && (
          <AdvancedProductFilters
            filters={filters}
            onFiltersChange={onFiltersChange}
            products={products}
            isMobile={false} // Internal logic handles layout, keep false to avoid double headers
          />
        )}

        {activeTab === 'presets' && <PlaceholderPanel title="Filter Presets" />}
        {activeTab === 'searches' && <PlaceholderPanel title="Saved Searches" />}
      </div>
    </div>
  );
};