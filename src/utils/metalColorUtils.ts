import { ProcessedProduct } from '../types/shopify';
import { MetalColor } from '../config/filterConfig';

/**
 * Regex patterns for matching metal colors in titles, tags, and descriptions.
 * Includes Dutch synonyms like 'Wit Goud' and CSV hyphenated tags.
 */
export const METAL_COLOR_PATTERNS: Record<MetalColor, RegExp[]> = {
  'White Gold': [
    /^white$/i,
    /^white-gold$/i,
    /18k?\s*white\s*gold/i,
    /white\s*gold\s*18k?/i,
    /wg\s*18k?/i,
    /wit\s*goud/i,
    /whte-gold/i,
  ],
  'Yellow Gold': [
    /^yellow$/i,
    /^yellow-gold$/i,
    /18k?\s*yellow\s*gold/i,
    /yellow\s*gold\s*18k?/i,
    /yg\s*18k?/i,
    /geel\s*goud/i,
  ],
  'Rose Gold': [
    /^rose$/i,
    /^rose-gold$/i,
    /^pink$/i,
    /18k?\s*rose\s*gold/i,
    /rose\s*gold\s*18k?/i,
    /roos\s*goud/i,
    /roze\s*goud/i,
  ],
};

export const METAL_COLOR_KEYWORDS: Record<MetalColor, string[]> = {
  'White Gold': ['18k White Gold', 'White Gold', 'white-gold', 'WG', 'Wit Goud'],
  'Yellow Gold': ['18k Yellow Gold', 'Yellow Gold', 'yellow-gold', 'YG', 'Geel Goud'],
  'Rose Gold': ['18k Rose Gold', 'Rose Gold', 'rose-gold', 'RG', 'Roos Goud', 'Roze Goud'],
};

const metalColorCache = new Map<string, MetalColor | null>();

/**
 * Extracts metal color by checking product metadata and tags.
 */
export function extractMetalColorFromProduct(product: ProcessedProduct): MetalColor | null {
  const cacheKey = product.id;
  if (metalColorCache.has(cacheKey)) return metalColorCache.get(cacheKey)!;

  let result: MetalColor | null = null;

  // 1. Check Tags (Matches CSV tag style like '18k-gold' + 'white-gold')
  const tags = product.tags?.map(t => t.toLowerCase()) || [];
  for (const [color, patterns] of Object.entries(METAL_COLOR_PATTERNS)) {
    if (tags.some(tag => patterns.some(p => p.test(tag)))) {
      result = color as MetalColor;
      break;
    }
  }

  // 2. Check Title/Description Fallback
  if (!result) {
    const text = `${product.name} ${product.description}`.toLowerCase();
    for (const [color, patterns] of Object.entries(METAL_COLOR_PATTERNS)) {
      if (patterns.some(p => p.test(text))) {
        result = color as MetalColor;
        break;
      }
    }
  }

  metalColorCache.set(cacheKey, result);
  return result;
}

/**
 * Checks if a product matches a metal color.
 * Crucial: Checks the 'Metal Color' variant option used in your CSV.
 */
export function productMatchesMetalColor(
  product: ProcessedProduct,
  metalColor: MetalColor
): boolean {
  // If the whole product is defined by a single metal color (e.g., in tags)
  const extractedColor = extractMetalColorFromProduct(product);
  if (extractedColor === metalColor) return true;

  // Otherwise, check individual variants (matches CSV 'Option1 Value')
  if (product.variants) {
    return product.variants.some(variant => {
      if (!variant.selectedOptions) return false;

      // Matches 'Metal Color' (exact CSV header) or common fallbacks
      const metalOption =
        variant.selectedOptions['Metal Color'] ||
        variant.selectedOptions['Metal'] ||
        variant.selectedOptions['Color'] ||
        variant.selectedOptions['metal'];

      if (metalOption) {
        const patterns = METAL_COLOR_PATTERNS[metalColor];
        return patterns.some(pattern => pattern.test(metalOption));
      }
      return false;
    });
  }

  return false;
}

/**
 * Returns UI display info for the filter chips and product cards.
 */
export function getMetalColorDisplayInfo(color: MetalColor) {
  const info = {
    'White Gold': { name: '18K White Gold', hex: '#D4D6D8' },
    'Yellow Gold': { name: '18K Yellow Gold', hex: '#E6BE8A' },
    'Rose Gold': { name: '18K Rose Gold', hex: '#E8C4B8' },
  };
  return info[color] || { name: color, hex: '#CCCCCC' };
}