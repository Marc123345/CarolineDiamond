// ====================================
// FILTER ORDER FOR OPTIMAL UX
// ====================================
// Order strongly affects perceived simplicity:
// 1. Ring Style (Solitaire, Halo - with/without side diamonds)
// 2. Diamond Shape
// 3. Metal / Gold Color
// 4. Diamond Type (Natural vs Lab-grown/synthetisch)
// 5. Carat Weight
// 6. Price Range
// 7. Side Diamonds on Band (for applicable styles)

export const FILTER_DISPLAY_ORDER = [
  'ringStyle',
  'shape',
  'metalColor',
  'diamondType',
  'caratWeight',
  'priceRange',
  'sideDiamonds'
] as const;

// Ring Styles (Top-level filter) - Expanded to include side diamond variants
export const RING_STYLES = [
  'Solitaire',
  'Solitaire + Side Diamonds',
  'Halo',
  'Halo + Side Diamonds'
] as const;

// All possible shapes
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

// Shape availability by ring style
export const SHAPES_BY_STYLE: Record<RingStyle, Shape[]> = {
  'Solitaire': ['Round', 'Oval', 'Princess', 'Pear', 'Marquise', 'Emerald', 'Heart'],
  'Solitaire + Side Diamonds': ['Round', 'Oval', 'Princess', 'Pear', 'Marquise', 'Emerald', 'Heart'],
  'Halo': ['Round', 'Oval', 'Princess', 'Pear', 'Marquise', 'Emerald', 'Cushion', 'Heart'],
  'Halo + Side Diamonds': ['Round', 'Oval', 'Princess', 'Pear', 'Marquise', 'Emerald', 'Cushion', 'Heart']
};

// Metal Colors (18K only) - Always 18 Carat Gold
export const METAL_COLORS = [
  'Rose Gold',
  'Yellow Gold',
  'White Gold'
] as const;

// Metal color display order matches sketch: Rose, Yellow, White
export const METAL_COLOR_LABELS = {
  'Rose Gold': '18K Rose Gold',
  'Yellow Gold': '18K Yellow Gold',
  'White Gold': '18K White Gold'
} as const;

// Jewelry Categories (Top level category filter)
export const JEWELRY_CATEGORIES = [
  'Rings',
  'Earrings',
  'Necklaces'
] as const;

// Earring Types
export const EARRING_TYPES = [
  'Studs',
  'Hoops',
  'Drops',
  'Dangles'
] as const;

// Earring Backing Types
export const EARRING_BACKINGS = [
  'Push Back',
  'Screw Back',
  'Lever Back',
  'French Hook'
] as const;

// Necklace Chain Lengths
export const CHAIN_LENGTHS = [
  '14"',
  '16"',
  '18"',
  '20"',
  '22"',
  '24"'
] as const;

// Stone Types (Top level: Diamond or Gemstone)
export const STONE_TYPES = [
  'Diamond',
  'Gemstone'
] as const;

// Diamond Origins
export const DIAMOND_ORIGINS = [
  'Natural Diamond',
  'Lab-Grown Diamond'
] as const;

// Gemstone Variants
export const GEMSTONE_VARIANTS = [
  'Sapphire (Blue)',
  'Sapphire (Pink)',
  'Sapphire (Yellow)',
  'Morganite (Pink)',
  'Ruby (Red)'
] as const;

// Diamond Type (Combined carat weight and origin - matches Shopify Option2)
export const DIAMOND_TYPES = [
  // Natural Diamond specific carats
  { value: '0.50ct', display: '0.50ct Natural', carat: 0.50, origin: 'Natural' },
  { value: '1.00ct', display: '1.00ct Natural', carat: 1.00, origin: 'Natural' },
  { value: '1.50ct', display: '1.50ct Natural', carat: 1.50, origin: 'Natural' },
  { value: 'Natural Diamond', display: 'Natural Diamond (Any Size)', carat: undefined, origin: 'Natural' },

  // Lab-Grown specific carats
  { value: 'Lab-Grown 0.50ct', display: '0.50ct Lab-Grown', carat: 0.50, origin: 'Lab-Grown' },
  { value: 'Lab-Grown 1.00ct', display: '1.00ct Lab-Grown', carat: 1.00, origin: 'Lab-Grown' },
  { value: 'Lab-Grown 1.50ct', display: '1.50ct Lab-Grown', carat: 1.50, origin: 'Lab-Grown' },
] as const;

