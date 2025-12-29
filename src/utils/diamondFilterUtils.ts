/**
 * src/utils/diamondFilterUtils.ts
 * Refactored for Diamonds By CS: Carat-Price Logic and Diamond Type Switching
 */
import { ProcessedProduct, ProductVariant } from '../types/shopify';
import { formatPrice } from './filterUtils';
import { DIAMOND_TYPE_TO_TAG } from '../config/filterConfig';

/**
 * Required Rule: Diamond Type MUST switch pricing logic (Lab vs Natural)
 * Natural diamonds show "Price on Request" regardless of backend price.
 */
export function getProductDisplayPrice(
  product: ProcessedProduct, 
  activeVariant: ProductVariant | null
): string {
  const isNatural = product.tags?.map(t => t.toLowerCase())
    .includes(DIAMOND_TYPE_TO_TAG['Natural']);
  
  const price = activeVariant 
    ? parseFloat(activeVariant.price) 
    : parseFloat(product.variants[0]?.price || '0');

  return formatPrice(price, isNatural);
}

/**
 * Required Rule: Carat change MUST select the correct variant and update price.
 * This function finds the specific variant matching the desired carat weight.
 */
export function findVariantByCarat(
  product: ProcessedProduct, 
  targetCarat: string
): ProductVariant | null {
  if (!targetCarat) return product.variants[0] || null;

  return product.variants.find(variant => {
    // Check Option 'Carat' (Primary)
    const caratOpt = variant.selectedOptions?.['Carat'];
    if (caratOpt === targetCarat) return true;

    // Fallback: Check for exact match in variant title (e.g., "1.00ct")
    return variant.title?.toLowerCase().includes(targetCarat.toLowerCase());
  }) || null;
}

/**
 * Extracts all available carats from a product's variants.
 * Required to build the selection dropdown dynamically.
 */
export function getAvailableCarats(product: ProcessedProduct): string[] {
  const carats = new Set<string>();
  
  product.variants.forEach(variant => {
    const caratVal = variant.selectedOptions?.['Carat'];
    if (caratVal) {
      carats.add(caratVal);
    } else {
      // Fallback extraction from title if option is missing
      const match = variant.title?.match(/(\d+\.?\d*ct)/i);
      if (match) carats.add(match[0].toLowerCase());
    }
  });

  return Array.from(carats).sort();
}

/**
 * Required Logic: Changing carat weight MUST update SKU and Availability.
 */
export function getVariantMetadata(variant: ProductVariant | null) {
  if (!variant) return { sku: 'N/A', available: false, label: 'Not Available' };

  return {
    sku: variant.sku || 'No SKU',
    available: variant.availableForSale,
    label: variant.availableForSale ? 'In Stock' : 'Not Available'
  };
}