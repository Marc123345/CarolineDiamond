import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';

interface OurCollectionProps {
  onNavigate: (page: string) => void;
}

export const OurCollection: React.FC<OurCollectionProps> = ({ onNavigate }) => {
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

  const collections = [
    {
      id: 'solitaire',
      title: 'Solitaire Collection',
      description: 'Timeless elegance with a single stunning diamond',
      image: 'https://ik.imagekit.io/qcvroy8xpd/3.Solitaire%20Ring.png?updatedAt=1756887836825',
      page: '/shop?category=rings&style=solitaire',
      filter: 'collection:solitaire',
      count: 7,
      priceFrom: '€1,700'
    },
    {
      id: 'halo',
      title: 'Halo Collection',
      description: 'Enhanced brilliance with surrounding diamonds',
      image: 'https://cdn.shopify.com/s/files/1/0762/6122/8788/files/image1_7f6c0ddf-bf26-4b6a-ba83-26e0f9bbeb6f.png',
      page: '/shop?category=rings&style=halo',
      filter: 'collection:halo',
      count: 9,
      priceFrom: '€1,850'
    },
    {
      id: 'engagement',
      title: 'All Engagement Rings',
      description: 'Discover your perfect symbol of love',
      image: 'https://ik.imagekit.io/qcvroy8xpd/PngItem_479625%201.png?updatedAt=1756832129082',
      page: '/shop/engagement-wedding',
      count: 16,
      priceFrom: '€1,700'
    }
  ];

  return (
    <section
      ref={ref}
      className="luxury-section bg-gradient-to-br from-Color-Netural-White via-Color-Secondary/20 to-Color-Netural-White luxury-texture relative overflow-hidden"
    >
      {/* Subtle luxury ambient elements */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-10 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-Color-Light-300/20 to-Color-Light-300/5 rounded-full luxury-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-Color-Light-300/15 to-Color-Light-300/3 rounded-full luxury-glow"></div>
        <div className="absolute top-1/2 right-1/6 w-32 h-32 bg-gradient-to-br from-Color-Light-300/10 to-Color-Light-300/2 rounded-full luxury-glow"></div>
      </motion.div>

      <div className="luxury-container">
        {/* Header */}
        <div ref={inViewRef} className="text-center section-header">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="mb-6 sm:mb-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-Color-Dark-500 font-bold font-serif text-center">
              Featured <span className="text-Color-Light-300">Collections</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: "160px" } : { width: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="h-[3px] sm:h-[4px] bg-gradient-to-r from-transparent via-Color-Light-300/80 to-transparent mx-auto mb-6 sm:mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base lg:typography-body-xl text-Color-Rich-Gray max-w-3xl mx-auto leading-loose px-4"
            style={{ letterSpacing: '0.03em' }}
          >
            Explore our exquisite collection of handcrafted engagement rings, featuring lab-grown diamonds
            and ethical sourcing. Each piece is IGI-certified with a lifetime craftsmanship guarantee.
          </motion.p>
        </div>

        {/* Collections Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16"
        >
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.9 }}
              transition={{
                duration: 0.8,
                delay: 0.8 + (index * 0.2),
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group cursor-pointer"
              onClick={() => {
                if (collection.filter) {
                  onNavigate(`${collection.page}?filter=${collection.filter}`);
                } else {
                  onNavigate(collection.page);
                }
              }}
            >
              <div className="trust-card detail-focus overflow-hidden relative border border-Color-Light-300/30">
                {/* Hover shimmer effect */}
                <motion.div
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"
                />

                {/* Image */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-Color-Secondary/20">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 relative z-20">
                  <h3 className="text-xl sm:text-2xl font-bold text-Color-Dark-500 mb-2 group-hover:text-Color-Light-300 transition-colors duration-300 font-serif">
                    {collection.title}
                  </h3>
                  <p className="text-sm sm:text-base text-Color-Gray-700 mb-4 leading-relaxed">
                    {collection.description}
                  </p>

                  <div className="flex items-baseline justify-between mb-6">
                    <div>
                      <span className="text-xs text-Color-Gray-600 uppercase tracking-wider">From</span>
                      <p className="text-lg sm:text-xl font-bold text-Color-Light-300">{collection.priceFrom}</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                    className="btn--text flex items-center text-Color-Light-300 hover:text-Color-Dark-500 group-hover:translate-x-2 transition-all duration-300 font-semibold"
                  >
                    <span>View Collection</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center px-4"
        >
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-8 sm:mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-Color-Light-300 mb-2 font-serif">16+</div>
              <div className="text-xs sm:text-sm text-Color-Gray-600 uppercase tracking-wider">Unique Designs</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.7 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-Color-Light-300 mb-2 font-serif">100%</div>
              <div className="text-xs sm:text-sm text-Color-Gray-600 uppercase tracking-wider">IGI Certified</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.8 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-Color-Light-300 mb-2 font-serif">18K</div>
              <div className="text-xs sm:text-sm text-Color-Gray-600 uppercase tracking-wider">Gold Quality</div>
            </motion.div>
          </div>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('/shop')}
            className="btn-primary transform hover:scale-105 hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base"
          >
            Explore All Collections
          </motion.button>
        </motion.div> {/* ✅ closes properly now */}
      </div>
    </section>
  );
};
