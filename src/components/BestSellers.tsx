import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Star, WifiOff, Sparkles, Crown } from 'lucide-react';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { ProductCard } from './ProductCard';
import { bestsellerProducts } from '../config/siteConfig';
import { transformConfigProductToProcessedProduct } from '../utils/shopifyHelpers';

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
  } = useShopifyProducts('tag:engagement-ring OR tag:solitaire OR tag:lab-grown', 'RELEVANCE', false, 6);

  // Use config bestsellers as fallback
  const configBestsellers = bestsellerProducts.map(transformConfigProductToProcessedProduct);
  const displayProducts = shopifyProducts.length > 0 ? shopifyProducts.slice(0, 3) : configBestsellers;

  return (
    <section
      ref={ref}
      className="py-8 sm:py-10 lg:py-20 bg-gradient-to-br from-Color-Netural-White via-Color-Secondary/20 to-Color-Netural-White luxury-texture relative overflow-hidden"
    >
      {/* Background Elements */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-15 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-Color-Light-300/20 to-Color-Light-300/5 rounded-full animate-luxury-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-Color-Light-300/15 to-Color-Light-300/3 rounded-full animate-premium-pulse"></div>
      </motion.div>

      <div className="content-container container-spacing relative z-10">
        {/* Hero Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-3 gap-4 mb-16 max-w-6xl mx-auto"
        >
          {displayProducts.slice(0, 3).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
              onClick={() => onNavigate(`/product/${product.handle}`)}
            >
              <img
                src={product.image || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-white text-sm font-bold">#{index + 1} Bestseller</span>
                  </div>
                  <p className="text-white text-xs line-clamp-2">{product.name}</p>
                </div>
              </div>
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-Color-Light-300 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                <Crown className="h-3 w-3 inline mr-1" />
                Top {index + 1}
              </div>
            </motion.div>
          ))}
        </motion.div>
        {/* Header */}
        <motion.div
          ref={inViewRef}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center section-header"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center mb-8"
          >
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.8 }}
              className="w-16 h-16 bg-Color-Light-300 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
            >
              <Crown className="h-8 w-8 text-Color-Netural-White" />
            </motion.div>
          </motion.div>
          
          <h2 className="typography-h2 text-Color-Dark-500 mb-6 relative">
            Customer <span className="text-Color-Light-300">Favorites</span>
          </h2>
          
          {/* Unifying Element */}
          <motion.div 
            initial={{ width: 0 }}
            animate={inView ? { width: "160px" } : { width: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="h-[3px] bg-gradient-to-r from-transparent via-Color-Light-300 to-transparent mx-auto mb-8"
          />
          
          <p className="typography-body-xl text-Color-Gray-700 max-w-4xl mx-auto leading-relaxed">
            Discover our most beloved pieces, chosen by customers for their exceptional beauty and craftsmanship.
          </p>
        </motion.div>

        {/* Show fallback notice if using offline data */}
        {usingFallback && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8 text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center">
              <WifiOff className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="typography-body font-medium text-blue-800">Using Local Bestsellers</p>
                <p className="typography-caption text-blue-600">
                  Showing curated bestseller collection
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && displayProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="animate-spin h-12 w-12 border-b-2 border-Color-Light-300 mx-auto mb-4"></div>
            <p className="typography-body text-Color-Gray-700">Loading bestsellers...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && displayProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10"
          >
            {displayProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.9 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 1 + (index * 0.2),
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <div className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-Color-Light-300/30 overflow-hidden relative">
                  {/* Bestseller Badge */}
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -45 }}
                    transition={{ duration: 0.6, delay: 1.2 + (index * 0.2) }}
                    className="absolute top-4 left-4 z-20"
                  >
                    <div className="bg-gradient-to-r from-Color-Light-300 to-Color-Light-300/80 text-Color-Netural-White px-3 py-1 rounded-full shadow-lg">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        <span className="text-xs font-bold">#{index + 1}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Hover shimmer effect */}
                  <motion.div
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"
                  />
                  
                  <ProductCard
                    product={product}
                    usingFallback={usingFallback}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="bg-gradient-to-r from-Color-Netural-Black to-Color-Dark-500 text-Color-Netural-White p-12 rounded-2xl shadow-2xl border border-Color-Light-300/30 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <motion.div
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%"],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 luxury-texture"
          />
          
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="text-center mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('/shop')}
            className="btn-primary px-8 py-4 flex items-center justify-center mx-auto"
          >
            <Sparkles className="mr-3 h-5 w-5" />
            Explore All Collections
            <ArrowRight className="ml-3 h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};