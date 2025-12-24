import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { ShopFilters } from '../components/shop/ShopFilters';
import { ShopProductGrid } from '../components/shop/ShopProductGrid';
import { ShopCTA } from '../components/shop/ShopCTA';
import { ProductQuickView } from '../components/ProductQuickView';
import { ProductFilters } from '../components/shop/ProductFilters';
import { ProcessedProduct } from '../types/shopify';
import { productMatchesShape } from '../utils/shapeUtils';
import { productMatchesCategory } from '../utils/categoryHelpers';

interface ShopPageProps {
  onNavigate: (page: string) => void;
  initialCategory?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onNavigate, initialCategory }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState<any>({});
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProcessedProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const category = searchParams.get('category');
    const newFilters: any = {};

    const categoryToUse = category || initialCategory;
    if (categoryToUse) {
      const cap = categoryToUse.charAt(0).toUpperCase() + categoryToUse.slice(1);
      if (['Earrings', 'Necklaces', 'Rings'].includes(cap)) {
        newFilters.jewelryCategory = cap;
      }
    }

    if (Object.keys(newFilters).length > 0) setFilters(newFilters);
  }, [searchParams, initialCategory]);

  const {
    products: shopifyProducts,
    loading: productsLoading,
    error: productsError,
    hasNextPage,
    loadMore
  } = useShopifyProducts(undefined, 'RELEVANCE', false);

  const filteredProducts = useMemo(() => {
    let result = shopifyProducts;

    if (filters.jewelryCategory) {
      result = result.filter(p => productMatchesCategory(p, filters.jewelryCategory));
    }

    if (filters.shapes?.length) {
      result = result.filter(p => filters.shapes.some((s: string) => productMatchesShape(p, s)));
    }

    return result;
  }, [shopifyProducts, filters]);

  const breadcrumbItems = useMemo(() => {
    const items = [{ label: 'Home', onClick: () => onNavigate('/') }];
    if (filters.jewelryCategory) {
      items.push({ label: filters.jewelryCategory });
    } else {
      items.push({ label: 'Shop All Jewelry' });
    }
    return items;
  }, [filters.jewelryCategory]);

  const handleClearAll = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-white">
      <ShopFilters
        onNavigate={onNavigate}
        searchQuery={searchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onFiltersOpen={() => setIsFilterOpen(true)}
        onSearchOpen={() => {}}
        totalResults={filteredProducts.length}
      />

      <section className="py-8 lg:py-12">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-16">
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbItems} onNavigate={onNavigate} />
          </div>

          <div className="lg:grid lg:grid-cols-4 lg:gap-12">
            <aside className="hidden lg:block sticky top-32 h-fit">
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                products={shopifyProducts}
                isLoading={productsLoading}
              />
            </aside>

            <ShopProductGrid
              products={filteredProducts}
              loading={productsLoading}
              error={productsError}
              viewMode={viewMode}
              filters={filters}
              searchQuery={searchQuery}
              onFiltersChange={setFilters}
              onClearAll={handleClearAll}
              onQuickView={setQuickViewProduct}
              onNavigate={onNavigate}
              hasNextPage={hasNextPage}
              onLoadMore={loadMore}
            />
          </div>
        </div>
      </section>

      <ShopCTA onNavigate={onNavigate} />

      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl animate-slide-left">
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClose={() => setIsFilterOpen(false)}
              isMobile={true}
              products={shopifyProducts}
            />
          </div>
        </div>
      )}

      <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
};
