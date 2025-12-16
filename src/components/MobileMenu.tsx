import React, { useCallback, useState } from 'react';
import {
  Menu, X, ShoppingBag, Heart, Sparkles, Gift, Star,
  User, MapPin, Palette, HandHeart, Gem, ChevronRight, ChevronDown,
  Diamond, Calendar, BookOpen, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mobileMenuGroups } from '../config/siteConfig';
import { useIsMobile } from '../hooks/useIsMobile';
import { T } from './T';

interface MobileMenuProps {
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
  onNavigate: (page: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  showMenu,
  setShowMenu,
  onNavigate
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Shop']);
  const isMobile = useIsMobile();

  const IconMap: Record<string, any> = {
    ShoppingBag, Heart, Gem, Diamond, Gift, Palette, HandHeart,
    Star, Calendar, User, MapPin, BookOpen, Sparkles, Zap
  };

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupTitle)
        ? prev.filter(g => g !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const handleMenuClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);

    if ('vibrate' in navigator) navigator.vibrate(20);

    // Use requestAnimationFrame for smoother transitions
    requestAnimationFrame(() => {
      setShowMenu(false);
      setTimeout(() => setIsClosing(false), 350);
    });
  }, [isClosing, setShowMenu]);

  const handleMenuItemClick = useCallback((page: string) => {
    if (isClosing) return;
    setIsClosing(true);

    if ('vibrate' in navigator) navigator.vibrate(30);

    // Use requestAnimationFrame for smoother navigation
    requestAnimationFrame(() => {
      setShowMenu(false);
      setTimeout(() => {
        onNavigate(page);
        setIsClosing(false);
      }, 200);
    });
  }, [isClosing, setShowMenu, onNavigate]);

  if (!showMenu) return null;

  return (
    <motion.div
      initial={isMobile ? false : { opacity: 0 }}
      animate={isMobile ? false : { opacity: 1 }}
      exit={isMobile ? false : { opacity: 0 }}
      transition={{ duration: isMobile ? 0 : 0.3 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-end overflow-hidden"
      style={{
        top: 'env(safe-area-inset-top)',
        bottom: 'env(safe-area-inset-bottom)',
        left: 'env(safe-area-inset-left)',
        right: 'env(safe-area-inset-right)'
      }}
      onClick={handleMenuClose}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      <motion.div
        initial={isMobile ? false : { x: '100%' }}
        animate={isMobile ? false : { x: 0 }}
        exit={isMobile ? false : { x: '100%' }}
        transition={{
          type: 'tween',
          duration: isMobile ? 0 : 0.3,
          ease: [0.22, 1, 0.36, 1]
        }}
        drag={isMobile ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragEnd={(event, info) => {
          if (!isMobile && info.offset.x > 100) handleMenuClose();
        }}
        id="mobile-menu"
        className="h-full w-full max-w-[90vw] bg-gradient-to-b from-black via-gray-900 to-black shadow-2xl border-l border-[#CDBCAB]/20 flex flex-col relative overflow-hidden"
        style={{
          height: '100dvh',
          maxHeight: '100dvh',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          willChange: isMobile ? 'auto' : 'transform',
          transform: 'translateZ(0)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Elegant background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-[#CDBCAB] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 right-1/4 w-24 h-24 bg-[#CDBCAB] rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-[#CDBCAB] rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#CDBCAB]/20 flex-shrink-0 relative z-10">
          <div className="flex items-center space-x-3">
            <motion.div 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#CDBCAB] to-[#B9A892] rounded-full flex items-center justify-center shadow-lg"
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">Navigation</h2>
              <p className="text-[10px] sm:text-xs text-[#CDBCAB]">Diamonds by CS</p>
            </div>
          </div>
          <button 
            onClick={handleMenuClose}
            className="p-3 hover:bg-white/10 rounded-xl transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center group"
          >
            <X className="h-6 w-6 text-white group-hover:text-[#CDBCAB] group-hover:rotate-90 transition-all duration-300" />
          </button>
        </div>

        {/* Menu Items - Flex Container with Groups */}
        <nav className="flex-1 flex flex-col px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto min-h-0 relative z-10">
          <div className="flex flex-col space-y-3 sm:space-y-4 flex-1">
            {mobileMenuGroups.map((group, groupIndex) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="space-y-1.5 sm:space-y-2"
              >
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-[#CDBCAB]/10 transition-all active:scale-98"
                >
                  <T className="text-xs sm:text-sm font-bold text-[#CDBCAB] uppercase tracking-wide">{group.title}</T>
                  <ChevronDown
                    className={`h-4 w-4 text-[#CDBCAB] transition-transform duration-300 ${
                      expandedGroups.includes(group.title) ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Group Items */}
                <AnimatePresence>
                  {expandedGroups.includes(group.title) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-0.5 sm:space-y-1 overflow-hidden"
                    >
                      {group.items.map((item, index) => {
                        const ItemIcon = IconMap[item.icon];
                        return (
                          <motion.button
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleMenuItemClick(item.page)}
                            className="w-full flex items-center p-2.5 sm:p-3 pl-4 sm:pl-6 rounded-lg hover:bg-gradient-to-r hover:from-[#CDBCAB]/20 hover:to-[#CDBCAB]/10 active:bg-[#CDBCAB]/30 transition-all duration-200 group text-left border border-transparent hover:border-[#CDBCAB]/20"
                            style={{
                              WebkitTapHighlightColor: 'transparent',
                              touchAction: 'manipulation'
                            }}
                          >
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#CDBCAB]/10 rounded-lg flex items-center justify-center mr-2.5 sm:mr-3 group-hover:bg-[#CDBCAB] transition-all flex-shrink-0">
                              {ItemIcon && <ItemIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#CDBCAB] group-hover:text-white transition-colors" />}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <T className="text-xs sm:text-sm font-medium text-white group-hover:text-[#CDBCAB] truncate transition-colors">
                                {item.label}
                              </T>
                              <span className="text-[10px] sm:text-xs text-gray-400 truncate hidden sm:block">
                                {item.tooltip}
                              </span>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#CDBCAB]/40 group-hover:text-[#CDBCAB] transition-colors flex-shrink-0" />
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          

          {/* Footer section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: mobileMenuGroups.length * 0.08 + 0.3 }}
            className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#CDBCAB]/20 flex-shrink-0"
          >
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#CDBCAB] to-[#B9A892] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-xl">
                <Gem className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">Diamonds by CS</h3>
              <p className="text-xs sm:text-sm text-[#CDBCAB] mb-3 sm:mb-4">Handcrafted in Antwerp</p>
              <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-[10px] sm:text-xs text-gray-300">
                <span>15+ Years</span>
                <div className="w-1 h-1 bg-[#CDBCAB] rounded-full"></div>
                <span>HRD Certified</span>
                <div className="w-1 h-1 bg-[#CDBCAB] rounded-full"></div>
                <span>5.0★ Reviews</span>
              </div>
            </div>
          </motion.div>
        </nav>
      </motion.div>
    </motion.div>
  );
};
