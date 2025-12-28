import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { ShopFilters } from '../components/shop/ShopFilters';
import { ShopProductGrid } from '../components/shop/ShopProductGrid';
import { ShopCTA } from '../components/shop/ShopCTA';
import { ProductQuickView } from '../components/ProductQuickView';
import { AdvancedProductFilters } from '../components/shop/AdvancedProductFilters';
import { SearchModal } from '../components/SearchModal';
import { ActiveFilterChips } from '../components/ActiveFilterChips';
import { CustomSizeRequestModal } from '../components/shop/CustomSizeRequestModal';
import { buildShopifyQuery } from '../config/filterConfig';
import type { ProcessedProduct } from '../types/shopify';
import { useShopFilters } from '../hooks/useShopFilters';
import { useFilterSync } from '../hooks/useFilterSync';
import { filterProducts } from '../lib/shop/productFiltering';
import { useIsMobile } from '../hooks/useIsMobile';

interface ShopPageProps {
  onNavigate: (page: string) => void;
  initialCategory?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onNavigate, initialCategory }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Core filter state
  const shopFilters = useShopFilters(
    initialCategory ? { jewelryCategory: initialCategory as any } : {}
  );

  // Sync filters with URL
  useFilterSync(shopFilters.filters, shopFilters.searchQuery, {
    onFiltersChange: (filters, search) => {
      shopFilters.setFilters(filters);
      shopFilters.setSearchQuery(search);
    },
    enabled: true,
  });

  // UI state
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProcessedProduct | null>(null);
  const [isCustomSizeModalOpen, setIsCustomSizeModalOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load recent searches', e);
      }
    }
  }, []);

  // Build Shopify query from filters
  const shopifyQueryString = useMemo(
    () => buildShopifyQuery({ ...shopFilters.filters, searchText: shopFilters.searchQuery }),
    [shopFilters.filters, shopFilters.searchQuery]
  );

  // Convert sortBy to Shopify format
  const { sortKey, reverse } = useMemo(() => {
    switch (sortBy) {
      case 'price-low':
        return { sortKey: 'PRICE', reverse: false };
      case 'price-high':
        return { sortKey: 'PRICE', reverse: true };
      case 'name':
        return { sortKey: 'TITLE', reverse: false };
      case 'created':
        return { sortKey: 'CREATED_AT', reverse: true };
      case 'best-selling':
        return { sortKey: 'BEST_SELLING', reverse: false };
      case 'featured':
      default:
        return { sortKey: 'RELEVANCE', reverse: false };
    }
  }, [sortBy]);

  // Fetch all products for filter counting (unfiltered)
  const { products: allProducts, loading: allProductsLoading } = useShopifyProducts(
    '',
    'RELEVANCE',
    false,
    100
  );

  // Fetch filtered products for display
  const {
    products: shopifyProducts,
    loading: productsLoading,
    error: productsError,
    usingFallback,
    hasNextPage,
    loadMore,
  } = useShopifyProducts(shopifyQueryString || undefined, sortKey, reverse);

  // Apply client-side price filtering
  const displayedProducts = useMemo(
    () => filterProducts(shopifyProducts, shopFilters.filters),
    [shopifyProducts, shopFilters.filters]
  );

  // Event handlers
  const handleSearch = (query: string) => {
    shopFilters.setSearchQuery(query);
    setIsSearchOpen(false);

    if (query.trim()) {
      const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
      setRecentSearches(updated);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
      navigate(`/shop?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/shop');
    }
  };

  const handleRemoveFilter = (key: keyof typeof shopFilters.filters, value?: any) => {
    if (value !== undefined) {
      shopFilters.updateFilter(key, value);
    } else {
      shopFilters.removeFilter(key);
    }
  };

  const handleClearAll = () => {
    shopFilters.clearAll();
    navigate('/shop');
  };

  return (
    <div className="min-h-screen bg-white">
      <ShopFilters
        onNavigate={onNavigate}
        searchQuery={shopFilters.searchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onFiltersOpen={() => setIsFilterOpen(true)}
        onSearchOpen={() => setIsSearchOpen(true)}
        products={shopifyProducts}
        totalResults={displayedProducts.length}
      />

      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <Breadcrumbs
            items={[
              { label: 'Home', onClick: () => onNavigate('/') },
              { label: 'Shop All Jewelry' },
            ]}
            onNavigate={onNavigate}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              {!allProductsLoading && allProducts.length > 0 ? (
                <AdvancedProductFilters
                  filters={shopFilters.filters}
                  onFiltersChange={shopFilters.setFilters}
                  products={displayedProducts}
                  isLoading={productsLoading}
                />
              ) : (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              )}
            </div>

            <div className="lg:col-span-3">
              <ActiveFilterChips
                filters={shopFilters.filters}
                searchQuery={shopFilters.searchQuery}
                onRemoveFilter={handleRemoveFilter}
                onClearSearch={() => {
                  shopFilters.setSearchQuery('');
                  navigate('/shop');
                }}
                onClearAll={handleClearAll}
              />

              <ShopProductGrid
                products={displayedProducts}
                loading={productsLoading}
                error={productsError}
                usingFallback={usingFallback}
                hasNextPage={hasNextPage}
                onLoadMore={loadMore}
                viewMode={viewMode}
                filters={shopFilters.filters}
                searchQuery={shopFilters.searchQuery}
                onFiltersChange={shopFilters.setFilters}
                onClearAll={handleClearAll}
                onQuickView={setQuickViewProduct}
                onNavigate={onNavigate}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      </section>

      <ShopCTA onNavigate={onNavigate} />

      {/* Mobile Filter Sidebar */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsFilterOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            {!allProductsLoading && allProducts.length > 0 ? (
              <AdvancedProductFilters
                filters={shopFilters.filters}
                onFiltersChange={shopFilters.setFilters}
                onClose={() => setIsFilterOpen(false)}
                isMobile={true}
                products={displayedProducts}
                isLoading={productsLoading}
              />
            ) : (
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
        products={allProducts}
      />

      <CustomSizeRequestModal
        isOpen={isCustomSizeModalOpen}
        onClose={() => setIsCustomSizeModalOpen(false)}
        prefilledData={{
          metal_color: shopFilters.filters.metalColors?.[0],
          ring_style: shopFilters.filters.ringStyle,
          shape: shopFilters.filters.shapes?.[0],
        }}
      />
    </div>
  );
};
