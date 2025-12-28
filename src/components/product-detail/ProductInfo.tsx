import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NormalizedVariant } from '../../utils/productNormalizer';
import { formatPrice } from '../../utils/productNormalizer';

interface ProductInfoProps {
  name: string;
  category?: string;
  description: string;
  selectedVariant: NormalizedVariant | null;
  basePrice?: number;
}

export const ProductInfo = memo<ProductInfoProps>(({
  name,
  category,
  description,
  selectedVariant,
  basePrice
}) => {
  const displayPrice = selectedVariant?.priceNumber || basePrice || 0;
  const compareAtPrice = selectedVariant?.compareAtPriceNumber;

  return (
    <header className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-[10px] uppercase tracking-[0.5em] text-Color-Light-300 font-black">
          {category || 'Handcrafted Excellence'}
        </span>
        <div className="h-px flex-1 bg-black/[0.05]" />
      </div>

      <h1 className="text-4xl md:text-6xl font-serif text-Color-Dark-500 leading-tight">
        {name}
      </h1>

      <div className="flex items-baseline gap-6 pt-4">
        <AnimatePresence mode="wait">
          <motion.span
            key={selectedVariant?.id || 'base'}
            initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
            className="text-4xl font-serif italic text-Color-Dark-500"
          >
            {formatPrice(displayPrice)}
          </motion.span>
        </AnimatePresence>

        {compareAtPrice && compareAtPrice > displayPrice && (
          <span className="text-xl text-Color-Light-300 line-through opacity-40">
            {formatPrice(compareAtPrice)}
          </span>
        )}
      </div>

      <p className="text-lg text-Color-Gray-500 font-light leading-relaxed max-w-xl pt-4">
        {description}
      </p>
    </header>
  );
});

ProductInfo.displayName = 'ProductInfo';
