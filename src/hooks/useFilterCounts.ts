/**
 * useFilterCounts.ts
 * Calculates how many products match each filter option
 * Used to show dynamic counts in FilterSidebar
 */
import { useMemo } from 'react';
import { ProcessedProduct } from '../types/shopify';
import { ProductFilters, ALL_SHAPES, METAL_COLORS, DIAMOND_TYPES, RING_STYLES, RING_STYLE_TO_TAG, DIAMOND_TYPE_TO_TAG, METAL_DISPLAY_TO_CANONICAL } from '../config/filterConfig';
import { normalizeMetal } from '../utils/metalColorUtils';
import { extractProductShape } from '../utils/shapeUtils';

export interface FilterCounts {
  productTypes: Record<string, number>;
  ringStyles: Record<string, number>;
  shapes: Record<string, number>;
  metalColors: Record<string, number>;
  diamondTypes: Record<string, number>;
  total: number;
}

export function useFilterCounts(
  allProducts: ProcessedProduct[],
  currentFilters: ProductFilters
): FilterCounts {
  return useMemo(() => {
    const counts: FilterCounts = {
      productTypes: {
        'Engagement Ring': 0,
        'Necklace': 0,
        'Earrings': 0,
      },
      ringStyles: {},
      shapes: {},
      metalColors: {},
      diamondTypes: {},
      total: allProducts.length,
    };

    // Initialize all possible values to 0
    ALL_SHAPES.forEach(shape => counts.shapes[shape] = 0);
    METAL_COLORS.forEach(color => counts.metalColors[color] = 0);
    DIAMOND_TYPES.forEach(type => counts.diamondTypes[type] = 0);
    RING_STYLES.forEach(style => counts.ringStyles[style] = 0);

    // Count each product
    allProducts.forEach(product => {
      // Build a test filter that includes current filters
      const testFilter = { ...currentFilters };

      // Product Type counts
      if (!testFilter.productType || testFilter.productType === product.productType) {
        counts.productTypes[product.productType] = (counts.productTypes[product.productType] || 0) + 1;
      }

      // Ring Style counts (only for engagement rings)
      if (product.productType === 'Engagement Ring') {
        RING_STYLES.forEach(style => {
          const tag = RING_STYLE_TO_TAG[style];
          if (product.tags.includes(tag)) {
            // Only count if other filters match
            if (matchesOtherFilters(product, { ...testFilter, ringStyle: undefined })) {
              counts.ringStyles[style] = (counts.ringStyles[style] || 0) + 1;
            }
          }
        });
      }

      // Shape counts (only for rings)
      if (product.productType === 'Engagement Ring') {
        const productShape = extractProductShape(product);
        if (productShape) {
          // Only count if other filters match
          if (matchesOtherFilters(product, { ...testFilter, shapes: undefined })) {
            counts.shapes[productShape] = (counts.shapes[productShape] || 0) + 1;
          }
        }
      }

      // Metal Color counts (check variants)
      const metalSet = new Set<string>();
      product.variants.forEach(variant => {
        const vMetal = normalizeMetal(variant.selectedOptions?.['Metal']);
        if (vMetal) {
          // Map canonical back to display name
          const displayColor = Object.entries(METAL_DISPLAY_TO_CANONICAL).find(
            ([_, canonical]) => canonical === vMetal
          )?.[0];
          if (displayColor) metalSet.add(displayColor);
        }
      });

      metalSet.forEach(color => {
        // Only count if other filters match
        if (matchesOtherFilters(product, { ...testFilter, metalColors: undefined })) {
          counts.metalColors[color] = (counts.metalColors[color] || 0) + 1;
        }
      });

      // Diamond Type counts
      DIAMOND_TYPES.forEach(type => {
        const tag = DIAMOND_TYPE_TO_TAG[type];
        if (product.tags.includes(tag)) {
          // Only count if other filters match
          if (matchesOtherFilters(product, { ...testFilter, diamondType: undefined })) {
            counts.diamondTypes[type] = (counts.diamondTypes[type] || 0) + 1;
          }
        }
      });
    });

    return counts;
  }, [allProducts, currentFilters]);
}

/**
 * Helper to check if a product matches all filters except the one being counted
 */
function matchesOtherFilters(product: ProcessedProduct, filters: ProductFilters): boolean {
  // Product Type
  if (filters.productType && product.productType !== filters.productType) {
    return false;
  }

  // Ring Style
  if (filters.ringStyle) {
    const tag = RING_STYLE_TO_TAG[filters.ringStyle];
    if (!product.tags.includes(tag)) return false;
  }

  // Diamond Type
  if (filters.diamondType) {
    const tag = DIAMOND_TYPE_TO_TAG[filters.diamondType];
    if (!product.tags.includes(tag)) return false;
  }

  // Shapes
  if (filters.shapes && filters.shapes.length > 0) {
    const productShape = extractProductShape(product);
    if (!productShape || !filters.shapes.includes(productShape)) {
      return false;
    }
  }

  // Metal Colors (check if any variant matches)
  if (filters.metalColors && filters.metalColors.length > 0) {
    const hasMatchingMetal = product.variants.some(v => {
      const vMetal = normalizeMetal(v.selectedOptions?.['Metal']);
      return vMetal && filters.metalColors!.includes(vMetal);
    });
    if (!hasMatchingMetal) return false;
  }

  return true;
}
