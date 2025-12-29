/**
 * src/utils/metalColorUtils.ts
 * Refactored to use Canonical Schema: white, yellow, rose
 */
import { ProcessedProduct } from '../types/shopify';
import { CANONICAL_METALS, MetalColor } from '../config/filterConfig';
import { getMetalColorOption } from './variantOptionUtils';

// patterns mapped to canonical keys
export const METAL_PATTERNS: Record<string, RegExp[]> = {
  [CANONICAL_METALS.WHITE]: [
    /^white$/i,
    /^white-gold$/i,
    /18k?\s*white\s*gold/i,
    /wg\s*18k?/i,
    /wit\s*goud/i,
  ],
  [CANONICAL_METALS.YELLOW]: [
    /^yellow$/i,
    /^yellow-gold$/i,
    /18k?\s*yellow\s*gold/i,
    /yg\s*18k?/i,
    /geel\s*goud/i,
  ],
  [CANONICAL_METALS.ROSE]: [
    /^rose$/i,
    /^rose-gold$/i,
    /^pink$/i,
    /18k?\s*rose\s*gold/i,
    /rg\s*18k?/i,
    /roos\s*goud/i,
  ],
};

/**
 * Normalizes any metal string into a canonical value: white, yellow, or rose.
 * Mandatory Rule: Never rely on display text.
 */
export function normalizeMetal(value: string | undefined): string | null {
  if (!value) return null;
  const val = value.trim().toLowerCase();

  for (const [canonical, patterns] of Object.entries(METAL_PATTERNS)) {
    if (patterns.some(pattern => pattern.test(val))) {
      return canonical;
    }
  }
  return null;
}

/**
 * Extracts the canonical metal color from product data.
 * Checks metafields, name, and tags in order of priority.
 */
export function extractMetalColorFromProduct(product: ProcessedProduct): string | null {
  // 1. Check Metafields
  if (product.metafields?.jewelry_material || product.metafields?.metal) {
    const metaVal = product.metafields.jewelry_material || product.metafields.metal;
    const normalized = normalizeMetal(metaVal);
    if (normalized) return normalized;
  }

  // 2. Check Name/Title
  const nameNormalized = normalizeMetal(product.name);
  if (nameNormalized) return nameNormalized;

  // 3. Check Tags
  if (product.tags) {
    for (const tag of product.tags) {
      const normalized = normalizeMetal(tag);
      if (normalized) return normalized;
    }
  }

  return null;
}

/**
 * Determines if a product matches the selected metal color filters.
 * Requirements: Variant filters must intersect, not override.
 */
export function productMatchesMetalColor(
  product: ProcessedProduct,
  selectedCanonicalMetals: string[]
): boolean {
  if (selectedCanonicalMetals.length === 0) return true;

  // Check if any variant matches the selected metals
  return product.variants.some(variant => {
    const metalOption = getMetalColorOption(variant);
    const variantMetal = normalizeMetal(metalOption);
    return variantMetal && selectedCanonicalMetals.includes(variantMetal);
  });
}

/**
 * Returns display info for the UI based on canonical keys.
 * Note: Labels are now clearly separated from logic.
 */
export function getMetalDisplayInfo(canonical: string) {
  const info: Record<string, { name: string; hex: string }> = {
    [CANONICAL_METALS.WHITE]: { name: '18K White Gold', hex: '#D4D6D8' },
    [CANONICAL_METALS.YELLOW]: { name: '18K Yellow Gold', hex: '#E6BE8A' },
    [CANONICAL_METALS.ROSE]: { name: '18K Rose Gold', hex: '#E8C4B8' },
  };
  return info[canonical] || { name: 'Other', hex: '#CCCCCC' };
}