import React, { useState } from 'react';
import { PageHero } from '../components/PageHero';
import { ProductCard } from '../components/ProductCard';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { Package, WifiOff } from 'lucide-react';
import { ProcessedProduct } from '../types/shopify';

interface NewArrivalsPageProps {
  onNavigate: (page: string) => void;
}

export const NewArrivalsPage: React.FC<NewArrivalsPageProps> = ({ onNavigate }) => {
  const { products, loading, error, usingFallback } = useShopifyProducts(undefined, 'CREATED_AT', true);

  return (
    <div className="bg-Color-Netural-White min-h-screen">
      <PageHero
        title="New Arrivals"
        subtitle="Explore our latest handcrafted pieces, fresh from our Antwerp atelier"
        backgroundImage="https://diamondsbycs.com/images/uploads/upload-68b5458f5a5cf.jpeg"
      />

      <section className="luxury-section luxury-container">
        {/* Show fallback notice if using offline data */}
        {usingFallback && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 max-w-4xl mx-auto">
            <div className="flex items-center">
              <WifiOff className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="typography-body font-medium text-blue-800">Using Offline Data</p>
                <p className="typography-caption text-blue-600">
                  Showing products from your Shopify CSV
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && products.length === 0 && (
          <div className="text-center py-12">
            <div className="animate-spin h-12 w-12 border-b-2 border-Color-Light-300 mx-auto mb-4"></div>
            <p className="typography-body text-Color-Gray-700">Loading new arrivals...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-10">
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg max-w-lg mx-auto">
              <p className="typography-body text-yellow-800 mb-2">{error}</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center text-Color-Netural-Black">
                <Package className="h-5 w-5 mr-2" />
                <span className="typography-body font-semibold">
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
            <Package className="h-16 w-16 text-Color-Champagne-Gold mx-auto mb-4" />
            <h3 className="typography-h4 text-Color-Netural-Black mb-2">No new arrivals yet</h3>
            <p className="typography-body text-Color-Champagne-Gold mb-6 max-w-md mx-auto">
              Check back soon for our latest pieces
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
