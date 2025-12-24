/**
 * Unified Filter Configuration
 * Provides constants and logic for the Shop filtering system.
 */

// 1. Core Categories
export const JEWELRY_CATEGORIES = ['Necklaces', 'Earrings', 'Rings'] as const;
export type JewelryCategory = typeof JEWELRY_CATEGORIES[number];

// 2. Ring-Specific Styles
export const RING_STYLES = ['Solitaire', 'Halo', 'Three Stone', 'Pavé'] as const;
export type RingStyle = typeof RING_STYLES[number];

// 3. Diamond Shapes
export const ALL_SHAPES = ['Round', 'Oval', 'Princess', 'Pear', 'Emerald', 'Cushion'] as const;
export type Shape = typeof ALL_SHAPES[number];

// 4. Metal & Stone Options
export const METAL_COLORS = ['White Gold', 'Yellow Gold', 'Rose Gold'] as const;
export const METAL_COLOR_LABELS: Record<string, string> = {
  'White Gold': '18K White Gold',
  'Yellow Gold': '18K Yellow Gold',
  'Rose Gold': '18K Rose Gold'
};

export const STONE_TYPES = ['Diamond', 'Gemstone'] as const;
export const DIAMOND_ORIGINS = ['Lab-Grown', 'Natural'] as const;
export const GEMSTONE_VARIANTS = ['Sapphire (Blue)', 'Ruby (Red)', 'Emerald (Green)'] as const;

// 5. Carat Weight Options
export const CARAT_WEIGHTS = [
  { label: '0.30', display: '0.30 ct' },
  { label: '0.50', display: '0.50 ct' },
  { label: '1.00', display: '1.00 ct' },
  { label: '1.50', display: '1.50 ct' }
];

// 6. Diamond Clarity Grades
export const CLARITY_GRADES = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'] as const;
export const COMMON_CLARITY_GRADES = ['VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'] as const;
export type ClarityGrade = typeof CLARITY_GRADES[number];

// 7. Diamond Certifications
export const CERTIFICATIONS = ['GIA', 'IGI', 'HRD', 'AGS'] as const;
export type Certification = typeof CERTIFICATIONS[number];

// 8. Earring Options
export const EARRING_TYPES = ['Stud', 'Hoop', 'Drop', 'Dangle'] as const;
export type EarringType = typeof EARRING_TYPES[number];

export const EARRING_BACKINGS = ['Push Back', 'Screw Back', 'Lever Back', 'French Wire'] as const;
export type EarringBacking = typeof EARRING_BACKINGS[number];

// 9. Necklace Options
export const CHAIN_LENGTHS = ['16"', '18"', '20"', '22"', '24"'] as const;
export type ChainLength = typeof CHAIN_LENGTHS[number];

// 10. Price Ranges
export const PRICE_RANGES = [
  { label: 'Under €1,000', min: 0, max: 1000 },
  { label: '€1,000 - €2,500', min: 1000, max: 2500 },
  { label: '€2,500 - €5,000', min: 2500, max: 5000 },
  { label: '€5,000 - €10,000', min: 5000, max: 10000 },
  { label: '€10,000+', min: 10000, max: Infinity }
] as const;

// 11. Global Filter Interface
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

/**
 * Logical Helpers for Cascading Filters
 */
export const getAvailableShapes = (style?: RingStyle): Shape[] => {
  // If no style is selected, show all shapes
  if (!style) return [...ALL_SHAPES];
  
  // Custom logic: Halo settings usually feature Round or Oval
  if (style === 'Halo') return ['Round', 'Oval', 'Cushion'];
  
  return [...ALL_SHAPES];
};

export const shouldShowShapeFilter = (category?: JewelryCategory): boolean => {
  // Hide shape filters for Necklaces/Earrings to keep UI clean
  return !category || category === 'Rings';
};

/**
 * Shopify Query Builder
 */
export const buildShopifyQuery = (filters: ProductFilters): string => {
  const parts: string[] = [];
  if (filters.jewelryCategory) parts.push(`product_type:${filters.jewelryCategory}`);
  if (filters.searchText) parts.push(`title:${filters.searchText}*`);
  return parts.join(' AND ');
};