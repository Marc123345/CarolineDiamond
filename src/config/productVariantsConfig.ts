// src/config/productVariantsConfig.ts

export interface ProductVariant {
  metalColor: 'White Gold' | 'Yellow Gold' | 'Rose Gold';
  diamondType: 'Lab-Grown' | 'Natural';
  caratWeight: string; // e.g., '0.30 ct', '0.50 ct', etc.
  price: number | null;
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

// Helper to generate variants for a specific category to keep code clean
const generateVariants = (
  caratOptions: string[],
  prices: (number | null)[],
  handles: string[],
  naturalHandle: string
): ProductVariant[] => {
  const metals: ('White Gold' | 'Yellow Gold' | 'Rose Gold')[] = ['White Gold', 'Yellow Gold', 'Rose Gold'];
  const variants: ProductVariant[] = [];

  // Lab-Grown variants
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

  // Natural Diamond variants (Price on Request)
  metals.forEach(metal => {
    variants.push({
      metalColor: metal,
      diamondType: 'Natural',
      caratWeight: caratOptions[0], // Base selection
      price: null,
      shopifyHandle: naturalHandle,
      available: true
    });
  });

  return variants;
};

// 1. Timeless Necklace Variants
export const TIMELESS_NECKLACE_VARIANTS = generateVariants(
  ['0.50 ct', '1.00 ct'],
  [750, 1190],
  ['timeless-diamond-necklace-18k-gold-0-50ct', 'timeless-diamond-necklace-18k-gold-1-00ct'],
  'timeless-diamond-necklace'
);

// 2. Earrings Studs Variants
export const EARRING_STUD_VARIANTS = generateVariants(
  ['0.30 ct', '0.50 ct', '1.00 ct'],
  [490, 590, 890],
  ['timeless-diamond-stud-earrings-18k-gold-0-30ct', 'timeless-diamond-stud-earrings-18k-gold-0-50ct', 'timeless-diamond-stud-earrings-18k-gold-1-00ct'],
  'timeless-diamond-earrings'
);

// 3. Solitaire Engagement Ring Variants
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
    description: 'A minimalist masterpiece...',
    images: ['https://cdn.shopify.com/...'],
    variants: TIMELESS_NECKLACE_VARIANTS,
    priceRange: '€750 – €1,190+'
  },
  earrings: {
    id: 'unified-earrings',
    title: 'Timeless Diamond Earrings – 18K Gold',
    handle: 'timeless-diamond-earrings',
    description: 'Elegant studs for everyday wear...',
    images: ['https://cdn.shopify.com/...'],
    variants: EARRING_STUD_VARIANTS,
    priceRange: '€490 – €890+'
  },
  rings: {
    id: 'unified-rings',
    title: 'Solitaire Engagement Ring – 18K Gold',
    handle: 'solitaire-ring-no-side-diamonds',
    description: 'Classic elegance and brilliance...',
    images: ['https://cdn.shopify.com/...'],
    variants: SOLITAIRE_RING_VARIANTS,
    priceRange: '€790 – €1,250+'
  }
};

// Re-using your existing logic but making it generic for any variant list
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