'use client';

/**
 * src/components/ProductCard.tsx
 * Robust Product Card for Diamonds By CS
 */
import React, { useMemo } from 'react';
import Link from 'next/link';
import { ProcessedProduct } from '../../types/shopify';
import { ProductFilters } from '../../config/filterConfig';
import { getProductDisplayPrice, getVariantMetadata } from '../../utils/diamondFilterUtils';
import { normalizeVendor } from '../../utils/filterUtils';

interface ProductCardProps {
  product: ProcessedProduct;
  filters?: ProductFilters;
  getActiveVariant?: (product: ProcessedProduct) => any;
  // Legacy props for backward compatibility
  usingFallback?: boolean;
  onQuickView?: () => void;
  activeFilters?: any;
  onNavigate?: (page: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  filters,
  getActiveVariant
}) => {
  // CRITICAL: Guard against missing getActiveVariant
  // Fallback to first variant or null if function not provided
  const activeVariant = useMemo(() => {
    if (!getActiveVariant || typeof getActiveVariant !== 'function') {
      // Fallback: use first variant or null
      return product?.variants?.[0] || null;
    }
    return getActiveVariant(product);
  }, [product, getActiveVariant]);

  // 2. Derive metadata (Price, SKU, Availability)
  const displayPrice = getProductDisplayPrice(product, activeVariant);
  const { sku, available, label } = getVariantMetadata(activeVariant);
  const normalizedVendor = normalizeVendor(product.vendor);

  return (
    <Link
      href={`/product/${product.handle}`}
      className="group relative border border-gray-200 p-4 transition-all hover:shadow-lg block"
    >
      {/* Product Image */}
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={activeVariant?.image || product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
        />
      </div>

      {/* Product Info */}
      <div className="mt-4 flex flex-col space-y-1">
        <p className="text-xs uppercase tracking-widest text-gray-500">
          {normalizedVendor}
        </p>
        <h3 className="text-sm font-medium text-gray-900">
          {product.name}
        </h3>

        {/* Dynamic Price Display (Natural Diamond Logic Handled) */}
        <p className="text-lg font-semibold text-primary">
          {displayPrice}
        </p>

        {/* Variant Specific Metadata */}
        <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
          <span>SKU: {sku}</span>
          <span className={`${available ? 'text-green-600' : 'text-red-500'}`}>
            {label}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4">
        <button
          disabled={!available}
          className={`w-full py-2 text-sm font-medium transition-colors ${
            available
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {available ? 'View Details' : 'Not Available'}
        </button>
      </div>
    </Link>
  );
};