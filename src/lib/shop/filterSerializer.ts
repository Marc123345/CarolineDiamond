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
 * FIXED: Uses productType and diamondType to match current schema
 */
export function filtersToSearchParams(
  filters: ProductFilters,
  searchQuery?: string
): URLSearchParams {
  const params = new URLSearchParams();

  // Product Type (jewelryCategory or productType)
  const productType = filters.productType || (filters as any).jewelryCategory;
  if (productType) {
    params.set('category', productType.toLowerCase().replace(/\s+/g, '-'));
  }

  // Ring style
  if (filters.ringStyle) {
    params.set('style', filters.ringStyle.toLowerCase().replace(/\s+/g, '-'));
  }

  // Shapes (only for rings)
  if (filters.shapes && filters.shapes.length > 0) {
    if (!productType || productType === 'Engagement Rings' || productType === 'Engagement Ring') {
      params.set('shape', filters.shapes.join(',').toLowerCase());
    }
  }

  // Metal colors
  if (filters.metalColors && filters.metalColors.length > 0) {
    params.set('metal', filters.metalColors.join(',').toLowerCase());
  }

  // Diamond type (replaces stoneType)
  if (filters.diamondType) {
    params.set('diamond', filters.diamondType.toLowerCase().replace(/\s+/g, '-'));
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
 * FIXED: Robust category parsing and uses current schema
 */
export function searchParamsToFilters(params: URLSearchParams): {
  filters: ProductFilters;
  searchQuery: string;
} {
  const filters: ProductFilters = {};
  const searchQuery = params.get('search') || '';

  // Product Type - handles various formats
  const category = params.get('category');
  if (category) {
    // Normalize: engagement-ring, rings, earrings, necklace
    const normalized = category.toLowerCase().replace(/-/g, ' ');

    if (normalized === 'engagement ring' || normalized === 'engagement rings' || normalized === 'rings') {
      filters.productType = 'Engagement Rings';
    } else if (normalized === 'earrings') {
      filters.productType = 'Earrings';
    } else if (normalized === 'necklace' || normalized === 'necklaces') {
      filters.productType = 'Necklaces';
    }
  }

  // Ring style - handles hyphens and plus signs
  const style = params.get('style');
  if (style) {
    // solitaire-side-diamonds → Solitaire + Side Diamonds
    const parts = style.split('-');
    if (parts.includes('side') && parts.includes('diamonds')) {
      const main = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      filters.ringStyle = `${main} + Side Diamonds`;
    } else {
      filters.ringStyle = parts
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  }

  // Shapes (only if Engagement Rings)
  const shapes = params.get('shape');
  if (shapes && (!filters.productType || filters.productType === 'Engagement Rings' || filters.productType === 'Engagement Ring')) {
    filters.shapes = shapes.split(',').map(s => getCanonicalShape(s.trim()));
  }

  // Metal colors - simplified, just lowercase
  const metal = params.get('metal');
  if (metal) {
    filters.metalColors = metal.split(',').map(m => m.trim());
  }

  // Diamond type
  const diamond = params.get('diamond');
  if (diamond) {
    const normalized = diamond.toLowerCase().replace(/-/g, ' ');
    if (normalized === 'lab grown' || normalized === 'lab-grown') {
      filters.diamondType = 'Lab-Grown';
    } else if (normalized === 'natural' || normalized === 'natural diamond') {
      filters.diamondType = 'Natural';
    }
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
