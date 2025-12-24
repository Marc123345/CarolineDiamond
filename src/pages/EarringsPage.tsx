// src/pages/EarringsPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Shield, Truck, Award, Package } from 'lucide-react';
import { motion } from 'framer-motion';

// Imports from your new unified system
import { ProductVariantSelector } from '../components/ProductVariantSelector';
import { PriceRequestModal } from '../components/PriceRequestModal';
import { ProductImageGallery } from '../components/ProductImageGallery';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useTimelessNecklace } from '../hooks/useTimelessNecklace'; // Reusing logic for variant actions
import { UNIFIED_PRODUCTS } from '../config/productVariantsConfig';
import { useWishlist } from '../context/WishlistContext';
import { useTranslation } from '../context/TranslationContext';

export const EarringsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();

  // Reusing the hook for cart and price request state management
  const {
    handleVariantAddToCart,
    handlePriceRequest,
    showPriceRequestModal,
    setShowPriceRequestModal,
    requestedVariant
  } = useTimelessNecklace();

  // Load the earrings configuration
  const product = UNIFIED_PRODUCTS.earrings;

  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('Product Not Found')}</h2>
          <button onClick={() => navigate('/shop')} className="text-[#CDBCAB] hover:underline">
            {t('Return to Shop')}
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
          price: 490, // Base price for Earrings
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
            { label: t('Earrings'), path: '/shop/earrings' },
            { label: product.title, path: `/product/${product.handle}` }
          ]}
          onNavigate={path => navigate(path)}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Gallery Section */}
          <div className="sticky top-8 h-fit">
            <ProductImageGallery
              images={product.images}
              productName={product.title}
              selectedImageIndex={selectedImageIndex}
              onImageSelect={setSelectedImageIndex}
            />

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="w-6 h-6 text-[#CDBCAB]" />
                <div>
                  <p className="text-xs font-semibold text-gray-900">{t('Certified')}</p>
                  <p className="text-[10px] text-gray-500">HRD/IGI/GIA</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Truck className="w-6 h-6 text-[#CDBCAB]" />
                <div>
                  <p className="text-xs font-semibold text-gray-900">{t('Free Shipping')}</p>
                  <p className="text-[10px] text-gray-500">{t('Worldwide')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <p className="text-sm text-gray-500">{t('Handcrafted in Antwerp')}</p>
              </div>
              <button onClick={toggleWishlist} className="p-3 rounded-full hover:bg-gray-100">
                <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
            </div>

            <div className="mb-8">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Implementation of the Unified Selector for Earrings */}
            <ProductVariantSelector
              productKey="earrings"
              onAddToCart={handleVariantAddToCart}
              onRequestPrice={handlePriceRequest}
            />

            {/* Category Specific Features */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('Earring Details')}</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#CDBCAB]" />
                  {t('Secure butterfly backing')}
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#CDBCAB]" />
                  {t('Hypoallergenic 18K Gold')}
                </li>
              </ul>
            </div>
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