// ====================================
// FILTER ORDER FOR OPTIMAL UX
// ====================================
export const FILTER_DISPLAY_ORDER = [
  'ringStyle',
  'shape',
  'metalColor',
  'diamondType',
  'caratWeight',
  'priceRange',
  'sideDiamonds'
] as const;

// Ring Styles (Top-level filter)
export const RING_STYLES = [
  'Solitaire',
  'Solitaire + Side Diamonds',
  'Halo',
  'Halo + Side Diamonds'
] as const;

export const ALL_SHAPES = [
  'Round',
  'Oval',
  'Princess',
  'Pear',
  'Marquise',
  'Emerald',
  'Cushion',
  'Heart'
] as const;

// Metal Colors (18K only)
export const METAL_COLORS = [
  'Rose Gold',
  'Yellow Gold',
  'White Gold'
] as const;

export const JEWELRY_CATEGORIES = [
  'Rings',
  'Earrings',
  'Necklaces'
] as const;

export const STONE_TYPES = [
  'Diamond',
  'Gemstone'
] as const;

export const DIAMOND_TYPES = [
  { value: '0.50ct', display: '0.50ct Natural', carat: 0.50, origin: 'Natural' },
  { value: '1.00ct', display: '1.00ct Natural', carat: 1.00, origin: 'Natural' },
  { value: '1.50ct', display: '1.50ct Natural', carat: 1.50, origin: 'Natural' },
  { value: 'Natural Diamond', display: 'Natural Diamond (Any Size)', carat: undefined, origin: 'Natural' },
  { value: 'Lab-Grown 0.50ct', display: '0.50ct Lab-Grown', carat: 0.50, origin: 'Lab-Grown' },
  { value: 'Lab-Grown 1.00ct', display: '1.00ct Lab-Grown', carat: 1.00, origin: 'Lab-Grown' },
  { value: 'Lab-Grown 1.50ct', display: '1.50ct Lab-Grown', carat: 1.50, origin: 'Lab-Grown' },
] as const;

export const CARAT_WEIGHTS = [
  { label: '0.5 ct - 1 ct', min: 0.5, max: 0.99, display: '0.5-0.99 ct' },
  { label: '1 ct - 1.5 ct', min: 1.0, max: 1.49, display: '1.0-1.49 ct' },
  { label: '1.5 ct - 2 ct', min: 1.5, max: 1.99, display: '1.5-1.99 ct' },
  { label: '2 ct +', min: 2.0, max: undefined, display: '2.0+ ct' }
] as const;

// TAG MAPPINGS: Maps canonical UI values to CSV/Shopify Tags
const TAG_MAPPINGS: Record<string, string[]> = {
  'Rings': ['Ring', 'Rings', 'engagement-ring', 'Engagement Ring'],
  'Earrings': ['Earring', 'Earrings', 'earrings'],
  'Necklaces': ['Necklace', 'Necklaces', 'necklace'],
  
  'Solitaire': ['solitaire', 'Solitaire'],
  'Halo': ['halo', 'Halo'],
  'Solitaire + Side Diamonds': ['solitaire', 'with-side-diamonds'],
  'Halo + Side Diamonds': ['halo', 'with-side-diamonds'],
  
  'Round': ['round-diamond', 'Round', 'round', 'Brilliant'],
  'Oval': ['oval-diamond', 'Oval', 'oval'],
  'Pear': ['pear-diamond', 'Pear', 'pear', 'teardrop'],
  'Princess': ['princess-diamond', 'Princess', 'square'],
  'Marquise': ['marquise-diamond', 'Marquise'],
  'Emerald': ['emerald-diamond', 'Emerald'],
  'Cushion': ['cushion-diamond', 'Cushion'],
  'Heart': ['heart-diamond', 'Heart'],

  'White Gold': ['White Gold', 'white-gold', '18k-gold'],
  'Yellow Gold': ['Yellow Gold', 'yellow-gold', '18k-gold'],
  'Rose Gold': ['Rose Gold', 'rose-gold', '18k-gold'],
};

