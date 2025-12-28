import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PageHero } from '../components/PageHero';
import { CollectionTabs } from '../components/collecties/CollectionTabs';
import { CollectionContent } from '../components/collecties/CollectionContent';
import { Sparkles, Crown, Star, Diamond, Heart, Palette, Award, Gem, ArrowRight } from 'lucide-react';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { collectiesContent } from '../config/collectiesConfig';

interface CollectiesPageProps {
  onNavigate: (page: string) => void;
}

export const CollectiesPage: React.FC<CollectiesPageProps> = ({ onNavigate }) => {
  const [activeCollection, setActiveCollection] = useState('engagement-rings');
  const [isLoaded, setIsLoaded] = useState(false);
  const { products } = useShopifyProducts();

  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Advanced parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);

  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const featuredCollections = useMemo(() => {
    const collectionIds = ['halo-rings', 'classic-solitaire', 'necklaces', 'earrings'];

    return collectionIds.map(id => {
      const collection = collectiesContent.collections[id];
      if (!collection?.filters) return null;

      const filteredProducts = products.filter(product => {
        const filters = collection.filters;
        if (filters.type && product.productType !== filters.type) return false;
        if (filters.tags) {
          const hasAllTags = filters.tags.every(tag =>
            product.tags.some(productTag =>
              productTag.toLowerCase() === tag.toLowerCase()
            )
          );
          if (!hasAllTags) return false;
        }
        return true;
      });

      const productWithImage = filteredProducts.find(p => p.images.length > 0);
      const minPrice = filteredProducts.reduce((min, p) => {
        const price = parseFloat(p.priceRange.minVariantPrice.amount);
        return price < min ? price : min;
      }, Infinity);

      return {
        id,
        title: collection.title,
        image: productWithImage?.images[0]?.src || null,
        count: filteredProducts.length,
        minPrice: minPrice === Infinity ? null : minPrice
      };
    }).filter(Boolean);
  }, [products]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className="bg-Color-Netural-White relative overflow-hidden min-h-screen"
    >
      {/* Enhanced Hero Section with Video Background */}
      <motion.div style={{ y: contentY }} className="relative">
        <div className="relative h-screen min-h-[600px]">
          {/* Video Background */}
          <div className="absolute inset-0 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              poster="https://ik.imagekit.io/qcvroy8xpd/b855a677-5d9f-4721-9bd3-446722fa0653.jpeg?updatedAt=1763894042745"
            >
              <source src="https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Video%202025-11-23%20at%2012.40.07.mp4" type="video/mp4" />
            </video>
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 sm:px-8 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <p className="text-Color-Champagne-Gold/90 text-lg sm:text-xl mb-4 font-light tracking-wide">
                Explore our curated jewelry collections
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white mb-8 tracking-tight">
                Signature Collections
              </h1>
            </motion.div>
          </div>

          {/* Breadcrumbs overlay */}
          <div className="absolute top-0 left-0 right-0 z-10 pt-32 sm:pt-40">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12">
              <Breadcrumbs
                items={[
                  { label: 'Collections', icon: Palette }
                ]}
                onNavigate={onNavigate}
                className="text-white"
              />
            </div>
          </div>

          {/* Hero overlay with floating elements */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {[...Array(typeof window !== 'undefined' && window.innerWidth < 768 ? 6 : 12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-Color-Champagne-Gold rounded-full"
                style={{
                  left: `${15 + i * 7}%`,
                  top: `${20 + (i % 4) * 20}%`,
                }}
                animate={{
                  y: [0, -30 - i * 2, 0],
                  x: [0, 20 - i * 1.5, 0],
                  opacity: [0.2, 0.7, 0.2],
                  scale: [0.8, 1.6, 0.8],
                  rotate: [0, 360, 720],
                }}
                transition={{
                  duration: 8 + i * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Introduction Section */}
      <motion.section
        initial={{ opacity: 0, y: 100 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="py-20 sm:py-32 lg:py-40 xl:py-48 bg-gradient-to-br from-Color-Netural-White via-Color-Champagne-Gold/10 to-Color-Netural-White luxury-texture relative overflow-hidden"
      >
        {/* Advanced background elements */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 opacity-15 pointer-events-none"
        >
          <motion.div
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.08, 0.25, 0.08],
              rotate: [0, 45, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-gradient-to-br from-Color-Champagne-Gold/20 to-Color-Champagne-Gold/5 rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.06, 0.2, 0.06],
              rotate: [0, -30, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
            className="absolute bottom-1/4 right-1/4 w-40 sm:w-60 lg:w-80 h-40 sm:h-60 lg:h-80 bg-gradient-to-br from-Color-Champagne-Gold/15 to-Color-Champagne-Gold/3 rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 2.2, 1],
              opacity: [0.1, 0.35, 0.1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 12 }}
            className="absolute top-1/2 left-1/6 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-gradient-to-br from-Color-Champagne-Gold/15 to-Color-Champagne-Gold/4 rounded-full"
          />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            ref={inViewRef}
            initial={{ opacity: 0, y: 80 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2 }}
            className="text-center mb-10 sm:mb-20 lg:mb-24"
          >
            {/* Sophisticated header design */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="inline-flex items-center justify-center mb-8 sm:mb-10 lg:mb-12"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: '120px' } : { width: 0 }}
                transition={{ duration: 1.5, delay: 0.6 }}
                className="h-[2px] sm:h-[3px] lg:h-[4px] bg-gradient-to-r from-transparent via-Color-Champagne-Gold/80 to-Color-Champagne-Gold mr-4 sm:mr-6 lg:mr-8 w-16 sm:w-20 lg:w-30"
              />

              <motion.div
                whileHover={{
                  scale: 1.3,
                  rotate: 360,
                  boxShadow: '0 0 60px rgba(205,188,171,0.9)',
                }}
                transition={{ duration: 1 }}
                className="w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-gradient-to-br from-Color-Champagne-Gold via-Color-Champagne-Gold/90 to-Color-Champagne-Gold/70 flex items-center justify-center shadow-2xl cursor-pointer relative overflow-hidden rounded-full sm:rounded-none"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.4, 1],
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Crown className="h-8 sm:h-10 lg:h-12 w-8 sm:w-10 lg:w-12 text-Color-Netural-White" />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: '120px' } : { width: 0 }}
                transition={{ duration: 1.5, delay: 0.8 }}
                className="h-[2px] sm:h-[3px] lg:h-[4px] bg-gradient-to-l from-transparent via-Color-Champagne-Gold/80 to-Color-Champagne-Gold ml-4 sm:ml-6 lg:ml-8 w-16 sm:w-20 lg:w-30"
              />
            </motion.div>

            {/* Section Title */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 1 }}
              className="text-2xl sm:text-3xl lg:typography-h1 text-Color-Dark-500 mb-8 sm:mb-10 lg:mb-12 relative px-4"
            >
              Curated Jewelry{' '}
              <span className="text-Color-Champagne-Gold relative">Collections</span>
            </motion.h1>

            {/* Unifying Element */}
            <motion.div 
              initial={{ width: 0 }}
              animate={inView ? { width: "180px" } : { width: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="h-[3px] bg-gradient-to-r from-transparent via-Color-Light-300 to-transparent mx-auto mb-8 sm:mb-10 lg:mb-12"
            />

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.6 }}
              className="text-base sm:text-lg lg:typography-body-xl text-Color-Gray-700 max-w-5xl mx-auto leading-relaxed mb-12 sm:mb-14 lg:mb-16 px-4"
            >
              Explore our carefully curated jewelry collections, from timeless engagement rings to
              exquisite diamond pieces. Each collection showcases exceptional craftsmanship and
              offers a range of styles to suit every taste and occasion.
            </motion.p>

            {/* Collection stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 2 }}
              className="bg-gradient-to-r from-Color-Netural-White via-Color-Champagne-Gold/15 to-Color-Netural-White p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl shadow-2xl border border-Color-Champagne-Gold/40 max-w-6xl mx-auto relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-16 text-sm sm:typography-body text-Color-Dark-500 relative z-10">
                {[
                  { icon: Award, text: '9 Curated Collections', delay: 0 },
                  { icon: Heart, text: '100+ Unique Designs', delay: 0.2 },
                  { icon: Star, text: 'Exceptional Craftsmanship', delay: 0.4 },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 2.2 + feature.delay }}
                    className="flex flex-col sm:flex-row items-center text-center sm:text-left group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.3, rotate: 360 }}
                      transition={{ duration: 0.8 }}
                      className="w-10 sm:w-12 lg:w-14 h-10 sm:h-12 lg:h-14 bg-Color-Champagne-Gold rounded-full flex items-center justify-center mb-2 sm:mb-0 sm:mr-3 lg:mr-4 group-hover:shadow-xl transition-shadow duration-300"
                    >
                      <feature.icon className="h-5 sm:h-6 lg:h-7 w-5 sm:w-6 lg:w-7 text-Color-Netural-White" />
                    </motion.div>
                    <span className="text-sm sm:text-base lg:text-lg font-bold group-hover:text-Color-Champagne-Gold transition-colors duration-300">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Shop By Category Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12 py-20 sm:py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-Color-Dark-500 mb-4">
            Shop By <span className="text-Color-Champagne-Gold italic">Category</span>
          </h2>
          <p className="text-Color-Gray-600 max-w-2xl mx-auto">
            Explore our most popular collections featuring exquisite designs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCollections.map((collection, index) => (
            collection && (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => setActiveCollection(collection.id)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg shadow-lg mb-4">
                  {collection.image ? (
                    <>
                      <img
                        src={collection.image}
                        alt={collection.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-Color-Light-200 to-Color-Light-100 flex items-center justify-center">
                      <Diamond className="w-16 h-16 text-Color-Champagne-Gold opacity-30" />
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                      {collection.minPrice && (
                        <p className="text-xs text-Color-Gray-600 mb-1">From €{Math.round(collection.minPrice).toLocaleString()}</p>
                      )}
                      <h3 className="text-sm font-bold text-Color-Dark-500">{collection.title}</h3>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 bg-Color-Champagne-Gold text-white px-3 py-1 rounded-full text-xs font-bold">
                    {collection.count}
                  </div>
                </div>

                <button
                  className="w-full flex items-center justify-center gap-2 text-sm text-Color-Dark-500 group-hover:text-Color-Champagne-Gold transition-colors duration-300"
                >
                  <span className="font-medium">View Collection</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )
          ))}
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12 py-20 sm:py-32 lg:py-40 xl:py-48">
        <div className="py-20 sm:py-32 lg:py-40 xl:py-48">
          <CollectionTabs activeCollection={activeCollection} onCollectionChange={setActiveCollection} />
        </div>
        <div className="py-20 sm:py-32 lg:py-40 xl:py-48">
          <CollectionContent activeCollection={activeCollection} onNavigate={onNavigate} />
        </div>
      </section>
    </motion.div>
  );
};
