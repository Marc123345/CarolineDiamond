import { useMemo, useRef, useEffect } from 'react';
import { ProcessedProduct } from '../types/shopify';
import { ProductFilters } from '../config/filterConfig';
import { EnhancedFilterCounts, FilterAvailability } from './useEnhancedFilterCounts';

/**
 * Optimized filter counts with aggressive memoization and caching
 * Uses structural hashing to avoid unnecessary recalculations
 */

interface CacheEntry {
  hash: string;
  counts: EnhancedFilterCounts;
  availability: FilterAvailability;
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const countCache = new Map<string, CacheEntry>();

/**
 * Generate a stable hash for products array
 */
function generateProductsHash(products: ProcessedProduct[]): string {
  if (products.length === 0) return 'empty';

  // Use product IDs and length for quick comparison
  const ids = products.slice(0, 5).map(p => p.id).join(',');
  return `${products.length}-${ids}`;
}

/**
 * Generate a stable hash for filters
 */
function generateFiltersHash(filters: ProductFilters): string {
  // Sort keys for consistent hashing
  const sortedEntries = Object.entries(filters)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:${[...value].sort().join(',')}`;
      }
      return `${key}:${value}`;
    });

  return sortedEntries.join('|');
}

/**
 * Check if products array has changed meaningfully
 */
function productsChanged(
  prev: ProcessedProduct[],
  next: ProcessedProduct[]
): boolean {
  if (prev.length !== next.length) return true;
  if (prev.length === 0) return false;

  // Quick check: compare first and last product IDs
  return (
    prev[0]?.id !== next[0]?.id ||
    prev[prev.length - 1]?.id !== next[next.length - 1]?.id
  );
}

/**
 * Optimized filter counting with smart caching
 */
export const useOptimizedFilterCounts = (
  products: ProcessedProduct[],
  currentFilters: ProductFilters
) => {
  const prevProductsRef = useRef<ProcessedProduct[]>([]);
  const prevFiltersRef = useRef<ProductFilters>({});
  const resultRef = useRef<{
    counts: EnhancedFilterCounts;
    availability: FilterAvailability;
  } | null>(null);

  return useMemo(() => {
    const productsHash = generateProductsHash(products);
    const filtersHash = generateFiltersHash(currentFilters);
    const cacheKey = `${productsHash}-${filtersHash}`;

    // Check memory cache first
    const cached = countCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return { counts: cached.counts, availability: cached.availability };
    }

    // Check if we can reuse previous calculation
    if (
      resultRef.current &&
      !productsChanged(prevProductsRef.current, products) &&
      JSON.stringify(prevFiltersRef.current) === JSON.stringify(currentFilters)
    ) {
      return resultRef.current;
    }

    // Calculate counts (expensive operation)
    const startTime = performance.now();
    const result = calculateOptimizedCounts(products, currentFilters);
    const endTime = performance.now();

    if (process.env.NODE_ENV === 'development') {
      console.log(`Filter counts calculated in ${(endTime - startTime).toFixed(2)}ms`);
    }

    // Update caches
    countCache.set(cacheKey, {
      hash: cacheKey,
      counts: result.counts,
      availability: result.availability,
      timestamp: Date.now(),
    });

    // Cleanup old cache entries (keep last 20)
    if (countCache.size > 20) {
      const entries = Array.from(countCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      entries.slice(0, entries.length - 20).forEach(([key]) => {
        countCache.delete(key);
      });
    }

    prevProductsRef.current = products;
    prevFiltersRef.current = currentFilters;
    resultRef.current = result;

    return result;
  }, [products, currentFilters]);
};

/**
 * Optimized count calculation with early exits and batching
 */
function calculateOptimizedCounts(
  products: ProcessedProduct[],
  currentFilters: ProductFilters
): {
  counts: EnhancedFilterCounts;
  availability: FilterAvailability;
} {
  const counts: EnhancedFilterCounts = {
    ringStyles: {},
    shapes: {},
    metalColors: {},
    diamondOrigins: {},
    gemstoneVariants: {},
    caratWeights: {},
    clarityGrades: {},
    certifications: {},
    ringSizes: {},
    priceRanges: {
      'under-1500': 0,
      '1500-3000': 0,
      '3000-5000': 0,
      'over-5000': 0,
    },
    totalProducts: products.length,
  };

  const availability: FilterAvailability = {
    ringStyles: new Set(),
    shapes: new Set(),
    metalColors: new Set(),
    diamondOrigins: new Set(),
    gemstoneVariants: new Set(),
    caratWeights: new Set(),
    clarityGrades: new Set(),
    certifications: new Set(),
    ringSizes: new Set(),
    hasInStock: false,
  };

  // Batch process products
  const BATCH_SIZE = 50;
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, Math.min(i + BATCH_SIZE, products.length));
    processBatch(batch, counts, availability, currentFilters);
  }

  return { counts, availability };
}

/**
 * Process a batch of products
 */
function processBatch(
  products: ProcessedProduct[],
  counts: EnhancedFilterCounts,
  availability: FilterAvailability,
  currentFilters: ProductFilters
): void {
  products.forEach(product => {
    // Skip if product doesn't match base filters
    if (!matchesBaseFilters(product, currentFilters)) {
      return;
    }

    // Process tags (most common attributes)
    if (product.tags) {
      const tagSet = new Set(product.tags.map(t => t.toLowerCase()));

      // Ring styles
      ['Solitaire (Without Side Diamonds)', 'Solitaire (With Side Diamonds)', 'Halo (Without Side Diamonds)', 'Halo (With Side Diamonds)'].forEach(style => {
        const baseStyle = style.split(' (')[0].toLowerCase();
        const hasSideDiamonds = style.includes('With Side Diamonds');
        const tagHasBaseStyle = Array.from(tagSet).some(tag => tag.includes(baseStyle));
        const tagHasSideDiamonds = Array.from(tagSet).some(tag => tag.includes('side-diamonds') || tag.includes('side diamonds'));
        const tagNoSideDiamonds = Array.from(tagSet).some(tag => tag.includes('no-side-diamonds'));

        const matches = tagHasBaseStyle && (
          (hasSideDiamonds && tagHasSideDiamonds) ||
          (!hasSideDiamonds && (tagNoSideDiamonds || !tagHasSideDiamonds))
        );

        if (matches) {
          counts.ringStyles[style] = (counts.ringStyles[style] || 0) + 1;
          availability.ringStyles.add(style);
        }
      });

      // Shapes
      ['Round', 'Oval', 'Princess', 'Pear', 'Marquise', 'Emerald', 'Cushion'].forEach(shape => {
        if (Array.from(tagSet).some(tag => tag.includes(shape.toLowerCase()))) {
          counts.shapes[shape] = (counts.shapes[shape] || 0) + 1;
          availability.shapes.add(shape);
        }
      });

      // Metal colors (check exact matches)
      ['White Gold', 'Yellow Gold', 'Rose Gold'].forEach(metal => {
        if (product.tags.some(tag => tag === metal || tag.toLowerCase() === metal.toLowerCase())) {
          counts.metalColors[metal] = (counts.metalColors[metal] || 0) + 1;
          availability.metalColors.add(metal);
        }
      });
    }

    // Price ranges (quick calculation)
    const price = product.price;
    if (price < 1500) counts.priceRanges['under-1500']++;
    else if (price < 3000) counts.priceRanges['1500-3000']++;
    else if (price < 5000) counts.priceRanges['3000-5000']++;
    else counts.priceRanges['over-5000']++;

    // Check stock availability
    if (product.variants?.some(v => v.availableForSale && (v.quantityAvailable ?? 0) > 0)) {
      availability.hasInStock = true;
    }

    // Ring sizes (from variants)
    product.variants?.forEach(variant => {
      if (variant.availableForSale && variant.selectedOptions) {
        const size = variant.selectedOptions['Size'] || variant.selectedOptions['size'];
        if (size) {
          counts.ringSizes[size] = (counts.ringSizes[size] || 0) + 1;
          availability.ringSizes.add(size);
        }
      }
    });
  });
}

/**
 * Quick base filter matching (minimal checks)
 */
function matchesBaseFilters(
  product: ProcessedProduct,
  filters: ProductFilters
): boolean {
  // Price check (fastest)
  if (filters.minPrice && product.price < filters.minPrice) return false;
  if (filters.maxPrice && product.price > filters.maxPrice) return false;

  // In-stock check
  if (filters.inStockOnly) {
    const hasStock = product.variants?.some(
      v => v.availableForSale && (v.quantityAvailable ?? 0) > 0
    );
    if (!hasStock) return false;
  }

  // Tag-based filters (quick set lookups)
  if (product.tags && product.tags.length > 0) {
    const tagSet = new Set(product.tags.map(t => t.toLowerCase()));

    if (filters.ringStyle && !Array.from(tagSet).some(t => t.includes(filters.ringStyle!.toLowerCase()))) {
      return false;
    }

    if (filters.stoneType && !Array.from(tagSet).some(t => t.includes(filters.stoneType!.toLowerCase()))) {
      return false;
    }
  }

  return true;
}

/**
 * Clear the cache manually
 */
export function clearFilterCountCache(): void {
  countCache.clear();
}

/**
 * Get cache statistics
 */
export function getFilterCountCacheStats(): {
  size: number;
  oldestEntry: number;
  newestEntry: number;
} {
  if (countCache.size === 0) {
    return { size: 0, oldestEntry: 0, newestEntry: 0 };
  }

  const entries = Array.from(countCache.values());
  const timestamps = entries.map(e => e.timestamp);

  return {
    size: countCache.size,
    oldestEntry: Math.min(...timestamps),
    newestEntry: Math.max(...timestamps),
  };
}
