import React, { useEffect, useState, useCallback } from 'react';
import {
  Menu, X, ChevronDown, Search,
  Award, Info, Heart, Sparkles, Gift, Gem, Star, Diamond, User, Newspaper,
  MessageSquare, MapPin, Palette, HandHeart, ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Keep this import
import { useWishlist } from '../context/WishlistContext';
import { useTranslation } from '../context/TranslationContext';
import { CartIcon } from './CartIcon';
import { WishlistIcon } from './WishlistIcon';
import { SearchModal } from './SearchModal';


// Empty interface kept for future props expansion
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HeaderProps {}

type IconKey =
  | 'Award' | 'ShoppingBag' | 'Info' | 'Heart' | 'Sparkles' | 'Gift' | 'Gem'
  | 'Star' | 'Diamond' | 'User' | 'Newspaper' | 'MessageSquare' | 'MapPin'
  | 'Palette' | 'HandHeart';

const IconMap: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  Award,
  ShoppingBag,
  Info,
  Heart,
  Sparkles,
  Gift,
  Gem,
  Star,
  Diamond,
  User,
  Newspaper,
  MessageSquare,
  MapPin,
  Palette,
  HandHeart,
};

export const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  const [expandedDesktopSection, setExpandedDesktopSection] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const currentPage = location.pathname;
  const { t } = useTranslation();

  // cart and wishlist hooks available for future use
  useCart();
  useWishlist();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setIsSearchOpen(false);
    }
  };

  const primaryCategories = [
    {
      id: 'explore-jewelry',
      title: t('Explore Jewelry'),
      icon: 'ShoppingBag' as IconKey,
      subcategories: [
        { title: t('Shop All Jewelry'), page: '/shop', icon: 'ShoppingBag' as IconKey },
        { title: t('Bestsellers'), page: '/shop', icon: 'Star' as IconKey },
        { title: t('New Arrivals'), page: '/shop', icon: 'Diamond' as IconKey }
      ]
    },
    {
      id: 'services-information',
      title: t('Services & Information'),
      icon: 'Info' as IconKey,
      subcategories: [
        { title: t('About Caroline'), page: '/about', icon: 'User' as IconKey },
        { title: t('News & Stories'), page: '/blog', icon: 'Newspaper' as IconKey },
        { title: t('Customer Reviews'), page: '/kind-words', icon: 'Star' as IconKey },
        { title: t('Contact & Showroom'), page: '/contact', icon: 'MapPin' as IconKey }
      ]
    }
  ];

  // Scroll shadow + compaction
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setExpandedMobileSection(null);
    setExpandedDesktopSection(null);
  }, [currentPage]);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    const original = document.body.style.overflow;
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = original || '';
    }
    return () => {
      document.body.style.overflow = original || '';
    };
  }, [isMobileMenuOpen]);


  const handleNavigation = useCallback((path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setExpandedMobileSection(null);
    setExpandedDesktopSection(null);
  }, [navigate]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setExpandedMobileSection(null);
  };

  const toggleMobileSection = (sectionId: string) => {
    setExpandedMobileSection(prev => (prev === sectionId ? null : sectionId));
  };

  const toggleDesktopSection = (sectionId: string) => {
    setExpandedDesktopSection(prev => (prev === sectionId ? null : sectionId));
  };

  return (
    <>
      {/* Sticky Header */}
      <header
        className="sticky top-0 z-50 transition-all duration-300 bg-surface border-b border-gray-200 shadow-sm"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          backgroundColor: '#FDFBF7'
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className={`flex justify-between items-center ${isScrolled ? 'h-14 sm:h-16' : 'h-14 sm:h-16 lg:h-20'} relative`}>
            {/* Logo */}
            <button
              onClick={() => handleNavigation('/')}
              className="flex-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-black p-2 rounded-lg active:scale-95 transition-transform min-w-[44px] min-h-[44px] flex items-center"
              aria-label="Go to home"
            >
              <img
                src="/logo.svg"
                alt="Diamonds by CS Logo"
                className="h-7 sm:h-9 lg:h-11 w-auto transition-all duration-300 group-hover:opacity-80 brightness-0"
                style={{ filter: 'brightness(0)' }}
              />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-12">
              {primaryCategories.map((category) => (
                <div key={category.id} className="relative group">
                  <button
                    onClick={() => toggleDesktopSection(category.id)}
                    aria-expanded={expandedDesktopSection === category.id}
                    aria-controls={`${category.id}-panel`}
                    className="flex items-center space-x-2 lg:space-x-3 text-sm lg:typography-body font-semibold text-black hover:text-Color-Champagne-Gold transition-all duration-300 py-2 lg:py-3 px-2 lg:px-4 hover:bg-gray-50 rounded-lg relative group"
                  >
                    <span className="relative z-10">{category.title}</span>
                    <ChevronDown
                      className={`h-3 lg:h-4 w-3 lg:w-4 transition-transform duration-300 relative z-10 ${
                        expandedDesktopSection === category.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {expandedDesktopSection === category.id && (
                      <motion.div
                        id={`${category.id}-panel`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 mt-2 lg:mt-4 w-64 lg:w-72 bg-surface-elevated shadow-2xl border border-gray-200 overflow-hidden z-50 rounded-xl"
                      >
                        <div className="p-4 lg:p-6 space-y-1">
                          {category.subcategories.map((sub, index) => (
                            <button
                              key={index}
                              onClick={() => handleNavigation(sub.page)}
                              className="flex items-center gap-3 lg:gap-4 w-full text-left py-3 lg:py-4 px-3 lg:px-4 text-gray-900 hover:text-Color-Champagne-Gold hover:bg-gray-50 transition-all duration-300 group rounded-lg"
                            >
                              <div className="w-6 lg:w-8 h-6 lg:h-8 bg-Color-Champagne-Gold/20 rounded-lg flex items-center justify-center group-hover:bg-Color-Champagne-Gold transition-colors duration-300">
                                {React.createElement(IconMap[sub.icon], {
                                  className:
                                    'h-3 lg:h-4 w-3 lg:w-4 text-Color-Champagne-Gold group-hover:text-Color-Netural-White transition-colors duration-300',
                                })}
                              </div>
                              <span className="text-sm lg:typography-body font-medium group-hover:font-bold transition-all duration-300">
                                {sub.title}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <button
                onClick={() => handleNavigation('/collecties')}
                className="text-sm lg:typography-body font-semibold text-black hover:text-Color-Champagne-Gold transition-all duration-300 py-2 lg:py-3 px-2 lg:px-4 hover:bg-gray-50 rounded-lg"
              >
                {t('Collections')}
              </button>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Mobile/Tablet Actions - only hamburger menu */}
              <div className="flex lg:hidden items-center gap-3 sm:gap-4">
                <button
                  onClick={toggleMobileMenu}
                  className="p-3 text-black hover:text-Color-Champagne-Gold hover:bg-gray-100 transition-all duration-300 rounded-lg active:scale-90 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={isMobileMenuOpen ? t('Close menu') : t('Open menu')}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu-panel"
                >
                  <div className="transition-transform duration-300">
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </div>
                </button>
              </div>

              {/* Desktop Actions - visible at lg breakpoint (1024px) and up */}
              <div className="hidden lg:flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-black hover:text-Color-Champagne-Gold hover:bg-gray-100 transition-all duration-300 rounded-lg active:scale-90 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={t('Search products')}
                >
                  <Search className="h-5 w-5" />
                </button>
                <WishlistIcon isTransparent={false} />
                <CartIcon isTransparent={false} />
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100]" style={{
            top: 'env(safe-area-inset-top)',
            bottom: 'env(safe-area-inset-bottom)',
            left: 'env(safe-area-inset-left)',
            right: 'env(safe-area-inset-right)'
          }}>
            {/* Dim background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={toggleMobileMenu}
              aria-hidden="true"
            />
            {/* Drawer */}
            <motion.div
              id="mobile-menu-panel"
              role="dialog"
              aria-modal="true"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-[85vw] max-w-sm shadow-2xl overflow-y-auto border-l border-Color-Champagne-Gold/30 bg-surface"
              style={{ maxWidth: 'min(85vw, 28rem)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 sm:p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex-none flex items-center justify-between pb-5 mb-5 border-b border-Color-Champagne-Gold/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-Color-Champagne-Gold rounded-full flex items-center justify-center">
                      <Menu className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-Color-Dark-500">{t('Menu')}</h2>
                  </div>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2.5 hover:bg-Color-Primary-Beige/30 transition-all duration-300 rounded-lg active:scale-90 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6 text-Color-Dark-500" />
                  </button>
                </div>

                {/* Sign In Button */}
                <div className="pb-4 mb-4 border-b border-Color-Champagne-Gold/40">
                  <button
                    onClick={() => handleNavigation('/account')}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-Color-Champagne-Gold to-Color-Champagne-Gold/80 hover:from-Color-Champagne-Gold/90 hover:to-Color-Champagne-Gold/70 active:from-Color-Champagne-Gold/80 active:to-Color-Champagne-Gold/60 transition-all duration-200 rounded-xl shadow-md hover:shadow-lg min-h-[60px]"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-none w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-base font-bold text-white text-left flex-1">
                        {t('Sign In')}
                      </span>
                    </div>
                    <ChevronDown className="flex-none h-5 w-5 text-white -rotate-90" />
                  </button>
                </div>

                {/* Mobile Menu Categories */}
                <div className="flex-1 overflow-y-auto space-y-2">
                  {primaryCategories.map((category) => (
                    <div key={category.id} className="overflow-hidden">
                      <button
                        onClick={() => toggleMobileSection(category.id)}
                        aria-expanded={expandedMobileSection === category.id}
                        aria-controls={`${category.id}-mobile-panel`}
                        className="w-full flex items-center justify-between p-4 bg-surface-elevated hover:bg-Color-Primary-Beige/20 active:bg-Color-Primary-Beige/30 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md min-h-[60px]"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex-none w-10 h-10 bg-Color-Champagne-Gold/20 rounded-lg flex items-center justify-center">
                            {React.createElement(IconMap[category.icon], {
                              className: 'h-5 w-5 text-Color-Champagne-Gold',
                            })}
                          </div>
                          <span className="text-base font-semibold text-Color-Dark-500 text-left flex-1">
                            {category.title}
                          </span>
                        </div>
                        <ChevronDown
                          className={`flex-none h-5 w-5 text-Color-Champagne-Gold transition-transform duration-300 ${
                            expandedMobileSection === category.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {expandedMobileSection === category.id && (
                          <motion.div
                            id={`${category.id}-mobile-panel`}
                            initial={{ height: 0, opacity: 0, y: -10 }}
                            animate={{ height: 'auto', opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: -10 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 space-y-1 sm:space-y-2 bg-surface-elevated ml-2 sm:ml-3 lg:ml-4 mr-1 sm:mr-2 mb-2 shadow-lg rounded-lg">
                              {category.subcategories.map((sub, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleNavigation(sub.page)}
                                  className="flex items-center gap-3 sm:gap-4 w-full text-left py-2 sm:py-3 lg:py-4 px-2 sm:px-3 lg:px-4 text-Color-Dark-500 hover:text-Color-Champagne-Gold hover:bg-Color-Primary-Beige/20 transition-all duration-300 group rounded-lg"
                                >
                                  {React.createElement(IconMap[sub.icon], {
                                    className: 'h-4 sm:h-5 w-4 sm:w-5 text-Color-Champagne-Gold group-hover:text-Color-Dark-500 transition-colors',
                                  })}
                                  <span className="text-sm sm:typography-body font-medium group-hover:font-semibold transition-all">
                                    {sub.title}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Static Links */}
                <div className="pt-4 sm:pt-6 space-y-2 sm:space-y-3">
                  <button
                    onClick={() => handleNavigation('/collecties')}
                    className="flex items-center gap-3 sm:gap-4 w-full text-left py-3 sm:py-4 px-3 sm:px-4 lg:px-5 text-Color-Dark-500 hover:text-Color-Champagne-Gold hover:bg-Color-Primary-Beige/20 transition-all duration-300 group rounded-lg"
                  >
                    {React.createElement(IconMap['Palette'], {
                      className: 'h-5 sm:h-6 w-5 sm:w-6 text-Color-Champagne-Gold group-hover:text-Color-Dark-500 transition-colors',
                    })}
                    <span className="text-sm sm:typography-body font-medium group-hover:font-semibold transition-all capitalize">
                      {t('Collections')}
                    </span>
                  </button>
                </div>

                {/* Footer Section */}
                <div className="pt-4 sm:pt-6 lg:pt-8 mt-4 sm:mt-6 lg:mt-8 border-t border-Color-Champagne-Gold/40">
                  <div className="text-center">
                    <p className="text-xs sm:typography-caption text-Color-Gray-700 mb-3 sm:mb-4">
                      {t('Handcrafted jewelry in Antwerp')}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                      <div className="flex items-center">
                        <MapPin className="h-3 sm:h-4 w-3 sm:w-4 text-Color-Champagne-Gold mr-1 sm:mr-2" />
                        <span className="text-xs sm:typography-small text-Color-Gray-700">Schupstraat 9-11</span>
                      </div>
                      <span className="text-xs sm:typography-small text-Color-Gray-700">Antwerp, Belgium</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
        placeholder={t('Search for jewelry, rings, diamonds...')}
      />
    </>
  );
};
