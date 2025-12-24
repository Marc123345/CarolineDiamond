export interface SolitaireVariant {
  metalColor: 'White Gold' | 'Yellow Gold' | 'Rose Gold';
  diamondType: 'Lab-Grown' | 'Natural';
  caratWeight: '0.50 ct' | '1.00 ct' | '1.50 ct';
  price: number | null;
  shopifyHandle: string;
  variantId?: string;
  available: boolean;
}

export interface SolitaireProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: string[];
  variants: SolitaireVariant[];
}

export const GENERIC_SOLITAIRE_VARIANTS: SolitaireVariant[] = [
  // Lab-Grown 0.50ct variants
  {
    metalColor: 'White Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '0.50 ct',
    price: 790,
    shopifyHandle: '18k-gold-lab-grown-diamond-solitaire-engagement-ring-0-50ct',
    available: true
  },
  {
    metalColor: 'Yellow Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '0.50 ct',
    price: 790,
    shopifyHandle: '18k-gold-lab-grown-diamond-solitaire-engagement-ring-0-50ct',
    available: true
  },
  {
    metalColor: 'Rose Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '0.50 ct',
    price: 790,
    shopifyHandle: '18k-gold-lab-grown-diamond-solitaire-engagement-ring-0-50ct',
    available: true
  },

  // Lab-Grown 1.00ct variants
  {
    metalColor: 'White Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '1.00 ct',
    price: 990,
    shopifyHandle: '18k-gold-lab-grown-diamond-solitaire-engagement-ring-1-00ct',
    available: true
  },
  {
    metalColor: 'Yellow Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '1.00 ct',
    price: 990,
    shopifyHandle: '18k-gold-lab-grown-diamond-solitaire-engagement-ring-1-00ct',
    available: true
  },
  {
    metalColor: 'Rose Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '1.00 ct',
    price: 990,
    shopifyHandle: '18k-gold-lab-grown-diamond-solitaire-engagement-ring-1-00ct',
    available: true
  },

  // Lab-Grown 1.50ct variants
  {
    metalColor: 'White Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '1.50 ct',
    price: 1250,
    shopifyHandle: '18k-gold-lab-grown-diamond-solitaire-engagement-ring-1-50ct',
    available: true
  },
  {
    metalColor: 'Yellow Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '1.50 ct',
    price: 1250,
    shopifyHandle: '18k-gold-lab-grown-diamond-solitaire-engagement-ring-1-50ct',
    available: true
  },
  {
    metalColor: 'Rose Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '1.50 ct',
    price: 1250,
    shopifyHandle: '18k-gold-lab-grown-diamond-solitaire-engagement-ring-1-50ct',
    available: true
  },

  // Natural 0.50ct variants - Price on Request
  {
    metalColor: 'White Gold',
    diamondType: 'Natural',
    caratWeight: '0.50 ct',
    price: null,
    shopifyHandle: 'solitaire-ring-no-side-diamonds',
    available: true
  },
  {
    metalColor: 'Yellow Gold',
    diamondType: 'Natural',
    caratWeight: '0.50 ct',
    price: null,
    shopifyHandle: 'solitaire-ring-no-side-diamonds',
    available: true
  },
  {
    metalColor: 'Rose Gold',
    diamondType: 'Natural',
    caratWeight: '0.50 ct',
    price: null,
    shopifyHandle: 'solitaire-ring-no-side-diamonds',
    available: true
  },

  // Natural 1.00ct variants - Price on Request
  {
    metalColor: 'White Gold',
    diamondType: 'Natural',
    caratWeight: '1.00 ct',
    price: null,
    shopifyHandle: 'solitaire-ring-no-side-diamonds',
    available: true
  },
  {
    metalColor: 'Yellow Gold',
    diamondType: 'Natural',
    caratWeight: '1.00 ct',
    price: null,
    shopifyHandle: 'solitaire-ring-no-side-diamonds',
    available: true
  },
  {
    metalColor: 'Rose Gold',
    diamondType: 'Natural',
    caratWeight: '1.00 ct',
    price: null,
    shopifyHandle: 'solitaire-ring-no-side-diamonds',
    available: true
  },

  // Natural 1.50ct variants - Price on Request
  {
    metalColor: 'White Gold',
    diamondType: 'Natural',
    caratWeight: '1.50 ct',
    price: null,
    shopifyHandle: 'solitaire-ring-no-side-diamonds',
    available: true
  },
  {
    metalColor: 'Yellow Gold',
    diamondType: 'Natural',
    caratWeight: '1.50 ct',
    price: null,
    shopifyHandle: 'solitaire-ring-no-side-diamonds',
    available: true
  },
  {
    metalColor: 'Rose Gold',
    diamondType: 'Natural',
    caratWeight: '1.50 ct',
    price: null,
    shopifyHandle: 'solitaire-ring-no-side-diamonds',
    available: true
  }
];

export const UNIFIED_GENERIC_SOLITAIRE: SolitaireProduct = {
  id: 'generic-solitaire-engagement-ring-unified',
  title: '18K Gold Lab-Grown Diamond Solitaire Engagement Ring',
  handle: 'solitaire-engagement-ring',
  description: `Timeless elegance in its purest form. This classic solitaire engagement ring showcases a brilliant lab-grown diamond set in luxurious 18K gold — the perfect symbol of eternal love.

Available in:
• 18K Yellow Gold
• 18K White Gold
• 18K Rose Gold

Diamond Options:
• Lab-Grown (0.50 ct, 1.00 ct, or 1.50 ct D-VS2)
• Natural (price on request)

Features:
• Classic 4-prong or 6-prong setting
• Comfort-fit band
• IGI-certified diamonds
• Lifetime craftsmanship guarantee

Includes:
• Certificate of authenticity
• Elegant presentation box
• Free worldwide shipping
• Free resizing within first year

Handcrafted in Antwerp, Belgium.`,
  images: [
    'https://cdn.shopify.com/s/files/1/0762/6122/8788/files/unnamed_5.jpg?v=1761490616',
    'https://cdn.shopify.com/s/files/1/0762/6122/8788/files/unnamed_6.jpg?v=1761490627',
    'https://cdn.shopify.com/s/files/1/0762/6122/8788/files/unnamed_7.jpg?v=1761490646'
  ],
  variants: GENERIC_SOLITAIRE_VARIANTS
};

export function getAvailableSolitaireFilters(
  variants: SolitaireVariant[],
  selectedFilters: Partial<Pick<SolitaireVariant, 'metalColor' | 'diamondType' | 'caratWeight'>>
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

export function findMatchingSolitaireVariant(
  variants: SolitaireVariant[],
  metalColor: string,
  diamondType: string,
  caratWeight: string
): SolitaireVariant | undefined {
  return variants.find(
    v =>
      v.metalColor === metalColor &&
      v.diamondType === diamondType &&
      v.caratWeight === caratWeight
  );
}

export function formatSolitairePrice(variant: SolitaireVariant | undefined): string {
  if (!variant) return 'Select options';
  if (variant.price === null) return 'Price on Request';
  return `€${variant.price.toLocaleString('nl-NL')}`;
}
