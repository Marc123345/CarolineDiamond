import React, { useState, useEffect } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CookieProvider } from './context/CookieContext';
import { AuthProvider } from './context/AuthContext';
import { TranslationProvider } from './context/TranslationContext';
import { ToastProvider } from './context/ToastContext';
import { PageTransition } from './components/PageTransition';
import { HomePage } from './pages/HomePage';
import { lazyWithRetry } from './utils/lazyWithRetry';

// Use lazyWithRetry for better error handling and automatic retries
const ShopPage = lazyWithRetry(() => import('./pages/ShopPage').then(module => ({ default: module.ShopPage })), { componentName: 'ShopPage' });
const EngagementRingsPage = lazyWithRetry(() => import('./pages/EngagementRingsPage').then(module => ({ default: module.EngagementRingsPage })), { componentName: 'EngagementRingsPage' });
const WeddingRingsPage = lazyWithRetry(() => import('./pages/WeddingRingsPage').then(module => ({ default: module.WeddingRingsPage })), { componentName: 'WeddingRingsPage' });
const FineJewelryPage = lazyWithRetry(() => import('./pages/FineJewelryPage').then(module => ({ default: module.FineJewelryPage })), { componentName: 'FineJewelryPage' });
const EarringsPage = lazyWithRetry(() => import('./pages/EarringsPage').then(module => ({ default: module.EarringsPage })), { componentName: 'EarringsPage' });
const NecklacesPage = lazyWithRetry(() => import('./pages/NecklacesPage').then(module => ({ default: module.NecklacesPage })), { componentName: 'NecklacesPage' });
const TimelessNecklaceProductPage = lazyWithRetry(() => import('./pages/TimelessNecklaceProductPage').then(module => ({ default: module.TimelessNecklaceProductPage })), { componentName: 'TimelessNecklaceProductPage' });
const CollectiesPage = lazyWithRetry(() => import('./pages/CollectiesPage').then(module => ({ default: module.CollectiesPage })), { componentName: 'CollectiesPage' });
const NewArrivalsPage = lazyWithRetry(() => import('./pages/NewArrivalsPage').then(module => ({ default: module.NewArrivalsPage })), { componentName: 'NewArrivalsPage' });
const BestsellersPage = lazyWithRetry(() => import('./pages/BestsellersPage').then(module => ({ default: module.BestsellersPage })), { componentName: 'BestsellersPage' });
const GiftInspirationPage = lazyWithRetry(() => import('./pages/GiftInspirationPage').then(module => ({ default: module.GiftInspirationPage })), { componentName: 'GiftInspirationPage' });
const KindWordsPage = lazyWithRetry(() => import('./pages/KindWordsPage').then(module => ({ default: module.KindWordsPage })), { componentName: 'KindWordsPage' });
const AboutPage = lazyWithRetry(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })), { componentName: 'AboutPage' });
const ContactPage = lazyWithRetry(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })), { componentName: 'ContactPage' });
import { Footer } from './components/Footer';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { ShopifyConnectionTest } from './pages/ShopifyConnectionTest';
import { TermsConditionsPage } from './pages/TermsConditionsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { ReturnRefundPolicyPage } from './pages/ReturnRefundPolicyPage';
import { PickupPolicyPage } from './pages/PickupPolicyPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';
import { OrdersPage } from './pages/OrdersPage';
import { NotificationPreferencesPage } from './pages/NotificationPreferencesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { DesktopNav } from './components/DesktopNav';
import { MobileMenu } from './components/MobileMenu';
import { CartIcon } from './components/CartIcon';
import { WishlistIcon } from './components/WishlistIcon';
import { UserMenu } from './components/auth/UserMenu';
import { AuthModal } from './components/auth/AuthModal';
import { SearchModal } from './components/SearchModal';

import { brandAssets } from './config/siteConfig';
import { ChrisStatusWidget } from './components/ChrisStatusWidget';
import { ErrorPage } from './pages/ErrorPage';
import { ErrorBoundary } from './components/ErrorBoundary';

// Helper function to generate stable keys for routes that share components
// This prevents AnimatePresence from creating conflicting animations
function getRouteKey(pathname: string): string {
  // Group shop pages together to prevent animation conflicts
  if (pathname.startsWith('/shop/')) {
    return 'shop';
  }
  // Group product pages together
  if (pathname.startsWith('/product/')) {
    return 'product';
  }
  // Group collection pages together
  if (pathname.startsWith('/collections/')) {
    return 'collections';
  }
  // Group about pages together
  if (pathname.startsWith('/about/')) {
    return 'about';
  }
  // Use pathname for other routes
  return pathname;
}

