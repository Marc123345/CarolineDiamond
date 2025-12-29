/**
 * Product Pricing and Configuration
 *
 * This file contains the comprehensive pricing structure and product specifications
 * for all diamond ring models available in the store.
 */

// Diamond Quality Grades
export interface DiamondQuality {
  color: string;
  clarity: string;
  grade: string; // Combined notation like "D/VS2"
}

export const STANDARD_QUALITY: DiamondQuality = {
  color: 'D',
  clarity: 'VS2',
  grade: 'D/VS2'
};

// Pricing Structure for Lab-Grown Diamonds
export interface PriceTier {
  carat: number;
  quality: DiamondQuality;
  priceEur: number;
  priceInclTax: number;
}

// Solitaire Ring Pricing (Lab-Grown Diamond - No Side Diamonds)
export const SOLITAIRE_NO_SIDE_DIAMONDS_PRICING: PriceTier[] = [
  {
    carat: 0.50,
    quality: STANDARD_QUALITY,
    priceEur: 790,
    priceInclTax: 790
  },
  {
    carat: 1.00,
    quality: STANDARD_QUALITY,
    priceEur: 990,
    priceInclTax: 990
  },
  {
    carat: 1.50,
    quality: STANDARD_QUALITY,
    priceEur: 1250,
    priceInclTax: 1250
  }
];

// Solitaire Ring Pricing (Lab-Grown Diamond - With Side Diamonds)
export const SOLITAIRE_WITH_SIDE_DIAMONDS_PRICING: PriceTier[] = [
  {
    carat: 0.50,
    quality: STANDARD_QUALITY,
    priceEur: 1150,
    priceInclTax: 1150
  },
  {
    carat: 1.00,
    quality: STANDARD_QUALITY,
    priceEur: 1350,
    priceInclTax: 1350
  },
  {
    carat: 1.50,
    quality: STANDARD_QUALITY,
    priceEur: 1610,
    priceInclTax: 1610
  }
];

// Legacy alias for backward compatibility
export const SOLITAIRE_LABGROWN_PRICING = SOLITAIRE_NO_SIDE_DIAMONDS_PRICING;

// Solitaire Oval Ring Pricing (Lab-Grown Diamond)
// Note: Same pricing as round solitaire for lab-grown diamonds
export const SOLITAIRE_OVAL_LABGROWN_PRICING: PriceTier[] = SOLITAIRE_LABGROWN_PRICING;

// Halo Ring Pricing (Lab-Grown Diamond - No Side Diamonds)
export const HALO_NO_SIDE_DIAMONDS_PRICING: PriceTier[] = SOLITAIRE_NO_SIDE_DIAMONDS_PRICING;

// Halo Ring Pricing (Lab-Grown Diamond - With Side Diamonds)
export const HALO_WITH_SIDE_DIAMONDS_PRICING: PriceTier[] = SOLITAIRE_WITH_SIDE_DIAMONDS_PRICING;

// Necklace Pricing (Timeless Diamond Necklace - Lab-Grown)
export const NECKLACE_LABGROWN_PRICING: PriceTier[] = [
  {
    carat: 0.50,
    quality: STANDARD_QUALITY,
    priceEur: 750,
    priceInclTax: 750
  },
  {
    carat: 1.00,
    quality: STANDARD_QUALITY,
    priceEur: 1190,
    priceInclTax: 1190
  }
];

// Earring Pricing (Timeless Diamond Stud Earrings - Lab-Grown)
export const EARRING_LABGROWN_PRICING: PriceTier[] = [
  {
    carat: 0.30,
    quality: STANDARD_QUALITY,
    priceEur: 490,
    priceInclTax: 490
  },
  {
    carat: 0.50,
    quality: STANDARD_QUALITY,
    priceEur: 590,
    priceInclTax: 590
  },
  {
    carat: 1.00,
    quality: STANDARD_QUALITY,
    priceEur: 890,
    priceInclTax: 890
  }
];

// Natural Diamond Pricing
export const NATURAL_DIAMOND_BASE_PRICE = 3000; // Base price in Euros (for rings without side diamonds)
export const NATURAL_DIAMOND_WITH_SIDE_PRICE = 3360; // Base price in Euros (for rings with side diamonds)

// Ring Models Available
export interface RingModel {
  id: string;
  name: string;
  nameNL: string; // Dutch translation
  description: string;
  style: 'Solitaire (Without Side Diamonds)' | 'Solitaire (With Side Diamonds)' | 'Halo (Without Side Diamonds)' | 'Halo (With Side Diamonds)';
  hasSideDiamonds: boolean;
  availableShapes: string[];
  images?: string[];
}

