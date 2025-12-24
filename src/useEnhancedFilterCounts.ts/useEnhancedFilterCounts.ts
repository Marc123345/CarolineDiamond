import { useMemo } from 'react';
import { ProcessedProduct } from '../types/shopify';
import { ProductFilters } from '../config/filterConfig';
import { productMatchesMetalColor } from '../utils/metalColorUtils';
import { productMatchesShape } from '../utils/shapeUtils';
import { productMatchesCategory } from '../utils/categoryHelpers';

/**
 * Hook to calculate how many products match each filter option
 * based on the CURRENTLY selected filters.
 */
export const useEnhancedFilterCounts = (
  products: ProcessedProduct[],
  filters: ProductFilters
) => {
  const counts = useMemo(() => {
    const stats = {
      categories: {} as Record<string, number>,
      ringStyles: {} as Record<string, number>,
      shapes: {} as Record<string, number>,
      metalColors: {} as Record<string, number>,
      caratWeights: {} as Record<string, number>
    };

    products.forEach(product => {
      // 1. Calculate Category Counts
      const category = product.productType || 'Other';
      stats.categories[category] = (stats.categories[category] || 0) + 1;

      // 2. Calculate Ring Style Counts (from tags)
      const styleTag = product.tags?.find(t => 
        ['Solitaire', 'Halo', 'Three Stone', 'Pavé'].includes(t)
      );
      if (styleTag) {
        stats.ringStyles[styleTag] = (stats.ringStyles[styleTag] || 0) + 1;
      }

      // 3. Calculate Shape Counts
      const shapeTag = product.tags?.find(t => 
        ['Round', 'Oval', 'Princess', 'Pear', 'Emerald', 'Cushion'].includes(t)
      );
      if (shapeTag) {
        stats.shapes[shapeTag] = (stats.shapes[shapeTag] || 0) + 1;
      }

      // 4. Calculate Metal Color Counts
      ['White Gold', 'Yellow Gold', 'Rose Gold'].forEach(color => {
        if (productMatchesMetalColor(product, color)) {
          stats.metalColors[color] = (stats.metalColors[color] || 0) + 1;
        }
      });
    });

    return stats;
  }, [products]); // Re-calculate only when the master product list changes

  return { counts };
};