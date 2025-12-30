/**
 * src/pages/ShopPage.tsx
 * The Orchestration Hub for Diamonds By CS Storefront
 * ADDED: URL sync for shareable filter links with proper loop prevention
 */
import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductCard } from '../components/ProductCard';
import { useFilterManager } from '../hooks/useFilterManager';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';
import { filtersToSearchParams, searchParamsToFilters, areFiltersEqual } from '../lib/shop/filterSerializer';
import { ProductFilters } from '../config/filterConfig';

const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Track sync state to prevent infinite loops
  const isSyncingFromURL = useRef(false);
  const isSyncingToURL = useRef(false);
  const lastUrlFilters = useRef<ProductFilters>({});

  // 1. Fetch live products from Shopify Storefront API
  const { products, loading: isLoading, error } = useShopifyProducts();

  // 2. Initialize our Robust Filtering System
  const {
    filters,
    searchQuery,
    setSearchQuery,
    updateFilter,
    clearFilters: clearFiltersInternal,
    filteredProducts,
    getActiveVariant,
    isSizeVisible
  } = useFilterManager(products || []);

  // Debug: Log products and filters in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('ShopPage - Products loaded:', products?.length || 0);
      console.log('ShopPage - Filtered products:', filteredProducts?.length || 0);
      console.log('ShopPage - Active filters:', filters);
    }
  }, [products, filteredProducts, filters]);

  // 3. Initialize filters from URL on mount
  useEffect(() => {
    if (isSyncingToURL.current) return;

    isSyncingFromURL.current = true;
    const { filters: urlFilters, searchQuery: urlSearch } = searchParamsToFilters(searchParams);

    // Only update if URL has filters
    if (Object.keys(urlFilters).length > 0 || urlSearch) {
      Object.entries(urlFilters).forEach(([key, value]) => {
        updateFilter(key as keyof ProductFilters, value);
      });
      if (urlSearch) setSearchQuery(urlSearch);
      lastUrlFilters.current = urlFilters;
    }

    // Reset sync flag after a tick
    setTimeout(() => {
      isSyncingFromURL.current = false;
    }, 0);
  }, []); // Only run on mount

  // 4. Sync filters to URL when they change
  useEffect(() => {
    // Don't sync if we're currently syncing from URL
    if (isSyncingFromURL.current) return;

    // Check if filters actually changed
    if (areFiltersEqual(filters, lastUrlFilters.current)) return;

    isSyncingToURL.current = true;
    lastUrlFilters.current = filters;

    const newParams = filtersToSearchParams(filters, searchQuery);
    setSearchParams(newParams, { replace: true });

    // Reset sync flag
    setTimeout(() => {
      isSyncingToURL.current = false;
    }, 0);
  }, [filters, searchQuery, setSearchParams]);

  // Enhanced clear filters that also clears URL
  const clearFilters = () => {
    clearFiltersInternal();
    setSearchParams({}, { replace: true });
    lastUrlFilters.current = {};
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Error loading catalog. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-grow">
        {/* Shop Header Section */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-serif text-gray-900">Our Collection</h1>
            <p className="mt-2 text-sm text-gray-600">
              Handcrafted in Antwerp. {filteredProducts.length} Results
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left: Refactored Sidebar with Dynamic Counts */}
            <FilterSidebar
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              allProducts={products || []}
            />

            {/* Right: Product Catalog */}
            <div className="flex-grow lg:pl-8">
              {isLoading ? (
                /* Skeleton Loader while products fetch */
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                  {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              ) : filteredProducts.length > 0 ? (
                /* The Final Filtered Grid */
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      filters={filters}
                      getActiveVariant={getActiveVariant}
                    />
                  ))}
                </div>
              ) : (
                /* Empty State: Clear Filters */
                <div className="flex flex-col items-center justify-center py-24">
                  <p className="text-lg text-gray-500">No products match your selection.</p>
                  <button 
                    onClick={clearFilters}
                    className="mt-4 text-sm font-medium text-black underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopPage;
export { ShopPage };