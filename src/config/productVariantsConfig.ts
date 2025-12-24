export interface ProductVariant {
  metalColor: 'White Gold' | 'Yellow Gold' | 'Rose Gold';
  diamondType: 'Lab-Grown' | 'Natural';
  caratWeight: string;
  price: number | null; // null = "Price on Request"
  shopifyHandle: string;
  available: boolean;
}

export interface UnifiedProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: string[];
  variants: ProductVariant[];
  priceRange: string;
}

/**
 * Generator function to ensure consistency across all product lines.
 * It automatically applies the "Price on Request" logic to Natural diamonds.
 */
const generateVariants = (
  caratOptions: string[],
  prices: (number | null)[],
  handles: string[],
  naturalHandle: string
): ProductVariant[] => {
  const metals: ('White Gold' | 'Yellow Gold' | 'Rose Gold')[] = ['White Gold', 'Yellow Gold', 'Rose Gold'];
  const variants: ProductVariant[] = [];

  // Lab-Grown variants with fixed pricing
  caratOptions.forEach((carat, idx) => {
    metals.forEach(metal => {
      variants.push({
        metalColor: metal,
        diamondType: 'Lab-Grown',
        caratWeight: carat,
        price: prices[idx],
        shopifyHandle: handles[idx],
        available: true
      });
    });
  });

  // Natural Diamond variants (Always "Price on Request")
  metals.forEach(metal => {
    variants.push({
      metalColor: metal,
      diamondType: 'Natural',
      caratWeight: caratOptions[0],
      price: null,
      shopifyHandle: naturalHandle,
      available: true
    });
  });

  return variants;
};

// 1. Necklace Data: €750 (0.50ct) & €1,190 (1.00ct)
export const TIMELESS_NECKLACE_VARIANTS = generateVariants(
  ['0.50 ct', '1.00 ct'],
  [750, 1190],
  ['timeless-diamond-necklace-18k-gold-0-50ct', 'timeless-diamond-necklace-18k-gold-1-00ct'],
  'timeless-diamond-necklace'
);

// 2. Earring Data: €490 (0.30ct), €590 (0.50ct), €890 (1.00ct)
export const EARRING_STUD_VARIANTS = generateVariants(
  ['0.30 ct', '0.50 ct', '1.00 ct'],
  [490, 590, 890],
  ['timeless-diamond-stud-earrings-18k-gold-0-30ct', 'timeless-diamond-stud-earrings-18k-gold-0-50ct', 'timeless-diamond-stud-earrings-18k-gold-1-00ct'],
  'timeless-diamond-earrings'
);

// 3. Solitaire Ring Data: €790 (0.50ct), €990 (1.00ct), €1,250 (1.50ct)
export const SOLITAIRE_RING_VARIANTS = generateVariants(
  ['0.50 ct', '1.00 ct', '1.50 ct'],
  [790, 990, 1250],
  ['18k-gold-lab-grown-diamond-solitaire-engagement-ring-0-50ct', '18k-gold-lab-grown-diamond-solitaire-engagement-ring-1-00ct', '18k-gold-lab-grown-diamond-solitaire-engagement-ring-1-50ct'],
  'solitaire-ring-no-side-diamonds'
);

export const UNIFIED_PRODUCTS: Record<string, UnifiedProduct> = {
  necklace: {
    id: 'unified-necklace',
    title: 'Timeless Diamond Necklace – 18K Gold',
    handle: 'timeless-diamond-necklace',
    description: 'A minimalist masterpiece design for everyday wear.',
    images: ['https://cdn.shopify.com/s/files/1/0762/6122/8788/files/unnamed_5.jpg?v=1761490616'],
    variants: TIMELESS_NECKLACE_VARIANTS,
    priceRange: '€750 – €1,190+'
  },
  earrings: {
    id: 'unified-earrings',
    title: 'Timeless Diamond Earrings – 18K Gold',
    handle: 'timeless-diamond-earrings',
    description: 'Elegant studs for everyday brilliance.',
    images: ['https://cdn.shopify.com/s/files/1/0762/6122/8788/files/unnamed_9.jpg?v=1761491389'],
    variants: EARRING_STUD_VARIANTS,
    priceRange: '€490 – €890+'
  },
  rings: {
    id: 'unified-rings',
    title: 'Solitaire Engagement Ring – 18K Gold',
    handle: 'solitaire-ring-no-side-diamonds',
    description: 'Classic elegance for the modern proposal.',
    images: ['https://cdn.shopify.com/s/files/1/0762/6122/8788/files/image1.png?v=1760005514'],
    variants: SOLITAIRE_RING_VARIANTS,
    priceRange: '€790 – €1,250+'
  }
};

export function getAvailableFilters(
  variants: ProductVariant[],
  selectedFilters: Partial<Pick<ProductVariant, 'metalColor' | 'diamondType' | 'caratWeight'>>
) {
  const { metalColor, diamondType, caratWeight } = selectedFilters;
  const matchingVariants = variants.filter(v => {
    if (metalColor && v.metalColor !== metalColor) return false;
    if (diamondType && v.diamondType !== diamondType) return false;
    if (caratWeight && v.caratWeight !== caratWeight) return false;
    return true;
  });

  return {
    metalColors: [...new Set(matchingVariants.map(v => v.metalColor))],
    diamondTypes: [...new Set(matchingVariants.map(v => v.diamondType))],
    caratWeights: [...new Set(matchingVariants.map(v => v.caratWeight))]
  };
}