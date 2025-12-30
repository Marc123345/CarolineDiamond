import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { ShopFilters } from '../components/shop/ShopFilters';
import { ShopProductGrid } from '../components/shop/ShopProductGrid';
import { ShopCTA } from '../components/shop/ShopCTA';
import { ProductQuickView } from '../components/ProductQuickView';
import { HierarchicalProductFilters } from '../components/shop/HierarchicalProductFilters';
import { AdvancedProductFilters } from '../components/shop/AdvancedProductFilters';
import { SearchModal } from '../components/SearchModal';
import { ActiveFilterChips } from '../components/ActiveFilterChips';
import { CustomSizeRequestModal } from '../components/shop/CustomSizeRequestModal';
import { ProductFilters as FilterType, buildShopifyQuery, CARAT_WEIGHTS } from '../config/filterConfig';
import { ProcessedProduct } from '../types/shopify';
import { useFilterManager } from '../hooks/useFilterManager';
import { productMatchesMetalColor } from '../utils/metalColorUtils';
import { productMatchesCaratWeight, productMatchesClarityGrade, productMatchesCertification } from '../utils/diamondFilterUtils';
import { productMatchesShape, getCanonicalShape } from '../utils/shapeUtils';
import { productMatchesCategory } from '../utils/categoryHelpers';
import { productHasMetalColor, productHasCaratWeight } from '../utils/variantFilterUtils';

