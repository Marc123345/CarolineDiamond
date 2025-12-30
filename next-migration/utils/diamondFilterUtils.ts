import { ProcessedProduct, ProductVariant } from '../types/shopify';

/**
 * Filters diamonds based on carat weight
 */
export const filterDiamonds = (products: ProcessedProduct[], carat?: string) => {
  if (!carat) return products;
  return products.filter(product =>
    product.variants.some(v => v.selectedOptions?.['Carat'] === carat)
  );
};

/**
 * Gets the display price for a product with variant
 * Handles Natural Diamond special case
 */
export const getProductDisplayPrice = (product: ProcessedProduct, variant?: ProductVariant | null): string => {
  // CRITICAL: Guard against corrupted product data
  if (!product || !product.variants || !Array.isArray(product.variants)) {
    return 'Price Unavailable';
  }

  // Check if variant has Natural Diamond (contact for price)
  if (variant) {
    const diamondType = variant.selectedOptions?.['Diamond Type'];
    if (diamondType && (diamondType === 'Natural Diamond' || diamondType.toLowerCase().includes('natural'))) {
      return 'Contact for Price';
    }
    // Show variant price if available
    if (variant.price > 0) {
      return `€${variant.price.toLocaleString()}`;
    }
  }

  // Fallback: Show base price range from all available variants
  const prices = product.variants
    .filter(v => v && v.availableForSale && v.price > 0)
    .map(v => v.price);

  if (prices.length === 0) {
    // Check if all variants are natural diamonds
    const hasNaturalDiamond = product.variants.some(v => {
      const type = v.selectedOptions?.['Diamond Type'];
      return type && (type === 'Natural Diamond' || type.toLowerCase().includes('natural'));
    });
    return hasNaturalDiamond ? 'Contact for Price' : 'Price Unavailable';
  }

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  if (minPrice === maxPrice) {
    return `€${minPrice.toLocaleString()}`;
  }
  return `€${minPrice.toLocaleString()} - €${maxPrice.toLocaleString()}`;
};

/**
 * Gets variant metadata (SKU, availability)
 */
export const getVariantMetadata = (variant?: ProductVariant | null) => {
  if (!variant) {
    return {
      sku: 'Not Available',
      available: false,
      label: 'Select Options'
    };
  }

  return {
    sku: variant.sku || 'N/A',
    available: variant.availableForSale,
    label: variant.availableForSale ? 'In Stock' : 'Out of Stock'
  };
};

/**
 * Finds a variant by carat weight
 */
export const findVariantByCarat = (product: ProcessedProduct, carat: string): ProductVariant | null => {
  return product.variants.find(v => v.selectedOptions?.['Carat'] === carat) || null;
};
