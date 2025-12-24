// src/utils/priceHelpers.ts
import { ProductVariant } from '../types/shopify'; //

/**
 * Formats a numeric price into a localized string.
 * Returns 'Price on Request' if the price is null or zero.
 */
export const formatPrice = (price: number | null, includeCurrency: boolean = true): string => {
  if (price === null || price === 0) return 'Price on Request'; //
  
  const formatted = price.toLocaleString('nl-NL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return includeCurrency ? `€${formatted}` : formatted; //
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
  // 1. Handle Timeless Diamond Necklace
  if (productHandle?.includes('necklace') || productHandle === 'timeless-diamond-necklace') {
    return {
      displayPrice: '€750 - €1,190+',
      hasMultiplePrices: true,
      minPrice: 750,
      maxPrice: 1190,
      isOnSale: false
    };
  }

  // 2. Handle Earring Studs
  if (productHandle?.includes('earring') || productHandle === 'timeless-diamond-earrings') {
    return {
      displayPrice: '€490 - €890+',
      hasMultiplePrices: true,
      minPrice: 490,
      maxPrice: 890,
      isOnSale: false
    };
  }

  // 3. Handle Solitaire Engagement Rings
  if (productHandle?.includes('solitaire-ring')) {
    return {
      displayPrice: '€790 - €1,250+',
      hasMultiplePrices: true,
      minPrice: 790,
      maxPrice: 1250,
      isOnSale: false
    };
  }

  // Fallback logic for standard products
  if (!variants || variants.length === 0) {
    return {
      displayPrice: '€0',
      hasMultiplePrices: false,
      minPrice: 0,
      maxPrice: 0,
      isOnSale: false
    };
  }

  const prices = variants.map(v => v.price).filter(p => p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const hasMultiplePrices = minPrice !== maxPrice;

  const isOnSale = variants.some(v => v.compareAtPrice && v.compareAtPrice > v.price);
  const compareAtPrice = isOnSale
    ? variants.find(v => v.compareAtPrice && v.compareAtPrice > v.price)?.compareAtPrice
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
 * Calculates VAT breakdown for a given price.
 * Defaults to 21% (standard rate for Belgium/Netherlands).
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

/**
 * Formats a price with an explicit VAT inclusion note.
 */
export const formatPriceWithVAT = (price: number, vatRate: number = 0.21): string => {
  return `${formatPrice(price)} (incl. ${Math.round(vatRate * 100)}% VAT)`;
};