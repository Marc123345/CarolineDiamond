import { useMemo } from 'react';
import { ProcessedProduct } from '../types';
import { ProductFilters } from '../config/filterConfig';

interface FilterCounts {
  metalColors: Record<string, number>;
  shapes: Record<string, number>;
  caratWeights: Record<string, number>;
  clarityGrades: Record<string, number>;
  certifications: Record<string, number>;
  categories: Record<string, number>;
  [key: string]: Record<string, number>;
}

export function useEnhancedFilterCounts(
  products: ProcessedProduct[],
  currentFilters: ProductFilters
): { counts: FilterCounts } {
  const counts = useMemo(() => {
    const result: FilterCounts = {
      metalColors: {},
      shapes: {},
      caratWeights: {},
      clarityGrades: {},
      certifications: {},
      categories: {},
    };

    products.forEach(product => {
      if (product.tags) {
        product.tags.forEach(tag => {
          const lowerTag = tag.toLowerCase();

          if (lowerTag.includes('gold') || lowerTag.includes('white') || lowerTag.includes('yellow') || lowerTag.includes('rose')) {
            result.metalColors[tag] = (result.metalColors[tag] || 0) + 1;
          }

          if (lowerTag.includes('round') || lowerTag.includes('oval') || lowerTag.includes('princess') ||
              lowerTag.includes('pear') || lowerTag.includes('marquise') || lowerTag.includes('emerald') ||
              lowerTag.includes('cushion') || lowerTag.includes('radiant') || lowerTag.includes('asscher') ||
              lowerTag.includes('heart')) {
            result.shapes[tag] = (result.shapes[tag] || 0) + 1;
          }

          if (lowerTag.match(/\d+\.?\d*\s*ct/)) {
            result.caratWeights[tag] = (result.caratWeights[tag] || 0) + 1;
          }
        });
      }

      if (product.category) {
        result.categories[product.category] = (result.categories[product.category] || 0) + 1;
      }
    });

    return result;
  }, [products, currentFilters]);

  return { counts };
}
