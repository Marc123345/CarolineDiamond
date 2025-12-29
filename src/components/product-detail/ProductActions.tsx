import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Phone, Zap } from 'lucide-react';
import { formatPrice, isPriceOnRequest } from '../../utils/productNormalizer';
import type { NormalizedVariant } from '../../utils/productNormalizer';

interface ProductActionsProps {
  productName: string;
  productImage: string;
  selectedVariant: NormalizedVariant | null;
  isInWishlist: boolean;
  isAddingToCart: boolean;
  cartLoading: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onToggleWishlist: () => void;
  onContactClick: () => void;
}

export const ProductActions = memo<ProductActionsProps>(({
  productName,
  productImage,
  selectedVariant,
  isInWishlist,
  isAddingToCart,
  cartLoading,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  onContactClick
}) => {
  const price = selectedVariant?.priceNumber || 0;
  const requiresInquiry = isPriceOnRequest(price) ||
    selectedVariant?.selectedOptions?.['Diamond Type']?.includes('Natural');

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
      className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-[9999] w-[96vw] sm:w-[95vw] max-w-4xl"
    >
      <div className="bg-white/95 backdrop-blur-2xl border border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl sm:rounded-full p-3 sm:p-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="hidden sm:flex items-center gap-4 pl-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-black/5">
            <img
              src={productImage}
              alt={productName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/product-placeholder.jpg';
              }}
            />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-black text-Color-Dark-500 truncate max-w-[120px]">
              {productName}
            </p>
            <p className="text-[11px] font-serif italic text-Color-Champagne-Gold">
              {formatPrice(price)}
            </p>
          </div>
        </div>

        <div className="flex-1 sm:flex-none flex items-center gap-2 sm:pr-2">
          <button
            onClick={onToggleWishlist}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all ${
              isInWishlist
                ? 'bg-red-500 text-white'
                : 'bg-black/5 text-Color-Dark-500 hover:bg-black/10'
            }`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>

          {requiresInquiry ? (
            <button
              onClick={onContactClick}
              className="flex-1 px-6 sm:px-10 h-12 sm:h-14 bg-Color-Dark-500 text-white rounded-full uppercase text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] font-black hover:bg-black transition-all flex items-center justify-center gap-2 sm:gap-4"
            >
              Inquire Price <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          ) : (
            <>
              <button
                onClick={onAddToCart}
                disabled={cartLoading || isAddingToCart || !selectedVariant?.isAvailable}
                className="flex-1 sm:flex px-4 sm:px-8 h-12 sm:h-14 bg-white text-Color-Dark-500 border-2 border-Color-Dark-500 rounded-full uppercase text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] font-black hover:bg-Color-Dark-500 hover:text-white transition-all items-center justify-center gap-2 sm:gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Add to cart"
              >
                <span className="hidden sm:inline">{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
                <span className="sm:hidden">{isAddingToCart ? 'Adding...' : 'Cart'}</span>
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={onBuyNow}
                disabled={cartLoading || isAddingToCart || !selectedVariant?.isAvailable}
                className="flex-1 px-6 sm:px-10 h-12 sm:h-14 bg-Color-Champagne-Gold text-Color-Dark-500 rounded-full uppercase text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] font-black hover:bg-[#C9A961] transition-all flex items-center justify-center gap-2 sm:gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Buy now"
              >
                {isAddingToCart ? 'Processing...' : 'Buy Now'}
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
});

ProductActions.displayName = 'ProductActions';