export function buildShopifyQuery(filters: ProductFilters): string {
  const parts: string[] = [];

  // Search Text
  if (filters.searchText?.trim()) {
    parts.push(`(title:*${filters.searchText}* OR tag:*${filters.searchText}*)`);
  }

  // Category
  if (filters.jewelryCategory) {
    const variations = TAG_MAPPINGS[filters.jewelryCategory] || [filters.jewelryCategory];
    parts.push(`(${variations.map(v => `tag:"${v}"`).join(' OR ')})`);
  }

  // Ring Style & Side Diamonds Logic
  if (filters.ringStyle) {
    if (filters.ringStyle.includes('Side Diamonds')) {
      const baseStyle = filters.ringStyle.split(' + ')[0];
      parts.push(`tag:"${baseStyle.toLowerCase()}" AND tag:"with-side-diamonds"`);
    } else {
      parts.push(`tag:"${filters.ringStyle.toLowerCase()}"`);
    }
  }

  // Shapes
  if (filters.shapes?.length) {
    const shapeQueries = filters.shapes.map(shape => {
      const variations = TAG_MAPPINGS[shape] || [shape];
      return `(${variations.map(v => `tag:"${v}"`).join(' OR ')})`;
    });
    parts.push(`(${shapeQueries.join(' OR ')})`);
  }

  // Metal Colors (Search Tags & Option1)
  if (filters.metalColors?.length) {
    const metalQueries = filters.metalColors.map(color => {
      return `(variants.option1:"${color}" OR tag:"${color.toLowerCase().replace(' ', '-')}")`;
    });
    parts.push(`(${metalQueries.join(' OR ')})`);
  }

  // Diamond Type / Carat (Option2 in CSV)
  if (filters.diamondTypes?.length) {
    const typeQueries = filters.diamondTypes.map(dt => `variants.option2:"${dt.value}"`);
    parts.push(`(${typeQueries.join(' OR ')})`);
  }

  // Price Range
  if (filters.minPrice !== undefined) parts.push(`variants.price:>=${filters.minPrice}`);
  if (filters.maxPrice !== undefined) parts.push(`variants.price:<=${filters.maxPrice}`);

  return parts.join(' AND ');
}

// Logic for showing filters based on your UX order
export function shouldShowFilter(
  filterId: string,
  activeFilters: ProductFilters,
  activeCategory?: JewelryCategory
): boolean {
  // Always show category-wide basics
  if (filterId === 'ringStyle') return activeCategory === 'Rings';
  
  // Follow the order: Style -> Shape -> Metal
  if (filterId === 'shape') {
    return activeCategory === 'Rings' ? !!activeFilters.ringStyle : true;
  }
  
  if (filterId === 'metalColor') {
    if (activeCategory === 'Rings') return !!activeFilters.shapes?.length;
    return true;
  }

  if (filterId === 'diamondType') return !!activeFilters.metalColors?.length;
  if (filterId === 'caratWeight') return !!activeFilters.diamondTypes?.length;

  return true;
}

// Types and Metadata
export interface ProductFilters {
  jewelryCategory?: JewelryCategory;
  ringStyle?: RingStyle;
  shapes?: Shape[];
  metalColors?: MetalColor[];
  diamondTypes?: DiamondType[];
  caratWeights?: CaratWeight[];
  minPrice?: number;
  maxPrice?: number;
  searchText?: string;
  sideDiamonds?: boolean;
}

export type RingStyle = typeof RING_STYLES[number];
export type Shape = typeof ALL_SHAPES[number];
export type MetalColor = typeof METAL_COLORS[number];
export type JewelryCategory = typeof JEWELRY_CATEGORIES[number];
export type DiamondType = typeof DIAMOND_TYPES[number];
export type CaratWeight = typeof CARAT_WEIGHTS[number];