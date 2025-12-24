import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { ProductFilters as FilterType, buildShopifyQuery, CARAT_WEIGHTS } from '../config/filterConfig';
import { ProcessedProduct } from '../types/shopify';
import { useFilterManager } from '../hooks/useFilterManager';
import { productMatchesMetalColor } from '../utils/metalColorUtils';
import { productMatchesCaratWeight } from '../utils/diamondFilterUtils';
import { productMatchesShape, getCanonicalShape } from '../utils/shapeUtils';
import { productMatchesCategory } from '../utils/categoryHelpers';
import { useTranslate } from '../hooks/useTranslate';

interface ShopPageProps {
  onNavigate: (page: string) => void;
  initialCategory?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onNavigate, initialCategory }) => {
  const navigate = useNavigate();
  const t = useTranslate();
  const [searchParams] = useSearchParams();

  // 1. Intelligent Filter Initialization
  const hasURLParams = searchParams.toString().length > 0;
  const filterManager = useFilterManager({}, {
    enableLocalStorage: !hasURLParams, 
    debounceMs: 300,
  });

  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProcessedProduct | null>(null);
  const [isCustomSizeModalOpen, setIsCustomSizeModalOpen] = useState(false);

  // 2. Sync URL Parameters to Filter State
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const newFilters: FilterType = {};

    const categoryToUse = category || initialCategory;
    if (categoryToUse) {
      const cap = categoryToUse.charAt(0).toUpperCase() + categoryToUse.slice(1);
      if (['Earrings', 'Necklaces', 'Rings'].includes(cap)) {
        newFilters.jewelryCategory = cap as any;
      }
    }

    if (search) filterManager.setSearchQuery(decodeURIComponent(search));
    if (Object.keys(newFilters).length > 0) filterManager.setFilters(newFilters);
  }, [searchParams, initialCategory]);

  // 3. Shopify Data Integration
  const shopifyQueryString = buildShopifyQuery({ 
    ...filterManager.filters, 
    searchText: filterManager.searchQuery 
  });

  const { products: allProducts, loading: allProductsLoading } = useShopifyProducts('', 'RELEVANCE', false, 100);
  const { 
    products: shopifyProducts, 
    loading: productsLoading, 
    error: productsError, 
    hasNextPage, 
    loadMore 
  } = useShopifyProducts(shopifyQueryString || undefined, 'RELEVANCE', false);

  // 4. Enhanced Client-Side Filtering (The Unified Logic)
  const filteredProducts = useMemo(() => {
    let result = shopifyProducts;

    if (filterManager.filters.jewelryCategory) {
      result = result.filter(p => productMatchesCategory(p, filterManager.filters.jewelryCategory!));
    }

    if (filterManager.filters.shapes?.length) {
      result = result.filter(p => filterManager.filters.shapes!.some(s => productMatchesShape(p, s)));
    }

    if (filterManager.filters.metalColors?.length) {
      result = result.filter(p => filterManager.filters.metalColors!.some(c => productMatchesMetalColor(p, c)));
    }

    return result;
  }, [shopifyProducts, filterManager.filters]);

  // 5. Breadcrumb Logic
  const breadcrumbItems = useMemo(() => {
    const items = [{ label: t('Home'), onClick: () => onNavigate('/') }];
    if (filterManager.filters.jewelryCategory) {
      items.push({ label: t(filterManager.filters.jewelryCategory) });
    } else {
      items.push({ label: t('Shop All Jewelry') });
    }
    return items;
  }, [filterManager.filters.jewelryCategory, t]);

  return (
    <div className="min-h-screen bg-white">
      <ShopFilters
        onNavigate={onNavigate}
        searchQuery={filterManager.searchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onFiltersOpen={() => setIsFilterOpen(true)}
        onSearchOpen={() => setIsSearchOpen(true)}
        totalResults={filteredProducts.length}
      />

      <section className="py-8 lg:py-12">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-16">
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbItems} onNavigate={onNavigate} />
          </div>

          <div className="lg:grid lg:grid-cols-4 lg:gap-12">
            {/* Sidebar Filters */}
            <aside className="hidden lg:block sticky top-32 h-fit">
              {!allProductsLoading ? (
                <AdvancedProductFilters
                  filters={filterManager.filters}
                  onFiltersChange={filterManager.setFilters}
                  products={allProducts}
                  isLoading={productsLoading}
                />
              ) : (
                <div className="space-y-4 animate-pulse">
                  <div className="h-10 bg-gray-50 rounded-xl" />
                  <div className="h-40 bg-gray-50 rounded-xl" />
                </div>
              )}
            </aside>

            {/* Product Grid Area */}
            <div className="lg:col-span-3">
              <ActiveFilterChips
                filters={filterManager.filters}
                searchQuery={filterManager.searchQuery}
                onRemoveFilter={(key) => filterManager.removeFilter(key)}
                onClearAll={() => filterManager.clearFilters()}
              />

              <ShopProductGrid
                products={filteredProducts}
                loading={productsLoading}
                error={productsError}
                viewMode={viewMode}
                onQuickView={setQuickViewProduct}
                onNavigate={onNavigate}
              />
              
              {hasNextPage && (
                <div className="mt-12 flex justify-center">
                  <button 
                    onClick={loadMore}
                    className="px-12 py-4 border-2 border-gray-100 rounded-full text-xs font-bold uppercase tracking-widest hover:border-[#CDBCAB] transition-all"
                  >
                    {t('Load More Pieces')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ShopCTA onNavigate={onNavigate} />

      {/* Modals & Slide-outs */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl animate-slide-left">
            <AdvancedProductFilters
              filters={filterManager.filters}
              onFiltersChange={filterManager.setFilters}
              onClose={() => setIsFilterOpen(false)}
              isMobile={true}
              products={allProducts}
            />
          </div>
        </div>
      )}

      <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSearch={filterManager.setSearchQuery} />
      <CustomSizeRequestModal 
        isOpen={isCustomSizeModalOpen} 
        onClose={() => setIsCustomSizeModalOpen(false)} 
        prefilledData={{ category: filterManager.filters.jewelryCategory }}
      />
    </div>
  );
};