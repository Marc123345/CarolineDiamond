// src/pages/SolitaireEngagementRingsPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Shield, Truck, Award, Package, Info } from 'lucide-react';
import { motion } from 'framer-motion';

// Imports from the unified system
import { ProductVariantSelector } from '../components/ProductVariantSelector';
import { PriceRequestModal } from '../components/PriceRequestModal';
import { ProductImageGallery } from '../components/ProductImageGallery';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useTimelessNecklace } from '../hooks/useTimelessNecklace'; // Reusing action logic
import { UNIFIED_PRODUCTS } from '../config/productVariantsConfig';
import { useWishlist } from '../context/WishlistContext';
import { useTranslation } from '../context/TranslationContext';

export const SolitaireEngagementRingsPage: React.FC = () => {
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

  // Load the rings configuration
  const product = UNIFIED_PRODUCTS.rings;

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
          price: 790, // Base price for Solitaire Rings
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
            { label: t('Engagement Rings'), path: '/shop/engagement-rings' },
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

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-[#F9F7F5] rounded-xl border border-[#CDBCAB]/10">
                <Shield className="w-6 h-6 text-[#CDBCAB]" />
                <div>
                  <p className="text-xs font-bold text-gray-900">{t('Secure Setting')}</p>
                  <p className="text-[10px] text-gray-500">{t('Handcrafted 4-Prong')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#F9F7F5] rounded-xl border border-[#CDBCAB]/10">
                <Award className="w-6 h-6 text-[#CDBCAB]" />
                <div>
                  <p className="text-xs font-bold text-gray-900">{t('Conflict-Free')}</p>
                  <p className="text-[10px] text-gray-500">{t('Ethically Sourced')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-5xl font-light text-gray-900 mb-2 tracking-tight">
                  {product.title}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
                  <p className="text-sm text-gray-500 uppercase tracking-widest">{t('Ready for Proposal')}</p>
                </div>
              </div>
              <button 
                onClick={toggleWishlist}
                className="p-3 rounded-full hover:bg-gray-100 transition-all border border-gray-100"
              >
                <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
            </div>

            <div className="mb-10">
              <p className="text-gray-600 text-lg font-light leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Implementation of the Unified Selector for Rings */}
            <ProductVariantSelector
              productKey="rings"
              onAddToCart={handleVariantAddToCart}
              onRequestPrice={handlePriceRequest}
            />

            {/* Ring Specific Information */}
            <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex gap-4 items-start">
                <Info className="w-5 h-5 text-[#CDBCAB] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">{t('Complimentary Services')}</h4>
                  <ul className="grid grid-cols-1 gap-2">
                    <li className="text-xs text-gray-500 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-gray-300" />
                      {t('One-time complimentary resizing')}
                    </li>
                    <li className="text-xs text-gray-500 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-gray-300" />
                      {t('Complimentary personalized engraving')}
                    </li>
                    <li className="text-xs text-gray-500 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-gray-300" />
                      {t('Luxury proposal packaging included')}
                    </li>
                  </ul>
                </div>
              </div>
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