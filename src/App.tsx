import React, { useState, useEffect } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Context Providers
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CookieProvider } from './context/CookieContext';
import { AuthProvider } from './context/AuthContext';
import { TranslationProvider } from './context/TranslationContext';
import { ToastProvider } from './context/ToastContext';

// Components
import { PageTransition } from './components/PageTransition';
import { Footer } from './components/Footer';
import { DesktopNav } from './components/DesktopNav';
import { MobileMenu } from './components/MobileMenu';
import { CartIcon } from './components/CartIcon';
import { WishlistIcon } from './components/WishlistIcon';
import { UserMenu } from './components/auth/UserMenu';
import { AuthModal } from './components/auth/AuthModal';
import { SearchModal } from './components/SearchModal';
import { ChrisStatusWidget } from './components/ChrisStatusWidget';
import { ErrorBoundary } from './components/ErrorBoundary';

// Config & Static Pages
import { brandAssets } from './config/siteConfig';
import { HomePage } from './pages/HomePage';
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
import { ErrorPage } from './pages/ErrorPage';

// --- LAZY LOADED PAGES (Optimized for Performance) ---
const ShopPage = React.lazy(() => import('./pages/ShopPage').then(m => ({ default: m.ShopPage })));
const WeddingRingsPage = React.lazy(() => import('./pages/WeddingRingsPage').then(m => ({ default: m.WeddingRingsPage })));
const FineJewelryPage = React.lazy(() => import('./pages/FineJewelryPage').then(m => ({ default: m.FineJewelryPage })));
const CollectiesPage = React.lazy(() => import('./pages/CollectiesPage').then(m => ({ default: m.CollectiesPage })));
const NewArrivalsPage = React.lazy(() => import('./pages/NewArrivalsPage').then(m => ({ default: m.NewArrivalsPage })));
const BestsellersPage = React.lazy(() => import('./pages/BestsellersPage').then(m => ({ default: m.BestsellersPage })));
const GiftInspirationPage = React.lazy(() => import('./pages/GiftInspirationPage').then(m => ({ default: m.GiftInspirationPage })));
const KindWordsPage = React.lazy(() => import('./pages/KindWordsPage').then(m => ({ default: m.KindWordsPage })));
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = React.lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));

// 1. UPDATED UNIFIED PRODUCT PAGES (Using the new naming convention)
const TimelessNecklaceProductPage = React.lazy(() => import('./pages/TimelessNecklaceProductPage').then(m => ({ default: m.TimelessNecklaceProductPage })));
const EarringsPage = React.lazy(() => import('./pages/EarringsPage').then(m => ({ default: m.EarringsPage })));
const SolitaireEngagementRingsPage = React.lazy(() => import('./pages/SolitaireEngagementRingsPage').then(m => ({ default: m.SolitaireEngagementRingsPage })));
const NecklacesPage = React.lazy(() => import('./pages/NecklacesPage').then(m => ({ default: m.NecklacesPage })));

