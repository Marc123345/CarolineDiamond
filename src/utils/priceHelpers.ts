// src/utils/priceHelpers.ts
import { ProductVariant } from '../types/shopify';

/**
 * Formats a numeric price into a localized European string.
 * Returns 'Price on Request' if the price is null or zero.
 */
export const formatPrice = (price: number | null, includeCurrency: boolean = true): string => {
  if (price === null || price === 0) return 'Price on Request';
  
  const formatted = price.toLocaleString('nl-NL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return includeCurrency ? `€${formatted}` : formatted;
};

/**
 * Returns the price display object based on the product category.
 * Implements Caroline's specific pricing instructions for unified products.
 */
export const getPriceDisplay = (variants: ProductVariant[], productHandle?: string): {
  displayPrice: string;
  hasMultiplePrices: boolean;
  minPrice: number;
  maxPrice: number;
  isOnSale: boolean;
  compareAtPrice?: number;
} => {
  // 1. Timeless Diamond Necklace Logic
  if (productHandle?.includes('necklace')) {
    return {
      displayPrice: '€750 - €1,190+',
      hasMultiplePrices: true,
      minPrice: 750,
      maxPrice: 1190,
      isOnSale: false
    };
  }

  // 2. Earring Studs Logic
  if (productHandle?.includes('earring')) {
    return {
      displayPrice: '€490 - €890+',
      hasMultiplePrices: true,
      minPrice: 490,
      maxPrice: 890,
      isOnSale: false
    };
  }

  // 3. Solitaire Engagement Rings Logic
  if (productHandle?.includes('solitaire-ring')) {
    return {
      displayPrice: '€790 - €1,250+',
      hasMultiplePrices: true,
      minPrice: 790,
      maxPrice: 1250,
      isOnSale: false
    };
  }

  // Fallback logic for standard Shopify products
  if (!variants || variants.length === 0) {
    return {
      displayPrice: '€0',
      hasMultiplePrices: false,
      minPrice: 0,
      maxPrice: 0,
      isOnSale: false
    };
  }

  const prices = variants.map(v => v.price).filter(p => p !== null && p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const hasMultiplePrices = minPrice !== maxPrice;

  const isOnSale = variants.some(v => v.compareAtPrice && v.compareAtPrice > (v.price || 0));
  const compareAtPrice = isOnSale
    ? variants.find(v => v.compareAtPrice && v.compareAtPrice > (v.price || 0))?.compareAtPrice
    : undefined;

  const displayPrice = hasMultiplePrices
    ? `From ${formatPrice(minPrice)}`
    : formatPrice(minPrice);

  return {
    displayPrice,
    hasMultiplePrices,
    minPrice,
    maxPrice,
    isOnSale,
    compareAtPrice
  };
};

/**
 * Formats a price with an explicit VAT inclusion note.
 */
export const formatPriceWithVAT = (price: number, vatRate: number = 0.21): string => {
  return `${formatPrice(price)} (incl. ${Math.round(vatRate * 100)}% VAT)`;
};

/**
 * Calculates VAT breakdown for internal logic.
 */
export const calculateVAT = (price: number, vatRate: number = 0.21): {
  priceWithVAT: number;
  vatAmount: number;
  priceWithoutVAT: number;
} => {
  const priceWithVAT = price;
  const priceWithoutVAT = price / (1 + vatRate);
  const vatAmount = price - priceWithoutVAT;

  return {
    priceWithVAT,
    vatAmount,
    priceWithoutVAT
  };
};