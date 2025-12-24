// 1. Core Category Definitions
export const JEWELRY_CATEGORIES = ['Necklaces', 'Earrings', 'Rings'] as const;
export type JewelryCategory = typeof JEWELRY_CATEGORIES[number];

// 2. Ring-Specific Styles
export const RING_STYLES = ['Solitaire', 'Halo', 'Three Stone', 'Pavé'] as const;
export type RingStyle = typeof RING_STYLES[number];

// 3. Diamond Shapes
export const ALL_SHAPES = ['Round', 'Oval', 'Princess', 'Pear', 'Emerald', 'Cushion'] as const;
export type Shape = typeof ALL_SHAPES[number];

// 4. Metal & Stone Constants
export const METAL_COLORS = ['White Gold', 'Yellow Gold', 'Rose Gold'] as const;
export const METAL_COLOR_LABELS: Record<string, string> = {
  'White Gold': '18K White Gold',
  'Yellow Gold': '18K Yellow Gold',
  'Rose Gold': '18K Rose Gold'
};

export const STONE_TYPES = ['Diamond', 'Gemstone'] as const;
export const DIAMOND_ORIGINS = ['Lab-Grown', 'Natural'] as const;
export const GEMSTONE_VARIANTS = ['Sapphire (Blue)', 'Ruby (Red)', 'Emerald (Green)'] as const;

// 5. Filter Type Definition
export interface ProductFilters {
  jewelryCategory?: JewelryCategory;
  ringStyle?: RingStyle;
  shapes?: Shape[];
  metalColors?: string[];
  stoneType?: string;
  diamondOrigin?: string;
  gemstoneVariant?: string;
  caratWeights?: { label: string; display: string }[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  searchText?: string;
}

// 6. Carat Weight Constants
export const CARAT_WEIGHTS = [
  { label: '0.30', display: '0.30 ct' },
  { label: '0.50', display: '0.50 ct' },
  { label: '1.00', display: '1.00 ct' },
  { label: '1.50', display: '1.50 ct' }
];

// 7. Helper Logic for Cascading Filters
export const getAvailableShapes = (style?: RingStyle): Shape[] => {
  if (!style) return [...ALL_SHAPES];
  // Example: Solitaire supports all, Halo might prefer Round/Oval
  return [...ALL_SHAPES];
};

export const shouldShowShapeFilter = (category?: JewelryCategory): boolean => {
  return !category || category === 'Rings';
};

/**
 * Builds a Shopify-compatible query string from filter state
 */
export const buildShopifyQuery = (filters: ProductFilters): string => {
  const parts: string[] = [];
  if (filters.jewelryCategory) parts.push(`product_type:${filters.jewelryCategory}`);
  if (filters.searchText) parts.push(`*${filters.searchText}*`);
  return parts.join(' AND ');
};