export interface NecklaceVariant {
  metalColor: 'White Gold' | 'Yellow Gold' | 'Rose Gold';
  diamondType: 'Lab-Grown' | 'Natural';
  caratWeight: '0.50 ct' | '1.00 ct';
  price: number | null;
  shopifyHandle: string;
  variantId?: string;
  available: boolean;
}

export interface NecklaceProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: string[];
  variants: NecklaceVariant[];
}

export const TIMELESS_NECKLACE_VARIANTS: NecklaceVariant[] = [
  // Lab-Grown 0.50ct variants
  {
    metalColor: 'White Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '0.50 ct',
    price: 750,
    shopifyHandle: 'timeless-diamond-necklace-18k-gold-0-50ct',
    available: true
  },
  {
    metalColor: 'Yellow Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '0.50 ct',
    price: 750,
    shopifyHandle: 'timeless-diamond-necklace-18k-gold-0-50ct',
    available: true
  },
  {
    metalColor: 'Rose Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '0.50 ct',
    price: 750,
    shopifyHandle: 'timeless-diamond-necklace-18k-gold-0-50ct',
    available: true
  },

  // Lab-Grown 1.00ct variants
  {
    metalColor: 'White Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '1.00 ct',
    price: 1190,
    shopifyHandle: 'timeless-diamond-necklace-18k-gold-1-00ct',
    available: true
  },
  {
    metalColor: 'Yellow Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '1.00 ct',
    price: 1190,
    shopifyHandle: 'timeless-diamond-necklace-18k-gold-1-00ct',
    available: true
  },
  {
    metalColor: 'Rose Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '1.00 ct',
    price: 1190,
    shopifyHandle: 'timeless-diamond-necklace-18k-gold-1-00ct',
    available: true
  },

  // Natural 0.50ct variants - Price on Request
  {
    metalColor: 'White Gold',
    diamondType: 'Natural',
    caratWeight: '0.50 ct',
    price: null,
    shopifyHandle: 'timeless-diamond-necklace',
    available: true
  },
  {
    metalColor: 'Yellow Gold',
    diamondType: 'Natural',
    caratWeight: '0.50 ct',
    price: null,
    shopifyHandle: 'timeless-diamond-necklace',
    available: true
  },
  {
    metalColor: 'Rose Gold',
    diamondType: 'Natural',
    caratWeight: '0.50 ct',
    price: null,
    shopifyHandle: 'timeless-diamond-necklace',
    available: true
  },

  // Natural 1.00ct variants - Price on Request
  {
    metalColor: 'White Gold',
    diamondType: 'Natural',
    caratWeight: '1.00 ct',
    price: null,
    shopifyHandle: 'timeless-diamond-necklace',
    available: true
  },
  {
    metalColor: 'Yellow Gold',
    diamondType: 'Natural',
    caratWeight: '1.00 ct',
    price: null,
    shopifyHandle: 'timeless-diamond-necklace',
    available: true
  },
  {
    metalColor: 'Rose Gold',
    diamondType: 'Natural',
    caratWeight: '1.00 ct',
    price: null,
    shopifyHandle: 'timeless-diamond-necklace',
    available: true
  }
];

export const UNIFIED_TIMELESS_NECKLACE: NecklaceProduct = {
  id: 'timeless-diamond-necklace-unified',
  title: 'Timeless Diamond Necklace – 18K Gold',
  handle: 'timeless-diamond-necklace',
  description: `A minimalist masterpiece designed for everyday wear. The Timeless Diamond Necklace by Diamonds by CS features a hand-set, brilliant-cut diamond suspended on a delicate 18K gold chain — elegant, versatile, and perfect for gifting.

Available in:
• 18K Yellow Gold
• 18K White Gold
• 18K Rose Gold

Diamond Options:
• Lab-Grown (0.50 ct or 1.00 ct D-VS2)
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
  variants: TIMELESS_NECKLACE_VARIANTS
};

export function getAvailableFilters(
  variants: NecklaceVariant[],
  selectedFilters: Partial<Pick<NecklaceVariant, 'metalColor' | 'diamondType' | 'caratWeight'>>
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

export function findMatchingVariant(
  variants: NecklaceVariant[],
  metalColor: string,
  diamondType: string,
  caratWeight: string
): NecklaceVariant | undefined {
  return variants.find(
    v =>
      v.metalColor === metalColor &&
      v.diamondType === diamondType &&
      v.caratWeight === caratWeight
  );
}

export function formatPrice(variant: NecklaceVariant | undefined): string {
  if (!variant) return 'Select options';
  if (variant.price === null) return 'Price on Request';
  return `€${variant.price.toLocaleString('nl-NL')}`;
}