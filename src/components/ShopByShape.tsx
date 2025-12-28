import React, { useState } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { buildImageKitUrl } from '../utils/imagekit';
import { useTranslation } from '../context/TranslationContext';
import { getCanonicalShape } from '../utils/shapeUtils';
import { ArrowUpRight } from 'lucide-react';

interface ShopByShapeProps {
  onNavigate: (page: string) => void;
}

export const ShopByShape: React.FC<ShopByShapeProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [hoveredShape, setHoveredShape] = useState<string | null>(null);

  const shapes = [
    { name: 'Round', imagePath: '20165%201.png', lifestyle: 'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg' },
    { name: 'Oval', imagePath: '20165%203.png', lifestyle: 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg' },
    { name: 'Princess', imagePath: '20165%208.png', lifestyle: 'https://images.pexels.com/photos/1472662/pexels-photo-1472662.jpeg' },
    { name: 'Pear', imagePath: '20165%2012.png', lifestyle: 'https://images.pexels.com/photos/1448665/pexels-photo-1448665.jpeg' },
    { name: 'Marquise', imagePath: 'image%201%20(2).png', lifestyle: 'https://images.pexels.com/photos/1448665/pexels-photo-1448665.jpeg' },
    { name: 'Emerald', imagePath: '20165%209.png', lifestyle: 'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg' },
    { name: 'Cushion', imagePath: '20165%204.png', lifestyle: 'https://images.pexels.com/photos/3946630/pexels-photo-3946630.jpeg' }
  ];

  return (
    <section ref={ref} className="relative py-24 sm:py-40 bg-[#FAF9F6] overflow-hidden">
      {/* Background Decorative Text */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none opacity-[0.02] select-none">
        <h2 className="text-[25vw] font-serif italic text-black">Cuts</h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="mb-24 lg:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-Color-Light-300 font-black mb-6 block">
              The Art of the Cut
            </span>
            <h2 className="text-5xl md:text-8xl font-serif text-Color-Dark-500 leading-none">
              Explore <br />
              <span className="italic text-Color-Light-300 ml-0 md:ml-20">By Shape</span>
            </h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 0.6 } : {}}
            className="max-w-xs text-sm uppercase tracking-widest leading-relaxed text-Color-Dark-500"
          >
            {t('Each diamond cut tells a different story. Discover the shape that reflects your unique style.')}
          </motion.p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-black/5 border border-black/5 overflow-hidden">
          {shapes.map((shape, idx) => (
            <ShapeCard 
              key={shape.name} 
              shape={shape} 
              idx={idx} 
              onNavigate={onNavigate}
              isHovered={hoveredShape === shape.name}
              setHovered={() => setHoveredShape(shape.name)}
              clearHover={() => setHoveredShape(null)}
            />
          ))}
          
          {/* Static CTA Square */}
          <div className="aspect-square bg-Color-Dark-500 flex flex-col items-center justify-center p-8 text-center text-white group cursor-pointer" onClick={() => onNavigate('/shop')}>
             <span className="text-[10px] uppercase tracking-[0.3em] mb-4 opacity-60">View All</span>
             <h4 className="text-2xl font-serif italic mb-6">Signature Selection</h4>
             <ArrowUpRight className="w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
};

const ShapeCard = ({ shape, idx, onNavigate, isHovered, setHovered, clearHover }: any) => {
  // Magnetic Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 10 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 10 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={setHovered}
      onMouseLeave={() => { clearHover(); mouseX.set(0); mouseY.set(0); }}
      onClick={() => onNavigate(`/shop?shape=${getCanonicalShape(shape.name).toLowerCase()}`)}
      className="relative aspect-square bg-white group cursor-pointer overflow-hidden flex flex-col items-center justify-center p-12 transition-colors duration-700"
    >
      {/* Background Lifestyle Image on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 z-0"
          >
            <img src={shape.lifestyle} className="w-full h-full object-cover grayscale" alt="" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diamond Cut Icon */}
      <motion.div 
        style={{ x: springX, y: springY }}
        className="relative z-10 w-full aspect-square flex items-center justify-center mb-8"
      >
        <motion.img
          animate={{ rotate: isHovered ? [0, 5, -5, 0] : 0 }}
          transition={{ duration: 4, repeat: Infinity }}
          src={buildImageKitUrl(shape.imagePath, { width: 300 })}
          className="w-3/4 h-3/4 object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] group-hover:drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
          alt={shape.name}
        />
      </motion.div>

      {/* Label */}
      <div className="relative z-10 text-center">
        <span className="text-[9px] uppercase tracking-[0.4em] text-Color-Light-300 font-black mb-2 block opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          Discover
        </span>
        <h3 className="text-sm uppercase tracking-widest font-bold text-Color-Dark-500 group-hover:text-Color-Light-300 transition-colors">
          {shape.name}
        </h3>
      </div>

      {/* Bottom Border Accent */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        className="absolute bottom-0 left-0 w-full h-[2px] bg-Color-Light-300 origin-left"
      />
    </motion.div>
  );
};