import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Play, Camera, ExternalLink, Heart, Star, Crown, Sparkles, 
  Award, Shield, Gem, Diamond, Palette, Users, Gift
} from 'lucide-react';
import { WireframeImage } from '../WireframeImage';
import { collectiesContent } from '../../config/collectiesConfig';

interface CollectionContentProps {
  activeCollection: string;
  onNavigate: (page: string) => void;
}

export const CollectionContent: React.FC<CollectionContentProps> = ({ 
  activeCollection, 
  onNavigate 
}) => {
  const collection = collectiesContent.collections[activeCollection];
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  if (!collection) return null;

  const getCollectionIcon = (collectionId: string) => {
    switch (collectionId) {
      case 'heartbeat': return { icon: Heart, color: 'from-red-500 to-pink-600', accent: '🦋' };
      case 'ann-demeulemeester': return { icon: Sparkles, color: 'from-purple-500 to-indigo-600', accent: '✨' };
      case 'carey': return { icon: Users, color: 'from-pink-500 to-rose-600', accent: '👭' };
      case 'think-pink': return { icon: Heart, color: 'from-pink-600 to-rose-700', accent: '🎗️' };
      case 'kim-van-oncen': return { icon: Star, color: 'from-blue-500 to-indigo-600', accent: '⭐' };
      default: return { icon: Diamond, color: 'from-Color-Netural-White0 to-Color-Netural-White600', accent: '💎' };
    }
  };

  const collectionMeta = getCollectionIcon(activeCollection);

  // Properly destructure the icon component for JSX rendering
  const { icon: CollectionIcon } = collectionMeta;

  return (
    <motion.section 
      ref={ref}
      key={activeCollection}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="py-20 sm:py-32 lg:py-40 xl:py-48 bg-gradient-to-br from-Color-Netural-White via-Color-Champagne-Gold/8 to-Color-Netural-White premium-texture relative overflow-hidden"
    >
      {/* Advanced parallax background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-15 pointer-events-none"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.6, 1],
            opacity: [0.06, 0.18, 0.06],
            rotate: [0, 25, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-Color-Champagne-Gold/20 to-Color-Champagne-Gold/5 rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.05, 0.15, 0.05],
            rotate: [0, -20, 0]
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-Color-Champagne-Gold/15 to-Color-Champagne-Gold/3 rounded-full"
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12 relative z-10">
        {/* Collection header */}
        <motion.div 
          ref={inViewRef}
          initial={{ opacity: 0, y: 80 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
          transition={{ duration: 1 }}
          className="text-center mb-14"
        >
          {/* Collection icon and title */}
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ duration: 1.2, delay: 0.3, type: "spring", stiffness: 80 }}
            className="inline-flex items-center justify-center mb-12"
          >
            <motion.div 
              whileHover={{ 
                scale: 1.3, 
                rotate: 360,
                boxShadow: "0 0 50px rgba(201,168,106,0.8)"
              }}
              transition={{ duration: 1 }}
              className={`w-28 h-28 bg-gradient-to-r ${collectionMeta.color} flex items-center justify-center shadow-2xl cursor-pointer relative overflow-hidden rounded-full`}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.4, 1]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <CollectionIcon className="h-14 w-14 text-white" />
              </motion.div>
              
              {/* Sparkle effects */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${15 + i * 12}%`,
                    top: `${15 + (i % 2) * 70}%`,
                  }}
                  animate={{
                    scale: [0, 2, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <span className="typography-caption uppercase tracking-[0.3em] text-Color-Champagne-Gold font-bold bg-Color-Champagne-Gold/15 px-6 py-3 rounded-full shadow-lg border border-Color-Champagne-Gold/30">
              {collectionMeta.accent} Exclusive Collection
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="typography-h1 text-Color-Dark-500 mb-8 relative"
          >
            <motion.span
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 1, delay: 1 }}
            >
              {collection.title.split(' ').slice(0, -1).join(' ')}
            </motion.span>{' '}
            <motion.span 
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-Color-Champagne-Gold relative"
            >
              {collection.title.split(' ').slice(-1)[0]}
              <motion.div 
                initial={{ width: 0 }}
                animate={inView ? { width: "100%" } : { width: 0 }}
                transition={{ duration: 2, delay: 1.6 }}
                className="absolute -bottom-6 left-0 h-[6px] bg-gradient-to-r from-transparent via-Color-Champagne-Gold/90 to-transparent"
              />
            </motion.span>
          </motion.h1>
          
          {collection.subtitle && (
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="typography-h3 text-Color-Champagne-Gold mb-6 italic font-medium"
            >
              {collection.subtitle}
            </motion.h2>
          )}
            {/* Unifying Element */}
            <motion.div 
              initial={{ width: 0 }}
              animate={inView ? { width: "180px" } : { width: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="h-[3px] bg-gradient-to-r from-transparent via-Color-Light-300 to-transparent mx-auto mb-8 sm:mb-10 lg:mb-12"
            />

          
          {collection.tagline && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="typography-h4 text-Color-Dark-500 mb-6"
            >
              {collection.tagline}
            </motion.p>
          )}
          
          {collection.celebration && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="inline-block bg-gradient-to-r from-Color-Champagne-Gold to-Color-Champagne-Gold/80 text-Color-Netural-Black px-8 py-4 rounded-full shadow-xl font-bold"
            >
              <span className="typography-body font-bold">{collection.celebration}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced content sections */}
        <div className="space-y-20">
          {collection.sections.map((section, sectionIndex) => (
            <motion.div 
              key={sectionIndex}
              initial={{ opacity: 0, y: 100 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
              transition={{ duration: 1, delay: 0.3 * sectionIndex }}
              className="relative"
            >
              {section.type === 'text-image' && (
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                  <motion.div 
                    initial={{ opacity: 0, x: -60 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
                    transition={{ duration: 0.8, delay: 0.4 + (sectionIndex * 0.2) }}
                    className="space-y-8"
                  >
                    {section.title && (
                      <motion.h3 
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, delay: 0.6 + (sectionIndex * 0.2) }}
                        className="typography-h2 text-Color-Dark-500 mb-8 relative"
                      >
                        {section.title}
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={inView ? { width: "80px" } : { width: 0 }}
                          transition={{ duration: 1, delay: 0.8 + (sectionIndex * 0.2) }}
                          className="absolute -bottom-3 left-0 h-[4px] bg-gradient-to-r from-Color-Champagne-Gold to-Color-Champagne-Gold/40"
                        />
                      </motion.h3>
                    )}
                    
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.8, delay: 0.8 + (sectionIndex * 0.2) }}
                      whileHover={{ scale: 1.02, y: -8 }}
                      className="bg-gradient-to-br from-Color-Netural-White to-Color-Champagne-Gold/15 p-10 rounded-2xl shadow-xl border border-Color-Champagne-Gold/30 relative overflow-hidden"
                    >
                      {/* Background pattern */}
                      <motion.div
                        animate={{ 
                          backgroundPosition: ["0% 0%", "100% 100%"],
                          opacity: [0.05, 0.12, 0.05]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 premium-texture"
                      />
                      
                      <div className="space-y-6 relative z-10">
                        {section.content.map((paragraph, pIndex) => (
                          <motion.p 
                            key={pIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: 1 + (pIndex * 0.1) }}
                            className="typography-body-lg text-Color-Rich-Gray leading-relaxed"
                          >
                            {paragraph}
                          </motion.p>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: 60 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
                    transition={{ duration: 0.8, delay: 0.6 + (sectionIndex * 0.2) }}
                    className="relative group"
                  >
                    <motion.div 
                      whileHover={{ 
                        scale: 1.05, 
                        rotate: 1,
                        boxShadow: "0 40px 80px rgba(0,0,0,0.3)"
                      }}
                      transition={{ duration: 0.8 }}
                      className="relative overflow-hidden rounded-3xl shadow-2xl"
                    >
                      {/* Use specific images for each collection */}
                      {activeCollection === 'heartbeat' && section.type === 'text-image' ? (
                        <img
                          src="https://diamondsbycs.com/images/uploads/upload-6556a2eac8217.JPG"
                          alt="A Heartbeat for Wildlife"
                          className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : activeCollection === 'ann-demeulemeester' && section.type === 'text-image' ? (
                        <img
                          src="https://diamondsbycs.com/images/uploads/upload-656f1771ce3c7.jpg"
                          alt="Ann Demeulemeester Collection"
                          className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : activeCollection === 'carey' && section.type === 'text-image' ? (
                        <img
                          src="https://diamondsbycs.com/images/uploads/upload-6556a7c19d9a3.JPG"
                          alt="Carey Collection"
                          className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : activeCollection === 'think-pink' && section.type === 'text-image' ? (
                        <img
                          src="https://diamondsbycs.com/images/uploads/upload-6556a2ead3360.JPG"
                          alt="Think Pink Collection"
                          className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : activeCollection === 'kim-van-oncen' && section.type === 'text-image' ? (
                        <img
                          src="https://diamondsbycs.com/images/uploads/upload-6556a2ead4c90.JPG"
                          alt="Kim Van Oncen Collection"
                          className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <WireframeImage
                          width="w-full"
                          height="h-96"
                          label={section.imageLabel || collection.title}
                          className="group-hover:scale-110 transition-transform duration-700"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      
                      {/* Collection badge */}
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.2, 1],
                          boxShadow: [
                            "0 0 20px rgba(201,168,106,0.4)",
                            "0 0 40px rgba(201,168,106,0.8)",
                            "0 0 20px rgba(201,168,106,0.4)"
                          ]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-6 right-6 bg-Color-Champagne-Gold/95 px-6 py-3 rounded-full shadow-xl"
                      >
                        <span className="typography-body text-Color-Netural-White font-bold">
                          {collectionMeta.accent} Collection
                        </span>
                      </motion.div>
                      
                      <div className="absolute bottom-8 left-8 right-8">
                        <h4 className="typography-h4 text-Color-Netural-White font-bold mb-3" style={{ textShadow: '3px 3px 12px rgba(0,0,0,0.9)' }}>
                          {section.imageLabel || collection.title}
                        </h4>
                        <p className="typography-h5 text-white font-bold italic">
                          Exclusive designer collaboration
                        </p>
                      </div>
                    </motion.div>
                    
                    {/* Decorative elements */}
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.5, 1],
                        rotate: [0, 180, 360],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-6 -left-6 w-16 h-16 bg-Color-Champagne-Gold shadow-2xl rounded-full"
                    />
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                      className="absolute -bottom-6 -right-6 w-12 h-12 bg-Color-Champagne-Gold shadow-xl rounded-full"
                    />
                  </motion.div>
                </div>
              )}

              {section.type === 'highlighted' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, delay: 0.4 + (sectionIndex * 0.2) }}
                  whileHover={{ scale: 1.02, y: -8 }}
                  className="bg-gradient-to-r from-Color-Netural-Black via-Color-Dark-500 to-Color-Netural-Black text-Color-Netural-White p-16 rounded-3xl shadow-2xl relative overflow-hidden"
                >
                  {/* Animated background */}
                  <motion.div
                    animate={{ 
                      backgroundPosition: ["0% 0%", "100% 100%"],
                      opacity: [0.1, 0.4, 0.1]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 luxury-texture"
                  />
                  
                  <div className="relative z-10">
                    {section.title && (
                      <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, delay: 0.6 + (sectionIndex * 0.2) }}
                        className="flex items-center justify-center mb-12"
                      >
                        <motion.div 
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.8 }}
                          className="w-16 h-16 bg-Color-Light-300 flex items-center justify-center shadow-2xl mr-6"
                        >
                          <Award className="h-8 w-8 text-Color-Netural-White" />
                        </motion.div>
                        <h3 className="typography-h2 text-Color-Netural-White font-bold">
                          {section.title}
                        </h3>
                      </motion.div>
                    )}
                    
                    <div className="space-y-8">
                      {section.content.map((paragraph, pIndex) => (
                        <motion.p 
                          key={pIndex}
                          initial={{ opacity: 0, y: 30 }}
                          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                          transition={{ duration: 0.8, delay: 0.8 + (pIndex * 0.2) }}
                          className="typography-body-lg text-Color-Light-300 leading-relaxed max-w-5xl mx-auto"
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.6, 1],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute top-8 right-8 w-16 h-16 bg-Color-Light-300/20 rounded-full"
                  />
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.4, 1],
                      opacity: [0.2, 0.6, 0.2]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-8 left-8 w-12 h-12 bg-Color-Light-300/15 rounded-full"
                  />
                </motion.div>
              )}

              {section.type === 'dark' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, delay: 0.4 + (sectionIndex * 0.2) }}
                  whileHover={{ scale: 1.02, y: -8 }}
                  className="bg-gradient-to-br from-Color-Netural-Black to-Color-Dark-500 text-Color-Netural-White p-16 rounded-3xl shadow-2xl relative overflow-hidden"
                >
                  {/* Enhanced background effects */}
                  <motion.div
                    animate={{ 
                      backgroundPosition: ["0% 0%", "100% 100%"],
                      opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 silk-texture"
                  />
                  
                  <div className="relative z-10">
                    {section.title && (
                      <motion.h3 
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, delay: 0.6 + (sectionIndex * 0.2) }}
                        className="typography-h2 text-Color-Netural-White mb-12 text-center relative"
                      >
                        {section.title}
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={inView ? { width: "100px" } : { width: 0 }}
                          transition={{ duration: 1.5, delay: 0.8 + (sectionIndex * 0.2) }}
                          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-[4px] bg-gradient-to-r from-transparent via-Color-Champagne-Gold/80 to-transparent"
                        />
                      </motion.h3>
                    )}
                    
                    <div className="space-y-8">
                      {section.content.map((paragraph, pIndex) => (
                        <motion.p 
                          key={pIndex}
                          initial={{ opacity: 0, y: 20 }}
                          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                          transition={{ duration: 0.6, delay: 0.8 + (pIndex * 0.1) }}
                          className="typography-body-lg text-Color-Netural-White leading-relaxed max-w-5xl mx-auto"
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                    </div>
                    
                    {section.centerText && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.8, delay: 1.2 + (sectionIndex * 0.2) }}
                        className="text-center mt-10"
                      >
                        <div className="bg-Color-Champagne-Gold/20 p-8 rounded-2xl border border-Color-Champagne-Gold/40 max-w-3xl mx-auto">
                          <p className="typography-h5 text-white font-bold italic">
                            {section.centerText}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Enhanced floating elements */}
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.8, 1],
                      opacity: [0.2, 0.6, 0.2],
                      rotate: [0, 360, 720]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-12 right-12 w-20 h-20 bg-Color-Champagne-Gold/25 rounded-full"
                  />
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.15, 0.5, 0.15],
                      rotate: [0, -360, -720]
                    }}
                    transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-12 left-12 w-16 h-16 bg-Color-Champagne-Gold/20 rounded-full"
                  />
                </motion.div>
              )}

              {section.type === 'text-only' && (
                <motion.div 
                  initial={{ opacity: 0, y: 60 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                  transition={{ duration: 0.8, delay: 0.4 + (sectionIndex * 0.2) }}
                  className="max-w-6xl mx-auto"
                >
                  {section.title && (
                    <motion.h3 
                      initial={{ opacity: 0, y: 30 }}
                      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                      transition={{ duration: 0.8, delay: 0.6 + (sectionIndex * 0.2) }}
                      className="typography-h3 text-Color-Dark-500 mb-12 text-center"
                    >
                      {section.title}
                    </motion.h3>
                  )}
                  
                  <div className="grid gap-8">
                    {section.content.map((paragraph, pIndex) => (
                      <motion.div 
                        key={pIndex}
                        initial={{ opacity: 0, x: pIndex % 2 === 0 ? -40 : 40 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: pIndex % 2 === 0 ? -40 : 40 }}
                        transition={{ duration: 0.8, delay: 0.8 + (pIndex * 0.2) }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="bg-gradient-to-r from-Color-Netural-White to-Color-Champagne-Gold/12 p-8 rounded-2xl shadow-lg border border-Color-Champagne-Gold/30 relative overflow-hidden"
                      >
                        {/* Hover shimmer */}
                        <motion.div
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 1, ease: "easeInOut" }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />
                        
                        <p className="typography-body-lg text-Color-Rich-Gray leading-relaxed relative z-10">
                          {paragraph}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {section.type === 'making-of' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 1, delay: 0.4 + (sectionIndex * 0.2) }}
                  className="bg-gradient-to-br from-Color-Netural-Black to-Color-Dark-500 text-Color-Netural-White p-16 rounded-3xl shadow-2xl relative overflow-hidden"
                >
                  {/* Video background effects */}
                  <motion.div
                    animate={{ 
                      backgroundPosition: ["0% 0%", "100% 100%"],
                      opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 premium-texture"
                  />
                  
                  <div className="text-center relative z-10">
                    <motion.div 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                      transition={{ duration: 1, delay: 0.6 + (sectionIndex * 0.2), type: "spring" }}
                      className="w-24 h-24 bg-Color-Light-300/20 flex items-center justify-center mx-auto mb-8"
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.3, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Camera className="h-12 w-12 text-Color-Light-300" />
                      </motion.div>
                    </motion.div>
                    
                    <h3 className="typography-h2 text-Color-Netural-White mb-8">
                      {section.title}
                    </h3>
                    
                    <div className="bg-Color-Dark-500 rounded-2xl shadow-2xl aspect-video max-w-4xl mx-auto relative group">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                          whileHover={{ scale: 1.2 }}
                          transition={{ duration: 0.4 }}
                          className="w-24 h-24 bg-Color-Light-300/90 flex items-center justify-center shadow-2xl cursor-pointer"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Play className="h-12 w-12 text-Color-Netural-White ml-1" />
                          </motion.div>
                        </motion.div>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h5 className="typography-h5 text-Color-Netural-White mb-2">Making Of Video</h5>
                        <p className="typography-caption text-Color-Light-300">
                          {section.content[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Enhanced CTA section */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="text-center mt-32"
        >
          <motion.div 
            whileHover={{ scale: 1.02, y: -10 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-r from-Color-Champagne-Gold/30 to-Color-Champagne-Gold/20 p-12 sm:p-16 rounded-3xl shadow-2xl border border-Color-Champagne-Gold/50 max-w-5xl mx-auto relative overflow-hidden"
          >
            {/* Background pattern */}
            <motion.div
              animate={{ 
                backgroundPosition: ["0% 0%", "100% 100%"],
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 silk-texture"
            />
            
            <div className="relative z-10">
              <motion.h3 
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="typography-h2 text-Color-Netural-Black mb-8 font-bold"
              >
                Discover Your Perfect Collection
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="typography-body-xl text-Color-Netural-Black/80 mb-12 max-w-3xl mx-auto font-medium"
              >
                Each collection offers unique pieces that combine artistry with meaning. 
                Find the perfect piece that resonates with your story.
              </motion.p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.button 
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('/shop')}
                  className="bg-Color-Netural-Black text-Color-Netural-White hover:bg-Color-Dark-500 px-12 py-5 flex items-center justify-center text-lg font-semibold transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                >
                  <Gem className="mr-3 h-6 w-6" />
                  Shop Collections
                </motion.button>
                <motion.button 
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                  transition={{ duration: 0.6, delay: 1.8 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('/contact')}
                  className="border-2 border-Color-Netural-Black text-Color-Netural-Black hover:bg-Color-Netural-Black hover:text-Color-Netural-White px-12 py-5 flex items-center justify-center text-lg font-semibold transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                >
                  <Crown className="mr-3 h-6 w-6" />
                  Personal Consultation
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};