// Specific Carat Weights (Primary filter options)
export const SPECIFIC_CARATS = [
  { value: 0.50, label: '0.50 ct', display: '0.50ct' },
  { value: 1.00, label: '1.00 ct', display: '1.00ct' },
  { value: 1.50, label: '1.50 ct', display: '1.50ct' },
  { value: 2.00, label: '2.00 ct', display: '2.00ct' }
] as const;

// Stone Carat Weight (Center Stone) - Range support
export const CARAT_WEIGHTS = [
  { label: '0.5 ct - 1 ct', min: 0.5, max: 0.99, display: '0.5-0.99 ct' },
  { label: '1 ct - 1.5 ct', min: 1.0, max: 1.49, display: '1.0-1.49 ct' },
  { label: '1.5 ct - 2 ct', min: 1.5, max: 1.99, display: '1.5-1.99 ct' },
  { label: '2 ct +', min: 2.0, max: undefined, display: '2.0+ ct' }
] as const;

// Diamond Clarity Grades
export const CLARITY_GRADES = [
  'FL',  // Flawless
  'IF',  // Internally Flawless
  'VVS1', // Very Very Slightly Included 1
  'VVS2', // Very Very Slightly Included 2
  'VS1', // Very Slightly Included 1
  'VS2', // Very Slightly Included 2
  'SI1', // Slightly Included 1
  'SI2', // Slightly Included 2
  'I1',  // Included 1
  'I2',  // Included 2
  'I3'   // Included 3
] as const;

// Common clarity filters (most searched)
export const COMMON_CLARITY_GRADES = ['VS1', 'VS2', 'SI1', 'SI2'] as const;

// Diamond Certification
export const CERTIFICATIONS = [
  'GIA',  // Gemological Institute of America
  'HRD',  // HRD Antwerp
  'IGI'   // International Gemological Institute
] as const;

// Carat Ranges (legacy - for backward compatibility)
export const CARAT_RANGES = [
  '0.50-0.99 ct',
  '1.00-1.49 ct',
  '1.50-1.99 ct',
  '2.00+ ct'
] as const;

// Price Ranges
export const PRICE_RANGES = [
  { label: 'Under €1,500', min: 0, max: 1500 },
  { label: '€1,500-€3,000', min: 1500, max: 3000 },
  { label: '€3,000-€5,000', min: 3000, max: 5000 },
  { label: 'Over €5,000', min: 5000, max: undefined }
] as const;

export type RingStyle = typeof RING_STYLES[number];
export type Shape = typeof ALL_SHAPES[number];
export type MetalColor = typeof METAL_COLORS[number];
export type JewelryCategory = typeof JEWELRY_CATEGORIES[number];
export type EarringType = typeof EARRING_TYPES[number];
export type EarringBacking = typeof EARRING_BACKINGS[number];
export type ChainLength = typeof CHAIN_LENGTHS[number];
export type StoneType = typeof STONE_TYPES[number];
export type DiamondOrigin = typeof DIAMOND_ORIGINS[number];
export type DiamondType = typeof DIAMOND_TYPES[number];
export type GemstoneVariant = typeof GEMSTONE_VARIANTS[number];
export type CaratRange = typeof CARAT_RANGES[number];
export type CaratWeight = typeof CARAT_WEIGHTS[number];
export type ClarityGrade = typeof CLARITY_GRADES[number];
export type Certification = typeof CERTIFICATIONS[number];
export type SpecificCarat = typeof SPECIFIC_CARATS[number];

// Filter Metadata for UI Rendering
export interface FilterMetadata {
  id: string;
  label: string;
  labelNL: string;
  order: number;
  isMultiSelect: boolean;
  showForCategories?: JewelryCategory[];
  dependsOn?: string[]; // Other filter IDs this depends on
}

