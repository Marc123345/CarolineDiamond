import { ProcessedProduct } from '../types/shopify';

/**
 * Calculate product price based on type, carat weight, and side diamonds
 * Implements the pricing logic from the filtering specification
 */

export interface PricingParams {
  productType: string;
  tags: string[];
  diamondType?: string;
  caratWeight?: string;
}

const SIDE_DIAMONDS_PREMIUM = 360;

/**
 * Extract carat weight from diamond type string
 * Handles formats like "Lab-Grown 0.50ct", "0.50ct", "0.50c"
 */
export const extractCaratWeight = (diamondType: string): string | null => {
  if (!diamondType) return null;

  // Match patterns like "0.30ct", "0.50ct", "1.00ct", "1.50ct", "0.50c"
  const match = diamondType.match(/(\d+\.\d+)c(t)?/i);
  if (match) {
    return match[1];
  }

  return null;
};

/**
 * Check if product has side diamonds based on tags
 */
export const hasSideDiamonds = (tags: string[]): boolean => {
  return tags.some(tag =>
    tag.toLowerCase().includes('solitaire + side diamonds') ||
    tag.toLowerCase().includes('halo + side diamonds') ||
    tag.toLowerCase().includes('side diamonds') ||
    tag.toLowerCase().includes('pavé')
  );
};

/**
 * Check if product is a natural diamond
 */
export const isNaturalDiamond = (diamondType: string, tags: string[]): boolean => {
  if (!diamondType) return false;

  return diamondType.toLowerCase().includes('natural') ||
         tags.some(tag => tag.toLowerCase().includes('natural diamond'));
};

/**
 * Calculate necklace price based on diamond type
 */
export const calculateNecklacePrice = (params: PricingParams): number | null => {
  const { diamondType, tags } = params;

  if (!diamondType) return null;

  // Natural diamonds are price on request
  if (isNaturalDiamond(diamondType, tags)) {
    return null;
  }

  const carat = extractCaratWeight(diamondType);

  if (carat === '0.50') return 750;
  if (carat === '1.00') return 1190;

  return null;
};

/**
 * Calculate earring price based on diamond type
 */
export const calculateEarringPrice = (params: PricingParams): number | null => {
  const { diamondType, tags } = params;

  if (!diamondType) return null;

  // Natural diamonds
  if (isNaturalDiamond(diamondType, tags)) {
    return 3000;
  }

  const carat = extractCaratWeight(diamondType);

  if (carat === '0.30') return 490;
  if (carat === '0.50') return 590;
  if (carat === '1.00') return 890;

  return null;
};

/**
 * Calculate engagement ring price based on carat weight and side diamonds
 */
export const calculateRingPrice = (params: PricingParams): number | null => {
  const { diamondType, tags } = params;

  if (!diamondType) return null;

  // Natural diamonds are price on request
  if (isNaturalDiamond(diamondType, tags)) {
    return null;
  }

  const carat = extractCaratWeight(diamondType);
  let basePrice: number | null = null;

  // Base pricing (solitaire or halo, no side diamonds)
  if (carat === '0.50') basePrice = 790;
  else if (carat === '1.00') basePrice = 990;
  else if (carat === '1.50') basePrice = 1250;

  if (basePrice === null) return null;

  // Add premium for side diamonds
  if (hasSideDiamonds(tags)) {
    return basePrice + SIDE_DIAMONDS_PREMIUM;
  }

  return basePrice;
};

/**
 * Calculate product price based on product type and specifications
 */
export const calculateProductPrice = (product: ProcessedProduct, diamondType?: string): number | null => {
  const params: PricingParams = {
    productType: product.productType || '',
    tags: product.tags || [],
    diamondType: diamondType || extractDiamondTypeFromProduct(product)
  };

  const productType = params.productType.toLowerCase();

  if (productType.includes('necklace')) {
    return calculateNecklacePrice(params);
  }

  if (productType.includes('earring')) {
    return calculateEarringPrice(params);
  }

  if (productType.includes('engagement') || productType.includes('ring')) {
    return calculateRingPrice(params);
  }

  return null;
};

/**
 * Extract diamond type from product variants or title
 */
export const extractDiamondTypeFromProduct = (product: ProcessedProduct): string | null => {
  // Check variants for Diamond Type option
  if (product.variants && product.variants.length > 0) {
    const firstVariant = product.variants[0];
    if (firstVariant.selectedOptions) {
      const diamondType =
        firstVariant.selectedOptions['Diamond Type'] ||
        firstVariant.selectedOptions['Carat Weight'] ||
        firstVariant.selectedOptions['diamond type'];

      if (diamondType) return diamondType;
    }
  }

  // Check tags for carat weight
  const caratTag = product.tags?.find(tag => /\d+\.\d+c(t)?/i.test(tag));
  if (caratTag) return caratTag;

  // Check product name
  const nameMatch = product.name?.match(/(\d+\.\d+c(t)?)/i);
  if (nameMatch) return nameMatch[1];

  return null;
};

/**
 * Format price display based on calculated price
 */
export const formatPriceDisplay = (price: number | null): string => {
  if (price === null) {
    return 'Price on Request';
  }

  return `€${price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Get price with explanation for debugging
 */
export const getPriceBreakdown = (params: PricingParams): {
  basePrice: number | null;
  premium: number;
  total: number | null;
  explanation: string;
} => {
  const { productType, tags, diamondType } = params;
  const productTypeLower = productType.toLowerCase();

  let basePrice: number | null = null;
  let premium = 0;
  let explanation = '';

  if (productTypeLower.includes('engagement') || productTypeLower.includes('ring')) {
    if (isNaturalDiamond(diamondType || '', tags)) {
      explanation = 'Natural diamond - Price on Request';
      return { basePrice: null, premium: 0, total: null, explanation };
    }

    const carat = extractCaratWeight(diamondType || '');
    if (carat === '0.50') basePrice = 790;
    else if (carat === '1.00') basePrice = 990;
    else if (carat === '1.50') basePrice = 1250;

    if (basePrice && hasSideDiamonds(tags)) {
      premium = SIDE_DIAMONDS_PREMIUM;
      explanation = `Base ring: €${basePrice} + Side diamonds: €${premium}`;
    } else if (basePrice) {
      explanation = `Base ring: €${basePrice}`;
    }
  } else if (productTypeLower.includes('necklace')) {
    const result = calculateNecklacePrice(params);
    basePrice = result;
    explanation = result === null ? 'Natural diamond - Price on Request' : `Necklace: €${result}`;
  } else if (productTypeLower.includes('earring')) {
    const result = calculateEarringPrice(params);
    basePrice = result;
    explanation = `Earrings: €${result}`;
  }

  const total = basePrice !== null && premium > 0 ? basePrice + premium : basePrice;

  return { basePrice, premium, total, explanation };
};
