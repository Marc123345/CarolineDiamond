import React, { useState, useEffect, Suspense } from 'react';
import { Menu, X } from 'lucide-react';
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
import { ChrisStatusWidget } from './components/ChrisStatusWidget';
import { ErrorBoundary } from './components/ErrorBoundary';

// Static / Critical Pages
import { brandAssets } from './config/siteConfig';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

// --- RESILIENT LAZY LOADING ---
// These helpers handle cases where you might have changed 'export const' to 'export default'
const lazyLoad = (path: string, namedExport?: string) => React.lazy(() => 
  import(path).then(m => ({ 
    default: namedExport ? m[namedExport] : (m.default || m[Object.keys(m)[0]]) 
  })).catch(err => {
    console.error(`Failed to load page at ${path}:`, err);
    return { default: () => <div className="p-20 text-center">Page Load Error</div> };
  })
);

const ShopPage = lazyLoad('./pages/ShopPage', 'ShopPage');
const WeddingRingsPage = lazyLoad('./pages/WeddingRingsPage', 'WeddingRingsPage');
const FineJewelryPage = lazyLoad('./pages/FineJewelryPage', 'FineJewelryPage');
const CollectiesPage = lazyLoad('./pages/CollectiesPage', 'CollectiesPage');
const AboutPage = lazyLoad('./pages/AboutPage', 'AboutPage');
const ContactPage = lazyLoad('./pages/ContactPage', 'ContactPage');

// NEW UNIFIED PAGES
const EarringsPage = lazyLoad('./pages/EarringsPage', 'EarringsPage');
const SolitaireEngagementRingsPage = lazyLoad('./pages/SolitaireEngagementRingsPage.tsx', 'SolitaireEngagementRingsPage');
const NecklacesPage = lazyLoad('./pages/NecklacesPage', 'NecklacesPage');

// Non-critical components
const ShoppingCart = React.lazy(() => import('./components/ShoppingCart').then(m => ({ default: m.ShoppingCart || m.default })));
const Wishlist = React.lazy(() => import('./components/Wishlist').then(m => ({ default: m.Wishlist || m.default })));

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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
    <div className="min-h-screen bg-white">
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <ChrisStatusWidget />

      <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-gray-200 h-20 flex items-center px-4 lg:px-16 justify-between">
        <button onClick={() => handleNavigate('/')} className="focus:outline-none">
          <img src={brandAssets.logo} alt="Logo" className="h-10 w-auto" />
        </button>
        <DesktopNav onNavigate={handleNavigate} isScrolled={isScrolled} />
        <div className="flex items-center gap-4">
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="lg:hidden p-2"><Menu /></button>
          <div className="hidden lg:flex items-center gap-5">
            <WishlistIcon isTransparent={false} />
            <CartIcon isTransparent={false} />
            <UserMenu onOpenAuth={() => setShowAuthModal(true)} />
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <ErrorBoundary>
          <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                <Routes location={location}>
                  <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
                  <Route path="/shop" element={<ShopPage onNavigate={handleNavigate} />} />
                  <Route path="/shop/earrings" element={<EarringsPage />} />
                  <Route path="/shop/engagement-rings" element={<SolitaireEngagementRingsPage />} />
                  <Route path="/shop/necklaces" element={<NecklacesPage onNavigate={handleNavigate} />} />
                  <Route path="/shop/wedding-rings" element={<WeddingRingsPage onNavigate={handleNavigate} />} />
                  <Route path="/shop/fine-jewelry" element={<FineJewelryPage onNavigate={handleNavigate} />} />
                  <Route path="/collecties" element={<CollectiesPage onNavigate={handleNavigate} />} />

                  {/* Product Detail */}
                  <Route path="/product/:id" element={<ProductDetailPage />} />

                  {/* Other routes */}
                  <Route path="/about" element={<AboutPage onNavigate={handleNavigate} />} />
                  <Route path="/contact" element={<ContactPage onNavigate={handleNavigate} />} />
                  <Route path="*" element={<NotFoundPage onNavigate={handleNavigate} />} />
                </Routes>
              </PageTransition>
            </AnimatePresence>
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer onNavigate={handleNavigate} />
      <MobileMenu showMenu={showMobileMenu} setShowMenu={setShowMobileMenu} onNavigate={handleNavigate} />
      
      <Suspense fallback={null}>
        <ShoppingCart />
        <Wishlist />
      </Suspense>
    </div>
  );
}

const theme = createTheme({ palette: { primary: { main: '#CDBCAB' } } });

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <TranslationProvider>
          <ToastProvider>
            <CookieProvider>
              <CartProvider>
                <WishlistProvider>
                  <AppContent />
                </WishlistProvider>
              </CartProvider>
            </CookieProvider>
          </ToastProvider>
        </TranslationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}