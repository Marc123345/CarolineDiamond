import type { ProcessedProduct, ProductVariant } from '../types/shopify';

export interface NormalizedProduct extends ProcessedProduct {
  primaryImage: string;
  hasVariants: boolean;
  minPrice: number;
  maxPrice: number;
}

export interface NormalizedVariant extends ProductVariant {
  priceNumber: number;
  compareAtPriceNumber?: number;
  hasDiscount: boolean;
  isAvailable: boolean;
}

const PLACEHOLDER_IMAGE = '/images/product-placeholder.jpg';

/**
 * Normalizes product type to plural form for consistency
 */
function normalizeProductType(productType: string): string {
  const normalized = productType.trim();

  // Map singular forms to plural
  if (normalized === 'Engagement Ring') return 'Engagement Rings';
  if (normalized === 'Necklace') return 'Necklaces';
  if (normalized === 'Earring') return 'Earrings';

  // Already plural or other types
  return normalized;
}

export function normalizeProduct(product: ProcessedProduct | null): NormalizedProduct | null {
  if (!product) return null;

  const primaryImage = product.images?.[0] || product.image || PLACEHOLDER_IMAGE;
  const hasVariants = (product.variants?.length || 0) > 0;

  const prices = product.variants?.map(v => v.price) || [product.price];
  const minPrice = Math.min(...prices.filter(p => p > 0));
  const maxPrice = Math.max(...prices.filter(p => p > 0));

  return {
    ...product,
    productType: normalizeProductType(product.productType),
    primaryImage,
    hasVariants,
    minPrice: minPrice === Infinity ? 0 : minPrice,
    maxPrice: maxPrice === -Infinity ? 0 : maxPrice,
    images: product.images?.length > 0 ? product.images : [primaryImage],
  };
}

export function normalizeVariant(variant: ProductVariant | null): NormalizedVariant | null {
  if (!variant) return null;

  const priceNumber = typeof variant.price === 'number' ? variant.price : parseFloat(String(variant.price));
  const compareAtPriceNumber = variant.compareAtPrice
    ? typeof variant.compareAtPrice === 'number'
      ? variant.compareAtPrice
      : parseFloat(String(variant.compareAtPrice))
    : undefined;

  return {
    ...variant,
    priceNumber,
    compareAtPriceNumber,
    hasDiscount: !!compareAtPriceNumber && compareAtPriceNumber > priceNumber,
    isAvailable: variant.availableForSale && (variant.quantityAvailable === undefined || variant.quantityAvailable > 0),
  };
}

export function getVariantImage(variant: ProductVariant | null, fallback: string): string {
  if (!variant) return fallback;

  if (variant.image) return variant.image;
  if (variant.images?.[0]) return variant.images[0];

  return fallback;
}

export function formatPrice(price: number | undefined | null, currencySymbol: string = '€'): string {
  if (!price || price === 0) return 'Price on request';

  return `${currencySymbol}${price.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
}

export function isPriceOnRequest(price: number | undefined | null): boolean {
  return !price || price === 0;
}

export function validateCartItem(
  product: ProcessedProduct | null,
  variant: ProductVariant | null,
  quantity: number
): { valid: boolean; error?: string } {
  if (!product) {
    return { valid: false, error: 'Product not found' };
  }

  if (product.variants.length > 0 && !variant) {
    return { valid: false, error: 'Please select all options' };
  }

  if (variant && !variant.availableForSale) {
    return { valid: false, error: 'This variant is out of stock' };
  }

  if (variant?.quantityAvailable !== undefined && quantity > variant.quantityAvailable) {
    return { valid: false, error: `Only ${variant.quantityAvailable} available` };
  }

  if (quantity < 1) {
    return { valid: false, error: 'Quantity must be at least 1' };
  }

  const price = variant?.price || product.price;
  if (isPriceOnRequest(price)) {
    return { valid: false, error: 'This item requires a price inquiry' };
  }

  return { valid: true };
}
