import React, { useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence, LayoutGroup } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Diamond, Sparkles, Star, Crown, Gem, Filter, Grid2x2 as Grid, 
  ShoppingBag, ArrowRight, TrendingUp, CircleDot, Waves, ChevronRight 
} from "lucide-react";
import { useTranslation } from '../context/TranslationContext';

// ... (Category interface and CATEGORIES array remain the same) ...

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortId>("popular");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [inViewRef, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Filtering Logic
  const filtered = useMemo(() => {
    let result = selectedFilter === "all" ? CATEGORIES : CATEGORIES.filter(c => 
      selectedFilter === "featured" ? c.featured : c.tags.includes(selectedFilter)
    );
    // Add sorting logic here...
    return result;
  }, [selectedFilter, sortBy]);

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-40 bg-[#FCFAFB] overflow-hidden">
      {/* Background Editorial Watermark */}
      <motion.div 
        style={{ x: useTransform(smoothProgress, [0, 1], ["10%", "-10%"]) }}
        className="absolute top-20 left-0 text-[20vw] font-serif italic text-Color-Secondary/10 whitespace-nowrap select-none pointer-events-none"
      >
        L'Art du Diamant
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- DYNAMIC HEADER --- */}
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-Color-Light-300 font-black mb-6 block">
              Curated Masterpieces
            </span>
            <h2 className="text-6xl md:text-8xl font-serif text-Color-Dark-500 leading-none">
              Shop By <br />
              <span className="italic text-Color-Light-300 ml-0 md:ml-24">Category</span>
            </h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 0.6 } : {}}
            className="max-w-sm text-lg text-Color-Gray-600 font-light leading-relaxed"
          >
            {t('Explore handcrafted jewelry including engagement rings, earrings, and necklaces crafted for your unique love story.')}
          </motion.p>
        </header>

        {/* --- MINIMALIST FILTERS (The "Glass" Bar) --- */}
        <nav className="mb-20 sticky top-24 z-30 bg-white/40 backdrop-blur-xl border-y border-black/[0.03] py-6">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
              {['all', 'featured', 'rings', 'necklaces', 'earrings'].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFilter(f)}
                  className={`text-[11px] uppercase tracking-[0.3em] font-bold transition-all duration-500 relative py-2 ${
                    selectedFilter === f ? 'text-Color-Dark-500' : 'text-Color-Gray-400 hover:text-Color-Dark-500'
                  }`}
                >
                  {t(f)}
                  {selectedFilter === f && (
                    <motion.div layoutId="activeFilter" className="absolute bottom-0 left-0 w-full h-[2px] bg-Color-Champagne-Gold" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-widest font-black text-Color-Light-300">Sort</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[11px] uppercase tracking-widest font-bold border-none focus:ring-0 cursor-pointer"
              >
                <option value="popular">Popularity</option>
                <option value="price-low">Price Low-High</option>
                <option value="name">A-Z</option>
              </select>
            </div>
          </div>
        </nav>

        {/* --- EDITORIAL ASYMMETRIC GRID --- */}
        <LayoutGroup>
          <motion.div layout className="grid grid-cols-1 md:grid-cols-6 gap-6 lg:gap-10">
            <AnimatePresence mode="popLayout">
              {filtered.map((category, idx) => (
                <CategoryPortal 
                  key={category.id} 
                  category={category} 
                  onNavigate={onNavigate}
                  isHovered={hoveredId === category.id}
                  onHover={() => setHoveredId(category.id)}
                  onLeave={() => setHoveredId(null)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {/* --- FOOTER HERITAGE SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-40 bg-Color-Dark-500 text-white p-12 lg:p-24 relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <motion.img 
              style={{ y: useTransform(smoothProgress, [0, 1], [-50, 50]) }}
              src="https://diamondsbycs.com/images/uploads/upload-655239166023c.JPG" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <Crown className="w-10 h-10 text-Color-Light-300 mb-8" />
            <h3 className="text-4xl md:text-6xl font-serif mb-8 italic">Handcrafted Excellence</h3>
            <p className="text-Color-Light-300/80 text-lg font-light mb-12 leading-loose">
              Every stone is IGI-certified and every setting is forged by master artisans in Antwerp. 
              Discover the perfection of 18K gold and conflict-free lab diamonds.
            </p>
            <button 
              onClick={() => onNavigate('/shop')}
              className="group flex items-center gap-6 text-sm uppercase tracking-[0.4em] font-bold"
            >
              Discover Full Boutique
              <div className="w-12 h-[1px] bg-white group-hover:w-20 transition-all duration-500" />
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

const CategoryPortal = ({ category, onNavigate, isHovered, onHover, onLeave }: any) => {
  // Determine grid span based on "size" property
  const gridSpan = category.size === 'large' ? 'md:col-span-4' : category.size === 'medium' ? 'md:col-span-3' : 'md:col-span-2';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`${gridSpan} relative aspect-[4/5] bg-white group cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700`}
      onClick={() => onNavigate(category.page)}
    >
      {/* Background Depth Reveal */}
      <div className="absolute inset-0 bg-[#F9F9F9]" />
      <motion.div 
        animate={{ scale: isHovered ? 1.1 : 1, opacity: isHovered ? 0.4 : 0.1 }}
        className="absolute inset-0 grayscale transition-all duration-1000"
      >
        <img src={category.image} className="w-full h-full object-cover blur-md" alt="" />
      </motion.div>

      {/* Main Floating Product Image */}
      <div className="absolute inset-0 p-12 flex items-center justify-center">
        <motion.img
          animate={{ 
            y: isHovered ? -20 : 0,
            rotate: isHovered ? 5 : 0,
            filter: isHovered ? 'drop-shadow(0 30px 40px rgba(0,0,0,0.2))' : 'drop-shadow(0 10px 10px rgba(0,0,0,0.05))'
          }}
          transition={{ type: "spring", stiffness: 100 }}
          src={category.image}
          className="w-4/5 h-4/5 object-contain z-20"
        />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-Color-Light-300 mb-2">Explore Collection</span>
        <h4 className="text-2xl font-serif text-Color-Dark-500 mb-2">{category.title}</h4>
        <div className="flex justify-between items-center border-t border-black/5 pt-4">
          <span className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-500">{category.priceRange}</span>
          <ChevronRight className="w-4 h-4 text-Color-Champagne-Gold" />
        </div>
      </div>

      {/* Static Info (Visible when not hovered) */}
      <div className="absolute top-8 left-8 z-30 group-hover:opacity-0 transition-opacity">
        <h4 className="text-xs uppercase tracking-[0.3em] font-black text-Color-Dark-500">{category.title}</h4>
        <p className="text-[10px] text-Color-Light-300 mt-1 font-bold">{category.productCount} Pieces</p>
      </div>
    </motion.div>
  );
};