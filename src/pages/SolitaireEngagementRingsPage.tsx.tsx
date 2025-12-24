import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Shield, Award, Info } from 'lucide-react';
import { motion } from 'framer-motion';

// Unified System Imports
import { ProductVariantSelector } from '../components/ProductVariantSelector';
import { PriceRequestModal } from '../components/PriceRequestModal';
import { ProductImageGallery } from '../components/ProductImageGallery';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useTimelessNecklace } from '../hooks/useTimelessNecklace';
import { UNIFIED_PRODUCTS } from '../config/productVariantsConfig';
import { useWishlist } from '../context/WishlistContext';
import { useTranslate } from '../hooks/useTranslate';

export const SolitaireEngagementRingsPage: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslate();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const {
    handleVariantAddToCart,
    handlePriceRequest,
    showPriceRequestModal,
    setShowPriceRequestModal,
    requestedVariant
  } = useTimelessNecklace();

  // 1. Connect to the 'rings' configuration from UNIFIED_PRODUCTS
  const product = UNIFIED_PRODUCTS.rings;

  if (!product) return null;

  const isInWishlist = wishlistState?.items?.some(item => item.id === product.handle) ?? false;

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
          {/* Visual Gallery with sticky behavior */}
          <div className="sticky top-8 h-fit">
            <ProductImageGallery
              images={product.images}
              productName={product.title}
              selectedImageIndex={selectedImageIndex}
              onImageSelect={setSelectedImageIndex}
            />
          </div>

          {/* Engagement Details and Unified Selector */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-5xl font-light text-gray-900 mb-2 tracking-tight">
                  {product.title}
                </h1>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">
                  {t('The Classic Solitaire Selection')}
                </p>
              </div>
              <button 
                onClick={() => wishlistDispatch({ type: isInWishlist ? 'REMOVE_ITEM' : 'ADD_ITEM', payload: product })}
                className="p-3 rounded-full hover:bg-gray-100 transition-all border border-gray-100"
              >
                <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
            </div>

            <p className="text-gray-600 text-lg font-light leading-relaxed mb-10 whitespace-pre-line">
              {product.description}
            </p>

            {/* 2. Inject the Unified Selector with the 'rings' key */}
            <ProductVariantSelector
              productKey="rings"
              onAddToCart={(v) => handleVariantAddToCart(v, product.title)}
              onRequestPrice={handlePriceRequest}
            />

            {/* Engagement-Specific Trust Signals */}
            <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex gap-4 items-start">
                <Info className="w-5 h-5 text-[#CDBCAB] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">{t('Proposal Essentials')}</h4>
                  <ul className="text-xs text-gray-500 space-y-2">
                    <li>• {t('One-time complimentary resizing included')}</li>
                    <li>• {t('Certified conflict-free natural or lab diamonds')}</li>
                    <li>• {t('Luxury proposal packaging and insured shipping')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable Modal for Natural Diamond Requests */}
      <PriceRequestModal
        isOpen={showPriceRequestModal}
        onClose={() => setShowPriceRequestModal(false)}
        variant={requestedVariant as any}
      />
    </div>
  );
};