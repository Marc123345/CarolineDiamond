import { useMemo, useRef } from 'react';
import { ProcessedProduct } from '../types'; // Adjusted import to shared types
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
  // Hashing just the first 5 and last 5 IDs + length is usually sufficient for immutability checks
  const head = products.slice(0, 5).map(p => p.id).join(',');
  const tail = products.slice(-5).map(p => p.id).join(',');
  return `${products.length}-${head}-${tail}`;
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

    // 1. Check global memory cache first
    const cached = countCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return { counts: cached.counts, availability: cached.availability };
    }

    // 2. Check if we can reuse the previous local calculation
    if (
      resultRef.current &&
      !productsChanged(prevProductsRef.current, products) &&
      JSON.stringify(prevFiltersRef.current) === JSON.stringify(currentFilters)
    ) {
      return resultRef.current;
    }

    // 3. Calculate counts (expensive operation)
    const startTime = performance.now();
    const result = calculateOptimizedCounts(products, currentFilters);
    const endTime = performance.now();

    if (import.meta.env.DEV) {
      console.log(`Filter counts calculated in ${(endTime - startTime).toFixed(2)}ms`);
    }

    // 4. Update caches
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

  // Batch process products to avoid blocking main thread too long if list is huge
  // (Though in synchronous code this loop runs fully, structure allows for future yielding)
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
    // Skip if product doesn't match base filters (e.g. price range)
    if (!matchesBaseFilters(product, currentFilters)) {
      return;
    }

    // Process tags (most common attributes)
    if (product.tags) {
      const tagSet = new Set(product.tags.map(t => t.toLowerCase()));

      // Ring styles
      ['Solitaire', 'Halo', 'Solitaire + Side Diamonds', 'Halo + Side Diamonds'].forEach(style => {
        if (Array.from(tagSet).some(tag => tag.includes(style.toLowerCase()))) {
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

      // Metal colors
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
        const size = variant.selectedOptions['Size'] || variant.selectedOptions['size'] || variant.selectedOptions['Ring Size'];
        if (size) {
          counts.ringSizes[size] = (counts.ringSizes[size] || 0) + 1;
          availability.ringSizes.add(size);
        }
      }
    });
  });
}

/**
 * Quick base filter matching (minimal checks to filter relevant products for counting)
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

    // If a Ring Style is selected, exclude products that don't match it
    if (filters.ringStyle && !Array.from(tagSet).some(t => t.includes(filters.ringStyle!.toLowerCase()))) {
      return false;
    }

    // If a Stone Type is selected, exclude products that don't match it
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