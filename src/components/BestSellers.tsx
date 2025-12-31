import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Star, WifiOff, Sparkles, Crown } from 'lucide-react';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { ProductCard } from './ProductCard';
import { ProcessedProduct } from '../types';

interface BestSellersProps {
  onNavigate: (page: string) => void;
}

export const BestSellers: React.FC<BestSellersProps> = ({ onNavigate }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Fetch bestseller products from Shopify
  const {
    products: shopifyProducts,
    loading,
    usingFallback
  } = useShopifyProducts('tag:bestseller OR tag:featured', 'BEST_SELLING', false, 3);

  // Fallback data if no API or empty result
  const displayProducts = shopifyProducts;

  return (
    <section
      ref={ref}
      className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-20 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-Color-Champagne-Gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-Color-Champagne-Gold/5 rounded-full blur-3xl"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <motion.div
          ref={inViewRef}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-Color-Champagne-Gold/10 rounded-full mb-6">
            <Crown className="h-6 w-6 text-Color-Champagne-Gold" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-Color-Netural-Black mb-6">
            Customer <span className="text-Color-Champagne-Gold">Favorites</span>
          </h2>
          
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-Color-Champagne-Gold to-transparent mx-auto mb-6" />
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most beloved pieces, chosen by customers for their exceptional beauty and craftsmanship.
          </p>
        </motion.div>

        {/* Show fallback notice if using offline data */}
        {usingFallback && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8 text-center max-w-lg mx-auto flex items-center justify-center gap-3">
            <WifiOff className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Using cached data</span>
          </div>
        )}

        {/* Loading State */}
        {loading && displayProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="animate-spin h-10 w-10 border-2 border-Color-Champagne-Gold border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Curating bestsellers...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && displayProducts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {/* Ranking Badge */}
                <div className="absolute -top-3 -left-3 z-20 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center border-2 border-Color-Champagne-Gold text-Color-Netural-Black font-bold font-serif">
                  #{index + 1}
                </div>
                
                <ProductCard
                  product={product}
                  usingFallback={usingFallback}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('/shop')}
            className="inline-flex items-center px-8 py-4 bg-Color-Netural-Black text-white font-semibold rounded-full hover:bg-Color-Champagne-Gold transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" />
            Explore Full Collection
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};