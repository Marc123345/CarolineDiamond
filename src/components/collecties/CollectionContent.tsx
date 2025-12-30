import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Heart, Star, Sparkles,
  Award, Gem, Diamond, Package, ShoppingBag
} from 'lucide-react';
import { collectiesContent } from '../../config/collectiesConfig';
import { useShopifyProducts } from '../../hooks/useShopifyProducts';
import { ProductCard } from '../ProductCard';
import { ProductCardSkeleton } from '../ProductCardSkeleton';
import { filterProductsByCollection, getCollectionHeroImage } from '../../utils/collectionFilters';

interface CollectionContentProps {
  activeCollection: string;
  onNavigate: (page: string) => void;
}

export const CollectionContent: React.FC<CollectionContentProps> = ({
  activeCollection,
  onNavigate
}) => {
  const collection = collectiesContent.collections[activeCollection];
  const containerRef = useRef<HTMLDivElement>(null);
  const { products, loading } = useShopifyProducts();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yParallax = useSpring(useTransform(scrollYProgress, [0, 1], [0, -150]));
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1]);

  const filteredProducts = useMemo(
    () => filterProductsByCollection(products, collection?.filters),
    [products, collection?.filters]
  );

  const collectionHeroImage = useMemo(
    () => getCollectionHeroImage(filteredProducts),
    [filteredProducts]
  );

  const theme = useMemo(() => {
    const themes: Record<string, { bg: string; accent: string; icon: any; text: string }> = {
      'engagement-rings': { bg: 'from-[#FFF9F5] to-[#FFFFFF]', accent: '#C9A86A', icon: Diamond, text: 'ENGAGEMENT' },
      'classic-solitaire': { bg: 'from-[#F8F8F8] to-[#FFFFFF]', accent: '#8B7355', icon: Gem, text: 'CLASSIC' },
      'halo-rings': { bg: 'from-[#FFF5F7] to-[#FFFFFF]', accent: '#D4AF37', icon: Sparkles, text: 'HALO' },
      'lab-grown': { bg: 'from-[#F0F5FF] to-[#FFFFFF]', accent: '#4169E1', icon: Star, text: 'INNOVATION' },
      'natural-diamonds': { bg: 'from-[#FFF5F5] to-[#FFFFFF]', accent: '#8B4513', icon: Diamond, text: 'NATURAL' },
      'necklaces': { bg: 'from-[#FFF0F6] to-[#FFFFFF]', accent: '#C75B7A', icon: Heart, text: 'NECKLACES' },
      'earrings': { bg: 'from-[#F5F5FF] to-[#FFFFFF]', accent: '#9370DB', icon: Sparkles, text: 'EARRINGS' },
      'solitaire-no-side': { bg: 'from-[#FAFAFA] to-[#FFFFFF]', accent: '#696969', icon: Gem, text: 'PURE' },
      'halo-no-side': { bg: 'from-[#F9F9F9] to-[#FFFFFF]', accent: '#778899', icon: Star, text: 'REFINED' },
    };
    return themes[activeCollection] || { bg: 'from-white to-gray-50', accent: '#C9A86A', icon: Diamond, text: 'COLLECTION' };
  }, [activeCollection]);

  if (!collection) return null;

  return (
    <section 
      ref={containerRef}
      className={`relative py-32 lg:py-48 bg-gradient-to-br ${theme.bg} overflow-hidden`}
    >
      {/* --- BACKGROUND STORYTELLING --- */}
      <div className="absolute top-10 left-0 w-full overflow-hidden pointer-events-none select-none">
        <motion.span 
          style={{ x: yParallax }}
          className="text-[12rem] lg:text-[20rem] font-serif text-black/[0.03] whitespace-nowrap block"
        >
          {theme.text} {theme.text} {theme.text}
        </motion.span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- COLLECTION HEADER WITH IMAGE --- */}
        <div className="mb-24">
          {/* Hero Image Section */}
          {collectionHeroImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative mb-16 h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-2xl"
            >
              <img
                src={collectionHeroImage}
                alt={collection.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 relative"
                >
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center relative z-10 shadow-xl">
                    <theme.icon className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-[10px] uppercase tracking-[0.8em] text-white font-black mb-4 block"
                >
                  Collection Showcase
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-none mb-4"
                >
                  {collection.title}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20"
                >
                  <Package className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Title Section (when no image) */}
          {!collectionHeroImage && (
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                className="mb-12 relative"
              >
                <div className="w-24 h-24 border border-Color-Champagne-Gold/30 rotate-45 absolute -inset-2 animate-pulse" />
                <div className="w-20 h-20 bg-white shadow-2xl flex items-center justify-center relative z-10">
                  <theme.icon className="w-10 h-10" style={{ color: theme.accent }} />
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <span className="text-[10px] uppercase tracking-[0.8em] text-Color-Champagne-Gold font-black mb-6 block">
                  Collection Showcase
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-Color-Dark-500 leading-none mb-6">
                  {collection.title.split(' ')[0]} <br />
                  <span className="italic font-light text-Color-Champagne-Gold">
                    {collection.title.split(' ').slice(1).join(' ')}
                  </span>
                </h1>
                <p className="text-xl text-Color-Gray-600 font-light max-w-2xl mx-auto leading-relaxed italic mb-8">
                  {collection.subtitle}
                </p>

                <div className="flex items-center justify-center gap-8 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-Color-Champagne-Gold" />
                    <span className="font-medium">{filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* --- COLLECTION DESCRIPTION --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-24 text-center"
        >
          <p className="text-lg text-Color-Gray-700 leading-relaxed">
            {collection.description}
          </p>
        </motion.div>

        {/* --- PRODUCT GRID --- */}
        <div className="mb-32">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onNavigate={onNavigate}
                  />
                ))}
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <ShoppingBag className="w-16 h-16 text-Color-Gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-serif text-Color-Gray-600 mb-2">No Products Found</h3>
              <p className="text-Color-Gray-500">This collection is currently empty.</p>
            </motion.div>
          )}
        </div>

        {/* --- CONTENT SECTIONS --- */}
        {collection.sections && collection.sections.length > 0 && (
          <div className="space-y-32 lg:space-y-48 mb-32">
            {collection.sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto"
              >
                {section.title && (
                  <h3 className="text-3xl md:text-4xl font-serif text-Color-Dark-500 mb-6 text-center">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-4">
                  {section.content.map((p, pi) => (
                    <p key={pi} className="text-lg text-Color-Gray-700 leading-relaxed text-center">
                      {p}
                    </p>
                  ))}
                </div>

                {section.centerText && (
                  <div className="mt-8 p-6 bg-white/50 backdrop-blur-md border-l-4 border-Color-Champagne-Gold italic text-Color-Dark-500 font-medium">
                    "{section.centerText}"
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* --- CALL TO ACTION --- */}
        <footer className="text-center border-t border-Color-Champagne-Gold/20 pt-24">
          <h2 className="text-3xl md:text-5xl font-serif text-Color-Dark-500 mb-8">
            Discover More from <span className="italic text-Color-Champagne-Gold">{collection.title}</span>
          </h2>
          <p className="text-Color-Gray-600 mb-12 max-w-2xl mx-auto">
            Explore our complete collection or get in touch with our team for personalized assistance
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button
              onClick={() => onNavigate('/shop')}
              className="px-10 py-4 bg-Color-Dark-500 text-white uppercase text-xs tracking-[0.3em] font-bold hover:bg-Color-Champagne-Gold transition-colors duration-300 rounded-sm"
            >
              Browse All Jewelry
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="px-10 py-4 border-2 border-Color-Dark-500 text-Color-Dark-500 uppercase text-xs tracking-[0.3em] font-bold hover:bg-Color-Dark-500 hover:text-white transition-all duration-300 rounded-sm"
            >
              Contact Us
            </button>
          </div>
        </footer>

      </div>
    </section>
  );
};