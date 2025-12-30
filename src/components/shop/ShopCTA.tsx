import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Sparkles, ArrowRight, Gem, PencilLine } from 'lucide-react';

interface ShopCTAProps {
  onNavigate: (page: string) => void;
}

export const ShopCTA: React.FC<ShopCTAProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth parallax motion for luxury depth
  const yShift = useSpring(useTransform(scrollYProgress, [0, 1], [20, -60]));
  const opacityFade = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative py-24 md:py-40 bg-[#FAF9F6] overflow-hidden"
    >
      {/* --- BACKGROUND LUXURY ENGINE --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <motion.span 
          style={{ x: yShift }}
          className="text-[15vw] font-serif italic text-black whitespace-nowrap absolute top-1/2 -translate-y-1/2 left-0"
        >
          Signature Bespoke Signature Bespoke
        </motion.span>
      </div>

      {/* Decorative Diamond Dust */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-Color-Champagne-Gold/5 rounded-full blur-[100px]" 
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div 
          style={{ opacity: opacityFade }}
          className="text-center space-y-10"
        >
          {/* Header State */}
          <div className="flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="w-12 h-12 rounded-full border border-Color-Champagne-Gold/30 flex items-center justify-center mb-8"
            >
              <PencilLine className="w-5 h-5 text-Color-Champagne-Gold" />
            </motion.div>
            
            <span className="text-[10px] uppercase tracking-[0.5em] text-Color-Light-300 font-black mb-6 block">
              The Bespoke Experience
            </span>
            
            <h2 className="text-5xl md:text-7xl font-serif text-Color-Dark-500 leading-tight">
              Beyond the <span className="italic">Collection</span>
            </h2>
          </div>

          {/* Description */}
          <p className="text-xl text-Color-Gray-600 font-light leading-relaxed max-w-2xl mx-auto">
            If your dream piece exists only in your imagination, Caroline will help you bring it to life. 
            Experience the artistry of bespoke craftsmanship in our Antwerp atelier.
          </p>

          {/* Luxury Action Button */}
          <div className="pt-8">
            <button
              onClick={() => onNavigate('/contact')}
              className="group relative inline-flex items-center gap-8 bg-Color-Dark-500 text-white px-12 py-6 overflow-hidden transition-all duration-700 hover:bg-black"
            >
              <span className="relative z-10 text-xs uppercase tracking-[0.4em] font-black">
                Book Private Consultation
              </span>

              <div className="relative z-10 flex items-center justify-center">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500 text-Color-Champagne-Gold" />
              </div>

              {/* Liquid Fill Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-Color-Champagne-Gold/20 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
            </button>
          </div>

          {/* Trust Footer */}
          <div className="pt-16 flex items-center justify-center gap-12 opacity-30 grayscale group-hover:grayscale-0 transition-all duration-1000">
            <div className="flex flex-col items-center">
              <Gem className="w-5 h-5 mb-2" />
              <span className="text-[8px] uppercase tracking-widest font-bold"> Antwerp Sourced</span>
            </div>
            <div className="w-px h-8 bg-black/10" />
            <div className="flex flex-col items-center">
              <Sparkles className="w-5 h-5 mb-2" />
              <span className="text-[8px] uppercase tracking-widest font-bold">Master Crafted</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};