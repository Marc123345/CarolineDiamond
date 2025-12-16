import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Users, Star, Sparkles, Crown, Palette, Diamond, Award, Gem } from 'lucide-react';

interface CollectionTabsProps {
  activeCollection: string;
  onCollectionChange: (collection: string) => void;
}

export const CollectionTabs: React.FC<CollectionTabsProps> = ({ 
  activeCollection, 
  onCollectionChange 
}) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const collections = [
    { 
      id: 'heartbeat', 
      title: 'A Heartbeat for...', 
      icon: Heart,
      subtitle: 'Wildlife & Sealife',
      description: 'Jewelry with a mission to protect endangered species',
      color: 'from-red-500 to-pink-600',
      accent: '🦋'
    },
    { 
      id: 'ann-demeulemeester', 
      title: 'Ann Demeulemeester', 
      icon: Sparkles,
      subtitle: 'Minimalist Elegance',
      description: 'Contemporary and distinctive collection',
      color: 'from-purple-500 to-indigo-600',
      accent: '✨'
    },
    { 
      id: 'carey', 
      title: 'Carey', 
      icon: Users,
      subtitle: 'Sister Love',
      description: 'Celebrating the unique bond between sisters',
      color: 'from-pink-500 to-rose-600',
      accent: '👭'
    },
    { 
      id: 'think-pink', 
      title: 'Think Pink', 
      icon: Heart,
      subtitle: 'Breast Cancer Awareness',
      description: 'Supporting breast cancer research',
      color: 'from-pink-600 to-rose-700',
      accent: '🎗️'
    },
    { 
      id: 'kim-van-oncen', 
      title: 'Kim Van Oncen', 
      icon: Star,
      subtitle: 'Stars Collection',
      description: 'Memorial jewelry for star children',
      color: 'from-blue-500 to-indigo-600',
      accent: '⭐'
    }
  ];

  return (
    <section className="bg-gradient-to-br from-Color-Champagne-Gold via-Color-Champagne-Gold/95 to-Color-Champagne-Gold py-8 sm:py-10 lg:py-20 sticky top-20 z-30 shadow-2xl backdrop-blur-xl relative overflow-hidden border-b border-Color-Champagne-Gold/30">
      {/* Sophisticated background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.6, 1],
            opacity: [0.05, 0.15, 0.05],
            rotate: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-80 h-80 bg-gradient-to-br from-Color-Netural-White/25 to-Color-Netural-White/8 rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.04, 0.12, 0.04],
            rotate: [0, -25, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-Color-Netural-White/20 to-Color-Netural-White/5 rounded-full"
        />
        
        {/* Floating diamond particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-Color-Netural-White rounded-full"
            style={{
              left: `${10 + i * 5.5}%`,
              top: `${20 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -25 - (i * 1.5), 0],
              x: [0, 15 - (i * 1), 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.8, 0.8],
              rotate: [0, 360, 720]
            }}
            transition={{
              duration: 10 + (i * 0.3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
        ))}
        
        {/* Luxury texture overlay */}
        <motion.div
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"],
            opacity: [0.05, 0.2, 0.05]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 luxury-texture"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12 relative z-10">
        {/* Enhanced header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3, type: "spring" }}
            className="inline-flex items-center justify-center mb-8"
          >
            <motion.div 
              whileHover={{ 
                scale: 1.3, 
                rotate: 360,
                boxShadow: "0 0 40px rgba(6,3,10,0.6)"
              }}
              transition={{ duration: 1 }}
              className="w-20 h-20 bg-Color-Netural-Black flex items-center justify-center shadow-2xl cursor-pointer rounded-full"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.3, 1]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Gem className="h-10 w-10 text-Color-Netural-White" />
              </motion.div>
            </motion.div>
          </motion.div>
          
          <h3 className="typography-h2 text-Color-Netural-Black mb-6 font-bold">
            Choose Your <span className="text-Color-Dark-500">Collection</span>
          </h3>
          
          {/* Unifying Element */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "140px" }}
            transition={{ duration: 1, delay: 0.6 }}
            className="h-[3px] bg-gradient-to-r from-transparent via-Color-Light-300 to-transparent mx-auto mb-8 sm:mb-10 lg:mb-12"
          />
          
          <p className="typography-body-lg text-Color-Netural-Black/80 max-w-3xl mx-auto font-medium">
            Each collection represents a unique story and collaboration
          </p>
        </motion.div>

        {/* Enhanced tabs container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative"
        >
          {/* Animated background indicator */}
          <motion.div
            className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-Color-Netural-Black via-Color-Dark-500 to-Color-Netural-Black shadow-xl"
            initial={{ width: 0 }}
            animate={{ 
              width: `${(collections.findIndex(c => c.id === activeCollection) + 1) * (100 / collections.length)}%`,
              x: `${collections.findIndex(c => c.id === activeCollection) * (100 / collections.length)}%`
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          
          <div className="flex flex-wrap justify-center md:grid md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {collections.map((collection, index) => (
              <motion.button
                key={collection.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCollectionChange(collection.id)}
                onMouseEnter={() => setHoveredTab(collection.id)}
                onMouseLeave={() => setHoveredTab(null)}
                className={`flex-shrink-0 w-full sm:w-auto p-4 sm:p-6 lg:p-8 transition-all duration-700 group relative overflow-hidden ${
                  activeCollection === collection.id
                    ? 'bg-gradient-to-br from-Color-Netural-White/90 to-Color-Netural-White/70 shadow-2xl transform scale-105 border-2 border-Color-Netural-White/80'
                    : 'bg-gradient-to-br from-Color-Netural-White/20 to-Color-Netural-White/10 hover:bg-gradient-to-br hover:from-Color-Netural-White/40 hover:to-Color-Netural-White/25 hover:shadow-xl border border-Color-Netural-White/30 hover:border-Color-Netural-White/60'
                }`}
              >
                {/* Advanced shimmer effect */}
                <AnimatePresence>
                  {(activeCollection === collection.id || hoveredTab === collection.id) && (
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 100 }}
                      exit={{ opacity: 0, x: 200 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-Color-Netural-Black/15 to-transparent"
                    />
                  )}
                </AnimatePresence>
                
                {/* Collection accent */}
                <motion.div 
                  animate={{ 
                    rotate: hoveredTab === collection.id ? [0, 15, -15, 0] : 0,
                    scale: hoveredTab === collection.id ? 1.4 : activeCollection === collection.id ? 1.2 : 1
                  }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl mb-4 relative z-10"
                >
                  {collection.accent}
                </motion.div>
                
                {/* Icon container */}
                <motion.div 
                  whileHover={{ 
                    scale: 1.3, 
                    rotate: 360,
                    boxShadow: "0 0 30px rgba(205,188,171,0.7)"
                  }}
                  transition={{ duration: 0.8 }}
                  className={`w-16 h-16 bg-gradient-to-r ${collection.color} flex items-center justify-center mx-auto mb-6 shadow-xl relative z-10`}
                >
                  <collection.icon className="h-8 w-8 text-white" />
                </motion.div>
                
                {/* Content */}
                <div className="text-center relative z-10">
                  <motion.h4 
                    animate={{ 
                      color: activeCollection === collection.id ? '#06030A' : hoveredTab === collection.id ? '#06030A' : '#0C0A09'
                    }}
                    className="typography-h6 font-bold mb-2 text-Color-Netural-Black"
                  >
                    {collection.title}
                  </motion.h4>
                  
                  <motion.p 
                    animate={{ 
                      opacity: hoveredTab === collection.id ? 1 : 0.8
                    }}
                    className={`typography-caption mb-3 font-medium ${
                      activeCollection === collection.id ? 'text-Color-Dark-500' : 'text-Color-Netural-Black/70 group-hover:text-Color-Dark-500'
                    }`}
                  >
                    {collection.subtitle}
                  </motion.p>
                  
                  {/* Expandable description */}
                  <AnimatePresence>
                    {(hoveredTab === collection.id || activeCollection === collection.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="overflow-hidden"
                      >
                        <p className="typography-caption text-Color-Netural-Black/80 leading-relaxed font-medium">
                          {collection.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Active indicator */}
                  {activeCollection === collection.id && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-4 w-8 h-1 bg-Color-Netural-Black mx-auto shadow-lg rounded-full"
                    />
                  )}
                </div>
                
                {/* Floating decorative elements */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{ duration: 3 + index * 0.5, repeat: Infinity }}
                  className="absolute top-2 right-2 w-3 h-3 bg-Color-Netural-White/40 rounded-full"
                />
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{ duration: 4 + index * 0.3, repeat: Infinity, delay: 1 }}
                  className="absolute bottom-2 left-2 w-2 h-2 bg-Color-Netural-White/30 rounded-full"
                />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Collection stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 lg:gap-12 typography-body text-Color-Netural-Black">
            {[
              { text: `${collections.length} Exclusive Collections`, delay: 0 },
              { text: "Limited Edition Pieces", delay: 0.2 },
              { text: "Meaningful Collaborations", delay: 0.4 }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + item.delay }}
                className="flex items-center text-center sm:text-left"
              >
                <motion.div 
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                  className="w-2 h-2 bg-Color-Netural-Black rounded-full mr-3"
                />
                <span className="font-semibold">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};