/**
 * Product Filtering Logic
 *
 * Pure functions for client-side product filtering.
 * All filtering uses CANONICAL TAG MAPPINGS to ensure consistency
 * between frontend labels and backend Shopify data.
 *
 * Server-side filtering happens via Shopify query for categories and basic tags.
 * Client-side filtering handles shapes, ring styles, and other attributes using
 * canonical mappings that handle variations in tags and variant options.
 */

import type { ProcessedProduct } from '../../types/shopify';
import type { ProductFilters } from '../../config/filterConfig';
import {
  productHasCanonicalMetalColor,
  productMatchesCanonicalRingStyle,
  productHasCanonicalShape,
  productHasCanonicalCarat,
  productHasCanonicalDiamondType,
  productMatchesCanonicalJewelryType,
  type CanonicalMetalColor,
  type CanonicalDiamondType,
} from '../../utils/canonicalTagMapping';

/**
 * Normalizes tag strings for comparison
 */
function normalizeTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-').trim();
}

/**
 * Applies client-side price range filtering
 * Checks both product base price and variant prices
 */
export function applyPriceFilter(
  products: ProcessedProduct[],
  minPrice?: number,
  maxPrice?: number
): ProcessedProduct[] {
  if (minPrice === undefined && maxPrice === undefined) {
    return products;
  }

  return products.filter(product => {
    // Check base product price
    let matchesPrice = true;
    const basePrice = product.price;

    if (minPrice !== undefined && basePrice < minPrice) {
      matchesPrice = false;
    }
    if (maxPrice !== undefined && basePrice > maxPrice) {
      matchesPrice = false;
    }

    // If base price matches, product passes
    if (matchesPrice) return true;

    // Otherwise, check if any variant price matches
    if (product.variants && product.variants.length > 0) {
      return product.variants.some(variant => {
        const variantPrice = typeof variant.price === 'string'
          ? parseFloat(variant.price)
          : variant.price;

        if (minPrice !== undefined && variantPrice < minPrice) {
          return false;
        }
        if (maxPrice !== undefined && variantPrice > maxPrice) {
          return false;
        }
        return true;
      });
    }

    return false;
  });
}

/**
 * Applies client-side shape filtering using canonical mappings
 */
export function applyShapeFilter(
  products: ProcessedProduct[],
  shapes?: string[]
): ProcessedProduct[] {
  if (!shapes || shapes.length === 0) {
    return products;
  }

  return products.filter(product => {
    // Product matches if it matches ANY of the selected shapes
    return shapes.some(shape => productHasCanonicalShape(product, shape));
  });
}

/**
 * Applies client-side ring style filtering using canonical mappings
 */
export function applyRingStyleFilter(
  products: ProcessedProduct[],
  ringStyle?: string
): ProcessedProduct[] {
  if (!ringStyle) {
    return products;
  }

  return products.filter(product => {
    return productMatchesCanonicalRingStyle(product, ringStyle);
  });
}

/**
 * Applies client-side category filtering using canonical mappings
 */
export function applyCategoryFilter(
  products: ProcessedProduct[],
  category?: string
): ProcessedProduct[] {
  if (!category) {
    return products;
  }

  return products.filter(product => {
    return productMatchesCanonicalJewelryType(product, category);
  });
}

/**
 * Applies client-side search text filtering
 */
export function applySearchFilter(
  products: ProcessedProduct[],
  searchText?: string
): ProcessedProduct[] {
  if (!searchText || !searchText.trim()) {
    return products;
  }

  const searchLower = searchText.toLowerCase().trim();

  return products.filter(product => {
    return product.name?.toLowerCase().includes(searchLower) ||
           product.description?.toLowerCase().includes(searchLower) ||
           product.tags?.some(tag => tag.toLowerCase().includes(searchLower));
  });
}

/**
 * Applies client-side metal color filtering using canonical mappings
 * Accepts display names ("Yellow Gold", "Rose Gold", "White Gold")
 * and converts to canonical values ("yellow", "rose", "white")
 */
export function applyMetalColorFilter(
  products: ProcessedProduct[],
  metalColors?: string[]
): ProcessedProduct[] {
  if (!metalColors || metalColors.length === 0) {
    return products;
  }

  return products.filter(product => {
    return metalColors.some(color => {
      // Convert display name to canonical value
      const canonical = color.toLowerCase().replace(/\s*gold$/i, '').trim() as CanonicalMetalColor;
      return productHasCanonicalMetalColor(product, canonical);
    });
  });
}

