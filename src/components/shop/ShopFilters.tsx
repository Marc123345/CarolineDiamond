import React from 'react';
import { Filter, Grid, List, Package, TrendingUp, Search } from 'lucide-react';
import { ProcessedProduct } from '../../types/shopify';
import { useTranslate } from '../../hooks/useTranslate';

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
  const t = useTranslate();

  return (
    <section
      className="py-4 bg-white border-b border-gray-100 sticky top-20 z-30 backdrop-blur-md bg-white/90"
      role="search"
      aria-label="Product filters and sorting"
    >
      <div className="max-w-[1800px] mx-auto px-4 lg:px-16">
        {/* Upper row: Status & Search Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div className="flex items-center text-gray-400 font-medium tracking-tight">
            <Package className="h-3.5 w-3.5 mr-2 text-[#CDBCAB]" />
            <span className="text-xs uppercase">
              {totalResults} {totalResults === 1 ? t('item') : t('items')} {t('found')}
            </span>
          </div>
          
          {searchQuery && (
            <div className="flex items-center text-[#CDBCAB] text-xs font-bold uppercase tracking-widest">
              <TrendingUp className="h-3.5 w-3.5 mr-2" />
              <span className="truncate">{t('Results for')}: "{searchQuery}"</span>
            </div>
          )}
        </div>

        {/* Lower row: Interactive Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={onSearchOpen}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-transparent hover:border-[#CDBCAB]/30 rounded-full transition-all duration-300"
              aria-label="Open search"
            >
              <Search className="h-4 w-4 text-[#CDBCAB]" />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest text-gray-900">{t('Search')}</span>
            </button>

            {/* Filters Button (Visible on Mobile/Tablet) */}
            <button
              onClick={onFiltersOpen}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-[#CDBCAB] text-white rounded-full shadow-sm hover:bg-[#B9A892] transition-all duration-300"
              aria-label="Open filters"
            >
              <Filter className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">{t('Filters')}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Custom Styled Sort Select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="appearance-none bg-gray-50 border border-transparent px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-gray-900 focus:ring-1 focus:ring-[#CDBCAB] focus:border-[#CDBCAB] cursor-pointer pr-10"
              >
                <option value="featured">{t('Featured')}</option>
                <option value="price-low">{t('Price: Low → High')}</option>
                <option value="price-high">{t('Price: High → Low')}</option>
                <option value="name">{t('Name A–Z')}</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="border-t-2 border-r-2 border-[#CDBCAB] w-1.5 h-1.5 rotate-[135deg]" />
              </div>
            </div>

            {/* View Mode Switcher (Desktop Only) */}
            <div className="hidden sm:flex bg-gray-50 p-1 rounded-full border border-gray-100">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-full transition-all ${
                  viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-full transition-all ${
                  viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};