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

// Product Types (Top level category filter)
export const PRODUCT_TYPES = [
  'Engagement Ring',
  'Earrings',
  'Necklace'
] as const;

// Legacy alias for backward compatibility
export const JEWELRY_CATEGORIES = PRODUCT_TYPES;

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

// Carat Weight / Diamond Type Options
export const CARAT_OPTIONS = [
  { value: '0.30', label: '0.30 ct', display: '0.30ct' },
  { value: '0.50', label: '0.50 ct', display: '0.50ct' },
  { value: '1.00', label: '1.00 ct', display: '1.00ct' },
  { value: '1.50', label: '1.50 ct', display: '1.50ct' },
  { value: 'natural', label: 'Natural Diamond', display: 'Natural Diamond (Price on Request)' }
] as const;

// Legacy: Stone Carat Weight ranges (for backward compatibility)
export const CARAT_WEIGHTS = [
  { label: '0.3 ct - 1 ct', min: 0.3, max: 0.99, display: '0.3-0.99 ct' },
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
  '0.30-0.99 ct',
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
export type ProductType = typeof PRODUCT_TYPES[number];
export type JewelryCategory = ProductType; // Alias for backward compatibility
export type EarringType = typeof EARRING_TYPES[number];
export type EarringBacking = typeof EARRING_BACKINGS[number];
export type ChainLength = typeof CHAIN_LENGTHS[number];
export type StoneType = typeof STONE_TYPES[number];
export type DiamondOrigin = typeof DIAMOND_ORIGINS[number];
export type GemstoneVariant = typeof GEMSTONE_VARIANTS[number];
export type CaratRange = typeof CARAT_RANGES[number];
export type CaratWeight = typeof CARAT_WEIGHTS[number];
export type CaratOption = typeof CARAT_OPTIONS[number];
export type ClarityGrade = typeof CLARITY_GRADES[number];
export type Certification = typeof CERTIFICATIONS[number];

export interface ProductFilters {
  productType?: ProductType;
  jewelryCategory?: JewelryCategory; // Alias for backward compatibility
  ringStyle?: RingStyle;
  shapes?: Shape[];
  metalColors?: MetalColor[];
  caratOptions?: string[]; // New: specific carat values like '0.30', '0.50', '1.00', '1.50', 'natural'
  earringType?: EarringType;
  earringBacking?: EarringBacking;
  chainLength?: ChainLength;
  stoneType?: StoneType;
  diamondOrigin?: DiamondOrigin;
  gemstoneVariant?: GemstoneVariant;
  caratRange?: CaratRange;
  caratWeights?: CaratWeight[];
  minCarat?: number;
  maxCarat?: number;
  clarityGrades?: ClarityGrade[];
  certifications?: Certification[];
  ringSizes?: string[];
  minPrice?: number;
  maxPrice?: number;
  searchText?: string;
  inStockOnly?: boolean;
}

const TAG_MAPPINGS: Record<string, string[]> = {
  // Product Types - Match Shopify product types exactly
  'Engagement Ring': ['Engagement Ring', 'engagement ring', 'Ring', 'Rings', 'ring', 'rings', 'Wedding Ring', 'Wedding Band', 'Band', 'Diamond Ring', 'Solitaire Ring', 'Halo Ring'],
  'Earrings': ['Earring', 'Earrings', 'earring', 'earrings', 'Diamond Earrings', 'Hoop Earrings', 'Drop Earrings'],
  'Necklace': ['Necklace', 'Necklaces', 'necklace', 'necklaces', 'Pendant', 'Diamond Necklace', 'Chain'],

  // Legacy support
  'Rings': ['Ring', 'Rings', 'ring', 'rings', 'Engagement Ring', 'Wedding Ring', 'Wedding Band', 'Band', 'Diamond Ring', 'Solitaire Ring', 'Halo Ring'],
  'Necklaces': ['Necklace', 'Necklaces', 'necklace', 'necklaces', 'Pendant', 'Diamond Necklace', 'Chain'],

  // Earring Types (lowercase 'studs' tag used in actual products)
  'Studs': ['Studs', 'studs', 'Stud', 'Stud Earrings'],
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
  'Solitaire': ['Solitaire', 'solitaire', 'Solitaire Ring', 'collection:solitaire', 'No Side Diamonds'],
  'Solitaire + Side Diamonds': ['Solitaire + Side Diamonds', 'Solitaire Side Diamonds', 'Solitaire with Side Diamonds', 'collection:solitaire-side', 'Side Diamonds'],
  'Halo': ['Halo', 'halo', 'Halo Ring', 'collection:halo', 'No Side Diamonds'],
  'Halo + Side Diamonds': ['Halo + Side Diamonds', 'Halo Side Diamonds', 'Halo with Side Diamonds', 'collection:halo-side', 'Side Diamonds', 'Halo + Side Diamonds'],

  // Shapes
  'Round': ['Round', 'shape:round'],
  'Oval': ['Oval', 'shape:oval'],
  'Princess': ['Princess', 'shape:princess'],
  'Pear': ['Pear', 'shape:pear'],
  'Marquise': ['Marquise', 'shape:marquise'],
  'Emerald': ['Emerald', 'shape:emerald'],
  'Cushion': ['Cushion', 'shape:cushion'],
  'Heart': ['Heart', 'shape:heart'],

  // Metal Colors - Match actual Shopify tags and variant values
  // Note: Products have tags like "White Gold", "Yellow Gold", "Rose Gold", "18K Gold"
  // Variants have selectedOptions with exact values: "White Gold", "Yellow Gold", "Rose Gold"
  'White Gold': [
    '18k White Gold',
    '18K White Gold',
    'White Gold',
    'white gold',
    'whte-gold',
    'WG'
  ],
  'Yellow Gold': [
    '18k Yellow Gold',
    '18K Yellow Gold',
    'Yellow Gold',
    'yellow gold',
    'yellow-gold',
    'YG'
  ],
  'Rose Gold': [
    '18k Rose Gold',
    '18K Rose Gold',
    'Rose Gold',
    'rose gold',
    'rose-gold',
    'RG'
  ],

  // Diamond Origins (including lowercase for backward compatibility)
  'Natural Diamond': ['Natural Diamond', 'Natural', 'Mined Diamond', 'stone:natural-diamond', 'Diamond', 'diamond'],
  'Lab-Grown Diamond': ['Lab-Grown Diamond', 'Lab Grown', 'Lab Diamond', 'Synthetic Diamond', 'stone:lab-diamond', 'Diamond', 'lab-grown', 'diamond'],

  // Gemstones
  'Sapphire (Blue)': ['Sapphire', 'Blue Sapphire', 'stone:sapphire', 'Gemstone'],
  'Sapphire (Pink)': ['Pink Sapphire', 'stone:pink-sapphire', 'Gemstone'],
  'Sapphire (Yellow)': ['Yellow Sapphire', 'stone:yellow-sapphire', 'Gemstone'],
  'Morganite (Pink)': ['Morganite', 'Pink Morganite', 'stone:morganite', 'Gemstone'],
  'Ruby (Red)': ['Ruby', 'Red Ruby', 'stone:ruby', 'Gemstone'],

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

export function buildShopifyQuery(filters: ProductFilters): string {
  const parts: string[] = [];

  if (filters.searchText?.trim()) {
    parts.push(`title:*${filters.searchText.trim()}* OR tag:*${filters.searchText.trim()}*`);
  }

  // Support both productType and jewelryCategory (legacy)
  const categoryToUse = filters.productType || filters.jewelryCategory;
  if (categoryToUse) {
    const variations = getTagVariations(categoryToUse);
    const tagQuery = variations.map(v => `tag:"${v}"`).join(' OR ');
    parts.push(`(${tagQuery})`);
  }

  if (filters.ringStyle) {
    const variations = getTagVariations(filters.ringStyle);
    const tagQuery = variations.map(v => `tag:"${v}"`).join(' OR ');
    parts.push(`(${tagQuery})`);
  }

  if (filters.earringType) {
    const variations = getTagVariations(filters.earringType);
    const tagQuery = variations.map(v => `tag:"${v}"`).join(' OR ');
    parts.push(`(${tagQuery})`);
  }

  if (filters.earringBacking) {
    const variations = getTagVariations(filters.earringBacking);
    const tagQuery = variations.map(v => `tag:"${v}"`).join(' OR ');
    parts.push(`(${tagQuery})`);
  }

  if (filters.chainLength) {
    const variations = getTagVariations(filters.chainLength);
    const tagQuery = variations.map(v => `tag:"${v}"`).join(' OR ');
    parts.push(`(${tagQuery})`);
  }

  if (filters.shapes?.length) {
    const shapeQueries: string[] = [];
    filters.shapes.forEach(shape => {
      const variations = getTagVariations(shape);
      const tagQuery = variations.map(v => `tag:"${v}"`).join(' OR ');
      shapeQueries.push(`(${tagQuery})`);
    });
    // When multiple shapes selected, use OR (user wants ANY of these shapes)
    if (shapeQueries.length > 1) {
      parts.push(`(${shapeQueries.join(' OR ')})`);
    } else {
      parts.push(shapeQueries[0]);
    }
  }

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

    // When multiple metal colors selected, use OR (user wants ANY of these colors)
    if (metalQueries.length > 1) {
      parts.push(`(${metalQueries.join(' OR ')})`);
    } else {
      parts.push(metalQueries[0]);
    }
  }

  // Stone Type filters
  if (filters.stoneType === 'Diamond') {
    if (filters.diamondOrigin) {
      const variations = getTagVariations(filters.diamondOrigin);
      const tagQuery = variations.map(v => `tag:"${v}"`).join(' OR ');
      parts.push(`(${tagQuery})`);
    } else {
      // If Diamond selected but no origin, show all diamonds
      parts.push(`(tag:"Diamond" OR tag:"Natural Diamond" OR tag:"Lab-Grown Diamond")`);
    }
  } else if (filters.stoneType === 'Gemstone') {
    if (filters.gemstoneVariant) {
      const variations = getTagVariations(filters.gemstoneVariant);
      const tagQuery = variations.map(v => `tag:"${v}"`).join(' OR ');
      parts.push(`(${tagQuery})`);
    } else {
      // If Gemstone selected but no variant, show all gemstones
      parts.push(`(tag:"Gemstone" OR tag:"Sapphire" OR tag:"Morganite" OR tag:"Ruby")`);
    }
  }

  // Carat Options (new specific values: 0.30ct, 0.50ct, 1.00ct, 1.50ct, natural)
  if (filters.caratOptions?.length) {
    const caratQueries: string[] = [];
    filters.caratOptions.forEach(option => {
      if (option === 'natural') {
        caratQueries.push(`(tag:"Natural Diamond" OR tag:"Price on Request")`);
      } else {
        const caratValue = parseFloat(option);
        caratQueries.push(`(tag:"${option}ct" OR tag:"${caratValue}ct" OR tag:"carat:${option}")`);
      }
    });
    if (caratQueries.length > 1) {
      parts.push(`(${caratQueries.join(' OR ')})`);
    } else {
      parts.push(caratQueries[0]);
    }
  }

  // Legacy: Carat Weight ranges
  if (filters.caratWeights?.length) {
    const caratQueries: string[] = [];
    filters.caratWeights.forEach(weight => {
      const caratTags = [
        `tag:"${weight.display}"`,
        `tag:"carat:${weight.min}"`,
        `tag:"${weight.label}"`
      ];
      caratQueries.push(`(${caratTags.join(' OR ')})`);
    });
    if (caratQueries.length > 1) {
      parts.push(`(${caratQueries.join(' OR ')})`);
    } else {
      parts.push(caratQueries[0]);
    }
  }

  // Custom carat range
  if (typeof filters.minCarat === 'number') {
    parts.push(`tag:"carat:>=${filters.minCarat}"`);
  }

  if (typeof filters.maxCarat === 'number') {
    parts.push(`tag:"carat:<=${filters.maxCarat}"`);
  }

  // Clarity filters
  if (filters.clarityGrades?.length) {
    const clarityQueries: string[] = [];
    filters.clarityGrades.forEach(clarity => {
      const variations = getTagVariations(clarity);
      const tagQuery = variations.map(v => `tag:"${v}"`).join(' OR ');
      clarityQueries.push(`(${tagQuery})`);
    });
    if (clarityQueries.length > 1) {
      parts.push(`(${clarityQueries.join(' OR ')})`);
    } else {
      parts.push(clarityQueries[0]);
    }
  }

  // Certification filters
  if (filters.certifications?.length) {
    const certQueries: string[] = [];
    filters.certifications.forEach(cert => {
      const variations = getTagVariations(cert);
      const tagQuery = variations.map(v => `tag:"${v}"`).join(' OR ');
      certQueries.push(`(${tagQuery})`);
    });
    if (certQueries.length > 1) {
      parts.push(`(${certQueries.join(' OR ')})`);
    } else {
      parts.push(certQueries[0]);
    }
  }

  if (filters.ringSizes?.length) {
    const sizeQuery = filters.ringSizes.map(size => `tag:"size:${size}" OR tag:"Size ${size}"`).join(' OR ');
    parts.push(`(${sizeQuery})`);
  }

  if (typeof filters.minPrice === 'number') {
    parts.push(`variants.price:>=${filters.minPrice}`);
  }

  if (typeof filters.maxPrice === 'number') {
    parts.push(`variants.price:<=${filters.maxPrice}`);
  }

  return parts.length > 0 ? parts.join(' ') : '';
}

// Helper to determine if shape filter should be shown
export function shouldShowShapeFilter(category?: ProductType | JewelryCategory): boolean {
  // Only show shapes for Engagement Ring or when no category is selected
  return !category || category === 'Engagement Ring' || category === 'Rings';
}

// Helper to get available shapes for selected ring style
export function getAvailableShapes(ringStyle?: RingStyle, category?: ProductType | JewelryCategory): Shape[] {
  // Don't show shapes for Necklace or Earrings
  if (!shouldShowShapeFilter(category)) {
    return [];
  }

  if (!ringStyle) return ALL_SHAPES as unknown as Shape[];
  return SHAPES_BY_STYLE[ringStyle];
}
