/**
 * Canonical Tag Mapping System
 *
 * Maps frontend filter values to backend Shopify tags/options.
 * All filtering MUST use these canonical mappings to ensure consistency.
 *
 * Rules:
 * - One frontend value maps to multiple possible backend values
 * - Normalization handles variations in casing, spacing, hyphens
 * - Variant options take precedence over product tags
 */

import type { ProcessedProduct } from '../types/shopify';

/**
 * Normalizes a string for comparison
 * - Lowercase
 * - Replace spaces and underscores with hyphens
 * - Trim whitespace
 */
export function normalizeForComparison(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .trim();
}

/**
 * CANONICAL METAL COLORS
 * Frontend: "yellow" | "rose" | "white"
 * Backend patterns: ["18K Yellow Gold", "Yellow Gold", "yellow-gold", "Yellow-Gold"]
 */
export const CANONICAL_METAL_COLORS = {
  yellow: ['18k yellow gold', 'yellow gold', 'yellow-gold', 'yellow'],
  rose: ['18k rose gold', 'rose gold', 'rose-gold', 'rose'],
  white: ['18k white gold', 'white gold', 'white-gold', 'white'],
} as const;

export type CanonicalMetalColor = keyof typeof CANONICAL_METAL_COLORS;

/**
 * Check if product has a specific metal color
 */
export function productHasCanonicalMetalColor(
  product: ProcessedProduct,
  canonicalColor: CanonicalMetalColor
): boolean {
  const patterns = CANONICAL_METAL_COLORS[canonicalColor];

  // Check variants first (most reliable)
  if (product.variants && product.variants.length > 0) {
    return product.variants.some(variant => {
      const metalOption = variant.selectedOptions?.['Metal Color'] ||
                          variant.selectedOptions?.['Color'] || '';
      const normalized = normalizeForComparison(metalOption);

      return patterns.some(pattern => normalized.includes(pattern.replace(/\s+/g, '-')));
    });
  }

  // Fallback to product tags
  if (product.tags) {
    return product.tags.some(tag => {
      const normalized = normalizeForComparison(tag);
      return patterns.some(pattern => normalized.includes(pattern.replace(/\s+/g, '-')));
    });
  }

  return false;
}

/**
 * CANONICAL RING STYLES
 * Frontend: Display labels
 * Backend patterns: Tag combinations
 */
export const CANONICAL_RING_STYLES = {
  'solitaire-no-side': {
    display: 'Solitaire (Without Side Diamonds)',
    requiredTags: ['solitaire'],
    excludedTags: ['halo'],
    sideDiamondVariants: {
      yes: ['side-diamonds', 'with-side-diamonds', '+ side diamonds', 'solitaire + side diamonds'],
      no: ['no-side-diamonds', 'no side diamonds', 'without side diamonds'],
    },
    expectSideDiamonds: false,
  },
  'solitaire-with-side': {
    display: 'Solitaire (With Side Diamonds)',
    requiredTags: ['solitaire'],
    excludedTags: ['halo'],
    sideDiamondVariants: {
      yes: ['side-diamonds', 'with-side-diamonds', '+ side diamonds', 'solitaire + side diamonds'],
      no: ['no-side-diamonds', 'no side diamonds', 'without side diamonds'],
    },
    expectSideDiamonds: true,
  },
  'halo-no-side': {
    display: 'Halo (Without Side Diamonds)',
    requiredTags: ['halo'],
    excludedTags: [],
    sideDiamondVariants: {
      yes: ['side-diamonds', 'with-side-diamonds', '+ side diamonds', 'halo + side diamonds'],
      no: ['no-side-diamonds', 'no side diamonds', 'without side diamonds'],
    },
    expectSideDiamonds: false,
  },
  'halo-with-side': {
    display: 'Halo (With Side Diamonds)',
    requiredTags: ['halo'],
    excludedTags: [],
    sideDiamondVariants: {
      yes: ['side-diamonds', 'with-side-diamonds', '+ side diamonds', 'halo + side diamonds'],
      no: ['no-side-diamonds', 'no side diamonds', 'without side diamonds'],
    },
    expectSideDiamonds: true,
  },
} as const;

/**
 * Check if product matches a ring style
 */
