/**
 * Product Filtering Logic
 *
 * Pure functions for client-side product filtering.
 * Server-side filtering happens via Shopify query for categories and basic tags.
 * Client-side filtering handles shapes, ring styles, and other attributes that
 * aren't consistently tagged in Shopify.
 */

import type { ProcessedProduct } from '../../types/shopify';
import type { ProductFilters } from '../../config/filterConfig';
import { productMatchesShape } from '../../utils/shapeUtils';
import { productMatchesRingStyle, productHasMetalColor } from '../../utils/productTagMatcher';

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
 * Applies client-side shape filtering
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
    return shapes.some(shape => productMatchesShape(product, shape));
  });
}

/**
 * Applies client-side ring style filtering
 */
export function applyRingStyleFilter(
  products: ProcessedProduct[],
  ringStyle?: string
): ProcessedProduct[] {
  if (!ringStyle) {
    return products;
  }

  return products.filter(product => {
    return productMatchesRingStyle(product, ringStyle as any);
  });
}

/**
 * Applies client-side category filtering
 */
export function applyCategoryFilter(
  products: ProcessedProduct[],
  category?: string
): ProcessedProduct[] {
  if (!category) {
    return products;
  }

  const categoryLower = category.toLowerCase();

  return products.filter(product => {
    const productCategory = product.category?.toLowerCase() || '';
    const productType = product.type?.toLowerCase() || '';
    const productTags = product.tags?.map(t => t.toLowerCase()) || [];
    const productName = product.name?.toLowerCase() || '';

    // Check if product matches the category
    return productCategory.includes(categoryLower) ||
           productType.includes(categoryLower) ||
           productName.includes(categoryLower) ||
           productTags.some(tag => tag.includes(categoryLower)) ||
           (categoryLower === 'rings' && (
             productType.includes('ring') ||
             productName.includes('ring') ||
             productTags.some(t => t.includes('ring') || t.includes('engagement'))
           )) ||
           (categoryLower === 'necklaces' && (
             productType.includes('necklace') ||
             productName.includes('necklace') ||
             productTags.includes('necklace')
           )) ||
           (categoryLower === 'earrings' && (
             productType.includes('earring') ||
             productName.includes('earring') ||
             productTags.includes('earrings') ||
             productTags.includes('earring')
           ));
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
 * Applies client-side metal color filtering
 */
export function applyMetalColorFilter(
  products: ProcessedProduct[],
  metalColors?: string[]
): ProcessedProduct[] {
  if (!metalColors || metalColors.length === 0) {
    return products;
  }

  return products.filter(product => {
    return metalColors.some(color => productHasMetalColor(product, color as any));
  });
}

/**
 * Applies client-side carat weight filtering
 * Checks product tags and variant options for carat weights
 * Handles variations: "0.50ct", "0.50c", "Lab-Grown 0.50ct", "All Lab-Grown 0.50ct"
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
      // Normalize the carat value to just the number part
      const caratStr = typeof carat === 'number' ? carat.toString() : carat;
      const caratNum = caratStr.replace(/[^0-9.]/g, ''); // Extract just "0.50" or "1.00"

      // Create multiple patterns to match
      const patterns = [
        caratNum + 'ct',    // "0.50ct"
        caratNum + 'c',     // "0.50c" (variant without 't')
        'lab-grown ' + caratNum + 'ct',  // "lab-grown 0.50ct"
        'lab-grown' + caratNum + 'ct',   // "lab-grown0.50ct"
        'all lab-grown ' + caratNum + 'ct', // "all lab-grown 0.50ct"
      ];

      // Check tags
      const hasTags = product.tags?.some(tag => {
        const tagNormalized = tag.toLowerCase().replace(/\s+/g, '');
        return patterns.some(pattern => {
          const patternNormalized = pattern.replace(/\s+/g, '');
          return tagNormalized === patternNormalized ||
                 tagNormalized.includes(patternNormalized) ||
                 tagNormalized === caratNum + 'ct' ||
                 tagNormalized === caratNum + 'c';
        });
      });

      if (hasTags) return true;

      // Check variant options (Diamond Type field)
      if (product.variants) {
        return product.variants.some(variant => {
          const diamondType = variant.selectedOptions?.['Diamond Type']?.toLowerCase().replace(/\s+/g, '') || '';
          const title = variant.title?.toLowerCase().replace(/\s+/g, '') || '';

          return patterns.some(pattern => {
            const patternNormalized = pattern.replace(/\s+/g, '');
            return diamondType.includes(patternNormalized) ||
                   title.includes(patternNormalized) ||
                   diamondType.includes(caratNum + 'ct') ||
                   diamondType.includes(caratNum + 'c') ||
                   title.includes(caratNum + 'ct') ||
                   title.includes(caratNum + 'c');
          });
        });
      }

      return false;
    });
  });
}

/**
 * Applies client-side diamond type filtering (Lab-grown vs Natural)
 */
export function applyDiamondTypeFilter(
  products: ProcessedProduct[],
  diamondType?: string
): ProcessedProduct[] {
  if (!diamondType) {
    return products;
  }

  const typeLower = diamondType.toLowerCase();

  return products.filter(product => {
    // Check tags
    const hasTags = product.tags?.some(tag =>
      tag.toLowerCase().includes(typeLower) ||
      (typeLower.includes('lab-grown') && tag.toLowerCase().includes('lab-grown')) ||
      (typeLower.includes('natural') && tag.toLowerCase().includes('natural'))
    );

    if (hasTags) return true;

    // Check variants
    if (product.variants) {
      return product.variants.some(variant => {
        const variantType = variant.selectedOptions?.['Diamond Type']?.toLowerCase() || '';
        const title = variant.title?.toLowerCase() || '';
        return variantType.includes(typeLower) || title.includes(typeLower);
      });
    }

    return false;
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
 * Applies all client-side filters to product list
 */
export function filterProducts(
  products: ProcessedProduct[],
  filters: ProductFilters
): ProcessedProduct[] {
  let filtered = products;

  // Apply category filter
  filtered = applyCategoryFilter(filtered, filters.jewelryCategory);

  // Apply search filter
  filtered = applySearchFilter(filtered, filters.searchText);

  // Apply ring style filter
  filtered = applyRingStyleFilter(filtered, filters.ringStyle);

  // Apply shape filter
  filtered = applyShapeFilter(filtered, filters.shapes);

  // Apply metal color filter
  filtered = applyMetalColorFilter(filtered, filters.metalColors);

  // Apply carat weight filter
  filtered = applyCaratWeightFilter(filtered, filters.caratWeights || filters.specificCarats);

  // Apply diamond type filter
  filtered = applyDiamondTypeFilter(filtered, filters.diamondType);

  // Apply side diamonds filter
  filtered = applySideDiamondsFilter(filtered, filters.sideDiamonds);

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
