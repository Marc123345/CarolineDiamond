import { useMemo } from 'react';
import { ProcessedProduct } from '../types/shopify';
import { ProductFilters as FilterType } from '../config/filterConfig';

export const useFilterCounts = (products: ProcessedProduct[], currentFilters: FilterType) => {
  return useMemo(() => {
    const counts = {
      ringStyles: {} as Record<string, number>,
      shapes: {} as Record<string, number>,
      metalColors: {} as Record<string, number>,
      stoneTypes: {} as Record<string, number>,
      diamondOrigins: {} as Record<string, number>,
      gemstoneVariants: {} as Record<string, number>,
      ringSizes: {} as Record<string, number>
    };

    products.forEach(product => {
      if (product.tags) {
        product.tags.forEach(tag => {
          const tagLower = tag.toLowerCase();

          if (tagLower.includes('solitaire') || tagLower.includes('halo') || tagLower.includes('side stone')) {
            counts.ringStyles[tag] = (counts.ringStyles[tag] || 0) + 1;
          }

          if (tagLower.includes('round') || tagLower.includes('oval') || tagLower.includes('princess') ||
              tagLower.includes('pear') || tagLower.includes('marquise') || tagLower.includes('emerald') ||
              tagLower.includes('cushion')) {
            counts.shapes[tag] = (counts.shapes[tag] || 0) + 1;
          }

          if (tagLower.includes('white gold') || tagLower.includes('yellow gold') || tagLower.includes('rose gold')) {
            counts.metalColors[tag] = (counts.metalColors[tag] || 0) + 1;
          }

          if (tagLower.includes('diamond') || tagLower.includes('gemstone')) {
            counts.stoneTypes[tag] = (counts.stoneTypes[tag] || 0) + 1;
          }

          if (tagLower.includes('natural') || tagLower.includes('lab-grown') || tagLower.includes('lab grown')) {
            counts.diamondOrigins[tag] = (counts.diamondOrigins[tag] || 0) + 1;
          }

          if (tagLower.includes('sapphire') || tagLower.includes('emerald') ||
              tagLower.includes('ruby') || tagLower.includes('morganite')) {
            counts.gemstoneVariants[tag] = (counts.gemstoneVariants[tag] || 0) + 1;
          }
        });
      }

      product.variants.forEach(variant => {
        if (variant.selectedOptions) {
          const size = variant.selectedOptions['Size'] || variant.selectedOptions['size'];
          if (size && variant.availableForSale) {
            counts.ringSizes[size] = (counts.ringSizes[size] || 0) + 1;
          }
        }
      });
    });

    return counts;
  }, [products]);
};
