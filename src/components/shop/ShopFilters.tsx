import React from 'react';
import { Filter, Grid, List, Package, TrendingUp, Search, ArrowUpDown } from 'lucide-react';
import { ProcessedProduct } from '../../types/shopify';

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
  searchQuery,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onFiltersOpen,
  onSearchOpen,
  totalResults = 0
}) => {
  return (
    <section
      className="py-4 sm:py-6 bg-white border-b border-gray-100 sticky top-[64px] sm:top-[80px] z-30 backdrop-blur-md bg-white/90"
      role="search"
      aria-label="Product filters and sorting"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Left Side: Results & Search Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center text-gray-900 font-medium">
              <Package className="h-4 w-4 mr-2 text-Color-Champagne-Gold" />
              <span className="text-sm">
                {totalResults} {totalResults === 1 ? 'Product' : 'Products'}
              </span>
            </div>
            
            {searchQuery && (
              <div className="hidden sm:flex items-center px-3 py-1 bg-Color-Champagne-Gold/10 text-Color-Champagne-Gold rounded-full text-xs font-semibold">
                <Search className="h-3 w-3 mr-1.5" />
                <span className="truncate max-w-[150px]">"{searchQuery}"</span>
              </div>
            )}
          </div>

          {/* Right Side: Controls */}
          <div className="flex items-center justify-between md:justify-end gap-3">
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onSearchOpen}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:border-Color-Champagne-Gold transition-colors text-sm font-medium text-gray-700"
              >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline">Search</span>
              </button>

              <button
                onClick={onFiltersOpen}
                className="flex lg:hidden items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>

            <div className="h-8 w-[1px] bg-gray-200 hidden sm:block mx-1"></div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="appearance-none pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-Color-Champagne-Gold/20 focus:border-Color-Champagne-Gold bg-white"
                >
                  <option value="featured">Featured</option>
                  <option value="created">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center p-1 bg-gray-50 rounded-lg border border-gray-100">
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};