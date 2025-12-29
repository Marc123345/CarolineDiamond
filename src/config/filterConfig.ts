/**
 * src/config/filterConfig.ts
 * Enforces Canonical Schema for Diamonds By CS
 */

// 1. Jewelry Type (Product Type)
export const JEWELRY_CATEGORIES = [
  'Engagement Ring',
  'Necklace',
  'Earrings'
] as const;

// 2. Ring Style (Source: product.tags)
// Maps directly to canonical tags: solitaire, solitaire-side-diamonds, halo, halo-side-diamonds
export const RING_STYLES = [
  'Solitaire',
  'Solitaire + Side Diamonds',
  'Halo',
  'Halo + Side Diamonds'
] as const;

export const RING_STYLE_TO_TAG: Record<string, string> = {
  'Solitaire': 'solitaire',
  'Solitaire + Side Diamonds': 'solitaire-side-diamonds',
  'Halo': 'halo',
  'Halo + Side Diamonds': 'halo-side-diamonds'
};

// 3. Diamond Shape (Source: product.tags OR variant.option.Shape)
export const ALL_SHAPES = [
  'Round', 'Princess', 'Cushion', 'Emerald', 'Oval', 'Pear', 'Marquise', 'Heart'
] as const;

// Shape compatibility logic (Source: Requirements)
// Disable dynamically, do NOT hide silently
export const SHAPES_BY_STYLE: Record<string, string[]> = {
  'Solitaire': ['Round', 'Princess', 'Emerald', 'Oval', 'Pear', 'Marquise'],
  'Solitaire + Side Diamonds': ['Round', 'Princess', 'Emerald', 'Oval', 'Pear', 'Marquise'],
  'Halo': ['Round', 'Princess', 'Cushion', 'Emerald', 'Oval', 'Pear', 'Marquise', 'Heart'],
  'Halo + Side Diamonds': ['Round', 'Princess', 'Cushion', 'Emerald', 'Oval', 'Pear', 'Marquise', 'Heart']
};

// 4. Metal Color (Canonical Values: yellow, rose, white)
export const CANONICAL_METALS = {
  WHITE: 'white',
  YELLOW: 'yellow',
  ROSE: 'rose'
} as const;

export const METAL_COLORS = [
  'White Gold',
  'Yellow Gold',
  'Rose Gold'
] as const;

// Mapping display labels to canonical backend values
export const METAL_DISPLAY_TO_CANONICAL: Record<string, string> = {
  'White Gold': CANONICAL_METALS.WHITE,
  'Yellow Gold': CANONICAL_METALS.YELLOW,
  'Rose Gold': CANONICAL_METALS.ROSE
};

// 5. Diamond Type (Critical Logic Switch)
export const DIAMOND_TYPES = ['Lab-Grown', 'Natural'] as const;

export const DIAMOND_TYPE_TO_TAG: Record<string, string> = {
  'Lab-Grown': 'lab-grown',
  'Natural': 'natural-diamond'
};

// 6. Carat Weights (Variant dependent)
export const CARAT_WEIGHTS = [
  { label: '0.30ct', value: 0.30 }, // earrings only
  { label: '0.50ct', value: 0.50 },
  { label: '1.00ct', value: 1.00 },
  { label: '1.50ct', value: 1.50 }
] as const;

// 7. Ring Sizes (Engagement Rings Only)
export const RING_SIZES = ['48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '60'];

export type RingStyle = typeof RING_STYLES[number];
export type Shape = typeof ALL_SHAPES[number];
export type MetalColor = typeof METAL_COLORS[number];
export type DiamondType = typeof DIAMOND_TYPES[number];

export interface ProductFilters {
  productType?: string;
  ringStyle?: string;
  shapes?: string[];
  metalColors?: string[];
  diamondType?: string;
  carat?: string;
  ringSize?: string;
  vendor?: string;
}