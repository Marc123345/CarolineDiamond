// src/utils/priceHelpers.ts
import { ProductVariant } from '../types/shopify';

export const formatPrice = (price: number | null): string => {
  if (price === null || price === 0) return 'Price on Request';
  return `€${price.toLocaleString('nl-NL')}`;
};

export const getPriceDisplay = (productHandle: string) => {
  // Direct matching based on Caroline's pricing instructions
  if (productHandle.includes('necklace')) {
    return { displayPrice: '€750 - €1,190+', minPrice: 750, maxPrice: 1190 };
  }
  if (productHandle.includes('earring')) {
    return { displayPrice: '€490 - €890+', minPrice: 490, maxPrice: 890 };
  }
  if (productHandle.includes('solitaire-ring')) {
    return { displayPrice: '€790 - €1,250+', minPrice: 790, maxPrice: 1250 };
  }

  return { displayPrice: 'Price on Request', minPrice: 0, maxPrice: 0 };
};

export const formatPriceWithVAT = (price: number): string => {
  const formatted = price.toLocaleString('nl-NL');
  return `€${formatted} (incl. 21% VAT)`;
};