/**
 * Applies client-side carat weight filtering using canonical mappings
 * Handles numeric values: 0.30, 0.50, 1.00, 1.50
 */
export function applyCaratWeightFilter(
  products: ProcessedProduct[],
  caratWeights?: string[] | number[]
): ProcessedProduct[] {
  if (!caratWeights || caratWeights.length === 0) {
    return products;
  }

  return products.filter(product => {
    return caratWeights.some(carat => {
      // Convert to number if string
      const caratNum = typeof carat === 'number' ? carat : parseFloat(carat);
      return productHasCanonicalCarat(product, caratNum);
    });
  });
}

/**
 * Applies client-side diamond type filtering (Lab-grown vs Natural) using canonical mappings
 */
export function applyDiamondTypeFilter(
  products: ProcessedProduct[],
  diamondType?: string
): ProcessedProduct[] {
  if (!diamondType) {
    return products;
  }

  const typeLower = diamondType.toLowerCase();

  // Determine canonical type
  let canonicalType: CanonicalDiamondType;
  if (typeLower.includes('lab') || typeLower.includes('grown') || typeLower.includes('synthetic')) {
    canonicalType = 'lab-grown';
  } else if (typeLower.includes('natural')) {
    canonicalType = 'natural';
  } else {
    return products; // Unknown type, return all
  }

  return products.filter(product => {
    return productHasCanonicalDiamondType(product, canonicalType);
  });
}

/**
 * Applies client-side side diamonds filtering
 * Independent of ring style for more granular control
 * Handles: "with-side-diamonds", "Halo + Side Diamonds", "Solitaire + Side Diamonds", "no-side-diamonds"
 */
export function applySideDiamondsFilter(
  products: ProcessedProduct[],
  sideDiamonds?: boolean
): ProcessedProduct[] {
  if (sideDiamonds === undefined) {
    return products;
  }

  return products.filter(product => {
    const tags = product.tags?.map(t => normalizeTag(t)) || [];
    const title = product.name?.toLowerCase() || '';

    // Check for presence of side diamonds
    const hasSideDiamonds = tags.some(tag =>
      tag.includes('with-side-diamonds') ||
      tag.includes('side-diamonds') ||
      tag.includes('+-side-diamonds') ||
      tag.includes('+side-diamonds') ||
      tag === 'side-diamonds' ||
      tag === 'halo+-side-diamonds' ||
      tag === 'solitaire+-side-diamonds' ||
      tag === 'halo+side-diamonds' ||
      tag === 'solitaire+side-diamonds'
    ) || title.includes('with side diamonds') ||
         title.includes('+ side diamonds') ||
         title.includes('+side diamonds');

    // Check for explicit absence of side diamonds
    const hasNoSideDiamonds = tags.some(tag =>
      tag.includes('no-side-diamonds') ||
      tag.includes('no side diamonds') ||
      tag.includes('without-side-diamonds')
    ) || title.includes('no side diamonds') ||
         title.includes('without side diamonds');

    if (sideDiamonds) {
      // User wants WITH side diamonds
      return hasSideDiamonds;
    } else {
      // User wants WITHOUT side diamonds
      return hasNoSideDiamonds || !hasSideDiamonds;
    }
  });
}

/**
 * Applies diamond type + carat combined filter
 * Handles: "Lab-Grown 0.50ct", "Lab-Grown 1.00ct", "Lab-Grown 1.50ct", "Natural Diamond"
 */
export function applyDiamondTypeOptionFilter(
  products: ProcessedProduct[],
  diamondTypeOption?: string
): ProcessedProduct[] {
  if (!diamondTypeOption) {
    return products;
  }

  // Parse the option to extract type and carat
  if (diamondTypeOption === 'Natural Diamond') {
    return applyDiamondTypeFilter(products, 'Natural');
  }

  // Lab-Grown options
  const match = diamondTypeOption.match(/Lab-Grown\s+([\d.]+)ct/);
  if (match) {
    const carat = parseFloat(match[1]);
    let filtered = applyDiamondTypeFilter(products, 'Lab-Grown');
    filtered = applyCaratWeightFilter(filtered, [carat]);
    return filtered;
  }

  return products;
}