export const RING_MODELS: RingModel[] = [
  {
    id: 'solitaire-princess',
    name: 'Solitaire Ring with Princess Shape Diamond',
    nameNL: 'Solitaire Ring met Princess Geslepen Diamant',
    description: 'Classic timeless solitaire ring with princess cut diamond',
    style: 'Solitaire (Without Side Diamonds)',
    hasSideDiamonds: false,
    availableShapes: ['Princess']
  },
  {
    id: 'solitaire-round',
    name: 'Solitaire Ring with Round Diamond',
    nameNL: 'Solitaire Ring met Ronde Diamant',
    description: 'Classic timeless solitaire ring with round brilliant diamond',
    style: 'Solitaire (Without Side Diamonds)',
    hasSideDiamonds: false,
    availableShapes: ['Round']
  },
  {
    id: 'solitaire-oval',
    name: 'Solitaire Ring with Oval Diamond',
    nameNL: 'Solitaire Ring met Ovale Diamant',
    description: 'Classic timeless solitaire ring with oval diamond',
    style: 'Solitaire (Without Side Diamonds)',
    hasSideDiamonds: false,
    availableShapes: ['Oval']
  },
  {
    id: 'solitaire-round-side',
    name: 'Solitaire Ring with Round Diamond and Side Diamonds',
    nameNL: 'Solitaire Ring met Ronde Diamant en Zijdiamanten',
    description: 'Elegant solitaire ring with round diamond enhanced by side diamonds',
    style: 'Solitaire (With Side Diamonds)',
    hasSideDiamonds: true,
    availableShapes: ['Round']
  },
  {
    id: 'solitaire-emerald-side',
    name: 'Solitaire Ring with Emerald Shape and Side Diamond',
    nameNL: 'Solitaire Ring met Smaragd Geslepen Diamant en Zijdiamant',
    description: 'Sophisticated solitaire ring with emerald cut diamond and side diamonds',
    style: 'Solitaire (With Side Diamonds)',
    hasSideDiamonds: true,
    availableShapes: ['Emerald']
  },
  {
    id: 'halo-cushion-side',
    name: 'Halo Ring with Cushion Diamond and Side Diamonds',
    nameNL: 'Halo Ring met Cushion Diamant en Zijdiamanten',
    description: 'Stunning halo ring with cushion cut diamond surrounded by smaller diamonds',
    style: 'Halo (With Side Diamonds)',
    hasSideDiamonds: true,
    availableShapes: ['Cushion']
  },
  {
    id: 'halo-pear',
    name: 'Halo Ring with Pear Shape Diamond',
    nameNL: 'Halo Ring met Peer Geslepen Diamant',
    description: 'Beautiful halo ring with pear shaped diamond',
    style: 'Halo (Without Side Diamonds)',
    hasSideDiamonds: false,
    availableShapes: ['Pear']
  },
  {
    id: 'halo-side',
    name: 'Halo Ring with Side Diamonds',
    nameNL: 'Halo Ring met Zijdiamanten',
    description: 'Luxurious halo ring with side diamonds on the band',
    style: 'Halo (With Side Diamonds)',
    hasSideDiamonds: true,
    availableShapes: ['Round', 'Oval', 'Princess', 'Cushion', 'Pear', 'Marquise', 'Emerald', 'Heart']
  }
];

// Metal Options (18K Gold)
export interface MetalOption {
  id: string;
  name: string;
  nameNL: string;
  displayName: string;
  hexColor: string;
  karat: number;
}

export const METAL_OPTIONS: MetalOption[] = [
  {
    id: 'white-gold',
    name: 'White Gold',
    nameNL: 'Witgoud',
    displayName: '18K White Gold',
    hexColor: '#E8E8E8',
    karat: 18
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    nameNL: 'Roségoud',
    displayName: '18K Rose Gold',
    hexColor: '#E8C4B8',
    karat: 18
  },
  {
    id: 'yellow-gold',
    name: 'Yellow Gold',
    nameNL: 'Geelgoud',
    displayName: '18K Yellow Gold',
    hexColor: '#FFD700',
    karat: 18
  }
];

// Diamond Origin Options
export interface DiamondOriginOption {
  id: string;
  name: string;
  nameNL: string;
  description: string;
  searchTerms: string[]; // For SEO/search
  certifications: string[];
}

