// src/pages/TimelessNecklaceProductPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Shield, Truck, Award, Package } from 'lucide-react';
import { motion } from 'framer-motion';

// 1. Updated Imports: Use the new generic selector and config
import { ProductVariantSelector } from '../components/ProductVariantSelector';
import { PriceRequestModal } from '../components/PriceRequestModal';
import { ProductImageGallery } from '../components/ProductImageGallery';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useTimelessNecklace } from '../hooks/useTimelessNecklace';
import { UNIFIED_PRODUCTS } from '../config/productVariantsConfig'; // New name
import { useWishlist } from '../context/WishlistContext';
import { useTranslation } from '../context/TranslationContext';

export const TimelessNecklaceProductPage: React.FC = () => {
  const { id: handle } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();

  const {
    handleVariantAddToCart,
    handlePriceRequest,
    showPriceRequestModal,
    setShowPriceRequestModal,
    requestedVariant
  } = useTimelessNecklace();

  // 2. Load the necklace specifically from the unified record
  const product = UNIFIED_PRODUCTS.necklace;

  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  // Error handling if product is missing
  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('Product Not Found')}</h2>
          <button onClick={() => navigate('/shop/necklaces')} className="text-[#CDBCAB] hover:underline">
            {t('Return to Necklaces')}
          </button>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlistState?.items?.some(item => item.id === product.handle) ?? false;

  const toggleWishlist = () => {
    if (isInWishlist) {
      wishlistDispatch({ type: 'REMOVE_ITEM', payload: product.handle });
    } else {
      wishlistDispatch({
        type: 'ADD_ITEM',
        payload: {
          id: product.handle,
          title: product.title,
          price: 750, // Base price for necklace
          image: product.images[0],
          handle: product.handle
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumbs
          items={[
            { label: t('Shop'), path: '/shop' },
            { label: t('Necklaces'), path: '/shop/necklaces' },
            { label: product.title, path: `/product/${product.handle}` }
          ]}
          onNavigate={path => navigate(path)}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Gallery & Trust Signals */}
          <div className="sticky top-8 h-fit">
            <ProductImageGallery
              images={product.images}
              productName={product.title}
              selectedImageIndex={selectedImageIndex}
              onImageSelect={setSelectedImageIndex}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 grid grid-cols-2 gap-4"
            >
              <TrustSignal icon={<Shield />} title={t('Certified')} desc="HRD/IGI/GIA" />
              <TrustSignal icon={<Truck />} title={t('Free Shipping')} desc={t('Worldwide')} />
              <TrustSignal icon={<Award />} title={t('Warranty')} desc={t('Lifetime')} />
              <TrustSignal icon={<Package />} title={t('Gift Box')} desc={t('Included')} />
            </motion.div>
          </div>

          {/* Right: Product Info & Selector */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <p className="text-sm text-gray-500">{t('Handcrafted in Antwerp, Belgium')}</p>
              </div>
              <button onClick={toggleWishlist} className="p-3 rounded-full hover:bg-gray-100">
                <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
            </div>

            <div className="mb-8 prose prose-sm max-w-none">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* 3. The New Unified Selector: Pass productKey="necklace" */}
            <ProductVariantSelector
              productKey="necklace"
              onAddToCart={handleVariantAddToCart}
              onRequestPrice={handlePriceRequest}
            />

            <ProductFeatures t={t} />
          </div>
        </div>
      </div>

      <PriceRequestModal
        isOpen={showPriceRequestModal}
        onClose={() => setShowPriceRequestModal(false)}
        variant={requestedVariant}
      />
    </div>
  );
};

// Helper Components for cleaner code
const TrustSignal = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
    <div className="text-[#CDBCAB]">{icon}</div>
    <div>
      <p className="text-xs font-semibold text-gray-900">{title}</p>
      <p className="text-[10px] text-gray-500">{desc}</p>
    </div>
  </div>
);

const ProductFeatures = ({ t }: { t: any }) => (
  <div className="mt-12 pt-8 border-t border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('Product Features')}</h3>
    <ul className="space-y-3">
      {[
        { title: 'Premium 18K Gold', desc: 'Available in White, Yellow, and Rose Gold' },
        { title: 'D-VS2 Diamond Quality', desc: 'Exceptional color and clarity' },
        { title: 'Certified Diamonds', desc: 'Includes HRD, IGI, or GIA certificate' }
      ].map((feature, idx) => (
        <li key={idx} className="flex items-start gap-3 text-sm">
          <div className="w-2 h-2 rounded-full bg-[#CDBCAB] mt-1.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">{t(feature.title)}</p>
            <p className="text-xs text-gray-500">{t(feature.desc)}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);