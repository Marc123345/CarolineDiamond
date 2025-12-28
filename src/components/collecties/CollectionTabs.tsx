import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Heart, Users, Star, Sparkles, Diamond, Gem, ArrowRight } from 'lucide-react';

interface CollectionTabsProps {
  activeCollection: string;
  onCollectionChange: (collection: string) => void;
}

export const CollectionTabs: React.FC<CollectionTabsProps> = ({ 
  activeCollection, 
  onCollectionChange 
}) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const collections = [
    { id: 'heartbeat', title: 'Heartbeat', icon: Heart, number: '01', accent: '🦋' },
    { id: 'ann-demeulemeester', title: 'Minimalist', icon: Sparkles, number: '02', accent: '✨' },
    { id: 'carey', title: 'Sisterhood', icon: Users, number: '03', accent: '👭' },
    { id: 'think-pink', title: 'Awareness', icon: Heart, number: '04', accent: '🎗️' },
    { id: 'kim-van-oncen', title: 'Memorial', icon: Star, number: '05', accent: '⭐' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-2xl border-b border-Color-Champagne-Gold/20 py-4">
      {/* --- SUBTLE LUXURY GRAIN --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <LayoutGroup>
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-2">
            
            {/* Sidebar Label for Context */}
            <div className="hidden xl:flex items-center gap-4 mr-8 border-r border-Color-Champagne-Gold/30 pr-8">
               <Gem className="w-5 h-5 text-Color-Champagne-Gold" />
               <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-Color-Dark-500 whitespace-nowrap">
                 Explore Archives
               </span>
            </div>

            {collections.map((item, index) => {
              const isActive = activeCollection === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onCollectionChange(item.id)}
                  onMouseEnter={() => setHoveredTab(item.id)}
                  onMouseLeave={() => setHoveredTab(null)}
                  className="relative flex items-center gap-4 px-6 py-4 transition-colors duration-500 group"
                >
                  {/* --- ACTIVE BACKGROUND (THE MAGIC) --- */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-Color-Secondary/40 rounded-sm -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    >
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-Color-Champagne-Gold" />
                    </motion.div>
                  )}

                  {/* --- TAB CONTENT --- */}
                  <div className="relative flex items-center gap-3">
                    <span className="text-[9px] font-serif italic text-Color-Light-300 opacity-60 group-hover:opacity-100 transition-opacity">
                      {item.number}
                    </span>
                    
                    <div className="relative">
                      <item.icon 
                        className={`w-4 h-4 transition-all duration-500 ${
                          isActive ? 'text-Color-Dark-500 scale-110' : 'text-Color-Gray-500 group-hover:text-Color-Champagne-Gold'
                        }`} 
                      />
                      {isActive && (
                        <motion.div 
                          layoutId="sparkle"
                          className="absolute -top-1 -right-1"
                        >
                          <Sparkles className="w-2 h-2 text-Color-Champagne-Gold animate-pulse" />
                        </motion.div>
                      )}
                    </div>

                    <span className={`text-[11px] uppercase tracking-[0.25em] font-bold transition-all duration-500 whitespace-nowrap ${
                      isActive ? 'text-Color-Dark-500' : 'text-Color-Gray-400 group-hover:text-Color-Dark-500'
                    }`}>
                      {item.title}
                    </span>
                  </div>

                  {/* --- HOVER TOOLTIP --- */}
                  <AnimatePresence>
                    {hoveredTab === item.id && !isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-Color-Dark-500 text-white px-4 py-2 text-[10px] tracking-widest uppercase pointer-events-none shadow-2xl z-50 whitespace-nowrap"
                      >
                        Discover {item.title} {item.accent}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-Color-Dark-500 rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}

            {/* Final CTA link on the right */}
            <div className="hidden md:flex ml-auto pl-8 items-center gap-2 group cursor-pointer" onClick={() => onNavigate('/shop')}>
               <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-Color-Champagne-Gold transition-colors">Full Shop</span>
               <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </LayoutGroup>
      </div>
    </nav>
  );
};