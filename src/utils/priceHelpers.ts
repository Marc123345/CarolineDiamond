import { ProductVariant, ProcessedProduct } from '../types/shopify';
import { calculateProductPrice, formatPriceDisplay, extractDiamondTypeFromProduct } from './productPricing';

export const formatPrice = (price: number, includeCurrency: boolean = true): string => {
  const formatted = price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return includeCurrency ? `€${formatted}` : formatted;
};

export const getPriceDisplay = (variants: ProductVariant[], productHandle?: string): {
  displayPrice: string;
  hasMultiplePrices: boolean;
  minPrice: number;
  maxPrice: number;
  isOnSale: boolean;
  compareAtPrice?: number;
} => {
  if (!variants || variants.length === 0) {
    return {
      displayPrice: '€0.00',
      hasMultiplePrices: false,
      minPrice: 0,
      maxPrice: 0,
      isOnSale: false
    };
  }

  const prices = variants.map(v => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const hasMultiplePrices = minPrice !== maxPrice;

  const isOnSale = variants.some(v => v.compareAtPrice && v.compareAtPrice > v.price);

  const compareAtPrice = isOnSale
    ? variants.find(v => v.compareAtPrice && v.compareAtPrice > v.price)?.compareAtPrice
    : undefined;

  // Special handling for main Timeless Necklace product
  // This product represents multiple variants (0.50ct and 1.00ct) across different products
  if (productHandle === 'timeless-diamond-necklace') {
    return {
      displayPrice: '€750 - €1,190+',
      hasMultiplePrices: true,
      minPrice: 750,
      maxPrice: 1190,
      isOnSale: false
    };
  }

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

export const formatPriceWithVAT = (price: number, vatRate: number = 0.21): string => {
  return `${formatPrice(price)} (incl. ${Math.round(vatRate * 100)}% VAT)`;
};

/**
 * Get smart price display that considers side diamonds premium and product type
 * Falls back to regular variant-based pricing if smart pricing doesn't apply
 */
export const getSmartPriceDisplay = (product: ProcessedProduct, selectedVariant?: ProductVariant): {
  displayPrice: string;
  calculatedPrice: number | null;
  isEstimated: boolean;
} => {
  // Try to calculate price using the specification logic
  const diamondType = selectedVariant?.selectedOptions?.['Diamond Type'] ||
                      selectedVariant?.selectedOptions?.['Carat Weight'] ||
                      extractDiamondTypeFromProduct(product);

  const calculatedPrice = calculateProductPrice(product, diamondType || undefined);

  if (calculatedPrice !== null) {
    return {
      displayPrice: formatPriceDisplay(calculatedPrice),
      calculatedPrice,
      isEstimated: false
    };
  }

  // Fall back to variant price or general price display
  if (selectedVariant) {
    return {
      displayPrice: formatPrice(selectedVariant.price),
      calculatedPrice: selectedVariant.price,
      isEstimated: false
    };
  }

  const regularDisplay = getPriceDisplay(product.variants || [], product.handle);
  return {
    displayPrice: regularDisplay.displayPrice,
    calculatedPrice: regularDisplay.minPrice,
    isEstimated: regularDisplay.hasMultiplePrices
  };
};
