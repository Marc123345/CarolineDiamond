import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Shield, Truck, Award, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { TimelessNecklaceVariantSelector } from '../components/TimelessNecklaceVariantSelector';
import { PriceRequestModal } from '../components/PriceRequestModal';
import { ProductImageGallery } from '../components/ProductImageGallery';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useTimelessNecklace } from '../hooks/useTimelessNecklace';
import { UNIFIED_TIMELESS_NECKLACE } from '../config/necklaceVariantsConfig';
import { useWishlist } from '../context/WishlistContext';
import { useTranslation } from '../context/TranslationContext';

export const TimelessNecklaceProductPage: React.FC = () => {
  console.log('[TimelessNecklaceProductPage] Component rendering - START');

  const { id: handle } = useParams<{ id: string }>();
  console.log('[TimelessNecklaceProductPage] 1. Handle from params:', handle);

  const navigate = useNavigate();
  console.log('[TimelessNecklaceProductPage] 2. useNavigate loaded');

  const { t } = useTranslation();
  console.log('[TimelessNecklaceProductPage] 3. useTranslation loaded (t function)');

  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  console.log('[TimelessNecklaceProductPage] 4. useWishlist loaded, items:', wishlistState?.items?.length);

  const {
    handleVariantAddToCart,
    handlePriceRequest,
    showPriceRequestModal,
    setShowPriceRequestModal,
    requestedVariant
  } = useTimelessNecklace();
  console.log('[TimelessNecklaceProductPage] 5. useTimelessNecklace loaded');

  const product = UNIFIED_TIMELESS_NECKLACE;
  console.log('[TimelessNecklaceProductPage] 6. Product loaded:', product?.title);
  console.log('[TimelessNecklaceProductPage] 7. Product variants:', product?.variants?.length);
  console.log('[TimelessNecklaceProductPage] 8. Product images:', product?.images?.length);

  // State for image gallery
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  // Defensive checks
  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/shop/necklaces')}
            className="text-[#CDBCAB] hover:underline"
          >
            Return to Necklaces
          </button>
        </div>
      </div>
    );
  }

  if (!product.variants || product.variants.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Unavailable</h2>
          <p className="text-gray-600 mb-4">No variants available for this product</p>
          <button
            onClick={() => navigate('/shop/necklaces')}
            className="text-[#CDBCAB] hover:underline"
          >
            Return to Necklaces
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
          price: 750,
          image: product.images[0],
          handle: product.handle
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumbs
          items={[
            { label: 'Shop', path: '/shop' },
            { label: 'Necklaces', path: '/shop/necklaces' },
            { label: product.title, path: `/product/${product.handle}` }
          ]}
          onNavigate={path => navigate(path)}
        />
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="sticky top-8 h-fit">
            {product.images && product.images.length > 0 ? (
              <ProductImageGallery
                images={product.images}
                productName={product.title || 'Product'}
                selectedImageIndex={selectedImageIndex}
                onImageSelect={setSelectedImageIndex}
              />
            ) : (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">No images available</p>
              </div>
            )}

            {/* Trust Signals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 grid grid-cols-2 gap-4"
            >
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="w-6 h-6 text-[#CDBCAB]" />
                <div>
                  <p className="text-xs font-semibold text-gray-900">{t('Certified')}</p>
                  <p className="text-[10px] text-gray-500">{t('HRD/IGI/GIA')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Truck className="w-6 h-6 text-[#CDBCAB]" />
                <div>
                  <p className="text-xs font-semibold text-gray-900">{t('Free Shipping')}</p>
                  <p className="text-[10px] text-gray-500">{t('Worldwide')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Award className="w-6 h-6 text-[#CDBCAB]" />
                <div>
                  <p className="text-xs font-semibold text-gray-900">{t('Warranty')}</p>
                  <p className="text-[10px] text-gray-500">{t('Lifetime')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Package className="w-6 h-6 text-[#CDBCAB]" />
                <div>
                  <p className="text-xs font-semibold text-gray-900">{t('Gift Box')}</p>
                  <p className="text-[10px] text-gray-500">{t('Included')}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>
                <p className="text-sm text-gray-500">{t('Handcrafted in Antwerp, Belgium')}</p>
              </div>
              <button
                onClick={toggleWishlist}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  }`}
                />
              </button>
            </div>

            {/* Description */}
            <div className="mb-8 prose prose-sm max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Variant Selector */}
            <TimelessNecklaceVariantSelector
              onAddToCart={handleVariantAddToCart}
              onRequestPrice={handlePriceRequest}
            />

            {/* Features */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('Product Features')}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#CDBCAB]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#CDBCAB]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {t('Premium 18K Gold')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('Available in White, Yellow, and Rose Gold')}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#CDBCAB]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#CDBCAB]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {t('D-VS2 Diamond Quality')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('Exceptional color and clarity')}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#CDBCAB]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#CDBCAB]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {t('Adjustable Chain Length')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('16-18 inches with secure clasp')}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#CDBCAB]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#CDBCAB]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {t('Certified Diamonds')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('Includes HRD, IGI, or GIA certificate')}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Price Request Modal */}
      <PriceRequestModal
        isOpen={showPriceRequestModal}
        onClose={() => setShowPriceRequestModal(false)}
        variant={requestedVariant}
      />
    </div>
  );
};
