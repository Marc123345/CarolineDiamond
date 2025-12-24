import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Shield, Truck, Award, Package } from 'lucide-react';
import { motion } from 'framer-motion';

import { ProductVariantSelector } from '../components/ProductVariantSelector';
import { PriceRequestModal } from '../components/PriceRequestModal';
import { ProductImageGallery } from '../components/ProductImageGallery';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useTimelessNecklace } from '../hooks/useTimelessNecklace';
import { UNIFIED_PRODUCTS } from '../config/productVariantsConfig';
import { useWishlist } from '../context/WishlistContext';
import { useTranslation } from '../context/TranslationContext';

export const EarringsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const {
    handleVariantAddToCart,
    handlePriceRequest,
    showPriceRequestModal,
    setShowPriceRequestModal,
    requestedVariant
  } = useTimelessNecklace();

  const product = UNIFIED_PRODUCTS.earrings;

  if (!product) return null;

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
          price: 490,
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

          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <p className="text-sm text-gray-500">{t('Handcrafted in Antwerp')}</p>
              </div>
              <button onClick={toggleWishlist} className="p-3 rounded-full hover:bg-gray-100 transition-colors">
                <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
            </div>

            <p className="text-gray-600 mb-8 whitespace-pre-line">{product.description}</p>

            <ProductVariantSelector
              productKey="earrings"
              onAddToCart={(v) => handleVariantAddToCart(v, product.title)}
              onRequestPrice={handlePriceRequest}
            />
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