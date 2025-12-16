import { ProductVariant } from '../types/shopify';

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
