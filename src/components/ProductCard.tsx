/**
 * src/components/ProductCard.tsx
 * Robust Product Card for Diamonds By CS
 */
import React, { useMemo } from 'react';
import { ProcessedProduct } from '../types/shopify';
import { ProductFilters } from '../config/filterConfig';
import { getProductDisplayPrice, getVariantMetadata } from '../utils/diamondFilterUtils';
import { normalizeVendor } from '../utils/filterUtils';

interface ProductCardProps {
  product: ProcessedProduct;
  filters: ProductFilters;
  getActiveVariant: (product: ProcessedProduct) => any;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  filters, 
  getActiveVariant 
}) => {
  // 1. Identify the active variant based on current filter state
  const activeVariant = useMemo(() => getActiveVariant(product), [product, getActiveVariant]);

  // 2. Derive metadata (Price, SKU, Availability)
  const displayPrice = getProductDisplayPrice(product, activeVariant);
  const { sku, available, label } = getVariantMetadata(activeVariant);
  const normalizedVendor = normalizeVendor(product.vendor);

  return (
    <div className="group relative border border-gray-200 p-4 transition-all hover:shadow-lg">
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
        >
          {available ? 'Add to Selection' : 'Not Available'}
        </button>
      </div>
    </div>
  );
};