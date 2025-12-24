import { useMemo } from 'react';
import { ProcessedProduct } from '../types/shopify';
import { ProductFilters } from '../config/filterConfig';

interface FilterCounts {
  ringStyles: Record<string, number>;
  metalColors: Record<string, number>;
  caratWeights: Record<string, number>;
  clarityGrades: Record<string, number>;
  certifications: Record<string, number>;
  shapes: Record<string, number>;
  ringSizes: Record<string, number>;
  stoneTypes: Record<string, number>;
  origins: Record<string, number>;
  earringTypes: Record<string, number>;
  earringBackings: Record<string, number>;
  chainLengths: Record<string, number>;
}

interface FilterAvailability {
  metalColors: Set<string>;
  ringStyles: Set<string>;
  shapes: Set<string>;
  ringSizes: Set<string>;
  hasInStock: boolean;
}

export function useEnhancedFilterCounts(
  products: ProcessedProduct[],
  filters: ProductFilters
) {
  return useMemo(() => {
    const counts: FilterCounts = {
      ringStyles: {},
      metalColors: {},
      caratWeights: {},
      clarityGrades: {},
      certifications: {},
      shapes: {},
      ringSizes: {},
      stoneTypes: {},
      origins: {},
      earringTypes: {},
      earringBackings: {},
      chainLengths: {}
    };

    const availability: FilterAvailability = {
      metalColors: new Set(),
      ringStyles: new Set(),
      shapes: new Set(),
      ringSizes: new Set(),
      hasInStock: false
    };

    products.forEach(product => {
      const tags = product.tags || [];
      const hasStock = product.totalInventory > 0;

      if (hasStock) {
        availability.hasInStock = true;
      }

      tags.forEach(tag => {
        const tagLower = tag.toLowerCase();

        if (tagLower.includes('style:')) {
          const style = tag.split(':')[1]?.trim();
          if (style) {
            counts.ringStyles[style] = (counts.ringStyles[style] || 0) + 1;
            availability.ringStyles.add(style);
          }
        }

        if (tagLower.includes('metal:') || tagLower.includes('color:')) {
          const metal = tag.split(':')[1]?.trim();
          if (metal) {
            counts.metalColors[metal] = (counts.metalColors[metal] || 0) + 1;
            availability.metalColors.add(metal);
          }
        }

        if (tagLower.includes('shape:')) {
          const shape = tag.split(':')[1]?.trim();
          if (shape) {
            counts.shapes[shape] = (counts.shapes[shape] || 0) + 1;
            availability.shapes.add(shape);
          }
        }

        if (tagLower.includes('size:')) {
          const size = tag.split(':')[1]?.trim();
          if (size) {
            counts.ringSizes[size] = (counts.ringSizes[size] || 0) + 1;
            availability.ringSizes.add(size);
          }
        }

        if (tagLower.includes('carat:')) {
          const carat = tag.split(':')[1]?.trim();
          if (carat) {
            counts.caratWeights[carat] = (counts.caratWeights[carat] || 0) + 1;
          }
        }

        if (tagLower.includes('clarity:')) {
          const clarity = tag.split(':')[1]?.trim();
          if (clarity) {
            counts.clarityGrades[clarity] = (counts.clarityGrades[clarity] || 0) + 1;
          }
        }

        if (tagLower.includes('certification:') || tagLower.includes('cert:')) {
          const cert = tag.split(':')[1]?.trim();
          if (cert) {
            counts.certifications[cert] = (counts.certifications[cert] || 0) + 1;
          }
        }

        if (tagLower.includes('stone:')) {
          const stone = tag.split(':')[1]?.trim();
          if (stone) {
            counts.stoneTypes[stone] = (counts.stoneTypes[stone] || 0) + 1;
          }
        }

        if (tagLower.includes('origin:')) {
          const origin = tag.split(':')[1]?.trim();
          if (origin) {
            counts.origins[origin] = (counts.origins[origin] || 0) + 1;
          }
        }

        if (tagLower.includes('earring-type:')) {
          const type = tag.split(':')[1]?.trim();
          if (type) {
            counts.earringTypes[type] = (counts.earringTypes[type] || 0) + 1;
          }
        }

        if (tagLower.includes('backing:')) {
          const backing = tag.split(':')[1]?.trim();
          if (backing) {
            counts.earringBackings[backing] = (counts.earringBackings[backing] || 0) + 1;
          }
        }

        if (tagLower.includes('chain:') || tagLower.includes('length:')) {
          const length = tag.split(':')[1]?.trim();
          if (length) {
            counts.chainLengths[length] = (counts.chainLengths[length] || 0) + 1;
          }
        }
      });
    });

    return { counts, availability };
  }, [products, filters]);
}
