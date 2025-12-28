import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHero } from '../components/PageHero';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/ProductCardSkeleton';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { WifiOff, Star, Sparkles, ArrowDown } from 'lucide-react';

interface BestsellersPageProps {
  onNavigate: (page: string) => void;
}

export const BestsellersPage: React.FC<BestsellersPageProps> = ({ onNavigate }) => {
  const { products, loading, error, usingFallback } = useShopifyProducts(
    'tag:bestseller OR tag:engagement-ring OR tag:solitaire', 
    'BEST_SELLING', 
    false
  );

  // Motion variants for an "expensive" entrance
  const containerVars = {
    visible: { 
      transition: { staggerChildren: 0.1, delayChildren: 0.3 } 
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)', 
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white min-h-screen"
    >
      {/* --- HERO: THE PREFACE --- */}
      <section className="relative">
        <PageHero
          title="Signature Icons"
          subtitle="A curation of our most beloved masterpieces, defined by Antwerp heritage."
          backgroundImage="https://diamondsbycs.com/images/uploads/upload-68b545a74baf9.jpeg"
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      <main className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        
        {/* --- STATUS & LEDGER HEADER --- */}
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/[0.03] pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-Color-Champagne-Gold animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.6em] text-Color-Light-300 font-black">
                The Selection Ledger
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif text-Color-Dark-500 italic">
              Bestselling <span className="not-italic text-Color-Light-300">Creations</span>
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="h-px w-12 bg-Color-Champagne-Gold/30" />
            <span className="text-[11px] uppercase tracking-widest font-bold text-Color-Gray-400">
              {products.length} Designs Unveiled
            </span>
          </div>
        </header>

        {/* --- DIGITAL CONTINUITY NOTICE --- */}
        <AnimatePresence>
          {usingFallback && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              className="mb-16 bg-[#F0F7FF] backdrop-blur-xl border border-blue-100 p-6 rounded-sm flex items-center gap-6"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                <WifiOff className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-black text-blue-900 mb-1">Digital Continuity Active</h4>
                <p className="text-xs text-blue-600/80 leading-relaxed">
                  The live boutique link is intermittent. Showing curated icons from our high-performance local cache.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- LOADING & ERROR STATES --- */}
        {loading && products.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            <ProductGridSkeleton count={6} />
          </div>
        )}

        {error && (
          <div className="text-center py-24 bg-red-50/50 rounded-sm border border-red-100">
            <p className="text-sm font-serif italic text-red-800">{error}</p>
          </div>
        )}

        {/* --- THE GALLERY GRID --- */}
        {!loading && products.length > 0 && (
          <motion.div 
            variants={containerVars}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={itemVars}>
                <ProductCard
                  product={product}
                  usingFallback={usingFallback}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* --- EMPTY STATE --- */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-48 opacity-40">
            <Star className="h-12 w-12 text-Color-Champagne-Gold mx-auto mb-6" />
            <h3 className="text-2xl font-serif italic text-Color-Dark-500">The Vault is Quiet</h3>
            <p className="text-[10px] uppercase tracking-widest mt-2 font-black">Refining our next selection</p>
          </div>
        )}

        {/* Decorative Scroll Anchor */}
        <div className="mt-32 flex flex-col items-center gap-6 opacity-20">
          <div className="w-px h-24 bg-gradient-to-b from-Color-Champagne-Gold to-transparent" />
          <span className="text-[9px] uppercase tracking-[0.4em] font-black">End of Selection</span>
        </div>
      </main>
    </motion.div>
  );
};