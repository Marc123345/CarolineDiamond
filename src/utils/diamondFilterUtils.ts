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
  if (!variant) {
    // Show base price range
    const prices = product.variants
      .filter(v => v.availableForSale)
      .map(v => v.price);

    if (prices.length === 0) return 'Contact for Price';

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return `€${minPrice.toLocaleString()}`;
    }
    return `€${minPrice.toLocaleString()} - €${maxPrice.toLocaleString()}`;
  }

  // Check if it's a Natural Diamond (contact for price)
  const diamondType = variant.selectedOptions?.['Diamond Type'];
  if (diamondType && (diamondType === 'Natural Diamond' || !diamondType.includes('Lab-Grown'))) {
    return 'Contact for Price';
  }

  // Show variant price
  return `€${variant.price.toLocaleString()}`;
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
