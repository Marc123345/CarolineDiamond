import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Shield, Truck, Award } from 'lucide-react';
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

export const EarringsPage: React.FC = () => {
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

  // 1. Connect to the 'earrings' configuration
  const product = UNIFIED_PRODUCTS.earrings;

  if (!product) return null;

  const isInWishlist = wishlistState?.items?.some(item => item.id === product.handle) ?? false;

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
          {/* Visual Gallery */}
          <div className="sticky top-8 h-fit">
            <ProductImageGallery
              images={product.images}
              productName={product.title}
              selectedImageIndex={selectedImageIndex}
              onImageSelect={setSelectedImageIndex}
            />
          </div>

          {/* Details and Selection */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <p className="text-sm text-gray-500">{t('Handcrafted in Antwerp')}</p>
              </div>
              <button 
                onClick={() => wishlistDispatch({ type: isInWishlist ? 'REMOVE_ITEM' : 'ADD_ITEM', payload: product })}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed whitespace-pre-line">{product.description}</p>

            {/* 2. Inject the Unified Selector with the 'earrings' key */}
            <ProductVariantSelector
              productKey="earrings"
              onAddToCart={(v) => handleVariantAddToCart(v, product.title)}
              onRequestPrice={handlePriceRequest}
            />

            <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#CDBCAB]" />
                <span className="text-xs font-medium uppercase">{t('Certified Stones')}</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#CDBCAB]" />
                <span className="text-xs font-medium uppercase">{t('Insured Shipping')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PriceRequestModal
        isOpen={showPriceRequestModal}
        onClose={() => setShowPriceRequestModal(false)}
        variant={requestedVariant as any}
      />
    </div>
  );
};