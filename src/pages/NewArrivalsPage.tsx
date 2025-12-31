import React, { useState } from 'react';
import { WifiOff, Package } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { ProductCard } from '../components/ProductCard';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { ProcessedProduct } from '../types'; // Adjusted path

// Stub for PageHero if not created yet
const DefaultPageHero = ({ title, subtitle, backgroundImage }: any) => (
  <div 
    className="py-24 text-center bg-cover bg-center text-white relative"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10">
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      <p className="text-lg">{subtitle}</p>
    </div>
  </div>
);

interface NewArrivalsPageProps {
  onNavigate: (page: string) => void;
}

export const NewArrivalsPage: React.FC<NewArrivalsPageProps> = ({ onNavigate }) => {
  // Fetch newest products first
  const { products, loading, error, usingFallback } = useShopifyProducts(
    undefined, 
    'CREATED_AT', 
    true // reverse = true for newest first
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Use real PageHero if you have it, else fallback */}
      <DefaultPageHero
        title="New Arrivals"
        subtitle="Explore our latest handcrafted pieces, fresh from our Antwerp atelier"
        backgroundImage="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Show fallback notice if using offline data */}
        {usingFallback && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 max-w-4xl mx-auto">
            <div className="flex items-center">
              <WifiOff className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-blue-800">Using Offline Data</p>
                <p className="text-xs text-blue-600">
                  Showing products from cached data
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && products.length === 0 && (
          <div className="text-center py-12">
            <div className="animate-spin h-12 w-12 border-b-2 border-Color-Champagne-Gold mx-auto mb-4"></div>
            <p className="text-gray-500">Loading new arrivals...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-10">
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg max-w-lg mx-auto">
              <p className="text-yellow-800 mb-2">{error}</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center text-gray-900">
                <Package className="h-5 w-5 mr-2" />
                <span className="font-semibold">
                  {products.length} {products.length === 1 ? 'product' : 'products'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  usingFallback={usingFallback}
                />
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No new arrivals yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Check back soon for our latest pieces
            </p>
          </div>
        )}
      </section>
    </div>
  );
};