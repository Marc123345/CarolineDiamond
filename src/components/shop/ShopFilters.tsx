import React from 'react';
import { Filter, Grid, List, Package, TrendingUp, Search } from 'lucide-react';
import { ProcessedProduct } from '../../types'; // Fixed import path

interface ShopFiltersProps {
  onNavigate: (page: string) => void;
  searchQuery: string;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onFiltersOpen: () => void;
  onSearchOpen: () => void;
  products?: ProcessedProduct[];
  totalResults?: number;
}

export const ShopFilters: React.FC<ShopFiltersProps> = ({
  onNavigate,
  searchQuery,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onFiltersOpen,
  onSearchOpen,
  products = [],
  totalResults = 0
}) => {
  return (
    <section
      className="py-4 sm:py-6 lg:py-8 bg-white border-b border-gray-200 sticky top-20 sm:top-24 z-30 backdrop-blur-sm bg-opacity-95"
      role="search"
      aria-label="Product filters and sorting"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Results Summary */}
        {totalResults > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
            <div className="flex items-center text-gray-900">
              <Package className="h-4 w-4 mr-2" />
              <span className="text-sm">
                {totalResults} {totalResults === 1 ? 'product' : 'products'} found
              </span>
            </div>
            {searchQuery && (
              <div className="flex items-center text-Color-Champagne-Gold text-sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span className="truncate">Results for "{searchQuery}"</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-4 sm:gap-6 mt-4">
          {/* Controls */}
          <div className="flex items-center justify-between gap-3">
            {/* Search Icon Button */}
            <button
              onClick={onSearchOpen}
              className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 hover:border-Color-Champagne-Gold rounded-lg transition-all duration-300 min-w-[44px] min-h-[44px] justify-center"
              aria-label="Open search"
            >
              <Search className="h-5 w-5 text-Color-Champagne-Gold" />
              <span className="hidden sm:inline font-medium text-gray-700">Search</span>
            </button>

            {/* Mobile Filters Button */}
            <button
              onClick={onFiltersOpen}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 hover:border-Color-Champagne-Gold rounded-lg transition-all duration-300 min-w-[44px] min-h-[44px] justify-center"
              aria-label="Open filters"
            >
              <Filter className="h-5 w-5 text-Color-Champagne-Gold" />
              <span className="font-medium text-gray-700">Filters</span>
            </button>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 focus:ring-2 focus:ring-Color-Champagne-Gold focus:border-Color-Champagne-Gold transition-all duration-300 text-sm sm:text-base rounded-lg bg-white"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="name">Name A–Z</option>
              </select>

              {/* View Mode Buttons - Hidden on mobile */}
              <div className="hidden sm:flex">
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={`p-3 border rounded-l-lg transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                    viewMode === 'grid' 
                      ? 'bg-gray-100 text-black shadow-inner' 
                      : 'text-gray-500 hover:text-black border-gray-200'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`p-3 border border-l-0 rounded-r-lg transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                    viewMode === 'list' 
                      ? 'bg-gray-100 text-black shadow-inner' 
                      : 'text-gray-500 hover:text-black border-gray-200'
                  }`}
                  aria-label="List view"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};