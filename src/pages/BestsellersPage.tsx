import React from 'react';
import { Package, WifiOff, Star } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard'; // Adjusted path
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { ProcessedProduct } from '../types'; // Adjusted path

// Stub for PageHero (ensure this exists in src/components/PageHero.tsx or use this local version)
const PageHero = ({ title, subtitle, backgroundImage }: { title: string; subtitle: string; backgroundImage: string }) => (
  <div 
    className="relative py-24 sm:py-32 text-center text-white bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10 max-w-4xl mx-auto px-4">
      <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">{title}</h1>
      <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">{subtitle}</p>
    </div>
  </div>
);

interface BestsellersPageProps {
  onNavigate: (page: string) => void;
}

export const BestsellersPage: React.FC<BestsellersPageProps> = ({ onNavigate }) => {
  // Fetch bestsellers
  const { products, loading, error, usingFallback } = useShopifyProducts(
    'tag:bestseller OR tag:engagement-ring OR tag:solitaire', 
    'BEST_SELLING', 
    false
  );

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        title="Customer Favorites"
        subtitle="Our most beloved pieces, chosen by customers for exceptional beauty and craftsmanship"
        backgroundImage="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80"
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Show fallback notice if using offline data */}
        {usingFallback && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8 max-w-4xl mx-auto flex items-center justify-center gap-3">
            <WifiOff className="h-5 w-5 text-blue-600" />
            <div className="text-center sm:text-left">
              <p className="font-medium text-blue-800">Using Offline Data</p>
              <p className="text-xs text-blue-600">Showing products from cached data</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && products.length === 0 && (
          <div className="text-center py-20">
            <div className="animate-spin h-12 w-12 border-b-2 border-Color-Champagne-Gold mx-auto mb-4"></div>
            <p className="text-gray-500">Curating favorites...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-10">
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg max-w-lg mx-auto">
              <p className="text-yellow-800">{error}</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <div className="flex items-center text-gray-900">
                <Star className="h-5 w-5 mr-2 text-Color-Champagne-Gold fill-current" />
                <span className="font-semibold">
                  {products.length} {products.length === 1 ? 'bestseller' : 'bestsellers'} found
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <div key={product.id} className="relative">
                  {/* Top 3 Badge */}
                  {index < 3 && (
                    <div className="absolute -top-2 -left-2 z-10 bg-Color-Netural-Black text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold shadow-lg">
                      #{index + 1}
                    </div>
                  )}
                  <ProductCard
                    product={product}
                    usingFallback={usingFallback}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No bestsellers found</h3>
            <p className="text-gray-500">Check back later for updates to our collection.</p>
          </div>
        )}
      </section>
    </div>
  );
};