export const DIAMOND_ORIGINS: DiamondOriginOption[] = [
  {
    id: 'natural',
    name: 'Natural Diamond',
    nameNL: 'Natuurlijke Diamant',
    description: 'Mined natural diamonds with full certification',
    searchTerms: ['natural', 'natural diamond', 'mined diamond', 'natuurlijke diamant'],
    certifications: ['HRD', 'IGI', 'GIA']
  },
  {
    id: 'lab-grown',
    name: 'Lab-Grown Diamond',
    nameNL: 'Synthetische Diamant',
    description: 'Lab-grown diamonds with full certification, identical to natural diamonds',
    searchTerms: ['lab-grown', 'synthetic', 'synthetisch', 'lab diamond', 'gekweekte diamant'],
    certifications: ['HRD', 'IGI', 'GIA']
  }
];

// Certification Bodies
export const CERTIFICATIONS = ['HRD', 'IGI', 'GIA'] as const;
export type CertificationBody = typeof CERTIFICATIONS[number];

// Ring Sizes (European sizing)
export const RING_SIZES = [
  '48', '50', '52', '54', '56', '58', '60'
] as const;

// Helper function to get price for specific configuration
export interface PriceQuery {
  model: string;
  carat: number;
  origin: 'natural' | 'lab-grown';
  shape?: string;
  metalColor: string;
  quality?: DiamondQuality;
}

export function getPriceForConfiguration(query: PriceQuery): number | null {
  const { model, carat, origin, shape } = query;

  // Lab-grown pricing
  if (origin === 'lab-grown') {
    // Solitaire round or oval
    if (model.includes('solitaire') && (shape === 'Round' || shape === 'Oval') && !model.includes('side')) {
      const pricing = SOLITAIRE_LABGROWN_PRICING.find(p => p.carat === carat);
      return pricing?.priceInclTax || null;
    }

    // Other lab-grown configurations would go here
    // TODO: Add pricing for other models
  }

  // Natural diamond pricing
  if (origin === 'natural') {
    return NATURAL_DIAMOND_BASE_PRICE;
  }

  return null;
}

// Helper function to generate product title
export function generateProductTitle(
  model: RingModel,
  shape: string,
  metalColor: string,
  origin: 'natural' | 'lab-grown',
  carat?: number
): string {
  const originText = origin === 'natural' ? 'Natural Diamond' : 'Lab-Grown Diamond';
  const caratText = carat ? `${carat}ct ` : '';
  const metalText = METAL_OPTIONS.find(m => m.name === metalColor)?.displayName || metalColor;

  return `${model.name} – ${shape} ${caratText}${originText} – ${metalText}`;
}

// Helper function to generate product slug
export function generateProductSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Product variant configuration
export interface ProductVariant {
  option1: string; // Metal Color
  option2: string; // Diamond Type (carat + origin)
  option3: string; // Ring Size or Shape
  sku?: string;
  price: number;
  compareAtPrice?: number;
  availableForSale: boolean;
}

// Helper to generate all variants for a product
export function generateVariantsForProduct(
  model: RingModel,
  shape: string,
  origin: 'natural' | 'lab-grown'
): ProductVariant[] {
  const variants: ProductVariant[] = [];

  // For each metal color
  METAL_OPTIONS.forEach(metal => {
    // For each carat weight
    const carats = origin === 'lab-grown'
      ? [0.50, 1.00, 1.50]
      : [0.50, 1.00, 1.50, 2.00];

    carats.forEach(carat => {
      const diamondType = origin === 'lab-grown'
        ? `Lab-Grown ${carat}ct`
        : `${carat}ct`;

      // For each ring size
      RING_SIZES.forEach(size => {
        const price = getPriceForConfiguration({
          model: model.id,
          carat,
          origin,
          shape,
          metalColor: metal.name,
        });

        if (price) {
          variants.push({
            option1: metal.name,
            option2: diamondType,
            option3: size,
            sku: `${model.id}-${shape}-${metal.id}-${origin}-${carat}-${size}`.toUpperCase(),
            price,
            availableForSale: true
          });
        }
      });
    });
  });

  return variants;
}

export default {
  RING_MODELS,
  METAL_OPTIONS,
  DIAMOND_ORIGINS,
  RING_SIZES,
  SOLITAIRE_LABGROWN_PRICING,
  SOLITAIRE_NO_SIDE_DIAMONDS_PRICING,
  SOLITAIRE_WITH_SIDE_DIAMONDS_PRICING,
  SOLITAIRE_OVAL_LABGROWN_PRICING,
  HALO_NO_SIDE_DIAMONDS_PRICING,
  HALO_WITH_SIDE_DIAMONDS_PRICING,
  NECKLACE_LABGROWN_PRICING,
  EARRING_LABGROWN_PRICING,
  NATURAL_DIAMOND_BASE_PRICE,
  NATURAL_DIAMOND_WITH_SIDE_PRICE,
  getPriceForConfiguration,
  generateProductTitle,
  generateProductSlug,
  generateVariantsForProduct
};
