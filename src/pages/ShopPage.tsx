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
import { getProductMinPrice } from '../utils/filterUtils';

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

    // Filter by jewelry category
    if (filters.jewelryCategory) {
      result = result.filter(p => productMatchesCategory(p, filters.jewelryCategory));
    }

    // Filter by ring style
    if (filters.ringStyle) {
      result = result.filter(p =>
        p.tags?.some(tag =>
          tag.toLowerCase().includes('style:') &&
          tag.toLowerCase().includes(filters.ringStyle!.toLowerCase())
        )
      );
    }

    // Filter by shapes
    if (filters.shapes?.length) {
      result = result.filter(p => filters.shapes.some((s: string) => productMatchesShape(p, s)));
    }

    // Filter by metal colors
    if (filters.metalColors?.length) {
      result = result.filter(p =>
        p.tags?.some(tag =>
          (tag.toLowerCase().includes('metal:') || tag.toLowerCase().includes('color:')) &&
          filters.metalColors!.some(color => tag.toLowerCase().includes(color.toLowerCase()))
        )
      );
    }

    // Filter by stone type
    if (filters.stoneType) {
      result = result.filter(p =>
        p.tags?.some(tag =>
          tag.toLowerCase().includes('stone:') &&
          tag.toLowerCase().includes(filters.stoneType!.toLowerCase())
        )
      );
    }

    // Filter by diamond origin (only if stone type is Diamond)
    if (filters.diamondOrigin) {
      result = result.filter(p =>
        p.tags?.some(tag =>
          tag.toLowerCase().includes('origin:') &&
          tag.toLowerCase().includes(filters.diamondOrigin!.toLowerCase())
        )
      );
    }

    // Filter by gemstone variant (only if stone type is Gemstone)
    if (filters.gemstoneVariant) {
      result = result.filter(p =>
        p.tags?.some(tag =>
          tag.toLowerCase().includes('gemstone:') &&
          tag.toLowerCase().includes(filters.gemstoneVariant!.toLowerCase())
        )
      );
    }

    // Filter by carat weights
    if (filters.caratWeights?.length) {
      result = result.filter(p =>
        p.tags?.some(tag => {
          if (!tag.toLowerCase().includes('carat:')) return false;
          const caratValue = tag.split(':')[1]?.trim();
          return filters.caratWeights!.some(weight => {
            // Match against the weight label (e.g., "0.50 ct", "1.00 ct")
            return caratValue && caratValue.toLowerCase().includes(weight.label.toLowerCase());
          });
        })
      );
    }

    // Filter by clarity grades
    if (filters.clarityGrades?.length) {
      result = result.filter(p =>
        p.tags?.some(tag => {
          if (!tag.toLowerCase().includes('clarity:')) return false;
          const clarity = tag.split(':')[1]?.trim().toUpperCase();
          return filters.clarityGrades!.some(grade => clarity === grade);
        })
      );
    }

    // Filter by certifications
    if (filters.certifications?.length) {
      result = result.filter(p =>
        p.tags?.some(tag => {
          if (!tag.toLowerCase().includes('certification:') && !tag.toLowerCase().includes('cert:')) return false;
          const cert = tag.split(':')[1]?.trim().toUpperCase();
          return filters.certifications!.some(c => cert === c);
        })
      );
    }

    // Filter by earring type
    if (filters.earringType) {
      result = result.filter(p =>
        p.tags?.some(tag =>
          tag.toLowerCase().includes('earring-type:') &&
          tag.toLowerCase().includes(filters.earringType!.toLowerCase())
        )
      );
    }

    // Filter by earring backing
    if (filters.earringBacking) {
      result = result.filter(p =>
        p.tags?.some(tag =>
          tag.toLowerCase().includes('backing:') &&
          tag.toLowerCase().includes(filters.earringBacking!.toLowerCase())
        )
      );
    }

    // Filter by chain length
    if (filters.chainLength) {
      result = result.filter(p =>
        p.tags?.some(tag =>
          (tag.toLowerCase().includes('chain:') || tag.toLowerCase().includes('length:')) &&
          tag.toLowerCase().includes(filters.chainLength!.toLowerCase())
        )
      );
    }

    // Filter by ring sizes
    if (filters.ringSizes?.length) {
      result = result.filter(p =>
        p.tags?.some(tag => {
          if (!tag.toLowerCase().includes('size:')) return false;
          const size = tag.split(':')[1]?.trim();
          return filters.ringSizes!.includes(size);
        })
      );
    }

    // Filter by in stock
    if (filters.inStockOnly) {
      result = result.filter(p => p.totalInventory > 0);
    }

    // Apply price filtering using consistent price extraction
    if (filters.minPrice !== undefined) {
      result = result.filter(p => {
        const price = getProductMinPrice(p);
        return price >= filters.minPrice!;
      });
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter(p => {
        const price = getProductMinPrice(p);
        return price <= filters.maxPrice!;
      });
    }

    return result;
  }, [shopifyProducts, filters]);

  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];

    switch (sortBy) {
      case 'price-low':
        return products.sort((a, b) => getProductMinPrice(a) - getProductMinPrice(b));
      case 'price-high':
        return products.sort((a, b) => getProductMinPrice(b) - getProductMinPrice(a));
      case 'name':
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'featured':
      default:
        return products;
    }
  }, [filteredProducts, sortBy]);

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
        totalResults={sortedProducts.length}
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
              />
            </aside>

            <ShopProductGrid
              products={sortedProducts}
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
