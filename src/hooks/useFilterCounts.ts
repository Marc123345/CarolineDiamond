/**
 * useFilterCounts.ts
 * Calculates how many products match each filter option
 * Used to show dynamic counts in FilterSidebar
 */
import { useMemo } from 'react';
import { ProcessedProduct } from '../types/shopify';
import { ProductFilters, ALL_SHAPES, METAL_COLORS, DIAMOND_TYPES, RING_STYLES } from '../config/filterConfig';
import { productMatchesRingStyle, productMatchesShape, productHasMetalColor, productHasDiamondType } from '../utils/productTagMatcher';
import { productMatchesCategory } from '../utils/categoryHelpers';

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
        'Engagement Rings': 0,
        'Necklaces': 0,
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
      const productTypeCategories = ['Engagement Rings', 'Necklaces', 'Earrings'];
      productTypeCategories.forEach(category => {
        const normalizedCategory = category === 'Engagement Rings' ? 'Rings' : category;
        if (productMatchesCategory(product, normalizedCategory as any)) {
          counts.productTypes[category] = (counts.productTypes[category] || 0) + 1;
        }
      });

      // Ring Style counts (only for engagement rings)
      const isEngagementRings = productMatchesCategory(product, 'Rings');
      if (isEngagementRings) {
        RING_STYLES.forEach(style => {
          if (productMatchesRingStyle(product, style)) {
            // Only count if other filters match
            if (matchesOtherFilters(product, { ...testFilter, ringStyle: undefined })) {
              counts.ringStyles[style] = (counts.ringStyles[style] || 0) + 1;
            }
          }
        });
      }

      // Shape counts (only for rings)
      if (isEngagementRings) {
        ALL_SHAPES.forEach(shape => {
          if (productMatchesShape(product, shape)) {
            // Only count if other filters match
            if (matchesOtherFilters(product, { ...testFilter, shapes: undefined })) {
              counts.shapes[shape] = (counts.shapes[shape] || 0) + 1;
            }
          }
        });
      }

      // Metal Color counts
      METAL_COLORS.forEach(color => {
        if (productHasMetalColor(product, color)) {
          // Only count if other filters match
          if (matchesOtherFilters(product, { ...testFilter, metalColors: undefined })) {
            counts.metalColors[color] = (counts.metalColors[color] || 0) + 1;
          }
        }
      });

      // Diamond Type counts
      DIAMOND_TYPES.forEach(type => {
        if (productHasDiamondType(product, type)) {
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
  // Product Type / Category
  if (filters.productType) {
    const normalizedCategory = filters.productType === 'Engagement Rings' || filters.productType === 'Engagement Ring'
      ? 'Rings'
      : filters.productType;
    if (!productMatchesCategory(product, normalizedCategory as any)) {
      return false;
    }
  }

  // Ring Style
  if (filters.ringStyle) {
    if (!productMatchesRingStyle(product, filters.ringStyle as any)) {
      return false;
    }
  }

  // Diamond Type
  if (filters.diamondType) {
    if (!productHasDiamondType(product, filters.diamondType)) {
      return false;
    }
  }

  // Shapes
  if (filters.shapes && filters.shapes.length > 0) {
    const hasMatchingShape = filters.shapes.some(shape =>
      productMatchesShape(product, shape as any)
    );
    if (!hasMatchingShape) {
      return false;
    }
  }

  // Metal Colors (check if any variant matches)
  if (filters.metalColors && filters.metalColors.length > 0) {
    const hasMatchingMetal = filters.metalColors.some(color =>
      productHasMetalColor(product, color as any)
    );
    if (!hasMatchingMetal) {
      return false;
    }
  }

  return true;
}