// Non-critical components
const CookieBanner = React.lazy(() => import('./components/CookieBanner').then(m => ({ default: m.CookieBanner })));
const ShoppingCart = React.lazy(() => import('./components/ShoppingCart').then(m => ({ default: m.ShoppingCart })));
const Wishlist = React.lazy(() => import('./components/Wishlist').then(m => ({ default: m.Wishlist })));
const WhatsAppButton = React.lazy(() => import('./components/WhatsAppButton').then(m => ({ default: m.WhatsAppButton })));
const TawkChat = React.lazy(() => import('./components/TawkChat'));

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

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => setNonCriticalLoaded(true));
    } else {
      setTimeout(() => setNonCriticalLoaded(true), 100);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (path: string) => {
    if (showMobileMenu) setShowMobileMenu(false);
    navigate(path);
  };

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
              {/* Header */}
              <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-gray-200 shadow-lg">
                <div className="max-w-[1800px] mx-auto px-4 lg:px-16 flex items-center justify-between h-20">
                  <button onClick={() => handleNavigate('/')} className="focus:outline-none">
                    <img src={brandAssets.logo} alt={brandAssets.logoAlt} className="h-10 w-auto" />
                  </button>
                  <DesktopNav onNavigate={handleNavigate} isScrolled={isScrolled} />
                  <div className="flex items-center gap-4">
                    <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="lg:hidden p-2">
                      {showMobileMenu ? <X /> : <Menu />}
                    </button>
                    <div className="hidden lg:flex items-center gap-5">
                      <button onClick={() => setShowSearch(true)} className="text-[#CDBCAB]"><Search /></button>
                      <WishlistIcon isTransparent={false} />
                      <CartIcon isTransparent={false} />
                      <UserMenu onOpenAuth={() => setShowAuthModal(true)} />
                    </div>
                  </div>
                </div>
              </nav>

              <main className="min-h-screen w-full pt-20">
                <ErrorBoundary>
                  <React.Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
                    <AnimatePresence mode="wait">
                      <PageTransition key={location.pathname}>
                        <Routes location={location}>
                          <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />

                          {/* 2. UPDATED PRODUCT ROUTES */}
                          <Route path="/shop" element={<ShopPage onNavigate={handleNavigate} />} />
                          <Route path="/shop/earrings" element={<EarringsPage />} />
                          <Route path="/shop/engagement-rings" element={<SolitaireEngagementRingsPage />} />
                          <Route path="/shop/necklaces" element={<NecklacesPage onNavigate={handleNavigate} />} />
                          <Route path="/shop/wedding-rings" element={<WeddingRingsPage onNavigate={handleNavigate} />} />
                          <Route path="/shop/fine-jewelry" element={<FineJewelryPage onNavigate={handleNavigate} />} />

                          {/* Specific Product Landing Pages */}
                          <Route path="/product/timeless-diamond-necklace" element={<TimelessNecklaceProductPage />} />
                          <Route path="/product/timeless-diamond-necklace-18k-gold-0-50ct" element={<TimelessNecklaceProductPage />} />
                          <Route path="/product/timeless-diamond-necklace-18k-gold-1-00ct" element={<TimelessNecklaceProductPage />} />
                          
                          {/* Generic Catch-all Product Detail */}
                          <Route path="/product/:id" element={<ProductDetailPage />} />

                          {/* Collections & Info */}
                          <Route path="/collections" element={<CollectiesPage onNavigate={handleNavigate} />} />
                          <Route path="/collections/new-arrivals" element={<NewArrivalsPage onNavigate={handleNavigate} />} />
                          <Route path="/collections/bestsellers" element={<BestsellersPage onNavigate={handleNavigate} />} />
                          <Route path="/about" element={<AboutPage onNavigate={handleNavigate} />} />
                          <Route path="/contact" element={<ContactPage onNavigate={handleNavigate} />} />
                          <Route path="/kind-words" element={<KindWordsPage onNavigate={handleNavigate} />} />
                          <Route path="/gift-inspiration" element={<GiftInspirationPage onNavigate={handleNavigate} />} />

                          {/* Account & Policies */}
                          <Route path="/account/settings" element={<AccountSettingsPage onNavigate={handleNavigate} />} />
                          <Route path="/account/orders" element={<OrdersPage onNavigate={handleNavigate} />} />
                          <Route path="/terms" element={<TermsConditionsPage onNavigate={handleNavigate} />} />
                          <Route path="/privacy" element={<PrivacyPolicyPage onNavigate={handleNavigate} />} />
                          <Route path="*" element={<NotFoundPage onNavigate={handleNavigate} />} />
                        </Routes>
                      </PageTransition>
                    </AnimatePresence>
                  </React.Suspense>
                </ErrorBoundary>
              </main>

              <Footer onNavigate={handleNavigate} />
              <MobileMenu showMenu={showMobileMenu} setShowMenu={setShowMobileMenu} onNavigate={handleNavigate} />
              
              {/* Shopping Cart (Always Active) */}
              <React.Suspense fallback={null}>
                <ShoppingCart />
              </React.Suspense>

              {/* Non-Critical Utilities */}
              {nonCriticalLoaded && (
                <React.Suspense fallback={null}>
                  <Wishlist />
                  <WhatsAppButton />
                  <TawkChat />
                  <CookieBanner />
                </React.Suspense>
              )}
            </div>
          </WishlistProvider>
        </CartProvider>
      </CookieProvider>
    </ToastProvider>
  );
}

const theme = createTheme({ palette: { primary: { main: '#CDBCAB' } } });

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