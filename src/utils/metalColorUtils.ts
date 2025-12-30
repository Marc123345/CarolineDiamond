import { ProcessedProduct } from '../types';
import { MetalColor } from '../config/filterConfig';

// Regex patterns to detect metal colors in text (titles, descriptions)
export const METAL_COLOR_PATTERNS: Record<MetalColor, RegExp[]> = {
  'White Gold': [
    /^white$/i,
    /^white-gold$/i,
    /^whte-gold$/i,
    /18k?\s*white\s*gold/i,
    /white\s*gold\s*18k?/i,
    /wg\s*18k?/i,
    /18k?\s*wg/i,
    /wit\s*goud/i,
  ],
  'Yellow Gold': [
    /^yellow$/i,
    /^yellow-gold$/i,
    /18k?\s*yellow\s*gold/i,
    /yellow\s*gold\s*18k?/i,
    /yg\s*18k?/i,
    /18k?\s*yg/i,
    /geel\s*goud/i,
  ],
  'Rose Gold': [
    /^rose$/i,
    /^rose-gold$/i,
    /^pink$/i,
    /18k?\s*rose\s*gold/i,
    /rose\s*gold\s*18k?/i,
    /18k?\s*pink\s*gold/i,
    /pink\s*gold\s*18k?/i,
    /rg\s*18k?/i,
    /18k?\s*rg/i,
    /roos\s*goud/i,
    /roze\s*goud/i,
  ],
};

// Keywords to look for in Shopify Tags
export const METAL_COLOR_KEYWORDS: Record<MetalColor, string[]> = {
  'White Gold': [
    '18k White Gold', '18K White Gold', 'White Gold 18k', 'White Gold 18K',
    'white gold', 'white-gold', 'whte-gold', 'White', 'white', 'WG',
    'material:white-gold', 'metal:white-gold', 'Wit Goud',
  ],
  'Yellow Gold': [
    '18k Yellow Gold', '18K Yellow Gold', 'Yellow Gold 18k', 'Yellow Gold 18K',
    'yellow gold', 'yellow-gold', 'Yellow', 'yellow', 'YG',
    'material:yellow-gold', 'metal:yellow-gold', 'Geel Goud',
  ],
  'Rose Gold': [
    '18k Rose Gold', '18K Rose Gold', 'Rose Gold 18k', 'Rose Gold 18K',
    '18k Pink Gold', '18K Pink Gold', 'rose gold', 'rose-gold', 'pink gold',
    'Rose', 'rose', 'Pink', 'pink', 'RG',
    'material:rose-gold', 'metal:rose-gold', 'Roos Goud', 'Roze Goud',
  ],
};

// Cache for metal color extraction to improve performance
const metalColorCache = new Map<string, MetalColor | null>();

export function extractMetalColorFromProduct(product: ProcessedProduct): MetalColor | null {
  // Use product ID as cache key for better performance
  const cacheKey = product.id;
  if (metalColorCache.has(cacheKey)) {
    return metalColorCache.get(cacheKey) as MetalColor | null;
  }

  let result: MetalColor | null = null;

  // 1. Check Metafields (using jewelryMaterial as mapped in shopifyHelpers)
  if (product.metafields?.jewelryMaterial) {
    const metalValue = product.metafields.jewelryMaterial.toLowerCase();
    if (metalValue.includes('white')) result = 'White Gold';
    else if (metalValue.includes('yellow')) result = 'Yellow Gold';
    else if (metalValue.includes('rose') || metalValue.includes('pink')) result = 'Rose Gold';
  }

  // 2. Check Name & Description
  if (!result) {
    for (const [color, patterns] of Object.entries(METAL_COLOR_PATTERNS)) {
      if (product.name) {
        for (const pattern of patterns) {
          if (pattern.test(product.name)) {
            result = color as MetalColor;
            break;
          }
        }
        if (result) break;
      }

      if (!result && product.description) {
        for (const pattern of patterns) {
          if (pattern.test(product.description)) {
            result = color as MetalColor;
            break;
          }
        }
        if (result) break;
      }
    }
  }

  // 3. Check Tags
  if (!result && product.tags) {
    for (const tag of product.tags) {
      const tagLower = tag.toLowerCase();
      for (const [color, keywords] of Object.entries(METAL_COLOR_KEYWORDS)) {
        for (const keyword of keywords) {
          if (tagLower === keyword.toLowerCase() || tagLower.includes(keyword.toLowerCase())) {
            result = color as MetalColor;
            break;
          }
        }
        if (result) break;
      }
      if (result) break;
    }
  }

  // Cache the result
  metalColorCache.set(cacheKey, result);
  return result;
}

export function productMatchesMetalColor(
  product: ProcessedProduct,
  metalColor: MetalColor
): boolean {
  // First check if the product level metadata matches
  const extractedColor = extractMetalColorFromProduct(product);
  if (extractedColor === metalColor) {
    return true;
  }

  // Then check specific variants (Crucial for products with multiple metal options)
  if (product.variants) {
    for (const variant of product.variants) {
      if (!variant.selectedOptions) continue;

      // Look for any option key that might represent metal
      const metalOption =
        variant.selectedOptions['Metal'] ||
        variant.selectedOptions['metal'] ||
        variant.selectedOptions['Material'] ||
        variant.selectedOptions['material'] ||
        variant.selectedOptions['Color'] ||
        variant.selectedOptions['color'] ||
        variant.selectedOptions['Metal Color']; // Added 'Metal Color' from your earlier CSV

      if (metalOption) {
        const patterns = METAL_COLOR_PATTERNS[metalColor];
        for (const pattern of patterns) {
          if (pattern.test(metalOption)) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

export function getAvailableMetalColors(products: ProcessedProduct[]): Set<MetalColor> {
  const colors = new Set<MetalColor>();

  products.forEach(product => {
    const color = extractMetalColorFromProduct(product);
    if (color) {
      colors.add(color);
    }

    if (product.variants) {
      product.variants.forEach(variant => {
        if (!variant.selectedOptions) return;

        const metalOption =
          variant.selectedOptions['Metal'] ||
          variant.selectedOptions['metal'] ||
          variant.selectedOptions['Material'] ||
          variant.selectedOptions['material'] ||
          variant.selectedOptions['Metal Color'];

        if (metalOption) {
          for (const [color, patterns] of Object.entries(METAL_COLOR_PATTERNS)) {
            for (const pattern of patterns) {
              if (pattern.test(metalOption)) {
                colors.add(color as MetalColor);
                break;
              }
            }
          }
        }
      });
    }
  });

  return colors;
}

export function getMetalColorDisplayInfo(color: MetalColor): {
  name: string;
  hexColor: string;
  description: string;
} {
  const info = {
    'White Gold': {
      name: '18K White Gold',
      hexColor: '#D4D6D8',
      description: 'Classic, elegant, and timeless',
    },
    'Yellow Gold': {
      name: '18K Yellow Gold',
      hexColor: '#E6BE8A',
      description: 'Traditional, warm, and luxurious',
    },
    'Rose Gold': {
      name: '18K Rose Gold',
      hexColor: '#E8C4B8',
      description: 'Romantic, modern, and unique',
    },
  };

  return info[color];
}

export function getMetalColorCount(
  products: ProcessedProduct[],
  color: MetalColor,
  otherFilters?: { exclude?: MetalColor[] }
): number {
  return products.filter(product => {
    if (otherFilters?.exclude) {
      const extractedColor = extractMetalColorFromProduct(product);
      if (extractedColor && otherFilters.exclude.includes(extractedColor)) {
        return false;
      }
    }
    return productMatchesMetalColor(product, color);
  }).length;
}