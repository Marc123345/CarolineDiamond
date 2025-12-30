/**
 * Enforces Canonical Schema for Diamonds
 * Defines all filter options and types for the application.
 */

// 1. Jewelry Type (Product Type)
export const JEWELRY_CATEGORIES = [
  'Engagement Rings',
  'Necklaces',
  'Earrings'
] as const;

// 2. Ring Style (Source: product.tags)
// Maps directly to canonical tags: solitaire (without side), solitaire-side-diamonds (with side), halo (without side), halo-side-diamonds (with side)
export const RING_STYLES = [
  'Solitaire (Without Side Diamonds)',
  'Solitaire (With Side Diamonds)',
  'Halo (Without Side Diamonds)',
  'Halo (With Side Diamonds)'
] as const;

export const RING_STYLE_TO_TAG: Record<string, string> = {
  'Solitaire (Without Side Diamonds)': 'solitaire',
  'Solitaire (With Side Diamonds)': 'solitaire-side-diamonds',
  'Halo (Without Side Diamonds)': 'halo',
  'Halo (With Side Diamonds)': 'halo-side-diamonds'
};

// 3. Diamond Shape (Source: product.tags OR variant.option.Shape)
export const ALL_SHAPES = [
  'Round', 'Princess', 'Cushion', 'Emerald', 'Oval', 'Pear', 'Marquise', 'Heart'
] as const;

// Shape compatibility logic
export const SHAPES_BY_STYLE: Record<string, string[]> = {
  'Solitaire (Without Side Diamonds)': ['Round', 'Princess', 'Emerald', 'Oval', 'Pear', 'Marquise'],
  'Solitaire (With Side Diamonds)': ['Round', 'Princess', 'Emerald', 'Oval', 'Pear', 'Marquise'],
  'Halo (Without Side Diamonds)': ['Round', 'Princess', 'Cushion', 'Emerald', 'Oval', 'Pear', 'Marquise', 'Heart'],
  'Halo (With Side Diamonds)': ['Round', 'Princess', 'Cushion', 'Emerald', 'Oval', 'Pear', 'Marquise', 'Heart']
};

// 4. Metal Color (Display: 18K Yellow Gold, 18K Rose Gold, 18K White Gold)
export const CANONICAL_METALS = {
  WHITE: 'white',
  YELLOW: 'yellow',
  ROSE: 'rose'
} as const;

export const METAL_COLORS = [
  '18K White Gold',
  '18K Yellow Gold',
  '18K Rose Gold'
] as const;

// Mapping display labels to canonical backend values
export const METAL_DISPLAY_TO_CANONICAL: Record<string, string> = {
  '18K White Gold': CANONICAL_METALS.WHITE,
  '18K Yellow Gold': CANONICAL_METALS.YELLOW,
  '18K Rose Gold': CANONICAL_METALS.ROSE
};

// 5. Diamond Type + Carat Combined Filter
export const DIAMOND_TYPE_OPTIONS = [
  { label: 'Lab-Grown 0.50ct', type: 'lab-grown', carat: 0.50 },
  { label: 'Lab-Grown 1.00ct', type: 'lab-grown', carat: 1.00 },
  { label: 'Lab-Grown 1.50ct', type: 'lab-grown', carat: 1.50 },
  { label: 'Natural Diamond', type: 'natural', carat: null }
] as const;

// Legacy support for separate type/carat filtering
export const DIAMOND_TYPES = ['Lab-Grown', 'Natural'] as const;

export const DIAMOND_TYPE_TO_TAG: Record<string, string> = {
  'Lab-Grown': 'lab-grown',
  'Natural': 'natural-diamond'
};

// Legacy: Carat Weights
export const CARAT_WEIGHTS = [
  { label: '0.30ct', value: 0.30 },
  { label: '0.50ct', value: 0.50 },
  { label: '1.00ct', value: 1.00 },
  { label: '1.50ct', value: 1.50 }
] as const;

// Legacy: Diamond Origins
export const DIAMOND_ORIGINS = ['Lab-Grown', 'Natural'] as const;

// Legacy: Gemstone Variants
export const GEMSTONE_VARIANTS = ['Diamond', 'Sapphire', 'Ruby', 'Emerald'] as const;

// Legacy: Clarity Grades
export const CLARITY_GRADES = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'] as const;

// Legacy: Certifications
export const CERTIFICATIONS = ['GIA', 'HRD', 'IGI'] as const;

// 6. Ring Sizes (Engagement Rings Only)
export const RING_SIZES = ['48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '60'];

export type RingStyle = typeof RING_STYLES[number];
export type Shape = typeof ALL_SHAPES[number];
export type MetalColor = typeof METAL_COLORS[number];
export type DiamondType = typeof DIAMOND_TYPES[number];
export type DiamondTypeOption = typeof DIAMOND_TYPE_OPTIONS[number];

export interface ProductFilters {
  productType?: string;
  ringStyle?: string;
  shapes?: string[];
  metalColors?: string[];
  diamondTypeOption?: string;
  ringSize?: string;
  searchText?: string;

  // Legacy support
  diamondType?: string;
  carat?: number;
  caratWeights?: any[];
  specificCarats?: number[];
  jewelryCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  sideDiamonds?: boolean;
  vendor?: string;
  stoneType?: string;
  diamondOrigin?: string;
  gemstoneVariant?: string;
  inStockOnly?: boolean;
}

// Get available shapes for a given ring style
export function getAvailableShapes(ringStyle?: string): typeof ALL_SHAPES {
  // In the future, this can return a filtered list based on SHAPES_BY_STYLE
  // For now, return all shapes to ensure visibility
  return ALL_SHAPES;
}

// Check if shape filter should be shown for a jewelry category
export function shouldShowShapeFilter(category?: string): boolean {
  if (!category) return false;
  const categoryLower = category.toLowerCase();
  return categoryLower === 'rings' || categoryLower.includes('ring');
}