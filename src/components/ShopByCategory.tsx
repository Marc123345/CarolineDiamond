import React, { useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence, LayoutGroup } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Diamond, Sparkles, Crown, Gem, 
  ShoppingBag, ArrowRight, ChevronRight 
} from "lucide-react";
import { useTranslation } from '../context/TranslationContext';

/* Ensure CATEGORIES and SortId types are imported or 
  defined at the top of your file. 
*/

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

  // Refined Filtering and Sorting Logic
  const filteredAndSorted = useMemo(() => {
    let result = selectedFilter === "all" 
      ? CATEGORIES 
      : CATEGORIES.filter(c => selectedFilter === "featured" ? c.featured : c.tags.includes(selectedFilter));
    
    // Applying Sorting
    if (sortBy === "price-low") return [...result].sort((a, b) => parsePrice(a.priceRange) - parsePrice(b.priceRange));
    if (sortBy === "name") return [...result].sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [selectedFilter, sortBy]);

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-40 bg-[#FCFAFB] overflow-hidden">
      {/* Background Editorial Watermark */}
      <motion.div 
        style={{ x: useTransform(smoothProgress, [0, 1], ["10%", "-10%"]) }}
        className="absolute top-20 left-0 text-[18vw] font-serif italic text-black/[0.02] whitespace-nowrap select-none pointer-events-none"
      >
        Antwerp Craftsmanship Antwerp Craftsmanship
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- DYNAMIC HEADER --- */}
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <motion.div
            ref={inViewRef}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-Color-Light-300 font-black mb-6 block">
              Curated Masterpieces
            </span>
            <h2 className="text-6xl md:text-8xl font-serif text-Color-Dark-500 leading-[0.9] mb-4">
              Shop By <br />
              <span className="italic text-Color-Light-300 ml-0 md:ml-24">Category</span>
            </h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 0.5 } : {}}
            className="max-w-xs text-sm uppercase tracking-widest leading-relaxed text-Color-Dark-500"
          >
            {t('Handcrafted jewelry including bespoke rings and signature necklaces, designed for your legacy.')}
          </motion.p>
        </header>

        {/* --- MINIMALIST FILTERS (Sticky Bar) --- */}
        <nav className="mb-20 sticky top-24 z-30 bg-white/60 backdrop-blur-xl border-y border-black/[0.05] py-6">
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
            
            <div className="flex items-center gap-4 border-l border-black/5 pl-8">
              <span className="text-[9px] uppercase tracking-widest font-black text-Color-Light-300">Sort</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[11px] uppercase tracking-widest font-bold border-none focus:ring-0 cursor-pointer text-Color-Dark-500"
              >
                <option value="popular">Popularity</option>
                <option value="price-low">Value</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>
        </nav>

        {/* --- EDITORIAL ASYMMETRIC GRID --- */}
        <LayoutGroup>
          <motion.div layout className="grid grid-cols-1 md:grid-cols-6 gap-6 lg:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredAndSorted.map((category) => (
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

        {/* --- REFINED FOOTER --- */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-40 bg-Color-Dark-500 text-white p-12 lg:p-24 relative overflow-hidden group shadow-2xl rounded-sm"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none grayscale">
            <img src="https://diamondsbycs.com/images/uploads/upload-655239166023c.JPG" className="w-full h-full object-cover" />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <Crown className="w-8 h-8 text-Color-Champagne-Gold mb-8" />
            <h3 className="text-4xl md:text-6xl font-serif mb-8 leading-tight italic">Antwerp Heritage</h3>
            <p className="text-Color-Light-300/60 text-lg font-light mb-12 leading-loose max-w-lg">
              Explore the full depth of our collection. Every piece is handcrafted in Antwerp and certified by the world's leading gemological institutes.
            </p>
            <button 
              onClick={() => onNavigate('/shop')}
              className="group flex items-center gap-6 text-[11px] uppercase tracking-[0.5em] font-black"
            >
              Full Boutique
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

const CategoryPortal = ({ category, onNavigate, isHovered, onHover, onLeave }: any) => {
  const gridSpan = category.size === 'large' ? 'md:col-span-4' : category.size === 'medium' ? 'md:col-span-3' : 'md:col-span-2';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`${gridSpan} relative aspect-[4/5] bg-white group cursor-pointer overflow-hidden border border-black/[0.03] transition-all duration-700 hover:shadow-2xl hover:border-black/[0.08]`}
      onClick={() => onNavigate(category.page)}
    >
      {/* Background Depth layer */}
      <div className="absolute inset-0 bg-[#FBFBFB]" />
      <motion.div 
        animate={{ scale: isHovered ? 1.05 : 1, opacity: isHovered ? 0.2 : 0.05 }}
        className="absolute inset-0 grayscale transition-all duration-1000 blur-sm"
      >
        <img src={category.image} className="w-full h-full object-cover" alt="" />
      </motion.div>

      {/* Center Floating Object */}
      <div className="absolute inset-0 p-16 flex items-center justify-center">
        <motion.img
          animate={{ 
            y: isHovered ? -15 : 0,
            rotate: isHovered ? 3 : 0,
            scale: isHovered ? 1.1 : 1,
            filter: isHovered ? 'drop-shadow(0 40px 50px rgba(0,0,0,0.15))' : 'drop-shadow(0 10px 10px rgba(0,0,0,0.03))'
          }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          src={category.image}
          className="w-full h-full object-contain z-20"
        />
      </div>

      {/* Info Header (Top) */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-30 group-hover:opacity-0 transition-opacity duration-500">
        <div>
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-black text-Color-Dark-500">{category.title}</h4>
          <p className="text-[9px] text-Color-Light-300 mt-1 uppercase font-bold tracking-widest">{category.productCount} Pieces</p>
        </div>
        {category.featured && <Sparkles className="w-4 h-4 text-Color-Champagne-Gold opacity-50" />}
      </div>

      {/* Hover CTA Footer (Bottom) */}
      <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end bg-gradient-to-t from-white via-white/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700">
        <span className="text-[9px] uppercase tracking-[0.4em] font-black text-Color-Light-300 mb-2">Refining Search</span>
        <h4 className="text-xl font-serif text-Color-Dark-500 mb-4">{category.title}</h4>
        <div className="flex justify-between items-center border-t border-black/5 pt-4">
          <span className="text-[10px] uppercase tracking-widest font-black text-Color-Gray-400">{category.priceRange}</span>
          <div className="flex items-center gap-2 text-Color-Champagne-Gold font-bold text-[10px] uppercase tracking-widest">
            Enter <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};