export function productMatchesCanonicalRingStyle(
  product: ProcessedProduct,
  displayStyle: string
): boolean {
  // CRITICAL: Block corrupted products from matching any style
  if (!product || !product.tags || !Array.isArray(product.tags) || !product.name) {
    // --- FIX START: Use process.env.NODE_ENV instead of import.meta.env.DEV ---
    if (process.env.NODE_ENV !== 'production') {
      console.warn('🚫 productMatchesCanonicalRingStyle: Corrupted product blocked:', product);
    }
    // --- FIX END ---
    return false;
  }

  const tags = product.tags.map(t => normalizeForComparison(t));
  const title = normalizeForComparison(product.name);

  // Find matching canonical style
  const styleEntry = Object.values(CANONICAL_RING_STYLES).find(
    s => s.display === displayStyle
  );

  if (!styleEntry) return false;

  // Check required tags
  const hasRequiredTags = styleEntry.requiredTags.every(required => {
    const normalized = normalizeForComparison(required);
    return tags.some(tag => tag.includes(normalized)) || title.includes(normalized);
  });

  if (!hasRequiredTags) return false;

  // Check excluded tags
  const hasExcludedTags = styleEntry.excludedTags.some(excluded => {
    const normalized = normalizeForComparison(excluded);
    return tags.some(tag => tag.includes(normalized)) || title.includes(normalized);
  });

  if (hasExcludedTags) return false;

  // Check side diamond expectation using EXACT tag matching to avoid substring conflicts
  // (e.g., 'side-diamonds' should NOT match 'no-side-diamonds')
  const hasSideDiamondYesTags = styleEntry.sideDiamondVariants.yes.some(pattern => {
    const normalized = normalizeForComparison(pattern);
    const exactTagMatch = tags.includes(normalized);
    const titleMatch = title.includes(normalized);
    return exactTagMatch || titleMatch;
  });

  const hasSideDiamondNoTags = styleEntry.sideDiamondVariants.no.some(pattern => {
    const normalized = normalizeForComparison(pattern);
    const exactTagMatch = tags.includes(normalized);
    const titleMatch = title.includes(normalized);
    return exactTagMatch || titleMatch;
  });

  if (styleEntry.expectSideDiamonds) {
    // For "With Side Diamonds" - must have explicit yes tags
    return hasSideDiamondYesTags;
  } else {
    // For "Without Side Diamonds" - must have explicit no tags
    return hasSideDiamondNoTags;
  }
}

/**
 * CANONICAL DIAMOND SHAPES
 * Frontend: "Round" | "Oval" | etc.
 * Backend patterns: ["round-diamond", "Round Diamond", "round"]
 */
export const CANONICAL_SHAPES = [
  'round',
  'oval',
  'princess',
  'cushion',
  'emerald',
  'pear',
  'marquise',
  'heart',
] as const;

export type CanonicalShape = typeof CANONICAL_SHAPES[number];

/**
 * Check if product has a specific shape
 */
export function productHasCanonicalShape(
  product: ProcessedProduct,
  shapeName: string
): boolean {
  const normalized = normalizeForComparison(shapeName);
  const tags = product.tags?.map(t => normalizeForComparison(t)) || [];
  const title = normalizeForComparison(product.name || '');

  // Check tags for patterns like "round-diamond", "round diamond"
  const hasShapeTag = tags.some(tag =>
    tag === normalized ||
    tag === `${normalized}-diamond` ||
    tag.includes(`${normalized}-diamond`) ||
    tag.includes(`${normalized} diamond`)
  );

  if (hasShapeTag) return true;

  // Check title
  return title.includes(`${normalized} diamond`) || title.includes(`${normalized}-diamond`);
}

/**
 * CANONICAL DIAMOND TYPES
 * Frontend: "Lab-Grown" | "Natural"
 * Backend tags: "lab-grown" | "natural-diamond" | tags in Diamond Type option
 */
export const CANONICAL_DIAMOND_TYPES = {
  'lab-grown': ['lab-grown', 'lab grown', 'labgrown', 'synthetic'],
  natural: ['natural diamond', 'natural', 'natural-diamond'],
} as const;

export type CanonicalDiamondType = keyof typeof CANONICAL_DIAMOND_TYPES;

/**
 * Check if product has a specific diamond type
 */
export function productHasCanonicalDiamondType(
  product: ProcessedProduct,
  type: CanonicalDiamondType
): boolean {
  const patterns = CANONICAL_DIAMOND_TYPES[type];

  // Check variants first (Diamond Type option)
  if (product.variants && product.variants.length > 0) {
    const hasInVariants = product.variants.some(variant => {
      const diamondTypeOption = variant.selectedOptions?.['Diamond Type'] || '';
      const normalized = normalizeForComparison(diamondTypeOption);

      return patterns.some(pattern =>
        normalized.includes(pattern.replace(/\s+/g, '-'))
      );
    });

    if (hasInVariants) return true;
  }

  // Check product tags
  if (product.tags) {
    return product.tags.some(tag => {
      const normalized = normalizeForComparison(tag);
      return patterns.some(pattern =>
        normalized.includes(pattern.replace(/\s+/g, '-'))
      );
    });
  }

  return false;
}

/**
 * CANONICAL CARAT WEIGHTS
 * Frontend: 0.30 | 0.50 | 1.00 | 1.50
 * Backend: "0.50ct", "Lab-Grown 0.50ct", "1.00ct", etc.
 */