/**
 * Applies all client-side filters to product list
 */
export function filterProducts(
  products: ProcessedProduct[],
  filters: ProductFilters
): ProcessedProduct[] {
  let filtered = products;

  // Apply category filter (use productType or jewelryCategory)
  filtered = applyCategoryFilter(filtered, filters.productType || filters.jewelryCategory);

  // Apply search filter
  filtered = applySearchFilter(filtered, filters.searchText);

  // Apply ring style filter
  filtered = applyRingStyleFilter(filtered, filters.ringStyle);

  // Apply shape filter
  filtered = applyShapeFilter(filtered, filters.shapes);

  // Apply metal color filter
  filtered = applyMetalColorFilter(filtered, filters.metalColors);

  // Apply combined diamond type + carat filter OR separate filters
  if (filters.diamondTypeOption) {
    filtered = applyDiamondTypeOptionFilter(filtered, filters.diamondTypeOption);
  } else {
    // Apply carat weight filter
    filtered = applyCaratWeightFilter(filtered, filters.caratWeights || filters.specificCarats);
    // Apply diamond type filter
    filtered = applyDiamondTypeFilter(filtered, filters.diamondType);
  }

  // Apply side diamonds filter
  filtered = applySideDiamondsFilter(filtered, filters.sideDiamonds);

  // Apply ring size filter (for rings only)
  if (filters.ringSize) {
    filtered = filtered.filter(product => {
      // Check if product or variants have the requested ring size
      if (product.variants && product.variants.length > 0) {
        return product.variants.some(variant => {
          const sizeOption = variant.selectedOptions?.find(
            opt => opt.name.toLowerCase() === 'size' || opt.name.toLowerCase() === 'ring size'
          );
          return sizeOption?.value === filters.ringSize;
        });
      }
      return false;
    });
  }

  // Apply price filter (should be last as it's most computationally expensive)
  filtered = applyPriceFilter(filtered, filters.minPrice, filters.maxPrice);

  return filtered;
}

/**
 * Gets count of products matching current filters
 */
export function getFilteredCount(
  products: ProcessedProduct[],
  filters: ProductFilters
): number {
  return filterProducts(products, filters).length;
}

/**
 * Sorts products by given sort key
 * (Shopify handles sorting server-side, this is for fallback/client-only scenarios)
 */
export function sortProducts(
  products: ProcessedProduct[],
  sortBy: string
): ProcessedProduct[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);

    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);

    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case 'created':
      // Assuming products have createdAt or similar field
      return sorted.reverse(); // Newest first

    case 'best-selling':
    case 'featured':
    default:
      return sorted; // Use server order
  }
}

/**
 * Searches products by query string
 */
export function searchProducts(
  products: ProcessedProduct[],
  query: string
): ProcessedProduct[] {
  if (!query || !query.trim()) {
    return products;
  }

  const searchTerm = query.toLowerCase().trim();

  return products.filter(product => {
    // Search in name
    if (product.name.toLowerCase().includes(searchTerm)) {
      return true;
    }

    // Search in description
    if (product.description?.toLowerCase().includes(searchTerm)) {
      return true;
    }

    // Search in tags
    if (product.tags?.some(tag => tag.toLowerCase().includes(searchTerm))) {
      return true;
    }

    // Search in category
    if (product.category?.toLowerCase().includes(searchTerm)) {
      return true;
    }

    return false;
  });
}

/**
 * Gets unique values for a filter from product list
 */
export function getUniqueFilterValues<K extends keyof ProcessedProduct>(
  products: ProcessedProduct[],
  field: K
): Array<ProcessedProduct[K]> {
  const values = new Set<ProcessedProduct[K]>();

  products.forEach(product => {
    const value = product[field];
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => values.add(v as ProcessedProduct[K]));
      } else {
        values.add(value);
      }
    }
  });

  return Array.from(values);
}

/**
 * Calculates price range statistics from products
 */
export function getPriceRange(
  products: ProcessedProduct[]
): { min: number; max: number; avg: number } {
  if (products.length === 0) {
    return { min: 0, max: 0, avg: 0 };
  }

  const prices = products.map(p => p.price).filter(p => p > 0);

  if (prices.length === 0) {
    return { min: 0, max: 0, avg: 0 };
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;

  return { min, max, avg };
}