export const FILTER_METADATA: Record<string, FilterMetadata> = {
  ringStyle: {
    id: 'ringStyle',
    label: 'Ring Style',
    labelNL: 'Ring Stijl',
    order: 1,
    isMultiSelect: false,
    showForCategories: ['Rings']
  },
  shape: {
    id: 'shape',
    label: 'Diamond Shape',
    labelNL: 'Diamantvorm',
    order: 2,
    isMultiSelect: true,
    showForCategories: ['Rings'],
    dependsOn: ['ringStyle']
  },
  metalColor: {
    id: 'metalColor',
    label: 'Metal / Gold Color',
    labelNL: 'Metaal / Goudkleur',
    order: 3,
    isMultiSelect: true
  },
  diamondType: {
    id: 'diamondType',
    label: 'Diamond Type',
    labelNL: 'Diamant Type',
    order: 4,
    isMultiSelect: false
  },
  caratWeight: {
    id: 'caratWeight',
    label: 'Carat Weight',
    labelNL: 'Karaat Gewicht',
    order: 5,
    isMultiSelect: true,
    dependsOn: ['diamondType']
  },
  priceRange: {
    id: 'priceRange',
    label: 'Price Range',
    labelNL: 'Prijsklasse',
    order: 6,
    isMultiSelect: false
  },
  sideDiamonds: {
    id: 'sideDiamonds',
    label: 'Side Diamonds on Band',
    labelNL: 'Zijdiamanten op Band',
    order: 7,
    isMultiSelect: false,
    showForCategories: ['Rings'],
    dependsOn: ['ringStyle']
  }
};

export interface ProductFilters {
  jewelryCategory?: JewelryCategory;
  ringStyle?: RingStyle;
  shapes?: Shape[];
  metalColors?: MetalColor[];
  earringType?: EarringType;
  earringBacking?: EarringBacking;
  chainLength?: ChainLength;
  stoneType?: StoneType;
  diamondOrigin?: DiamondOrigin;
  diamondType?: DiamondType; // Single selection for diamond carat/origin
  gemstoneVariant?: GemstoneVariant;
  caratRange?: CaratRange;
  caratWeights?: CaratWeight[];
  specificCarats?: number[]; // Specific carat weights (0.50, 1.00, 1.50, etc.)
  minCarat?: number;
  maxCarat?: number;
  clarityGrades?: ClarityGrade[];
  certifications?: Certification[];
  ringSizes?: string[];
  minPrice?: number;
  maxPrice?: number;
  searchText?: string;
  inStockOnly?: boolean;
  sideDiamonds?: boolean; // Filter for rings with/without side diamonds on band
}

