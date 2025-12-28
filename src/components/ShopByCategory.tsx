import React, { useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Diamond,
  Sparkles,
  Star,
  Crown,
  Gem,
  Filter,
  Grid2x2 as Grid,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  CircleDot,
  Waves,
} from "lucide-react";
import { T } from "./T";
import { useTranslation } from '../context/TranslationContext';

interface ShopByCategoryProps {
  onNavigate: (page: string) => void;
}

interface Category {
  id: string;
  title: string;
  subtitle: string;
  page: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  image: string;
  productCount: number;
  priceRange: string; // e.g. "From €1,700"
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
    image:
      "https://cdn.shopify.com/s/files/1/0762/6122/8788/files/image1_31ae42c3-3e80-4e28-850d-20b7d6e13658.png",
    productCount: 11,
    priceRange: "From €1,700",
    featured: true,
    size: "large",
    tags: ["solitaire", "engagement", "diamond"],
  },
  {
    id: "halo",
    title: "Halo Collection",
    subtitle: "Enhanced brilliance with surrounding diamonds",
    page: "/shop?category=rings&style=halo",
    icon: Sparkles,
    image:
      "https://cdn.shopify.com/s/files/1/0762/6122/8788/files/image1_45de09b4-4517-4fd3-afcd-da08887ea2aa.png",
    productCount: 11,
    priceRange: "From €1,850",
    featured: true,
    size: "medium",
    tags: ["halo", "engagement", "diamond"],
  },
  {
    id: "wedding-rings",
    title: "Wedding Rings",
    subtitle: "Symbols of eternal love",
    page: "/wedding-rings",
    icon: Star,
    image:
      "https://cdn.shopify.com/s/files/1/0762/6122/8788/files/image1_31ae42c3-3e80-4e28-850d-20b7d6e13658.png",
    productCount: 18,
    priceRange: "From €1,500",
    featured: true,
    size: "medium",
    tags: ["wedding", "rings", "couples"],
  },
  {
    id: "necklaces",
    title: "Diamond Necklaces",
    subtitle: "Grace and sophistication",
    page: "/shop/necklaces",
    icon: Waves,
    image:
      "https://cdn.shopify.com/s/files/1/0762/6122/8788/files/unnamed_5.jpg?v=1761490616",
    productCount: 8,
    priceRange: "From €750",
    featured: true,
    size: "small",
    tags: ["necklaces", "diamond", "elegant"],
  },
  {
    id: "earrings",
    title: "Diamond Earrings",
    subtitle: "Sparkle with every movement",
    page: "/shop/earrings",
    icon: CircleDot,
    image:
      "https://cdn.shopify.com/s/files/1/0762/6122/8788/files/unnamed_9.jpg?v=1761491389",
    productCount: 12,
    priceRange: "From €490",
    featured: true,
    size: "small",
    tags: ["earrings", "diamond", "luxury"],
  },
  {
    id: "lab-grown",
    title: "Lab-Grown Diamonds",
    subtitle: "Ethical & sustainable beauty",
    page: "/shop?category=rings",
    icon: Gem,
    image:
      "https://cdn.shopify.com/s/files/1/0762/6122/8788/files/image2_db21c120-9aca-4a9a-bc08-16688e74bb66.png",
    productCount: 22,
    priceRange: "From €1,700",
    featured: false,
    size: "small",
    tags: ["lab-grown", "ethical", "sustainable"],
  },
  {
    id: "18k-gold",
    title: "18K Gold Rings",
    subtitle: "Luxurious craftsmanship",
    page: "/shop?category=rings",
    icon: Crown,
    image:
      "https://cdn.shopify.com/s/files/1/0762/6122/8788/files/image3_105f7226-deaa-4a48-b4db-4fb6a1a8ac1e.png",
    productCount: 22,
    priceRange: "From €1,700",
    featured: true,
    size: "small",
    tags: ["18k-gold", "luxury", "premium"],
  },
];

