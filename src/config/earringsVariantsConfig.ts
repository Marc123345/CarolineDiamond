export interface EarringVariant {
  metalColor: 'White Gold' | 'Yellow Gold' | 'Rose Gold';
  diamondType: 'Lab-Grown' | 'Natural';
  caratWeight: '0.30 ct' | '0.50 ct' | '1.00 ct';
  price: number | null;
  shopifyHandle: string;
  variantId?: string;
  available: boolean;
}

export interface EarringProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: string[];
  variants: EarringVariant[];
}

export const TIMELESS_EARRING_VARIANTS: EarringVariant[] = [
  // Lab-Grown 0.30ct variants
  {
    metalColor: 'White Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '0.30 ct',
    price: 490,
    shopifyHandle: 'timeless-diamond-stud-earrings-18k-gold-0-30ct',
    available: true
  },
  {
    metalColor: 'Yellow Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '0.30 ct',
    price: 490,
    shopifyHandle: 'timeless-diamond-stud-earrings-18k-gold-0-30ct',
    available: true
  },
  {
    metalColor: 'Rose Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '0.30 ct',
    price: 490,
    shopifyHandle: 'timeless-diamond-stud-earrings-18k-gold-0-30ct',
    available: true
  },

  // Lab-Grown 0.50ct variants
  {
    metalColor: 'White Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '0.50 ct',
    price: 590,
    shopifyHandle: 'timeless-diamond-stud-earrings-18k-gold-0-50ct',
    available: true
  },
  {
    metalColor: 'Yellow Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '0.50 ct',
    price: 590,
    shopifyHandle: 'timeless-diamond-stud-earrings-18k-gold-0-50ct',
    available: true
  },
  {
    metalColor: 'Rose Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '0.50 ct',
    price: 590,
    shopifyHandle: 'timeless-diamond-stud-earrings-18k-gold-0-50ct',
    available: true
  },

  // Lab-Grown 1.00ct variants
  {
    metalColor: 'White Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '1.00 ct',
    price: 890,
    shopifyHandle: 'timeless-diamond-stud-earrings-18k-gold-1-00ct',
    available: true
  },
  {
    metalColor: 'Yellow Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '1.00 ct',
    price: 890,
    shopifyHandle: 'timeless-diamond-stud-earrings-18k-gold-1-00ct',
    available: true
  },
  {
    metalColor: 'Rose Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '1.00 ct',
    price: 890,
    shopifyHandle: 'timeless-diamond-stud-earrings-18k-gold-1-00ct',
    available: true
  },

  // Natural 0.30ct variants - Price on Request
  {
    metalColor: 'White Gold',
    diamondType: 'Natural',
    caratWeight: '0.30 ct',
    price: null,
    shopifyHandle: 'timeless-diamond-earrings',
    available: true
  },
  {
    metalColor: 'Yellow Gold',
    diamondType: 'Natural',
    caratWeight: '0.30 ct',
    price: null,
    shopifyHandle: 'timeless-diamond-earrings',
    available: true
  },
  {
    metalColor: 'Rose Gold',
    diamondType: 'Natural',
    caratWeight: '0.30 ct',
    price: null,
    shopifyHandle: 'timeless-diamond-earrings',
    available: true
  },

  // Natural 0.50ct variants - Price on Request
  {
    metalColor: 'White Gold',
    diamondType: 'Natural',
    caratWeight: '0.50 ct',
    price: null,
    shopifyHandle: 'timeless-diamond-earrings',
    available: true
  },
  {
    metalColor: 'Yellow Gold',
    diamondType: 'Natural',
    caratWeight: '0.50 ct',
    price: null,
    shopifyHandle: 'timeless-diamond-earrings',
    available: true
  },
  {
    metalColor: 'Rose Gold',
    diamondType: 'Natural',
    caratWeight: '0.50 ct',
    price: null,
    shopifyHandle: 'timeless-diamond-earrings',
    available: true
  },

  // Natural 1.00ct variants - Price on Request
  {
    metalColor: 'White Gold',
    diamondType: 'Natural',
    caratWeight: '1.00 ct',
    price: null,
    shopifyHandle: 'timeless-diamond-earrings',
    available: true
  },
  {
    metalColor: 'Yellow Gold',
    diamondType: 'Natural',
    caratWeight: '1.00 ct',
    price: null,
    shopifyHandle: 'timeless-diamond-earrings',
    available: true
  },
  {
    metalColor: 'Rose Gold',
    diamondType: 'Natural',
    caratWeight: '1.00 ct',
    price: null,
    shopifyHandle: 'timeless-diamond-earrings',
    available: true
  }
];

export const UNIFIED_TIMELESS_EARRINGS: EarringProduct = {
  id: 'timeless-diamond-earrings-unified',
  title: 'Timeless Diamond Stud Earrings – 18K Gold',
  handle: 'timeless-diamond-earrings',
  description: `Classic elegance meets modern sustainability. The Timeless Diamond Stud Earrings by Diamonds by CS feature brilliant-cut lab-grown diamonds set in luxurious 18K gold — timeless, versatile, and perfect for every occasion.

Available in:
• 18K Yellow Gold
• 18K White Gold
• 18K Rose Gold

Diamond Options:
• Lab-Grown (0.30 ct, 0.50 ct, or 1.00 ct D-VS2)
• Natural (price on request)

Includes:
• Certificate of authenticity
• Elegant packaging
• Free worldwide shipping

Handcrafted in Antwerp, Belgium.`,
  images: [
    'https://cdn.shopify.com/s/files/1/0762/6122/8788/files/unnamed_5.jpg?v=1761490616',
    'https://cdn.shopify.com/s/files/1/0762/6122/8788/files/unnamed_6.jpg?v=1761490627',
    'https://cdn.shopify.com/s/files/1/0762/6122/8788/files/unnamed_7.jpg?v=1761490646'
  ],
  variants: TIMELESS_EARRING_VARIANTS
};

export function getAvailableEarringFilters(
  variants: EarringVariant[],
  selectedFilters: Partial<Pick<EarringVariant, 'metalColor' | 'diamondType' | 'caratWeight'>>
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

export function findMatchingEarringVariant(
  variants: EarringVariant[],
  metalColor: string,
  diamondType: string,
  caratWeight: string
): EarringVariant | undefined {
  return variants.find(
    v =>
      v.metalColor === metalColor &&
      v.diamondType === diamondType &&
      v.caratWeight === caratWeight
  );
}

export function formatEarringPrice(variant: EarringVariant | undefined): string {
  if (!variant) return 'Select options';
  if (variant.price === null) return 'Price on Request';
  return `€${variant.price.toLocaleString('nl-NL')}`;
}