const TAG_MAPPINGS: Record<string, string[]> = {
  // Jewelry Categories - Match CSV data exactly
  'Rings': ['Ring', 'Rings', 'ring', 'rings', 'Engagement Ring', 'Wedding Ring', 'Wedding Band', 'Band', 'Diamond Ring', 'Solitaire Ring', 'Halo Ring'],
  'Earrings': ['Earring', 'Earrings', 'earring', 'earrings', 'Studs', 'studs', 'Stud Earrings', 'Diamond Earrings', 'Hoop Earrings', 'Drop Earrings'],
  'Necklaces': ['Necklace', 'Necklaces', 'necklace', 'necklaces', 'Pendant', 'Diamond Necklace', 'Chain'],

  // Earring Types
  'Studs': ['Stud', 'Studs', 'Stud Earrings'],
  'Hoops': ['Hoop', 'Hoops', 'Hoop Earrings'],
  'Drops': ['Drop', 'Drops', 'Drop Earrings'],
  'Dangles': ['Dangle', 'Dangles', 'Dangle Earrings'],

  // Earring Backings
  'Push Back': ['Push Back', 'Push-Back', 'Pushback', 'Butterfly Back'],
  'Screw Back': ['Screw Back', 'Screw-Back', 'Screwback'],
  'Lever Back': ['Lever Back', 'Lever-Back', 'Leverback'],
  'French Hook': ['French Hook', 'French-Hook', 'Wire Hook'],

  // Chain Lengths
  '14"': ['14"', '14 inch', '14inch', '14-inch'],
  '16"': ['16"', '16 inch', '16inch', '16-inch'],
  '18"': ['18"', '18 inch', '18inch', '18-inch'],
  '20"': ['20"', '20 inch', '20inch', '20-inch'],
  '22"': ['22"', '22 inch', '22inch', '22-inch'],
  '24"': ['24"', '24 inch', '24inch', '24-inch'],

  // Ring Styles - Match CSV data exactly
  'Solitaire': ['Solitaire', 'solitaire', 'Solitaire Ring', 'collection:solitaire'],
  'Solitaire + Side Diamonds': ['Solitaire + Side Diamonds', 'Solitaire Side Diamonds', 'Solitaire with Side Diamonds', 'collection:solitaire-side'],
  'Halo': ['Halo', 'halo', 'Halo Ring', 'collection:halo'],
  'Halo + Side Diamonds': ['Halo + Side Diamonds', 'Halo Side Diamonds', 'Halo with Side Diamonds', 'collection:halo-side'],

  // Side Diamonds on Band
  'Side Diamonds': ['Side Diamonds', 'side-diamonds', 'With Side Diamonds', 'Band Diamonds', 'Solitaire + Side Diamonds', 'Halo + Side Diamonds'],
  'No Side Diamonds': ['No Side Diamonds', 'no-side-diamonds', 'Without Side Diamonds', 'Plain Band', 'Solitaire', 'Halo'],

  // Shapes - Include metafield and tag variations
  'Round': ['Round', 'round', 'shape:round', 'Round Brilliant', 'Round Cut', 'diamond_shape:round', 'Brilliant', 'brilliant'],
  'Oval': ['Oval', 'oval', 'shape:oval', 'Oval Cut', 'diamond_shape:oval'],
  'Princess': ['Princess', 'princess', 'shape:princess', 'Princess Cut', 'Princess-Cut', 'diamond_shape:princess', 'Square', 'square'],
  'Pear': ['Pear', 'pear', 'shape:pear', 'Pear Cut', 'Pear Shape', 'Pear-Shaped', 'diamond_shape:pear', 'Teardrop'],
  'Marquise': ['Marquise', 'marquise', 'shape:marquise', 'Marquise Cut', 'diamond_shape:marquise', 'Navette'],
  'Emerald': ['Emerald', 'emerald', 'shape:emerald', 'Emerald Cut', 'diamond_shape:emerald'],
  'Cushion': ['Cushion', 'cushion', 'shape:cushion', 'Cushion Cut', 'diamond_shape:cushion', 'Pillow', 'pillow'],
  'Heart': ['Heart', 'heart', 'shape:heart', 'Heart Cut', 'Heart Shape', 'Heart-Shaped', 'diamond_shape:heart'],
  'Asscher': ['Asscher', 'asscher', 'shape:asscher', 'Asscher Cut', 'diamond_shape:asscher'],
  'Radiant': ['Radiant', 'radiant', 'shape:radiant', 'Radiant Cut', 'diamond_shape:radiant'],

  // Metal Colors - Match actual Shopify variant values from CSV
  'White Gold': [
    '18k White Gold',
    '18K White Gold',
    'White Gold',
    'white gold',
    'white',
    'whte-gold',
    'White',
    'white-gold',
    'WG'
  ],
  'Yellow Gold': [
    '18k Yellow Gold',
    '18K Yellow Gold',
    'Yellow Gold',
    'yellow gold',
    'yellow-gold',
    'Yellow',
    'YG'
  ],
  'Rose Gold': [
    '18k Rose Gold',
    '18K Rose Gold',
    'Rose Gold',
    'rose gold',
    'rose-gold',
    'Rose',
    'RG'
  ],

  // Gemstones
  'Sapphire (Blue)': ['Sapphire', 'Blue Sapphire', 'stone:sapphire', 'Gemstone'],
  'Sapphire (Pink)': ['Pink Sapphire', 'stone:pink-sapphire', 'Gemstone'],
  'Sapphire (Yellow)': ['Yellow Sapphire', 'stone:yellow-sapphire', 'Gemstone'],
  'Morganite (Pink)': ['Morganite', 'Pink Morganite', 'stone:morganite', 'Gemstone'],
  'Ruby (Red)': ['Ruby', 'Red Ruby', 'stone:ruby', 'Gemstone'],

  // Diamond Types (combined carat + origin - matches Option2 from CSV)
  '0.50ct': ['0.50ct', '0.50', 'carat:0.50', 'Natural 0.50ct', 'Diamond 0.50ct'],
  '1.00ct': ['1.00ct', '1.00', '1ct', 'carat:1.00', 'Natural 1.00ct', 'Diamond 1.00ct'],
  '1.50ct': ['1.50ct', '1.50', 'carat:1.50', 'Natural 1.50ct', 'Diamond 1.50ct'],
  'Lab-Grown 0.50ct': ['Lab-Grown 0.50ct', 'Lab Grown 0.50ct', 'All Lab-Grown 0.50ct', 'lab-grown:0.50'],
  'Lab-Grown 1.00ct': ['Lab-Grown 1.00ct', 'Lab Grown 1.00ct', 'All Lab-Grown 1.00ct', 'lab-grown:1.00'],
  'Lab-Grown 1.50ct': ['Lab-Grown 1.50ct', 'Lab Grown 1.50ct', 'All Lab-Grown 1.50ct', 'lab-grown:1.50'],
  'Natural Diamond': ['Natural Diamond', 'Natural', 'Mined Diamond', 'All Natural Diamond', 'stone:natural-diamond', 'Diamond', 'diamond'],
  'Lab-Grown Diamond': ['Lab-Grown Diamond', 'Lab Grown', 'Lab Diamond', 'Synthetic Diamond', 'stone:lab-diamond', 'Diamond', 'lab-grown', 'diamond', 'Lab-Grown', 'All Lab-Grown'],

  // Clarity Grades
  'FL': ['FL', 'Flawless', 'clarity:fl'],
  'IF': ['IF', 'Internally Flawless', 'clarity:if'],
  'VVS1': ['VVS1', 'clarity:vvs1'],
  'VVS2': ['VVS2', 'clarity:vvs2'],
  'VS1': ['VS1', 'clarity:vs1'],
  'VS2': ['VS2', 'clarity:vs2'],
  'SI1': ['SI1', 'clarity:si1'],
  'SI2': ['SI2', 'clarity:si2'],
  'I1': ['I1', 'clarity:i1'],
  'I2': ['I2', 'clarity:i2'],
  'I3': ['I3', 'clarity:i3'],

  // Certifications
  'GIA': ['GIA', 'GIA Certified', 'cert:gia', 'Gemological Institute of America'],
  'HRD': ['HRD', 'HRD Certified', 'cert:hrd', 'HRD Antwerp'],
  'IGI': ['IGI', 'IGI Certified', 'cert:igi', 'International Gemological Institute']
};