const getFilters = (
  categories: Category[],
  t: (key: string) => string
): { id: string; label: string; count: number }[] => [
  { id: "all", label: t("All Categories"), count: categories.length },
  {
    id: "featured",
    label: t("Featured"),
    count: categories.filter((c) => c.featured).length,
  },
  {
    id: "rings",
    label: t("Rings"),
    count: categories.filter(
      (c) => c.tags.includes("engagement") || c.tags.includes("wedding") || c.tags.includes("solitaire") || c.tags.includes("halo")
    ).length,
  },
  {
    id: "necklaces",
    label: t("Necklaces"),
    count: categories.filter(
      (c) => c.tags.includes("necklaces") || c.tags.includes("necklace")
    ).length,
  },
  {
    id: "earrings",
    label: t("Earrings"),
    count: categories.filter(
      (c) => c.tags.includes("earrings") || c.tags.includes("earring")
    ).length,
  },
];

const getSortOptions = (t: (key: string) => string) => [
  { id: "popular", label: t("Most Popular") },
  { id: "price-low", label: t("Price: Low to High") },
  { id: "price-high", label: t("Price: High to Low") },
  { id: "name", label: t("Name A–Z") },
] as const;

type SortId = "popular" | "price-low" | "price-high" | "name";

type Size = Category["size"];

function getGridClass(size: Size): string {
  if (size === "large") return "col-span-1 md:col-span-2 lg:col-span-2 aspect-[4/3] md:aspect-[3/2]";
  if (size === "medium") return "col-span-1 md:col-span-1 aspect-[3/4]";
  return "col-span-1 aspect-square";
}

