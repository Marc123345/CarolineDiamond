import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { ShopFilters } from '../components/shop/ShopFilters';
import { ShopProductGrid } from '../components/shop/ShopProductGrid';
import { ShopCTA } from '../components/shop/ShopCTA';
import { ProductQuickView } from '../components/ProductQuickView';
import { SearchModal } from '../components/SearchModal';
import { ActiveFilterChips } from '../components/ActiveFilterChips';
import { CustomSizeRequestModal } from '../components/shop/CustomSizeRequestModal';
import { AdvancedProductFilters } from '../components/shop/AdvancedProductFilters';
import { ProductFilters as FilterType, buildShopifyQuery, CARAT_WEIGHTS } from '../config/filterConfig';
import { ProcessedProduct } from '../types/shopify';
import { useFilterManager } from '../hooks/useFilterManager';
import { productMatchesMetalColor } from '../utils/metalColorUtils';
import { productMatchesCaratWeight, productMatchesClarityGrade, productMatchesCertification } from '../utils/diamondFilterUtils';
import { productMatchesShape, getCanonicalShape } from '../utils/shapeUtils';
import { productMatchesCategory } from '../utils/categoryHelpers';

interface ShopPageProps {
  onNavigate: (page: string) => void;
  initialCategory?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onNavigate, initialCategory }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hasURLParams = searchParams.has('shape') || searchParams.has('category') ||
                        searchParams.has('metal') || searchParams.has('style') ||
                        searchParams.has('stone') || searchParams.has('search');

  const filterManager = useFilterManager({}, {
    enableLocalStorage: !hasURLParams,
    enableAnalytics: true,
    enableCaching: true,
    debounceMs: 300,
  });

  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProcessedProduct | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isCustomSizeModalOpen, setIsCustomSizeModalOpen] = useState(false);
  const isUpdatingFromURL = React.useRef(false);

  // Initialize filters and search from URL params and initialCategory
  useEffect(() => {
    isUpdatingFromURL.current = true;

    const category = searchParams.get('category');
    const shape = searchParams.get('shape');
    const search = searchParams.get('search');
    const metal = searchParams.get('metal');
    const style = searchParams.get('style');
    const stone = searchParams.get('stone');
    const carat = searchParams.get('carat');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');

    const newFilters: FilterType = {};

    // CATEGORY NORMALIZATION: Map "necklace" to "Necklaces", "ring" to "Rings"
    const categoryToUse = (category || initialCategory)?.toLowerCase();
    if (categoryToUse) {
      if (categoryToUse.includes('ring')) newFilters.jewelryCategory = 'Rings';
      else if (categoryToUse.includes('earring')) newFilters.jewelryCategory = 'Earrings';
      else if (categoryToUse.includes('necklace')) newFilters.jewelryCategory = 'Necklaces';
    }

    if (shape) {
      const categoryValue = newFilters.jewelryCategory;
      if (!categoryValue || categoryValue === 'Rings') {
        const canonicalShape = getCanonicalShape(shape);
        newFilters.shapes = [canonicalShape];
      }
    }

    if (metal) {
      newFilters.metalColors = metal.split(',').map(m =>
        m.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      );
    }

    if (style) {
      newFilters.ringStyle = style.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }

    if (stone) {
      newFilters.stoneType = stone.charAt(0).toUpperCase() + stone.slice(1);
    }

    if (carat) {
      const caratLabels = carat.split(',');
      const caratWeights = caratLabels.map(label => {
        return CARAT_WEIGHTS.find(w => w.label === label);
      }).filter(Boolean);
      if (caratWeights.length > 0) {
        newFilters.caratWeights = caratWeights as any;
      }
    }

    if (minPrice) newFilters.minPrice = parseFloat(minPrice);
    if (maxPrice) newFilters.maxPrice = parseFloat(maxPrice);
    if (inStock === 'true') newFilters.inStockOnly = true;

    if (search) filterManager.setSearchQuery(decodeURIComponent(search));
    if (Object.keys(newFilters).length > 0) filterManager.setFilters(newFilters);

    setTimeout(() => { isUpdatingFromURL.current = false; }, 100);
  }, [searchParams, initialCategory]);

  // Mobile resize detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const shopifyQueryString = buildShopifyQuery({ ...filterManager.filters, searchText: filterManager.searchQuery });

  const getShopifySortKey = () => {
    switch (sortBy) {
      case 'price-low': return { sortKey: 'PRICE', reverse: false };
      case 'price-high': return { sortKey: 'PRICE', reverse: true };
      case 'name': return { sortKey: 'TITLE', reverse: false };
      case 'created': return { sortKey: 'CREATED_AT', reverse: true };
      case 'best-selling': return { sortKey: 'BEST_SELLING', reverse: false };
      default: return { sortKey: 'RELEVANCE', reverse: false };
    }
  };

  const { sortKey, reverse } = getShopifySortKey();

  // Fetch products
  const { products: allProducts, loading: allProductsLoading } = useShopifyProducts('', 'RELEVANCE', false, 250);
  const { 
    products: shopifyProducts, 
    loading: productsLoading, 
    error: productsError, 
    usingFallback, 
    hasNextPage, 
    loadMore 
  } = useShopifyProducts(shopifyQueryString || undefined, sortKey, reverse);

  // CLIENT-SIDE FILTERING (Handles CSV inconsistencies)
  const filteredProducts = useMemo(() => {
    let result = shopifyProducts;

    // 1. Category Filter (Handles "Engagement Ring" vs "Rings")
    if (filterManager.filters.jewelryCategory) {
      const category = filterManager.filters.jewelryCategory;
      result = result.filter(product => {
        const type = product.type?.toLowerCase() || '';
        if (category === 'Rings') return type.includes('ring');
        if (category === 'Earrings') return type.includes('earring');
        if (category === 'Necklaces') return type.includes('necklace');
        return productMatchesCategory(product, category);
      });
    }

    // 2. Shape Filter (Handles tag substrings like "pear-diamond")
    if (filterManager.filters.shapes && filterManager.filters.shapes.length > 0) {
      result = result.filter(product => {
        return filterManager.filters.shapes!.some(shape => {
          const hasTag = product.tags?.some(tag => tag.toLowerCase().includes(shape.toLowerCase()));
          return hasTag || productMatchesShape(product, shape);
        });
      });
    }

    // 3. Metal Color Filter (Handles "Yellow Gold" option vs "18k-gold" tag)
    if (filterManager.filters.metalColors && filterManager.filters.metalColors.length > 0) {
      result = result.filter(product => {
        return filterManager.filters.metalColors!.some(color => {
          const matchesOption = product.variants.some(v => 
            Object.values(v.selectedOptions || {}).some(opt => opt === color)
          );
          return matchesOption || productMatchesMetalColor(product, color);
        });
      });
    }

    // 4. Carat Weight Filter (Handles "0.50c" vs "0.50ct" vs "Lab-Grown 0.50ct")
    if (filterManager.filters.caratWeights && filterManager.filters.caratWeights.length > 0) {
      result = result.filter(product => {
        const matchesUtility = filterManager.filters.caratWeights!.some(weight =>
          productMatchesCaratWeight(product, weight)
        );
        if (matchesUtility) return true;

        // Fallback for CSV string variations
        return product.variants.some(variant => {
          const variantText = [variant.title, ...Object.values(variant.selectedOptions || {})].join(' ').toLowerCase();
          return filterManager.filters.caratWeights!.some(w => {
            const cleanLabel = w.label.toLowerCase().replace('ct', '').replace('c', '').trim();
            return variantText.includes(cleanLabel) && (variantText.includes('ct') || variantText.includes('carat'));
          });
        });
      });
    }

    // 5. In Stock Filter
    if (filterManager.filters.inStockOnly) {
      result = result.filter(product => product.variants.some(v => v.availableForSale && (v.quantityAvailable ?? 0) > 0));
    }

    return result;
  }, [shopifyProducts, filterManager.filters]);

  const handleSearch = (query: string) => {
    filterManager.setSearchQuery(query);
    setIsSearchOpen(false);
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/shop');
    }
  };

  const handleRemoveFilter = (key: keyof FilterType, value?: any) => {
    if (value !== undefined) filterManager.setFilters({ [key]: value });
    else filterManager.removeFilter(key);
  };

  // Sync filters to URL
  useEffect(() => {
    if (isUpdatingFromURL.current) return;
    const params = new URLSearchParams();
    if (filterManager.filters.jewelryCategory) params.set('category', filterManager.filters.jewelryCategory.toLowerCase());
    if (filterManager.filters.shapes?.length) params.set('shape', filterManager.filters.shapes.join(',').toLowerCase());
    if (filterManager.filters.metalColors?.length) params.set('metal', filterManager.filters.metalColors.join(',').toLowerCase().replace(/\s+/g, '-'));
    if (filterManager.searchQuery) params.set('search', encodeURIComponent(filterManager.searchQuery));
    
    const newSearch = params.toString();
    if (newSearch !== window.location.search.substring(1)) {
      navigate(`/shop${newSearch ? `?${newSearch}` : ''}`, { replace: true });
    }
  }, [filterManager.filters, filterManager.searchQuery, navigate]);

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
        products={shopifyProducts}
        totalResults={filteredProducts.length}
      />

      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <Breadcrumbs
            items={[{ label: 'Home', onClick: () => onNavigate('/') }, { label: 'Shop All Jewelry' }]}
            onNavigate={onNavigate}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            <div className="hidden lg:block">
              {!allProductsLoading && (
                <AdvancedProductFilters
                  filters={filterManager.filters}
                  onFiltersChange={filterManager.setFilters}
                  products={allProducts}
                  isLoading={productsLoading || filterManager.isLoading}
                />
              )}
            </div>

            <div className="lg:col-span-3">
              <ActiveFilterChips
                filters={filterManager.filters}
                searchQuery={filterManager.searchQuery}
                onRemoveFilter={handleRemoveFilter}
                onClearSearch={() => { filterManager.setSearchQuery(''); navigate('/shop'); }}
                onClearAll={() => { filterManager.clearFilters(); navigate('/shop'); }}
              />

              <ShopProductGrid
                products={filteredProducts}
                loading={productsLoading || filterManager.isLoading}
                error={productsError}
                usingFallback={usingFallback}
                hasNextPage={hasNextPage}
                onLoadMore={loadMore}
                viewMode={viewMode}
                filters={filterManager.filters}
                searchQuery={filterManager.searchQuery}
                onFiltersChange={filterManager.setFilters}
                onClearAll={() => { filterManager.clearFilters(); navigate('/shop'); }}
                onQuickView={setQuickViewProduct}
                onNavigate={onNavigate}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      </section>

      <ShopCTA onNavigate={onNavigate} />

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            <AdvancedProductFilters
              filters={filterManager.filters}
              onFiltersChange={filterManager.setFilters}
              onClose={() => setIsFilterOpen(false)}
              isMobile={true}
              products={allProducts}
              isLoading={productsLoading}
            />
          </div>
        </div>
      )}

      <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSearch={handleSearch} products={allProducts} />
      <CustomSizeRequestModal
        isOpen={isCustomSizeModalOpen}
        onClose={() => setIsCustomSizeModalOpen(false)}
        prefilledData={{
          metal_color: filterManager.filters.metalColors?.[0],
          ring_style: filterManager.filters.ringStyle,
          shape: filterManager.filters.shapes?.[0],
        }}
      />
    </div>
  );
};