function getTagVariations(canonicalTag: string): string[] {
  return TAG_MAPPINGS[canonicalTag] || [canonicalTag];
}

/**
 * Build Shopify Storefront API query using PRODUCT-LEVEL attributes ONLY
 *
 * GOLDEN RULE: Collections filter products. Product pages select variants.
 *
 * This function filters products by their product-level attributes:
 * - Product type (Ring, Necklace, Earring)
 * - Ring design/style (Solitaire, Halo, etc.)
 * - Shapes AVAILABLE on this product (tags indicating which shapes can be ordered)
 * - Metal colors AVAILABLE on this product (tags indicating which metals can be ordered)
 * - Stone type (Diamond, Gemstone)
 *
 * This function does NOT filter by variant-specific attributes like:
 * - Specific carat weight (variant option - selected on product page)
 * - Ring size (variant option - selected on product page)
 * - Clarity grade (variant attribute - selected on product page)
 * - Certification (variant attribute - selected on product page)
 */
export function buildShopifyQuery(filters: ProductFilters): string {
  const parts: string[] = [];

  // 1. Search Text (searches title, description, tags)
  if (filters.searchText?.trim()) {
    const searchTerm = filters.searchText.trim();
    parts.push(`(title:*${searchTerm}* OR tag:*${searchTerm}*)`);
  }

  // 2. Jewelry Category (product-level: what type of jewelry is this?)
  if (filters.jewelryCategory) {
    const variations = getTagVariations(filters.jewelryCategory);
    const tagQuery = variations.map(v => `tag:"${v}"`).join(' OR ');
    parts.push(`(${tagQuery})`);
  }

  // 3. Ring Style/Design (product-level: design category)
  if (filters.ringStyle) {
    const variations = getTagVariations(filters.ringStyle);
    const tagQuery = variations.map(v => `tag:"${v}"`).join(' OR ');
    parts.push(`(${tagQuery})`);
  }

  // 4. Earring Type (product-level)
  if (filters.earringType) {
    const variations = getTagVariations(filters.earringType);
    const tagQuery = variations.map(v => `tag:"${v}"`).join(' OR ');
    parts.push(`(${tagQuery})`);
  }

  // 5. Earring Backing (product-level)
  if (filters.earringBacking) {
    const variations = getTagVariations(filters.earringBacking);
    const tagQuery = variations.map(v => `tag:"${v}"`).join(' OR ');
    parts.push(`(${tagQuery})`);
  }

  // 6. Chain Length (product-level)
  if (filters.chainLength) {
    const variations = getTagVariations(filters.chainLength);
    const tagQuery = variations.map(v => `tag:"${v}"`).join(' OR ');
    parts.push(`(${tagQuery})`);
  }

  // 7. Diamond Shapes AVAILABLE (product-level: which shapes can be ordered for this product?)
  // Product should be tagged with ALL shapes it supports, e.g., "Round", "Oval", "Princess"
  if (filters.shapes?.length) {
    const shapeQueries: string[] = [];
    filters.shapes.forEach(shape => {
      const variations = getTagVariations(shape);
      const tagQuery = variations.map(v => `tag:"${v}"`).join(' OR ');
      shapeQueries.push(`(${tagQuery})`);
    });
    if (shapeQueries.length > 1) {
      parts.push(`(${shapeQueries.join(' OR ')})`);
    } else {
      parts.push(shapeQueries[0]);
    }
  }

  // 8. Metal Colors AVAILABLE (product-level: which metals can be ordered for this product?)
  // Product should be tagged with ALL metals it supports, e.g., "White Gold", "Rose Gold"
  if (filters.metalColors?.length) {
    const metalQueries: string[] = [];
    filters.metalColors.forEach(color => {
      const variations = getTagVariations(color);
      const tagQuery = variations.map(v => {
        const escaped = v.replace(/"/g, '\\"');
        return `tag:"${escaped}"`;
      }).join(' OR ');
      metalQueries.push(`(${tagQuery})`);
    });
    if (metalQueries.length > 1) {
      parts.push(`(${metalQueries.join(' OR ')})`);
    } else {
      parts.push(metalQueries[0]);
    }
  }

  // 9. Stone Type (product-level: Diamond or Gemstone)
  if (filters.stoneType === 'Diamond') {
    if (filters.diamondOrigin) {
      const variations = getTagVariations(filters.diamondOrigin);
      const tagQuery = variations.map(v => `tag:"${v}"`).join(' OR ');
      parts.push(`(${tagQuery})`);
    } else {
      parts.push(`(tag:"Diamond" OR tag:"Natural Diamond" OR tag:"Lab-Grown Diamond")`);
    }
  } else if (filters.stoneType === 'Gemstone') {
    if (filters.gemstoneVariant) {
      const variations = getTagVariations(filters.gemstoneVariant);
      const tagQuery = variations.map(v => `tag:"${v}"`).join(' OR ');
      parts.push(`(${tagQuery})`);
    } else {
      parts.push(`(tag:"Gemstone" OR tag:"Sapphire" OR tag:"Morganite" OR tag:"Ruby")`);
    }
  }

  // 10. Side Diamonds on Band (product-level: design feature)
  if (typeof filters.sideDiamonds === 'boolean') {
    if (filters.sideDiamonds) {
      parts.push(`(tag:"Side Diamonds" OR tag:"Solitaire + Side Diamonds" OR tag:"Halo + Side Diamonds")`);
    } else {
      parts.push(`(tag:"No Side Diamonds" OR tag:"Solitaire" OR tag:"Halo") NOT tag:"Side Diamonds"`);
    }
  }

  // 11. Availability (product-level)
  if (filters.inStockOnly) {
    parts.push('available_for_sale:true');
  }

  // NOTE: We DO NOT filter by variant-level attributes here:
  // - Carat weight (filters.caratWeights, filters.specificCarats) -> Variant option, selected on product page
  // - Ring size (filters.ringSizes) -> Variant option, selected on product page
  // - Clarity (filters.clarityGrades) -> Variant attribute, selected on product page
  // - Certification (filters.certifications) -> Variant attribute, selected on product page
  // - Diamond Type (filters.diamondType) -> Variant option combining carat + origin
  //
  // These should be applied CLIENT-SIDE after fetching products, or shown as options
  // on the product detail page for the user to select their preferred variant.

  return parts.length > 0 ? parts.join(' AND ') : '';
}

// Helper to determine if shape filter should be shown
export function shouldShowShapeFilter(jewelryCategory?: JewelryCategory): boolean {
  // Only show shapes for Rings or when no category is selected
  return !jewelryCategory || jewelryCategory === 'Rings';
}

// Helper to get available shapes for selected ring style
export function getAvailableShapes(ringStyle?: RingStyle, jewelryCategory?: JewelryCategory): Shape[] {
  // Don't show shapes for Necklaces or Earrings
  if (!shouldShowShapeFilter(jewelryCategory)) {
    return [];
  }

  if (!ringStyle) return ALL_SHAPES as unknown as Shape[];
  return SHAPES_BY_STYLE[ringStyle];
}

// Get filters in recommended display order
export function getFiltersInDisplayOrder(activeCategory?: JewelryCategory): FilterMetadata[] {
  const allFilters = Object.values(FILTER_METADATA);

  return allFilters
    .filter(filter => {
      // Filter by category if specified
      if (filter.showForCategories && activeCategory) {
        return filter.showForCategories.includes(activeCategory);
      }
      return true;
    })
    .sort((a, b) => a.order - b.order);
}

// Check if a filter should be displayed based on dependencies
export function shouldShowFilter(
  filterId: string,
  activeFilters: ProductFilters,
  activeCategory?: JewelryCategory
): boolean {
  const metadata = FILTER_METADATA[filterId];
  if (!metadata) return false;

  // Check category restrictions
  if (metadata.showForCategories && activeCategory) {
    if (!metadata.showForCategories.includes(activeCategory)) {
      return false;
    }
  }

  // Check dependencies
  if (metadata.dependsOn) {
    for (const dependency of metadata.dependsOn) {
      // If a dependency exists but has no value, don't show this filter
      if (dependency === 'ringStyle' && !activeFilters.ringStyle) {
        return false;
      }
      if (dependency === 'diamondType' && !activeFilters.diamondOrigin && !activeFilters.diamondType) {
        return false;
      }
    }
  }

  return true;
}

// Get available carat weights based on diamond type
export function getAvailableCarats(diamondOrigin?: DiamondOrigin): SpecificCarat[] {
  // Lab-grown diamonds have specific pricing at 0.50, 1.00, 1.50
  if (diamondOrigin === 'Lab-Grown Diamond') {
    return SPECIFIC_CARATS.slice(0, 3); // 0.50, 1.00, 1.50
  }

  // Natural diamonds available in all sizes including 2.00+
  return SPECIFIC_CARATS as unknown as SpecificCarat[];
}
