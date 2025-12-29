/**
 * src/pages/ShopPage.tsx
 * The Orchestration Hub for Diamonds By CS Storefront
 */
import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductCard } from '../components/ProductCard';
import { useFilterManager } from '../hooks/useFilterManager';
import { useShopifyProducts } from '../hooks/useShopifyProducts'; // Provided in your source
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';

const ShopPage: React.FC = () => {
  // 1. Fetch live products from Shopify Storefront API
  const { products, isLoading, error } = useShopifyProducts();

  // 2. Initialize our Robust Filtering System
  const {
    filters,
    searchQuery,
    setSearchQuery,
    updateFilter,
    clearFilters,
    filteredProducts,
    getActiveVariant,
    isSizeVisible
  } = useFilterManager(products || []);

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
            
            {/* Left: Refactored Sidebar */}
            <FilterSidebar 
              filters={filters} 
              updateFilter={updateFilter} 
              clearFilters={clearFilters} 
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