export const CANONICAL_CARATS = [0.30, 0.50, 1.00, 1.50] as const;

export type CanonicalCarat = typeof CANONICAL_CARATS[number];

/**
 * Extract carat weight from Diamond Type option or tag
 */
export function extractCaratFromString(value: string): number | null {
  const match = value.match(/(0\.30|0\.50|1\.00|1\.50|2\.00)ct?/i);
  return match ? parseFloat(match[1]) : null;
}

/**
 * Check if product has a specific carat weight
 */
export function productHasCanonicalCarat(
  product: ProcessedProduct,
  carat: number
): boolean {
  const caratStr = carat.toFixed(2); // "0.50"

  // Check variants first (Diamond Type option)
  if (product.variants && product.variants.length > 0) {
    const hasInVariants = product.variants.some(variant => {
      const diamondTypeOption = variant.selectedOptions?.['Diamond Type'] || '';
      const extractedCarat = extractCaratFromString(diamondTypeOption);
      return extractedCarat === carat;
    });

    if (hasInVariants) return true;
  }

  // Check product tags
  if (product.tags) {
    return product.tags.some(tag => {
      const extractedCarat = extractCaratFromString(tag);
      return extractedCarat === carat;
    });
  }

  return false;
}

/**
 * JEWELRY TYPE (Product Type)
 * Frontend: "Engagement Ring" | "Necklace" | "Earrings"
 * Backend: productType field
 */
export const CANONICAL_JEWELRY_TYPES = {
  'engagement-ring': ['Engagement Ring', 'Ring', 'engagement-ring'],
  necklace: ['Necklace', 'necklace'],
  earrings: ['Earrings', 'Earring', 'earrings', 'earring'],
} as const;

/**
 * Check if product matches jewelry type
 */
export function productMatchesCanonicalJewelryType(
  product: ProcessedProduct,
  displayType: string
): boolean {
  const typeNormalized = normalizeForComparison(product.productType || product.category || '');
  const categoryNormalized = normalizeForComparison(product.category || '');
  const nameNormalized = normalizeForComparison(product.name || '');

  const typeKey = normalizeForComparison(displayType);

  // Special handling for Engagement Rings
  if (displayType === 'Engagement Rings' || typeKey === 'engagement-rings') {
    return typeNormalized.includes('engagement') ||
           categoryNormalized.includes('engagement') ||
           nameNormalized.includes('engagement') ||
           product.tags?.some(tag => normalizeForComparison(tag).includes('engagement'));
  }

  // Special handling for Rings category
  if (displayType === 'Rings' || typeKey === 'rings') {
    return typeNormalized.includes('ring') ||
           categoryNormalized.includes('ring') ||
           nameNormalized.includes('ring') ||
           product.tags?.some(tag => normalizeForComparison(tag).includes('ring'));
  }

  if (displayType === 'Necklaces' || typeKey === 'necklaces') {
    return typeNormalized.includes('necklace') ||
           categoryNormalized.includes('necklace') ||
           nameNormalized.includes('necklace');
  }

  if (displayType === 'Earrings' || typeKey === 'earrings') {
    return typeNormalized.includes('earring') ||
           categoryNormalized.includes('earring') ||
           nameNormalized.includes('earring');
  }

  return typeNormalized.includes(typeKey) || categoryNormalized.includes(typeKey);
}

/**
 * Extract all available options from products using canonical mappings
 */
export function extractCanonicalOptions(products: ProcessedProduct[]) {
  const metalColors = new Set<CanonicalMetalColor>();
  const shapes = new Set<string>();
  const carats = new Set<number>();
  const diamondTypes = new Set<CanonicalDiamondType>();

  products.forEach(product => {
    // Metal colors
    (['yellow', 'rose', 'white'] as CanonicalMetalColor[]).forEach(color => {
      if (productHasCanonicalMetalColor(product, color)) {
        metalColors.add(color);
      }
    });

    // Shapes
    CANONICAL_SHAPES.forEach(shape => {
      const displayShape = shape.charAt(0).toUpperCase() + shape.slice(1);
      if (productHasCanonicalShape(product, displayShape)) {
        shapes.add(displayShape);
      }
    });

    // Carats
    CANONICAL_CARATS.forEach(carat => {
      if (productHasCanonicalCarat(product, carat)) {
        carats.add(carat);
      }
    });

    // Diamond types
    (['lab-grown', 'natural'] as CanonicalDiamondType[]).forEach(type => {
      if (productHasCanonicalDiamondType(product, type)) {
        diamondTypes.add(type);
      }
    });
  });

  return {
    metalColors: Array.from(metalColors),
    shapes: Array.from(shapes).sort(),
    carats: Array.from(carats).sort(),
    diamondTypes: Array.from(diamondTypes),
  };
}