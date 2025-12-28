import { useMemo, useRef } from 'react';
import { ProcessedProduct } from '../types/shopify';
import { 
  ProductFilters, 
  RING_STYLES, 
  ALL_SHAPES, 
  METAL_COLORS, 
  CARAT_WEIGHTS 
} from '../config/filterConfig';

/**
 * Interface for the count results
 */
export interface EnhancedFilterCounts {
  jewelryCategory: Record<string, number>;
  ringStyles: Record<string, number>;
  shapes: Record<string, number>;
  metalColors: Record<string, number>;
  diamondTypes: Record<string, number>;
  caratWeights: Record<string, number>;
  ringSizes: Record<string, number>;
  priceRanges: Record<string, number>;
  totalProducts: number;
}

interface CacheEntry {
  hash: string;
  result: { counts: EnhancedFilterCounts };
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000;
const countCache = new Map<string, CacheEntry>();

/**
 * Optimized filter counting with structural memoization
 */
export const useOptimizedFilterCounts = (
  products: ProcessedProduct[],
  currentFilters: ProductFilters
) => {
  return useMemo(() => {
    const productsHash = `${products.length}-${products[0]?.id || 'empty'}`;
    const filtersHash = JSON.stringify(currentFilters);
    const cacheKey = `${productsHash}-${filtersHash}`;

    const cached = countCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.result;
    }

    const result = calculateOptimizedCounts(products, currentFilters);

    countCache.set(cacheKey, {
      hash: cacheKey,
      result,
      timestamp: Date.now(),
    });

    return result;
  }, [products, currentFilters]);
};

function calculateOptimizedCounts(
  products: ProcessedProduct[],
  currentFilters: ProductFilters
): { counts: EnhancedFilterCounts } {
  const counts: EnhancedFilterCounts = {
    jewelryCategory: {},
    ringStyles: {},
    shapes: {},
    metalColors: {},
    diamondTypes: {},
    caratWeights: {},
    ringSizes: {},
    priceRanges: {
      'under-1500': 0,
      '1500-3000': 0,
      '3000-5000': 0,
      'over-5000': 0,
    },
    totalProducts: products.length,
  };

  // Process in batches for main-thread responsiveness
  const BATCH_SIZE = 100;
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    processBatch(batch, counts, currentFilters);
  }

  return { counts };
}

function processBatch(
  products: ProcessedProduct[],
  counts: EnhancedFilterCounts,
  currentFilters: ProductFilters
): void {
  products.forEach(product => {
    const tags = product.tags?.map(t => t.toLowerCase()) || [];
    const productType = (product.productType || '').toLowerCase();

    // 1. Style Logic (Solitaire vs Solitaire + Side)
    if (productType.includes('ring') || tags.includes('rings')) {
      const isHalo = tags.includes('halo');
      const isSolitaire = tags.includes('solitaire');
      const hasSideDiamonds = tags.includes('with-side-diamonds');

      RING_STYLES.forEach(style => {
        if (style === 'Solitaire' && isSolitaire && !hasSideDiamonds) counts.ringStyles[style] = (counts.ringStyles[style] || 0) + 1;
        if (style === 'Solitaire + Side Diamonds' && isSolitaire && hasSideDiamonds) counts.ringStyles[style] = (counts.ringStyles[style] || 0) + 1;
        if (style === 'Halo' && isHalo && !hasSideDiamonds) counts.ringStyles[style] = (counts.ringStyles[style] || 0) + 1;
        if (style === 'Halo + Side Diamonds' && isHalo && hasSideDiamonds) counts.ringStyles[style] = (counts.ringStyles[style] || 0) + 1;
      });
    }

    // 2. Shape Logic (Matches 'pear-diamond' etc)
    ALL_SHAPES.forEach(shape => {
      if (tags.some(t => t.includes(shape.toLowerCase()))) {
        counts.shapes[shape] = (counts.shapes[shape] || 0) + 1;
      }
    });

    // 3. Variant Scanning (Metal Color, Diamond Type, Size)
    const seenMetals = new Set<string>();
    const seenCaratRanges = new Set<string>();

    product.variants.forEach(variant => {
      const options = variant.selectedOptions || {};
      
      // Metal Color (Option1)
      METAL_COLORS.forEach(color => {
        if (Object.values(options).includes(color) && !seenMetals.has(color)) {
          counts.metalColors[color] = (counts.metalColors[color] || 0) + 1;
          seenMetals.add(color);
        }
      });

      // Ring Size (Option3)
      const size = options['Ring size'] || options['Size'] || options['size'];
      if (size && variant.availableForSale) {
        counts.ringSizes[size] = (counts.ringSizes[size] || 0) + 1;
      }

      // Carat Weight Ranges (Binning from Option2 strings)
      const diamondTypeStr = options['Diamond Type'] || '';
      const weightMatch = diamondTypeStr.match(/(\d+(\.\d+)?)/);
      if (weightMatch) {
        const weight = parseFloat(weightMatch[0]);
        CARAT_WEIGHTS.forEach(range => {
          if (weight >= range.min && (range.max === undefined || weight <= range.max)) {
            if (!seenCaratRanges.has(range.label)) {
              counts.caratWeights[range.label] = (counts.caratWeights[range.label] || 0) + 1;
              seenCaratRanges.add(range.label);
            }
          }
        });
      }
    });

    // 4. Price Binning
    const price = product.price;
    if (price < 1500) counts.priceRanges['under-1500']++;
    else if (price < 3000) counts.priceRanges['1500-3000']++;
    else if (price < 5000) counts.priceRanges['3000-5000']++;
    else counts.priceRanges['over-5000']++;
  });
}