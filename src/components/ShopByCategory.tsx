import React, { useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence, LayoutGroup } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Diamond, Sparkles, Star, Crown, Gem, Filter, 
  ShoppingBag, ArrowRight, ChevronRight 
} from "lucide-react";
import { useTranslation } from '../context/TranslationContext';

// --- 1. MISSING DATA DEFINITIONS (FIX STARTS HERE) ---

interface Category {
  id: string;
  title: string;
  subtitle: string;
  page: string;
  icon: any;
  image: string;
  productCount: number;
  priceRange: string;
  featured: boolean;
  size: "small" | "medium" | "large";
  tags: string[];
}

type SortId = "popular" | "price-low" | "price-high" | "name";

const CATEGORIES: Category[] = [
  {
    id: "solitaire",
    title: "Solitaire Collection",
    subtitle: "Timeless elegance with a single diamond",
    page: "/shop?category=rings&style=solitaire",
    icon: Diamond,
    image: "https://cdn.shopify.com/s/files/1/0762/6122/8788/files/image1_31ae42c3-3e80-4e28-850d-20b7d6e13658.png",
    productCount: 11,
    priceRange: "From €1,700",
    featured: true,
    size: "large",
    tags: ["rings", "solitaire", "engagement"],
  },
  {
    id: "halo",
    title: "Halo Collection",
    subtitle: "Enhanced brilliance with surrounding diamonds",
    page: "/shop?category=rings&style=halo",
    icon: Sparkles,
    image: "https://cdn.shopify.com/s/files/1/0762/6122/8788/files/image1_45de09b4-4517-4fd3-afcd-da08887ea2aa.png",
    productCount: 11,
    priceRange: "From €1,850",
    featured: true,
    size: "medium",
    tags: ["rings", "halo", "engagement"],
  },
  {
    id: "necklaces",
    title: "Diamond Necklaces",
    subtitle: "Grace and sophistication",
    page: "/shop/necklaces",
    icon: Gem,
    image: "https://cdn.shopify.com/s/files/1/0762/6122/8788/files/unnamed_5.jpg?v=1761490616",
    productCount: 8,
    priceRange: "From €750",
    featured: true,
    size: "small",
    tags: ["necklaces", "elegant"],
  },
  {
    id: "earrings",
    title: "Diamond Earrings",
    subtitle: "Refined radiance",
    page: "/shop/earrings",
    icon: Star,
    image: "https://cdn.shopify.com/s/files/1/0762/6122/8788/files/unnamed_9.jpg?v=1761491389",
    productCount: 12,
    priceRange: "From €490",
    featured: true,
    size: "small",
    tags: ["earrings", "luxury"],
  }
];

// Helper to handle price sorting
function parsePrice(priceRange: string): number {
  const match = priceRange.match(/(\d+[\d,.]*)/);
  if (!match) return 0;
  return Number(match[1].replace(/[.,]/g, ""));
}

// --- 2. COMPONENT LOGIC ---

interface ShopByCategoryProps {
  onNavigate: (page: string) => void;
}

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

  const filteredAndSorted = useMemo(() => {
    let result = selectedFilter === "all" 
      ? CATEGORIES 
      : CATEGORIES.filter(c => selectedFilter === "featured" ? c.featured : c.tags.includes(selectedFilter));
    
    if (sortBy === "price-low") return [...result].sort((a, b) => parsePrice(a.priceRange) - parsePrice(b.priceRange));
    if (sortBy === "name") return [...result].sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [selectedFilter, sortBy]);

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-40 bg-[#FCFAFB] overflow-hidden">
      {/* Background Watermark */}
      <motion.div 
        style={{ x: useTransform(smoothProgress, [0, 1], ["10%", "-10%"]) }}
        className="absolute top-20 left-0 text-[18vw] font-serif italic text-black/[0.02] whitespace-nowrap select-none pointer-events-none"
      >
        Antwerp Craftsmanship Antwerp Craftsmanship
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <motion.div
            ref={inViewRef}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-Color-Light-300 font-black mb-6 block">
              Curated Masterpieces
            </span>
            <h2 className="text-6xl md:text-8xl font-serif text-Color-Dark-500 leading-[0.9] mb-4">
              Shop By <br />
              <span className="italic text-Color-Light-300 ml-0 md:ml-24">Category</span>
            </h2>
          </motion.div>
        </header>

        {/* Filters */}
        <nav className="mb-20 sticky top-24 z-30 bg-white/60 backdrop-blur-xl border-y border-black/[0.05] py-6">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
              {['all', 'featured', 'rings', 'necklaces', 'earrings'].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFilter(f)}
                  className={`text-[11px] uppercase tracking-[0.3em] font-bold transition-all relative py-2 ${
                    selectedFilter === f ? 'text-Color-Dark-500' : 'text-Color-Gray-400'
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
              <span className="text-[9px] uppercase tracking-widest font-black text-Color-Light-300">Sort</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortId)}
                className="bg-transparent text-[11px] uppercase tracking-widest font-bold border-none focus:ring-0 cursor-pointer"
              >
                <option value="popular">Popularity</option>
                <option value="price-low">Value</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>
        </nav>

        {/* Grid */}
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
      </div>
    </section>
  );
};

const CategoryPortal = ({ category, onNavigate, isHovered, onHover, onLeave }: any) => {
  const gridSpan = category.size === 'large' ? 'md:col-span-4' : 'md:col-span-2';

  return (
    <motion.div
      layout
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`${gridSpan} relative aspect-[4/5] bg-white group cursor-pointer overflow-hidden border border-black/[0.03] transition-all duration-700 hover:shadow-2xl`}
      onClick={() => onNavigate(category.page)}
    >
      <div className="absolute inset-0 bg-[#FBFBFB]" />
      <div className="absolute inset-0 p-16 flex items-center justify-center">
        <motion.img
          animate={{ y: isHovered ? -15 : 0, scale: isHovered ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 80 }}
          src={category.image}
          className="w-full h-full object-contain z-20"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end bg-gradient-to-t from-white via-white/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700">
        <span className="text-[9px] uppercase tracking-[0.4em] font-black text-Color-Light-300 mb-2">Refining Search</span>
        <h4 className="text-xl font-serif text-Color-Dark-500 mb-4">{category.title}</h4>
        <div className="flex justify-between items-center border-t border-black/5 pt-4">
          <span className="text-[10px] uppercase tracking-widest font-black text-Color-Gray-400">{category.priceRange}</span>
          <ChevronRight className="w-3 h-3 text-Color-Champagne-Gold" />
        </div>
      </div>
      
      <div className="absolute top-8 left-8 z-30 group-hover:opacity-0 transition-opacity">
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-black text-Color-Dark-500">{category.title}</h4>
      </div>
    </motion.div>
  );
};