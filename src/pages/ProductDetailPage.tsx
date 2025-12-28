import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Sparkles, X, WifiOff } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useProductDetail } from '../hooks/useProductDetail';
import { ProductGallery } from '../components/product-detail/ProductGallery';
import { ProductInfo } from '../components/product-detail/ProductInfo';
import { PurchasePanel } from '../components/product-detail/PurchasePanel';
import { ProductSpecifications } from '../components/product-detail/ProductSpecifications';
import { ExpertAdviceCTA } from '../components/product-detail/ExpertAdviceCTA';
import { ProductActions } from '../components/product-detail/ProductActions';

export const ProductDetailPage: React.FC = () => {
  const { id: handle } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    product,
    selectedVariant,
    selectedOptions,
    quantity,
    loading,
    error,
    usingFallback,
    isInWishlist,
    isAddingToCart,
    selectOptions,
    setQuantity,
    addToCart,
    toggleWishlist,
  } = useProductDetail(handle || '');

  const handleContactClick = () => navigate('/contact');
  const handleBackToShop = () => navigate('/shop');

  if (loading) return <LoadingState />;
  if (error || !product) return <ErrorState onBack={handleBackToShop} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#FCFAFB]"
    >
      <AnimatePresence>
        {usingFallback && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            className="bg-blue-50/80 backdrop-blur-md border-b border-blue-100 py-3 text-center"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-800 flex items-center justify-center gap-3">
              <WifiOff className="w-3 h-3" /> Digital Continuity Active • Local Cache
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-24">
        <div className="mb-12">
          <Breadcrumbs
            items={[
              { label: 'Collections', path: '/shop', icon: ShoppingBag },
              { label: product.category || 'Jewelry' },
              { label: product.name },
            ]}
            onNavigate={navigate}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="space-y-12">
            <ProductInfo
              name={product.name}
              category={product.category}
              description={product.description}
              selectedVariant={selectedVariant}
              basePrice={product.price}
            />

            <PurchasePanel
              product={product}
              selectedOptions={selectedOptions}
              quantity={quantity}
              onOptionsChange={selectOptions}
              onQuantityChange={setQuantity}
            />

            <ProductSpecifications selectedVariant={selectedVariant} />

            <ExpertAdviceCTA onContactClick={handleContactClick} />
          </div>
        </div>
      </main>

      <ProductActions
        productName={product.name}
        productImage={product.primaryImage}
        selectedVariant={selectedVariant}
        isInWishlist={isInWishlist}
        isAddingToCart={isAddingToCart}
        cartLoading={false}
        onAddToCart={addToCart}
        onToggleWishlist={toggleWishlist}
        onContactClick={handleContactClick}
      />
    </motion.div>
  );
};

const LoadingState = () => (
  <div className="h-screen flex flex-col items-center justify-center space-y-6">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    >
      <Sparkles className="w-10 h-10 text-Color-Champagne-Gold" />
    </motion.div>
    <span className="text-[10px] uppercase tracking-[0.5em] font-black text-Color-Light-300">
      Unveiling Masterpiece
    </span>
  </div>
);

const ErrorState = ({ onBack }: { onBack: () => void }) => (
  <div className="h-screen flex flex-col items-center justify-center text-center px-6">
    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-8">
      <X className="w-8 h-8 text-red-500" />
    </div>
    <h2 className="text-3xl font-serif text-Color-Dark-500 mb-4">Piece Unattainable</h2>
    <p className="text-Color-Gray-500 max-w-sm mx-auto mb-10 leading-relaxed">
      We could not retrieve this specific curation. It may have been retired or moved to our
      private vault.
    </p>
    <button
      onClick={onBack}
      className="px-10 py-4 bg-Color-Dark-500 text-white uppercase text-[10px] tracking-widest font-black hover:bg-black transition-colors"
    >
      Return to Collections
    </button>
  </div>
);
