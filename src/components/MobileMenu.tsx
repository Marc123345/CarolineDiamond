import React, { useEffect } from 'react';
import {
  X, ShoppingBag, Heart, Sparkles, Gift, Star,
  User, MapPin, Palette, HandHeart, Gem, 
  Diamond, Calendar, BookOpen, Zap, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mobileMenuGroups } from '../config/siteConfig';
import { T } from './T';

interface MobileMenuProps {
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
  onNavigate: (page: string) => void;
}

const IconMap: any = {
  ShoppingBag, Heart, Gem, Diamond, Gift, Palette, HandHeart,
  Star, Calendar, User, MapPin, BookOpen, Sparkles, Zap
};

export const MobileMenu: React.FC<MobileMenuProps> = ({
  showMenu,
  setShowMenu,
  onNavigate
}) => {
  // Fix: Prevent body scroll when menu is open
  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showMenu]);

  const containerVars = {
    hidden: { x: '100%' },
    visible: { 
      x: 0, 
      transition: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 200,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { 
      x: '100%', 
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const itemVars = {
    hidden: { x: 20, opacity: 0, filter: 'blur(5px)' },
    visible: { 
      x: 0, 
      opacity: 1, 
      filter: 'blur(0px)',
      transition: { duration: 0.5 }
    }
  };

  return (
    <AnimatePresence>
      {showMenu && (
        <div className="fixed inset-0 z-[200] flex justify-end overflow-hidden">
          {/* --- BACKDROP --- */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMenu(false)}
            className="absolute inset-0 bg-Color-Dark-500/40 backdrop-blur-sm"
          />

          {/* --- MENU PANEL --- */}
          <motion.div
            variants={containerVars}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-[450px] h-full bg-white shadow-[-20px_0_80px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden"
          >
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            
            {/* Watermark */}
            <div className="absolute top-1/2 -left-20 -rotate-90 pointer-events-none select-none">
              <span className="text-[120px] font-serif italic text-Color-Secondary/10 whitespace-nowrap">
                Antwerp Heritage
              </span>
            </div>

            {/* HEADER */}
            <header className="relative z-10 p-8 flex items-center justify-between border-b border-black/[0.03]">
              <motion.div variants={itemVars}>
                <h2 className="text-4xl font-serif text-Color-Dark-500">Boutique</h2>
                <p className="text-[10px] uppercase tracking-[0.4em] text-Color-Light-300 font-black mt-1">Menu</p>
              </motion.div>
              <button 
                onClick={() => setShowMenu(false)}
                className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-500"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* NAV CONTENT */}
            <nav className="relative z-10 flex-1 overflow-y-auto px-8 py-10 no-scrollbar">
              <div className="space-y-12">
                {mobileMenuGroups.map((group) => (
                  <motion.div key={group.title} variants={itemVars} className="space-y-6">
                    <span className="text-[10px] uppercase tracking-[0.5em] text-Color-Light-300 font-black block">
                      {group.title}
                    </span>
                    
                    <div className="space-y-2">
                      {group.items.map((item) => {
                        const Icon = IconMap[item.icon];
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                                setShowMenu(false);
                                onNavigate(item.page);
                            }}
                            className="w-full flex items-center justify-between py-4 group border-b border-black/[0.02] hover:border-Color-Champagne-Gold/40 transition-all duration-500"
                          >
                            <div className="flex items-center gap-5">
                              <div className="w-10 h-10 rounded-full bg-Color-Secondary/30 flex items-center justify-center group-hover:bg-Color-Champagne-Gold transition-colors">
                                <Icon className="w-4 h-4 text-Color-Dark-500 group-hover:text-white transition-colors" />
                              </div>
                              <span className="text-lg font-serif text-Color-Dark-500 group-hover:italic group-hover:text-Color-Champagne-Gold transition-all">
                                {item.label}
                              </span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-Color-Light-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            </nav>

            {/* FOOTER */}
            <motion.footer 
              variants={itemVars}
              className="relative z-10 p-8 bg-Color-Primary-Beige/20 border-t border-black/[0.03]"
            >
              <div className="bg-white p-6 shadow-xl flex items-center gap-6 rounded-sm border border-black/5">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                    className="absolute inset-0 border border-dashed border-Color-Champagne-Gold/40 rounded-full"
                  />
                  <div className="absolute inset-1.5 bg-Color-Dark-500 rounded-full flex items-center justify-center">
                    <Gem className="w-6 h-6 text-Color-Champagne-Gold" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-black text-Color-Dark-500">Antwerp Studio</h4>
                  <p className="text-[11px] text-Color-Gray-500 italic mt-1">Est. 2009</p>
                </div>
              </div>
            </motion.footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};