import React, { useEffect, useRef, useMemo } from 'react';
import { Search, WifiOff, Package, AlertTriangle } from 'lucide-react';
import { ProductCard } from '../ProductCard';
import { ProductGridSkeleton } from '../ProductCardSkeleton';
import { EmptyState } from './EmptyState';
import { ProcessedProduct } from '../../types/shopify';
import { ProductFilters as FilterType } from '../../config/filterConfig';

interface ShopProductGridProps {
  products: ProcessedProduct[];
  loading?: boolean;
  error?: string | null;
  usingFallback?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  viewMode: 'grid' | 'list';
  filters: FilterType;
  searchQuery: string;
  onFiltersChange: (filters: FilterType) => void;
  onClearAll: () => void;
  onQuickView: (product: ProcessedProduct) => void;
  onNavigate: (page: string) => void;
  isMobile?: boolean;
}

export const ShopProductGrid: React.FC<ShopProductGridProps> = React.memo(({
  products,
  loading = false,
  error = null,
  usingFallback = false,
  hasNextPage = false,
  onLoadMore,
  viewMode,
  filters,
  searchQuery,
  onFiltersChange,
  onClearAll,
  onQuickView,
  onNavigate,
  isMobile = false
}) => {
  const isMountedRef = useRef(true);

  // Track mount status to prevent updates during unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const hasActiveFilters = searchQuery || Object.keys(filters).some(key => filters[key as keyof FilterType]);

  // Memoize the product count text to prevent rapid DOM updates
  const productCountText = useMemo(() => {
    return `${products.length} product${products.length !== 1 ? 's' : ''} found`;
  }, [products.length]);

  // Memoize active filter count
  const activeFilterCount = useMemo(() => {
    return Object.keys(filters).filter(key => filters[key as keyof FilterType]).length;
  }, [filters]);

  return (
    <div className="lg:col-span-3">
      {/* Products Count Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-Color-Netural-Black" key="product-count">
          {productCountText}
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-sm font-medium text-Color-Champagne-Gold hover:text-Color-Netural-Black transition-colors underline"
            aria-label="Clear all active filters"
          >
            Clear all filters ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Show fallback notice if using offline data */}
      {usingFallback && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6">
          <div className="flex items-center">
            <WifiOff className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-1">Using Offline Data</p>
              <p className="text-xs text-blue-600">
                Showing products from cached data. Live connection will restore automatically.
              </p>
            </div>
          </div>
        </div>
      )}


      {/* Loading State */}
      {loading && !error && (
        <div className="grid gap-6 mb-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridSkeleton count={6} />
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="text-center py-8 sm:py-10">
          <div className="bg-yellow-50 border border-yellow-200 p-4 sm:p-6 rounded-lg max-w-lg mx-auto">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-base sm:typography-h6 text-yellow-800 mb-2">Connection Notice</h3>
            <p className="text-sm sm:typography-body text-yellow-600 mb-4">{error}</p>
            {usingFallback && (
              <div className="bg-blue-100 p-3 rounded text-blue-800 text-xs sm:text-sm">
                <strong>Good news:</strong> Your products are still available from cached data. 
                The live connection will restore automatically.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <>

          <div
            key="products-grid"
            className={`grid gap-6 mb-10 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}
          >
            {products.map(productData => (
              <ProductCard
                key={`product-${productData.id}`}
                product={productData}
                usingFallback={usingFallback}
                onQuickView={() => onQuickView(productData)}
                activeFilters={{
                  shapes: filters.shapes,
                  metalColors: filters.metalColors
                }}
              />
            ))}
          </div>

          {hasNextPage && (
            <div className="text-center mb-12 mt-8">
              <button
                onClick={onLoadMore}
                className="inline-flex items-center px-8 py-4 bg-Color-Netural-Black text-white font-semibold rounded-lg hover:bg-Color-Champagne-Gold transition-all duration-300 shadow-md hover:shadow-lg"
                aria-label="Load more products"
              >
                Load More Products
              </button>
            </div>
          )}
        </>
      )}

      {!error && products.length === 0 && !loading && (
        <EmptyState
          searchQuery={searchQuery}
          hasFilters={hasActiveFilters}
          onClearAll={onClearAll}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for React.memo to prevent unnecessary re-renders
  return (
    prevProps.products.length === nextProps.products.length &&
    prevProps.loading === nextProps.loading &&
    prevProps.error === nextProps.error &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.searchQuery === nextProps.searchQuery &&
    JSON.stringify(prevProps.filters) === JSON.stringify(nextProps.filters)
  );
});