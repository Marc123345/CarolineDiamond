/**
 * Filter Serialization for URL Params
 *
 * Handles conversion between ProductFilters and URL query strings.
 * Pure functions - bidirectional, lossless conversion.
 */

import type { ProductFilters } from '../../config/filterConfig';
import { CARAT_WEIGHTS } from '../../config/filterConfig';
import { getCanonicalShape } from '../../utils/shapeUtils';

/**
 * Serializes filters to URL search params
 */
export function filtersToSearchParams(
  filters: ProductFilters,
  searchQuery?: string
): URLSearchParams {
  const params = new URLSearchParams();

  // Category
  if (filters.jewelryCategory) {
    params.set('category', filters.jewelryCategory.toLowerCase());
  }

  // Ring style
  if (filters.ringStyle) {
    params.set('style', filters.ringStyle.toLowerCase().replace(/\s+/g, '-'));
  }

  // Shapes (only for rings)
  if (filters.shapes && filters.shapes.length > 0) {
    const category = filters.jewelryCategory;
    if (!category || category === 'Rings') {
      params.set('shape', filters.shapes.join(',').toLowerCase());
    }
  }

  // Metal colors
  if (filters.metalColors && filters.metalColors.length > 0) {
    params.set('metal', filters.metalColors.join(',').toLowerCase().replace(/\s+/g, '-'));
  }

  // Stone type
  if (filters.stoneType) {
    params.set('stone', filters.stoneType.toLowerCase());
  }

  // Carat weights
  if (filters.caratWeights && filters.caratWeights.length > 0) {
    params.set('carat', filters.caratWeights.map(w => w.label).join(','));
  }

  // Price range
  if (filters.minPrice !== undefined) {
    params.set('minPrice', filters.minPrice.toString());
  }
  if (filters.maxPrice !== undefined) {
    params.set('maxPrice', filters.maxPrice.toString());
  }

  // In stock only
  if (filters.inStockOnly) {
    params.set('inStock', 'true');
  }

  // Search query
  if (searchQuery && searchQuery.trim()) {
    params.set('search', searchQuery.trim());
  }

  return params;
}

/**
 * Deserializes URL search params to filters
 */
export function searchParamsToFilters(params: URLSearchParams): {
  filters: ProductFilters;
  searchQuery: string;
} {
  const filters: ProductFilters = {};
  const searchQuery = params.get('search') || '';

  // Category
  const category = params.get('category');
  if (category) {
    const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
    if (capitalized === 'Earrings' || capitalized === 'Necklaces' || capitalized === 'Rings') {
      filters.jewelryCategory = capitalized as any;
    }
  }

  // Ring style
  const style = params.get('style');
  if (style) {
    filters.ringStyle = style
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Shapes (only if not Necklaces or Earrings)
  const shapes = params.get('shape');
  if (shapes) {
    const categoryValue = filters.jewelryCategory;
    if (!categoryValue || categoryValue === 'Rings') {
      filters.shapes = shapes.split(',').map(s => getCanonicalShape(s.trim()));
    }
  }

  // Metal colors
  const metal = params.get('metal');
  if (metal) {
    filters.metalColors = metal.split(',').map(m =>
      m
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    );
  }

  // Stone type
  const stone = params.get('stone');
  if (stone) {
    filters.stoneType = stone.charAt(0).toUpperCase() + stone.slice(1);
  }

  // Carat weights
  const carat = params.get('carat');
  if (carat) {
    const caratLabels = carat.split(',');
    const caratWeights = caratLabels
      .map(label => CARAT_WEIGHTS.find(w => w.label === label))
      .filter(Boolean);
    if (caratWeights.length > 0) {
      filters.caratWeights = caratWeights as any;
    }
  }

  // Price range
  const minPrice = params.get('minPrice');
  if (minPrice) {
    const parsed = parseFloat(minPrice);
    if (!isNaN(parsed) && parsed >= 0) {
      filters.minPrice = parsed;
    }
  }

  const maxPrice = params.get('maxPrice');
  if (maxPrice) {
    const parsed = parseFloat(maxPrice);
    if (!isNaN(parsed) && parsed >= 0) {
      filters.maxPrice = parsed;
    }
  }

  // In stock only
  const inStock = params.get('inStock');
  if (inStock === 'true') {
    filters.inStockOnly = true;
  }

  return { filters, searchQuery };
}

/**
 * Checks if two filter objects are equal
 */
export function areFiltersEqual(a: ProductFilters, b: ProductFilters): boolean {
  const keysA = Object.keys(a).sort();
  const keysB = Object.keys(b).sort();

  if (keysA.length !== keysB.length) return false;
  if (keysA.join(',') !== keysB.join(',')) return false;

  for (const key of keysA) {
    const valueA = a[key as keyof ProductFilters];
    const valueB = b[key as keyof ProductFilters];

    if (Array.isArray(valueA) && Array.isArray(valueB)) {
      if (valueA.length !== valueB.length) return false;
      if (JSON.stringify([...valueA].sort()) !== JSON.stringify([...valueB].sort())) {
        return false;
      }
    } else if (valueA !== valueB) {
      return false;
    }
  }

  return true;
}
