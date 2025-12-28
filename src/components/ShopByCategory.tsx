import React, { useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence, LayoutGroup } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Diamond, Sparkles, Star, Crown, Gem, Filter, 
  ShoppingBag, ArrowRight, ChevronRight 
} from "lucide-react";
import { useTranslation } from '../context/TranslationContext';
import { T } from "./T";

// 1. DATA DEFINITION (This was missing)
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
  }
];

// 2. COMPONENT LOGIC
interface ShopByCategoryProps {
  onNavigate: (page: string) => void;
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [inViewRef, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const filtered = useMemo(() => {
    if (selectedFilter === "all") return CATEGORIES;
    if (selectedFilter === "featured") return CATEGORIES.filter(c => c.featured);
    return CATEGORIES.filter(c => c.tags.includes(selectedFilter));
  }, [selectedFilter]);

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
            <h2 className="text-6xl md:text-8xl font-serif text-Color-Dark-500 leading-none">
              Shop By <br />
              <span className="italic text-Color-Light-300 ml-0 md:ml-24">Category</span>
            </h2>
          </motion.div>
        </header>

        {/* Filters */}
        <nav className="mb-20 bg-white/40 backdrop-blur-xl border-y border-black/[0.03] py-6">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {['all', 'featured', 'rings', 'necklaces'].map((f) => (
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
        </nav>

        {/* Grid */}
        <LayoutGroup>
          <motion.div layout className="grid grid-cols-1 md:grid-cols-6 gap-6 lg:gap-10">
            <AnimatePresence mode="popLayout">
              {filtered.map((category) => (
                <motion.div
                  key={category.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`${category.size === 'large' ? 'md:col-span-4' : 'md:col-span-2'} relative aspect-[4/5] bg-white overflow-hidden shadow-sm group cursor-pointer`}
                  onClick={() => onNavigate(category.page)}
                >
                  <img src={category.image} className="w-full h-full object-contain p-12 transition-transform duration-700 group-hover:scale-110" alt={category.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
                    <h4 className="text-2xl font-serif">{category.title}</h4>
                    <p className="text-[10px] uppercase tracking-widest mt-2">{category.priceRange}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  );
};