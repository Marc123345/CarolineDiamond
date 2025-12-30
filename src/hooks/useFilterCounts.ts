import { useMemo } from 'react';
import { ProcessedProduct } from '../types'; // Adjusted to consistent path
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
      // 1. Count Tags
      if (product.tags) {
        product.tags.forEach(tag => {
          const tagLower = tag.toLowerCase();

          // Ring Styles
          if (tagLower.includes('solitaire') || tagLower.includes('halo') || tagLower.includes('side stone')) {
            // We use the raw tag as key, or you could normalize it here if needed
            counts.ringStyles[tag] = (counts.ringStyles[tag] || 0) + 1;
          }

          // Shapes
          if (tagLower.includes('round') || tagLower.includes('oval') || tagLower.includes('princess') ||
              tagLower.includes('pear') || tagLower.includes('marquise') || tagLower.includes('emerald') ||
              tagLower.includes('cushion')) {
            counts.shapes[tag] = (counts.shapes[tag] || 0) + 1;
          }

          // Metal Colors
          if (tagLower.includes('white gold') || tagLower.includes('yellow gold') || tagLower.includes('rose gold')) {
            counts.metalColors[tag] = (counts.metalColors[tag] || 0) + 1;
          }

          // Stone Types
          if (tagLower.includes('diamond') || tagLower.includes('gemstone')) {
            counts.stoneTypes[tag] = (counts.stoneTypes[tag] || 0) + 1;
          }

          // Diamond Origins
          if (tagLower.includes('natural') || tagLower.includes('lab-grown') || tagLower.includes('lab grown')) {
            counts.diamondOrigins[tag] = (counts.diamondOrigins[tag] || 0) + 1;
          }

          // Gemstone Variants
          if (tagLower.includes('sapphire') || tagLower.includes('emerald') ||
              tagLower.includes('ruby') || tagLower.includes('morganite')) {
            counts.gemstoneVariants[tag] = (counts.gemstoneVariants[tag] || 0) + 1;
          }
        });
      }

      // 2. Count Variant Options (Ring Sizes)
      if (product.variants) {
        // We only count sizes for variants that are actually in stock/sellable
        const uniqueSizes = new Set<string>();
        
        product.variants.forEach(variant => {
          if (variant.selectedOptions && variant.availableForSale) {
            const size = variant.selectedOptions['Size'] || 
                         variant.selectedOptions['size'] || 
                         variant.selectedOptions['Ring Size'];
                         
            if (size) uniqueSizes.add(size);
          }
        });

        // Add to global counts (increment once per product to show "Products available in size X")
        // Or remove the Set logic if you want to count total variants
        uniqueSizes.forEach(size => {
          counts.ringSizes[size] = (counts.ringSizes[size] || 0) + 1;
        });
      }
    });

    return counts;
  }, [products]); // Recalculate only when products list changes
};