interface ShopPageProps {
  onNavigate: (page: string) => void;
  initialCategory?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onNavigate, initialCategory }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if URL has filter params - if so, don't load from localStorage
  const hasURLParams = searchParams.has('shape') || searchParams.has('category') ||
                        searchParams.has('metal') || searchParams.has('style') ||
                        searchParams.has('stone') || searchParams.has('search');

  const filterManager = useFilterManager({}, {
    enableLocalStorage: !hasURLParams, // Disable localStorage if URL has params
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

    // Handle category from URL or initialCategory prop
    const categoryToUse = category || initialCategory;
    if (categoryToUse) {
      const lowerCategory = categoryToUse.toLowerCase();

      // Normalize category names to match JewelryCategory types
      if (lowerCategory === 'earrings' || lowerCategory === 'earring') {
        newFilters.jewelryCategory = 'Earrings';
      } else if (lowerCategory === 'necklaces' || lowerCategory === 'necklace') {
        newFilters.jewelryCategory = 'Necklace';
      } else if (lowerCategory === 'rings' || lowerCategory === 'ring' ||
                 lowerCategory === 'engagement rings' || lowerCategory === 'engagement ring') {
        newFilters.jewelryCategory = 'Engagement Ring';
      }
    }

    // Only apply shape filter if not Necklaces or Earrings
    if (shape) {
      const categoryValue = newFilters.jewelryCategory;
      if (!categoryValue || categoryValue === 'Engagement Ring') {
        const canonicalShape = getCanonicalShape(shape);
        newFilters.shapes = [canonicalShape];
      }
    }

    if (style) {
      newFilters.ringStyle = style.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }

    if (stone) {
      newFilters.stoneType = stone.charAt(0).toUpperCase() + stone.slice(1);
    }

    if (minPrice) {
      newFilters.minPrice = parseFloat(minPrice);
    }

    if (maxPrice) {
      newFilters.maxPrice = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      newFilters.inStockOnly = true;
    }

    if (search) {
      filterManager.setSearchQuery(decodeURIComponent(search));
    }

    if (Object.keys(newFilters).length > 0) {
      filterManager.setFilters(newFilters);
    }

    setTimeout(() => {
      isUpdatingFromURL.current = false;
    }, 100);
  }, [searchParams, initialCategory]);

  // Detect mobile screen size with debouncing for better performance
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    let timeoutId: NodeJS.Timeout;
    const debouncedCheckMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };
    
    window.addEventListener('resize', debouncedCheckMobile);
    return () => {
      window.removeEventListener('resize', debouncedCheckMobile);
      clearTimeout(timeoutId);
    };
  }, []);

  const shopifyQueryString = buildShopifyQuery({ ...filterManager.filters, searchText: filterManager.searchQuery });

  // Convert sortBy to Shopify format
  const getShopifySortKey = () => {
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
  };

  const { sortKey, reverse } = getShopifySortKey();

  useEffect(() => {
    filterManager.startQuery();
  }, [shopifyQueryString, filterManager]);

  // Fetch ALL products for filter counting (unfiltered) - pass empty string for no query
  const {
    products: allProducts,
    loading: allProductsLoading
  } = useShopifyProducts('', 'RELEVANCE', false, 100);

  // Fetch filtered products for display
  const {
    products: shopifyProducts,
    loading: productsLoading,
    error: productsError,
    usingFallback,
    hasNextPage,
    loadMore
  } = useShopifyProducts(shopifyQueryString || undefined, sortKey, reverse);

  useEffect(() => {
    if (!productsLoading) {
      filterManager.endQuery(shopifyProducts.length);
    }
  }, [productsLoading, shopifyProducts.length, filterManager]);

  // Client-side filtering for in-stock, ring sizes, metal colors, carat, clarity, certification, and category with memoization
  const filteredProducts = useMemo(() => {
    let result = shopifyProducts;

    // Apply category filter (client-side for accurate matching)
    if (filterManager.filters.jewelryCategory) {
      result = result.filter(product =>
        productMatchesCategory(product, filterManager.filters.jewelryCategory!)
      );
    }

    // Apply shape filter (client-side for accurate matching)
    if (filterManager.filters.shapes && filterManager.filters.shapes.length > 0) {
      result = result.filter(product => {
        return filterManager.filters.shapes!.some(shape =>
          productMatchesShape(product, shape)
        );
      });
    }

    // Apply variant-based metal color filter
    if (filterManager.filters.variantMetalColors && filterManager.filters.variantMetalColors.length > 0) {
      result = result.filter(product => {
        return filterManager.filters.variantMetalColors!.some(metalColor =>
          productHasMetalColor(product, metalColor)
        );
      });
    }

    // Apply variant-based carat weight filter
    if (filterManager.filters.variantCaratWeights && filterManager.filters.variantCaratWeights.length > 0) {
      result = result.filter(product => {
        return filterManager.filters.variantCaratWeights!.some(caratWeight =>
          productHasCaratWeight(product, caratWeight)
        );
      });
    }

    // Apply clarity filter
    if (filterManager.filters.clarityGrades && filterManager.filters.clarityGrades.length > 0) {
      result = result.filter(product => {
        return filterManager.filters.clarityGrades!.some(clarity =>
          productMatchesClarityGrade(product, clarity)
        );
      });
    }

    // Apply certification filter
    if (filterManager.filters.certifications && filterManager.filters.certifications.length > 0) {
      result = result.filter(product => {
        return filterManager.filters.certifications!.some(cert =>
          productMatchesCertification(product, cert)
        );
      });
    }

    // Apply in-stock filter
    if (filterManager.filters.inStockOnly) {
      result = result.filter(product => {
        const hasInStockVariant = product.variants.some(variant =>
          variant.availableForSale && (variant.quantityAvailable ?? 0) > 0
        );
        return hasInStockVariant;
      });
    }

    // Apply ring size filter
    if (filterManager.filters.ringSizes && filterManager.filters.ringSizes.length > 0) {
      result = result.filter(product => {
        return filterManager.filters.ringSizes!.some(filterSize => {
          if (product.metafields?.ringSize) {
            const sizes = product.metafields.ringSize.split(/[;,]/).map(s => s.trim());
            if (sizes.includes(filterSize)) return true;
          }

          return product.variants.some(variant => {
            if (!variant.selectedOptions) return false;
            const sizeOption = variant.selectedOptions['Size'] || variant.selectedOptions['size'];
            return sizeOption === filterSize;
          });
        });
      });
    }

    return result;
  }, [
    shopifyProducts,
    filterManager.filters.jewelryCategory,
    filterManager.filters.shapes,
    filterManager.filters.metalColors,
    filterManager.filters.variantMetalColors,
    filterManager.filters.variantCaratWeights,
    filterManager.filters.caratWeights,
    filterManager.filters.clarityGrades,
    filterManager.filters.certifications,
    filterManager.filters.inStockOnly,
    filterManager.filters.ringSizes
  ]);

  // Products are already sorted by Shopify based on our query
  const sortedProducts = filteredProducts;

  const handleSearch = (query: string) => {
    filterManager.setSearchQuery(query);
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

  const clearAllFilters = () => {
    filterManager.clearFilters();
    navigate('/shop');
  };

  const handleRemoveFilter = (key: keyof FilterType, value?: any) => {
    if (value !== undefined) {
      filterManager.setFilters({ [key]: value });
    } else {
      filterManager.removeFilter(key);
    }
  };

  // Sync filters to URL (skip when updating from URL to avoid loops)
  useEffect(() => {
    if (isUpdatingFromURL.current) return;

    const params = new URLSearchParams();

    if (filterManager.filters.jewelryCategory) {
      params.set('category', filterManager.filters.jewelryCategory.toLowerCase());
    }

    if (filterManager.filters.ringStyle) {
      params.set('style', filterManager.filters.ringStyle.toLowerCase().replace(/\s+/g, '-'));
    }

    // Only include shape params if not Necklaces or Earrings
    if (filterManager.filters.shapes && filterManager.filters.shapes.length > 0) {
      const category = filterManager.filters.jewelryCategory;
      if (!category || category === 'Engagement Ring') {
        params.set('shape', filterManager.filters.shapes.join(',').toLowerCase());
      }
    }

    if (filterManager.filters.stoneType) {
      params.set('stone', filterManager.filters.stoneType.toLowerCase());
    }

    if (filterManager.filters.minPrice) {
      params.set('minPrice', filterManager.filters.minPrice.toString());
    }

    if (filterManager.filters.maxPrice) {
      params.set('maxPrice', filterManager.filters.maxPrice.toString());
    }

    if (filterManager.filters.inStockOnly) {
      params.set('inStock', 'true');
    }

    if (filterManager.searchQuery.trim()) {
      params.set('search', encodeURIComponent(filterManager.searchQuery));
    }

    const newSearch = params.toString();
    const currentSearch = window.location.search.substring(1);

    if (newSearch !== currentSearch) {
      navigate(`/shop${newSearch ? `?${newSearch}` : ''}`, { replace: true });
    }
  }, [filterManager.filters, filterManager.searchQuery, navigate]);

  const handleQuickView = (product: ProcessedProduct) => {
    setQuickViewProduct(product);
  };



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
        totalResults={sortedProducts.length}
      />

      {/* Main Shop Content */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <Breadcrumbs
            items={[
              { label: 'Home', onClick: () => onNavigate('/') },
              { label: 'Shop All Jewelry' }
            ]}
            onNavigate={onNavigate}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Desktop Sidebar - Advanced Filters */}
            <div className="hidden lg:block">
              {!allProductsLoading && allProducts.length > 0 ? (
                <AdvancedProductFilters
                  filters={filterManager.filters}
                  onFiltersChange={filterManager.setFilters}
                  products={allProducts}
                  isLoading={productsLoading || filterManager.isLoading}
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
              {/* Active Filter Chips */}
              <ActiveFilterChips
                filters={filterManager.filters}
                searchQuery={filterManager.searchQuery}
                onRemoveFilter={handleRemoveFilter}
                onClearSearch={() => {
                  filterManager.setSearchQuery('');
                  navigate('/shop');
                }}
                onClearAll={clearAllFilters}
              />

              {/* Products Grid */}
              <ShopProductGrid
              products={sortedProducts}
              loading={productsLoading || filterManager.isLoading}
              error={productsError}
              usingFallback={usingFallback}
              hasNextPage={hasNextPage}
              onLoadMore={loadMore}
              viewMode={viewMode}
              filters={filterManager.filters}
              searchQuery={filterManager.searchQuery}
              onFiltersChange={filterManager.setFilters}
              onClearAll={clearAllFilters}
              onQuickView={handleQuickView}
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
                filters={filterManager.filters}
                onFiltersChange={filterManager.setFilters}
                onClose={() => setIsFilterOpen(false)}
                isMobile={true}
                products={allProducts}
                isLoading={productsLoading || filterManager.isLoading}
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

      {/* Product Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
        products={allProducts}
      />

      {/* Custom Size Request Modal */}
      <CustomSizeRequestModal
        isOpen={isCustomSizeModalOpen}
        onClose={() => setIsCustomSizeModalOpen(false)}
        prefilledData={{
          ring_style: filterManager.filters.ringStyle,
          shape: filterManager.filters.shapes?.[0],
        }}
      />
    </div>
  );
};