// Lazy load non-critical components with retry logic
const CookieBanner = lazyWithRetry(() => import('./components/CookieBanner').then(module => ({ default: module.CookieBanner })), { componentName: 'CookieBanner' });
const ShoppingCart = lazyWithRetry(() => import('./components/ShoppingCart').then(module => ({ default: module.ShoppingCart })), { componentName: 'ShoppingCart' });
const Wishlist = lazyWithRetry(() => import('./components/Wishlist').then(module => ({ default: module.Wishlist })), { componentName: 'Wishlist' });
const WhatsAppButton = lazyWithRetry(() => import('./components/WhatsAppButton').then(module => ({ default: module.WhatsAppButton })), { componentName: 'WhatsAppButton' });
const TawkChat = lazyWithRetry(() => import('./components/TawkChat'), { componentName: 'TawkChat' });

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [nonCriticalLoaded, setNonCriticalLoaded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setShowSearch(false);
    }
  };

  // Load non-critical components after initial render using requestIdleCallback for better performance
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        setNonCriticalLoaded(true);
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      const timer = setTimeout(() => {
        setNonCriticalLoaded(true);
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (path: string) => {
    try {
      // Close mobile menu if open
      if (showMobileMenu) {
        setShowMobileMenu(false);
      }
      // Navigate to the path
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback navigation
      window.location.href = path;
    }
  };

  // Preload functions removed - lazy loading handles optimization

  return (
    <ToastProvider>
      <CookieProvider>
        <CartProvider>
          <WishlistProvider>
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            <SearchModal
              isOpen={showSearch}
              onClose={() => setShowSearch(false)}
              onSearch={handleSearch}
              placeholder="Search for engagement rings, diamonds, jewelry..."
            />
            <ChrisStatusWidget />
          <div className="min-h-screen bg-Color-Netural-White">
            {/* Unified Navigation Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-full bg-white border-b border-gray-200 shadow-lg" style={{ top: 'env(safe-area-inset-top)' }} role="navigation" aria-label="Main navigation">
              <div className="max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6 lg:px-16 w-full">
                {/* Top Row: Logo, Nav, Icons */}
                <div className="grid grid-cols-[100px_1fr_auto] sm:grid-cols-[140px_1fr_auto] md:grid-cols-[180px_1fr_auto] lg:grid-cols-[220px_1fr_220px] xl:grid-cols-[260px_1fr_260px] items-center h-16 sm:h-18 md:h-20 gap-2 sm:gap-3 md:gap-4 lg:gap-8">
                  {/* Logo */}
                  <div className="flex justify-start">
                    <button
                      onClick={() => handleNavigate('/')}
                      className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-Color-Light-300 rounded-lg py-2 min-w-[44px] min-h-[44px]"
                      aria-label="Go to home page"
                    >
                      <img
                        src={brandAssets.logo}
                        alt={brandAssets.logoAlt}
                        className="h-8 sm:h-10 md:h-12 w-auto transition-all duration-500 group-hover:opacity-80 group-hover:scale-105"
                      />
                    </button>
                  </div>

                  {/* Desktop Navigation */}
                  <div className="flex justify-center">
                    <DesktopNav
                      onNavigate={handleNavigate}
                      isScrolled={isScrolled}
                    />
                  </div>

                  {/* Right Side Icons */}
                  <div className="flex items-center justify-end gap-3 sm:gap-4">
                    {/* Hamburger Menu - Always Visible */}
                    <button
                      onClick={() => setShowMobileMenu(!showMobileMenu)}
                      className="p-2 text-black hover:text-Color-Champagne-Gold hover:bg-gray-100 transition-all duration-300 rounded-lg active:scale-90 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      aria-label={showMobileMenu ? "Close menu" : "Open menu"}
                      aria-expanded={showMobileMenu}
                      aria-controls="mobile-menu"
                    >
                      {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>

                    {/* Desktop Icons - Hidden on mobile/tablet */}
                    <div className="hidden lg:flex items-center gap-2 md:gap-3 lg:gap-5">
                      <button
                        onClick={() => setShowSearch(true)}
                        className="relative text-black hover:text-Color-Champagne-Gold lg:text-[#CDBCAB] lg:hover:text-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Search products"
                      >
                        <Search className="h-6 w-6" />
                      </button>
                      <div className="text-black lg:text-[#CDBCAB]">
                        <WishlistIcon isTransparent={false} />
                      </div>
                      <div className="text-black lg:text-[#CDBCAB]">
                        <CartIcon isTransparent={false} />
                      </div>
                      <UserMenu onOpenAuth={() => setShowAuthModal(true)} />
                    </div>
                  </div>
                </div>

              </div>
            </nav>

            <main className="min-h-screen w-full overflow-x-hidden pt-20" role="main">
              <ErrorBoundary>
                <React.Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center bg-white">
                    <div className="text-center">
                      <div className="animate-spin h-12 w-12 border-b-2 border-Color-Light-300 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading...</p>
                    </div>
                  </div>
                }>
                  <AnimatePresence mode="sync">
                    <PageTransition key={getRouteKey(location.pathname)}>
                      <Routes location={location}>
                  {/* Home */}
                  <Route path="/" element={<HomePage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />

                  {/* Shop Routes */}
                  <Route path="/shop" element={<ShopPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/shop/engagement-rings" element={<EngagementRingsPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/shop/wedding-rings" element={<WeddingRingsPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/shop/fine-jewelry" element={<FineJewelryPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/shop/earrings" element={<EarringsPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/shop/necklaces" element={<NecklacesPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/product/timeless-diamond-necklace" element={<TimelessNecklaceProductPage />} errorElement={<ErrorPage />} />
                  <Route path="/product/timeless-diamond-necklace-18k-gold-0-50ct" element={<TimelessNecklaceProductPage />} errorElement={<ErrorPage />} />
                  <Route path="/product/timeless-diamond-necklace-18k-gold-1-00ct" element={<TimelessNecklaceProductPage />} errorElement={<ErrorPage />} />
                  <Route path="/product/:id" element={
                    <ErrorBoundary>
                      <ProductDetailPage />
                    </ErrorBoundary>
                  } errorElement={<ErrorPage />} />

                  {/* Collections Routes */}
                  <Route path="/collections" element={<CollectiesPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/collections/new-arrivals" element={<NewArrivalsPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/collections/bestsellers" element={<BestsellersPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/collections/special" element={<CollectiesPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />

                  {/* About Routes */}
                  <Route path="/about" element={<AboutPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/about/atelier" element={<AboutPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/about/sustainability" element={<AboutPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />

                  {/* Other Pages */}
                  <Route path="/kind-words" element={<KindWordsPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/contact" element={<ContactPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/gift-inspiration" element={<GiftInspirationPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />

                  {/* Legacy Routes (redirect to new structure) */}
                  <Route path="/juwelen" element={<FineJewelryPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/collecties" element={<CollectiesPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />

                  {/* Account Routes */}
                  <Route path="/account/settings" element={<AccountSettingsPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/account/orders" element={<OrdersPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/account/notifications" element={<NotificationPreferencesPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />

                  {/* Legal & Policy Routes */}
                  <Route path="/terms" element={<TermsConditionsPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/cookies" element={<CookiePolicyPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/returns" element={<ReturnRefundPolicyPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/pickup" element={<PickupPolicyPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />

                  {/* System Pages */}
                  <Route path="/design-system" element={<DesignSystemPage onNavigate={handleNavigate} />} errorElement={<ErrorPage />} />
                  <Route path="/test-connection" element={<ShopifyConnectionTest />} errorElement={<ErrorPage />} />

                  {/* 404 - Catch all */}
                  <Route path="*" element={<NotFoundPage onNavigate={handleNavigate} />} />
                      </Routes>
                    </PageTransition>
                  </AnimatePresence>
                </React.Suspense>
              </ErrorBoundary>
            </main>
            <Footer onNavigate={handleNavigate} />
            
            {/* Mobile Menu */}
            <MobileMenu 
              showMenu={showMobileMenu} 
              setShowMenu={setShowMobileMenu} 
              onNavigate={handleNavigate} 
            />

            {/* Cart - Always mounted for state synchronization */}
            <ErrorBoundary>
              <React.Suspense fallback={null}>
                <ShoppingCart />
              </React.Suspense>
            </ErrorBoundary>

            {/* Other non-critical components loaded after initial render */}
            {nonCriticalLoaded && (
              <ErrorBoundary>
                <React.Suspense fallback={null}>
                  <Wishlist />
                  <WhatsAppButton />
                  <TawkChat />
                  <CookieBanner />
                </React.Suspense>
              </ErrorBoundary>
            )}
          </div>
        </WishlistProvider>
      </CartProvider>
    </CookieProvider>
    </ToastProvider>
  );
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#CDBCAB',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <TranslationProvider>
          <AppContent />
        </TranslationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;