function parsePrice(priceRange: string): number | null {
  // Accept formats like "From €1,700" or "From €1700"
  const m = priceRange.match(/([0-9][0-9.,]*)/);
  if (!m) return null;
  return Number(m[1].replace(/[.,]/g, ""));
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortId>("popular");

  // Motion scaffolding
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const smoothY = useSpring(backgroundY, { stiffness: 100, damping: 30 });

  const [inViewRef, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const filters = useMemo(() => getFilters(CATEGORIES, t), [t]);
  const sortOptions = useMemo(() => getSortOptions(t), [t]);

  const filtered = useMemo(() => {
    switch (selectedFilter) {
      case "featured":
        return CATEGORIES.filter((c) => c.featured);
      case "rings":
        return CATEGORIES.filter(
          (c) => c.tags.includes("engagement") || c.tags.includes("wedding") || c.tags.includes("solitaire") || c.tags.includes("halo")
        );
      case "necklaces":
        return CATEGORIES.filter(
          (c) => c.tags.includes("necklaces") || c.tags.includes("necklace")
        );
      case "earrings":
        return CATEGORIES.filter(
          (c) => c.tags.includes("earrings") || c.tags.includes("earring")
        );
      default:
        return CATEGORIES;
    }
  }, [selectedFilter]);

  const sorted = useMemo(() => {
    const base = [...filtered];
    if (sortBy === "name") {
      return base.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === "price-low" || sortBy === "price-high") {
      return base.sort((a, b) => {
        const pa = parsePrice(a.priceRange) ?? Number.POSITIVE_INFINITY;
        const pb = parsePrice(b.priceRange) ?? Number.POSITIVE_INFINITY;
        return sortBy === "price-low" ? pa - pb : pb - pa;
      });
    }
    // popular: featured first, then by productCount desc, then title
    return base.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (a.productCount !== b.productCount)
        return b.productCount - a.productCount;
      return a.title.localeCompare(b.title);
    });
  }, [filtered, sortBy]);

  // Accessibility: handle Enter/Space on cards
  const onCardKey = (e: React.KeyboardEvent<HTMLDivElement>, page: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onNavigate(page);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-Color-Netural-White via-Color-Secondary/5 to-Color-Netural-White section-spacing"
      aria-labelledby="shop-by-category-heading"
    >
      {/* Decorative motion background */}
      <motion.div
        style={{ y: smoothY }}
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden
      >
        <div className="absolute left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-gradient-radial from-Color-Light-300 to-transparent blur-3xl" />
        <div className="absolute bottom-[10%] right-[15%] h-[400px] w-[400px] rounded-full bg-gradient-radial from-Color-Secondary to-transparent blur-3xl" />
      </motion.div>

      <div className="content-container container-spacing">
        {/* Header */}
        <motion.header
          ref={inViewRef}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-16 text-center lg:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-Color-Light-300/30 bg-gradient-to-r from-Color-Netural-White to-Color-Secondary/20 px-6 py-3 shadow-sm"
          >
            <TrendingUp className="h-4 w-4 text-Color-Light-300" aria-hidden />
            <span className="typography-caption font-semibold uppercase tracking-[0.15em] text-Color-Dark-500">
              {t('Curated Collections')}
            </span>
          </motion.div>

          <h2
            id="shop-by-category-heading"
            className="mb-6 font-serif text-5xl font-light leading-[1.1] tracking-tight text-Color-Dark-500 sm:text-6xl lg:text-7xl"
          >
            {t('Shop By')}
            <span className="block text-Color-Dark-500">
              {t('Category')}
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto max-w-3xl text-lg leading-relaxed text-Color-Gray-700 sm:text-xl"
          >
            {t('Explore handcrafted jewelry including engagement rings, earrings, and necklaces')}
            <br className="hidden sm:block" />
            {t('with IGI-certified lab-grown diamonds and 18K gold settings crafted for your love story.')}
          </motion.p>
        </motion.header>

        {/* Controls */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          aria-label="Category filters and sort"
          className="relative mb-14 overflow-hidden rounded-2xl border border-Color-Champagne-Gold/20 bg-white p-6 shadow-[0_4px_20px_rgba(205,188,171,0.08)] sm:p-8"
        >
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex items-center gap-2.5">
                <Filter className="h-4.5 w-4.5 text-Color-Champagne-Gold" aria-hidden />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-Color-Netural-Black">
                  {t('Filter By')}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFilter(f.id)}
                    aria-pressed={selectedFilter === f.id}
                    className={`group relative overflow-hidden rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Color-Champagne-Gold focus-visible:ring-offset-2 ${
                      selectedFilter === f.id
                        ? "bg-Color-Netural-Black text-white shadow-md"
                        : "border border-Color-Champagne-Gold/30 bg-white text-Color-Netural-Black hover:border-Color-Champagne-Gold hover:bg-Color-Primary-Beige/30 hover:shadow-sm"
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {f.label}
                      <span className={`text-xs font-normal ${
                        selectedFilter === f.id ? "opacity-80" : "opacity-60"
                      }`}>
                        ({f.count})
                      </span>
                    </span>
                    {selectedFilter !== f.id && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-Color-Primary-Beige/20 to-Color-Champagne-Gold/10"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:min-w-[240px]">
              <div className="flex items-center gap-2.5">
                <Grid className="h-4.5 w-4.5 text-Color-Champagne-Gold" aria-hidden />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-Color-Netural-Black">
                  {t('Sort By')}
                </span>
              </div>
              <label className="sr-only" htmlFor="sort-categories">
                {t('Sort categories')}
              </label>
              <select
                id="sort-categories"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortId)}
                className="cursor-pointer rounded-lg border border-Color-Champagne-Gold/30 bg-white px-4 py-2 text-sm font-medium text-Color-Netural-Black shadow-sm transition-all hover:border-Color-Champagne-Gold hover:bg-Color-Primary-Beige/20 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-Color-Champagne-Gold focus:border-Color-Champagne-Gold"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.nav>

        {/* Grid */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {sorted.map((category, index) => {
            const isHovered = hoveredId === category.id;
            return (
              <motion.li
                key={category.id}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.1 + index * 0.08,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className={getGridClass(category.size)}
              >
                <motion.div
                  role="button"
                  tabIndex={0}
                  onClick={() => onNavigate(category.page)}
                  onKeyDown={(e) => onCardKey(e, category.page)}
                  onMouseEnter={() => setHoveredId(category.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  aria-label={`${category.title}: ${category.subtitle}. ${category.productCount} ${t('items')}. ${category.priceRange}.`}
                  className="group relative h-full min-h-[320px] w-full cursor-pointer overflow-hidden rounded-3xl border border-Color-Light-300/20 bg-gradient-to-br from-white via-Color-Secondary/5 to-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Color-Light-300 focus-visible:ring-offset-4"
                >
                  {/* Media */}
                  <div className="absolute inset-0">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white via-Color-Secondary/5 to-Color-Light-300/10"
                      animate={{ opacity: isHovered ? 0.3 : 1 }}
                      transition={{ duration: 0.4 }}
                    />
                    <motion.img
                      src={category.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                      className="h-full w-full object-contain p-10 transition-all duration-700"
                      animate={{
                        scale: isHovered ? 1.08 : 1,
                        rotate: isHovered ? 2 : 0
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
                      animate={{ opacity: isHovered ? 0.95 : 0.9 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>

                  {/* Featured badge */}
                  {category.featured && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.08 }}
                      className="absolute left-4 top-4 z-20"
                    >
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-Color-Light-300 to-Color-Dark-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-Color-Light-300/30">
                        <Star className="h-3.5 w-3.5 fill-current" aria-hidden /> Featured
                      </span>
                    </motion.div>
                  )}

                  {/* Count badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.08 }}
                    className="absolute right-4 top-4 z-20"
                  >
                    <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-Color-Dark-500 shadow-lg backdrop-blur-sm">
                      {category.productCount} {t('items')}
                    </span>
                  </motion.div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-7">
                    <motion.div
                      animate={{ y: isHovered ? -4 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="mb-2 font-serif text-3xl font-light tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                        <T>{category.title}</T>
                      </h3>
                      <p className="mb-4 text-base font-medium text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
                        <T>{category.subtitle}</T>
                      </p>
                    </motion.div>

                    <div className="flex items-center justify-between">
                      <motion.span
                        className="text-xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                        animate={{ scale: isHovered ? 1.05 : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {category.priceRange}
                      </motion.span>
                      <motion.span
                        className="grid h-11 w-11 place-items-center rounded-full bg-white text-Color-Dark-500 shadow-lg"
                        animate={{
                          x: isHovered ? 4 : 0,
                          scale: isHovered ? 1.1 : 1
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight className="h-5 w-5" aria-hidden />
                      </motion.span>
                    </div>

                    {/* Tags (first two) */}
                    <motion.div
                      className="mt-4 flex flex-wrap gap-2"
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: isHovered ? 1 : 0.8 }}
                    >
                      {category.tags.slice(0, 2).map((tag, i) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </motion.div>

                    {/* Hover underline */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-4 h-[2px] origin-left bg-gradient-to-r from-Color-Light-300 to-white"
                      aria-hidden
                    />
                  </div>
                </motion.div>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-16 overflow-hidden rounded-3xl border border-Color-Dark-500/10 bg-gradient-to-br from-Color-Dark-500 via-Color-Netural-Black to-Color-Dark-500 p-8 text-white shadow-[0_20px_60px_rgba(0,0,0,0.3)] sm:p-10 lg:p-12"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.05),transparent_50%)]" aria-hidden />
          <motion.div
            className="absolute right-0 top-0 h-64 w-64 rounded-full bg-Color-Light-300/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            aria-hidden
          />

          <div className="relative z-10 flex flex-col items-center justify-between gap-8 lg:flex-row">
            <div className="text-center lg:text-left">
              <motion.h4
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.7 }}
                className="mb-2 font-serif text-4xl font-light tracking-tight text-white sm:text-5xl"
              >
                {t('Handcrafted Excellence')}
              </motion.h4>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.8 }}
                className="text-lg text-Color-Light-300/90"
              >
                {t('Discover exquisite jewelry and engagement ring designs')}
              </motion.p>
            </div>

            <div className="flex items-center gap-8 sm:gap-12">
              {[
                { label: t('Collections'), value: CATEGORIES.length },
                { label: t('Designs'), value: "57" },
                { label: t('Certified'), value: "100%" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="mb-1 bg-gradient-to-br from-white to-Color-Light-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">{stat.value}</div>
                  <div className="text-xs font-medium uppercase tracking-wider text-Color-Light-300/70 sm:text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={() => onNavigate("/shop")}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-Color-Dark-500 shadow-lg transition-all hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-Color-Dark-500"
            >
              <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-bold">{t('View All')}</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
