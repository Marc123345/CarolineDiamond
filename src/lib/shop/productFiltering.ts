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
import { productMatchesRingStyle } from '../../utils/productTagMatcher';

/**
 * Applies client-side price range filtering
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
    const price = product.price;

    if (minPrice !== undefined && price < minPrice) {
      return false;
    }

    if (maxPrice !== undefined && price > maxPrice) {
      return false;
    }

    return true;
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

    // Check if product matches the category
    return productCategory.includes(categoryLower) ||
           productType.includes(categoryLower) ||
           productTags.some(tag => tag.includes(categoryLower)) ||
           (categoryLower === 'rings' && (productType.includes('ring') || productTags.includes('ring'))) ||
           (categoryLower === 'necklaces' && (productType.includes('necklace') || productTags.includes('necklace'))) ||
           (categoryLower === 'earrings' && (productType.includes('earring') || productTags.includes('earring')));
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

  // Apply price filter
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
