import React, { useState, useMemo } from "react";
import {
  X, ArrowRight, ShoppingBag, Gem, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { primaryCategories, staticLinks } from "../config/siteConfig";
import { T } from "./T";

// Reusable icon map for the premium look
const IconMap: any = { ShoppingBag, Gem /* Add others as needed */ };

interface FloatingOverlayProps {
  category: any;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

const FloatingOverlay: React.FC<FloatingOverlayProps> = ({ category, onClose, onNavigate }) => {
  // Editorial Content Logic
  const content = useMemo(() => {
    const data: Record<string, { img: string; quote: string; label: string }> = {
      "shop": {
        img: "https://ik.imagekit.io/qcvroy8xpd/91b5f5ce-4ccd-4075-8721-f633906d3842.jpeg",
        quote: "Handcrafted Brilliance",
        label: "The Signature Collection"
      },
      "collections": {
        img: "https://ik.imagekit.io/qcvroy8xpd/b855a677-5d9f-4721-9bd3-446722fa0653.jpeg",
        quote: "Moments Preserved",
        label: "Exclusive Collaborations"
      },
      "about": {
        img: "https://diamondsbycs.com/images/uploads/upload-656a00eeec975.png",
        quote: "Antwerp Heritage",
        label: "The Master Artisan"
      }
    };
    return data[category.id] || data.shop;
  }, [category.id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
    >
      {/* --- BLURRED BACKDROP --- */}
      <div className="absolute inset-0 bg-Color-Dark-500/80 backdrop-blur-xl" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-6xl bg-white shadow-[0_50px_100px_rgba(0,0,0,0.4)] flex flex-col lg:flex-row overflow-hidden rounded-sm"
      >
        {/* Subtle Luxury Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* --- LEFT: EDITORIAL IMAGE PORTAL --- */}
        <div className="relative w-full lg:w-1/2 h-[300px] lg:h-auto overflow-hidden group">
          <motion.img
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={content.img}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
            alt={category.title}
          />
          <div className="absolute inset-0 bg-Color-Dark-500/20" />
          
          <div className="absolute inset-0 p-12 flex flex-col justify-between z-10">
            <span className="text-[10px] uppercase tracking-[0.6em] text-white font-black opacity-60">
              {content.label}
            </span>
            <div>
              <h3 className="text-4xl md:text-5xl font-serif italic text-white leading-tight mb-4">
                {content.quote}
              </h3>
              <div className="w-12 h-px bg-Color-Champagne-Gold" />
            </div>
          </div>
        </div>

        {/* --- RIGHT: THE NAVIGATION LEDGER --- */}
        <div className="w-full lg:w-1/2 p-8 lg:p-20 flex flex-col bg-[#FAF9F6] relative">
          {/* Close Icon */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-500"
          >
            <X className="w-5 h-5" />
          </button>

          <header className="mb-16">
            <span className="text-[10px] uppercase tracking-[0.4em] text-Color-Light-300 font-bold mb-4 block">Navigation</span>
            <h2 className="text-5xl font-serif text-Color-Dark-500">{category.title}</h2>
          </header>

          <div className="space-y-2 flex-1">
            {category.subcategories?.map((sub: any, idx: number) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + (idx * 0.1) }}
                onClick={() => onNavigate(sub.page)}
                className="w-full flex items-center justify-between py-6 border-b border-black/[0.04] group hover:border-Color-Champagne-Gold transition-all duration-500"
              >
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-serif italic text-Color-Light-300">0{idx + 1}</span>
                  <span className="text-lg uppercase tracking-widest font-bold text-Color-Dark-500 group-hover:text-Color-Champagne-Gold group-hover:translate-x-2 transition-all duration-500">
                    {sub.title}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-Color-Light-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </motion.button>
            ))}
          </div>

          <footer className="mt-16 pt-8 border-t border-black/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-2 h-2 rounded-full bg-Color-Champagne-Gold animate-pulse" />
               <span className="text-[10px] uppercase tracking-widest font-black text-Color-Dark-500">Antwerp Studio Active</span>
            </div>
            <button 
              onClick={() => onNavigate('/shop')}
              className="text-[10px] uppercase tracking-[0.3em] font-black text-Color-Light-300 hover:text-Color-Dark-500 transition-colors"
            >
              Full Catalog
            </button>
          </footer>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const DesktopNav: React.FC<DesktopNavProps> = ({ onNavigate }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  return (
    <nav className="hidden lg:flex items-center gap-4">
      {primaryCategories.map((category) => (
        <div key={category.id} className="relative">
          <button
            onClick={() => setExpandedSection(category.id)}
            className="group relative flex items-center gap-2 px-6 py-4 transition-all duration-500"
          >
            <span className={`text-[11px] uppercase tracking-[0.3em] font-black transition-colors ${
              expandedSection === category.id ? 'text-Color-Champagne-Gold' : 'text-Color-Dark-500 group-hover:text-Color-Champagne-Gold'
            }`}>
              <T>{category.title}</T>
            </span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-500 ${expandedSection === category.id ? 'rotate-180' : ''}`} />
            
            {/* Liquid Underline */}
            <div className="absolute bottom-3 left-6 right-6 h-[1.5px] bg-Color-Champagne-Gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
          </button>

          <AnimatePresence>
            {expandedSection === category.id && (
              <FloatingOverlay
                category={category}
                onClose={() => setExpandedSection(null)}
                onNavigate={(p) => { setExpandedSection(null); onNavigate(p); }}
              />
            )}
          </AnimatePresence>
        </div>
      ))}

      {staticLinks.map((link) => (
        <button
          key={link.page}
          onClick={() => onNavigate(link.page)}
          className="px-6 py-4 text-[11px] uppercase tracking-[0.3em] font-black text-Color-Dark-500 hover:text-Color-Champagne-Gold transition-colors group relative"
        >
          <T>{link.label}</T>
          <div className="absolute bottom-3 left-6 right-6 h-[1.5px] bg-Color-Champagne-Gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
        </button>
      ))}
    </nav>
  );
};