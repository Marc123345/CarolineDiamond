'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Menu, X, ChevronDown, Search, Award, Info, Heart, Sparkles, Gift, Gem,
  Star, Diamond, User, Newspaper, MessageSquare, MapPin, Palette, HandHeart, ShoppingBag, Instagram, Facebook
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTranslation } from '../../context/TranslationContext';
import { CartIcon } from '../ui/CartIcon';
import { WishlistIcon } from '../ui/WishlistIcon';
import { SearchModal } from '../ui/SearchModal';

const IconMap: any = {
  Award, ShoppingBag, Info, Heart, Sparkles, Gift, Gem, Star, Diamond, 
  User, Newspaper, MessageSquare, MapPin, Palette, HandHeart,
};

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { scrollY } = useScroll();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Dynamic Header Transformations
  const headerBg = useTransform(scrollY, [0, 50], ["rgba(253, 251, 247, 0)", "rgba(253, 251, 247, 0.9)"]);
  const headerBlur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);
  const headerPadding = useTransform(scrollY, [0, 50], ["24px", "12px"]);
  const headerShadow = useTransform(scrollY, [0, 50], ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 20px rgba(0,0,0,0.05)"]);

  const primaryCategories = [
    {
      id: 'explore-jewelry',
      title: t('Explore Jewelry'),
      icon: 'ShoppingBag',
      subcategories: [
        { title: t('Shop All Jewelry'), page: '/shop', icon: 'ShoppingBag', desc: 'Browse our complete signature collection' },
        { title: t('Bestsellers'), page: '/shop', icon: 'Star', desc: 'Most loved pieces by our clients' },
        { title: t('New Arrivals'), page: '/shop', icon: 'Diamond', desc: 'The latest hand-crafted designs' }
      ]
    },
    {
      id: 'services-information',
      title: t('Services & Information'),
      icon: 'Info',
      subcategories: [
        { title: t('About Caroline'), page: '/about', icon: 'User', desc: '12 years of styling expertise' },
        { title: t('News & Stories'), page: '/blog', icon: 'Newspaper', desc: 'Jewelry care and style guides' },
        { title: t('Customer Reviews'), page: '/kind-words', icon: 'MessageSquare', desc: 'Stories from our happy couples' },
        { title: t('Contact'), page: '/contact', icon: 'MapPin', desc: 'Visit our Antwerp showroom' }
      ]
    }
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <>
      <motion.header
        style={{ 
          backgroundColor: headerBg, 
          backdropFilter: headerBlur,
          paddingTop: headerPadding,
          paddingBottom: headerPadding,
          boxShadow: headerShadow
        }}
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-out border-b border-black/[0.03]"
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-10 flex justify-between items-center">
          
          {/* LEFT: DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8">
            {primaryCategories.map((cat) => (
              <div 
                key={cat.id} 
                className="relative"
                onMouseEnter={() => setActiveDropdown(cat.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] font-bold text-Color-Dark-500 hover:text-Color-Champagne-Gold transition-colors py-4">
                  {cat.title}
                  <ChevronDown className={`w-3 h-3 transition-transform duration-500 ${activeDropdown === cat.id ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {activeDropdown === cat.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 w-[450px] bg-white shadow-2xl border border-black/5 p-8 rounded-sm overflow-hidden"
                    >
                      <div className="grid gap-6">
                        {cat.subcategories.map((sub, i) => (
                          <button 
                            key={i} 
                            onClick={() => handleNavigation(sub.page)}
                            className="flex items-start gap-4 group text-left"
                          >
                            <div className="w-10 h-10 bg-Color-Secondary flex items-center justify-center group-hover:bg-Color-Champagne-Gold transition-colors duration-500">
                              {React.createElement(IconMap[sub.icon], { className: "w-4 h-4 text-Color-Dark-500 group-hover:text-white" })}
                            </div>
                            <div>
                              <span className="block text-xs uppercase tracking-widest font-bold text-Color-Dark-500 group-hover:text-Color-Champagne-Gold transition-colors">{sub.title}</span>
                              <span className="text-[10px] text-Color-Gray-500 font-light mt-1 block">{sub.desc}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CENTER: LOGO */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <button onClick={() => handleNavigation('/')} className="group">
              <img src="/logo.svg" alt="Logo" className="h-10 md:h-12 w-auto grayscale brightness-0 group-hover:scale-110 transition-transform duration-700" />
            </button>
          </div>

          {/* RIGHT: ACTIONS */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setIsSearchOpen(true)} className="hover:text-Color-Champagne-Gold transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <WishlistIcon isTransparent={false} />
            </div>
            <CartIcon isTransparent={false} />
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            >
              <motion.span animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 7 : 0 }} className="w-6 h-[1.5px] bg-black block" />
              <motion.span animate={{ opacity: isMobileMenuOpen ? 0 : 1 }} className="w-6 h-[1.5px] bg-black block" />
              <motion.span animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -7 : 0 }} className="w-6 h-[1.5px] bg-black block" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* --- MOBILE IMMERSIVE MENU --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-[#FAF9F6] flex flex-col justify-center px-12"
          >
            <div className="space-y-8">
              {primaryCategories.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <span className="text-[10px] uppercase tracking-[0.5em] text-Color-Light-300 font-bold mb-4 block">0{idx + 1}</span>
                  <button 
                    onClick={() => handleNavigation(cat.subcategories[0].page)}
                    className="text-4xl font-serif text-Color-Dark-500 hover:italic"
                  >
                    {cat.title}
                  </button>
                </motion.div>
              ))}
              <motion.div 
                 initial={{ x: -20, opacity: 0 }} 
                 animate={{ x: 0, opacity: 1 }} 
                 transition={{ delay: 0.3 }}
              >
                <button 
                  onClick={() => handleNavigation('/collecties')}
                  className="text-4xl font-serif text-Color-Dark-500"
                >
                  {t('Collections')}
                </button>
              </motion.div>
            </div>

            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest font-bold">Follow us</p>
                <div className="flex gap-4">
                  <Instagram className="w-4 h-4" />
                  <Facebook className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-Color-Light-300">Antwerp, BE</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={(q) => router.push(`/shop?search=${q}`)}
      />
    </>
  );
};