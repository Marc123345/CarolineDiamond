import { useMemo } from 'react';
import { ProcessedProduct } from '../types/shopify';
import { 
  ProductFilters as FilterType, 
  RING_STYLES, 
  ALL_SHAPES, 
  METAL_COLORS, 
  DIAMOND_TYPES,
  CARAT_WEIGHTS,
  JEWELRY_CATEGORIES
} from '../config/filterConfig';

export const useFilterCounts = (products: ProcessedProduct[]) => {
  return useMemo(() => {
    const counts = {
      jewelryCategory: {} as Record<string, number>,
      ringStyles: {} as Record<string, number>,
      shapes: {} as Record<string, number>,
      metalColors: {} as Record<string, number>,
      diamondTypes: {} as Record<string, number>,
      caratWeights: {} as Record<string, number>,
      ringSizes: {} as Record<string, number>
    };

    products.forEach(product => {
      const tags = product.tags?.map(t => t.toLowerCase()) || [];
      const productType = (product.productType || '').toLowerCase();

      // 1. Count Jewelry Categories
      JEWELRY_CATEGORIES.forEach(cat => {
        const catLower = cat.toLowerCase();
        if (productType.includes(catLower.replace('s', '')) || tags.includes(catLower)) {
          counts.jewelryCategory[cat] = (counts.jewelryCategory[cat] || 0) + 1;
        }
      });

      // 2. Count Ring Styles (Logic for Side Diamonds)
      if (productType.includes('ring') || tags.includes('rings')) {
        RING_STYLES.forEach(style => {
          const isHalo = tags.includes('halo');
          const isSolitaire = tags.includes('solitaire');
          const hasSideDiamonds = tags.includes('with-side-diamonds');

          if (style === 'Solitaire' && isSolitaire && !hasSideDiamonds) {
            counts.ringStyles[style] = (counts.ringStyles[style] || 0) + 1;
          } else if (style === 'Solitaire + Side Diamonds' && isSolitaire && hasSideDiamonds) {
            counts.ringStyles[style] = (counts.ringStyles[style] || 0) + 1;
          } else if (style === 'Halo' && isHalo && !hasSideDiamonds) {
            counts.ringStyles[style] = (counts.ringStyles[style] || 0) + 1;
          } else if (style === 'Halo + Side Diamonds' && isHalo && hasSideDiamonds) {
            counts.ringStyles[style] = (counts.ringStyles[style] || 0) + 1;
          }
        });
      }

      // 3. Count Shapes (Checks tags like 'pear-diamond')
      ALL_SHAPES.forEach(shape => {
        const shapeLower = shape.toLowerCase();
        if (tags.some(t => t.includes(shapeLower))) {
          counts.shapes[shape] = (counts.shapes[shape] || 0) + 1;
        }
      });

      // 4. Count Metal Colors & Carats (Scanning Variants)
      const seenMetals = new Set<string>();
      const seenTypes = new Set<string>();

      product.variants.forEach(variant => {
        const options = variant.selectedOptions || {};
        
        // Count Metals (Option1 in CSV)
        METAL_COLORS.forEach(color => {
          if (Object.values(options).includes(color) && !seenMetals.has(color)) {
            counts.metalColors[color] = (counts.metalColors[color] || 0) + 1;
            seenMetals.add(color);
          }
        });

        // Count Diamond Types (Option2 in CSV - e.g., 'Lab-Grown 1.00ct')
        DIAMOND_TYPES.forEach(dt => {
          if (Object.values(options).includes(dt.value) && !seenTypes.has(dt.value)) {
            counts.diamondTypes[dt.value] = (counts.diamondTypes[dt.value] || 0) + 1;
            seenTypes.add(dt.value);
          }
        });

        // Count Ring Sizes (Option3 in CSV)
        const size = options['Ring size'] || options['Size'] || options['size'];
        if (size && variant.availableForSale) {
          counts.ringSizes[size] = (counts.ringSizes[size] || 0) + 1;
        }
      });

      // 5. Count Carat Weight Ranges
      CARAT_WEIGHTS.forEach(range => {
        const hasMatch = product.variants.some(v => {
          const opt2 = v.selectedOptions?.['Diamond Type'] || '';
          const match = opt2.match(/(\d+(\.\d+)?)/);
          if (match) {
            const val = parseFloat(match[0]);
            return val >= range.min && (range.max === undefined || val <= range.max);
          }
          return false;
        });
        if (hasMatch) {
          counts.caratWeights[range.label] = (counts.caratWeights[range.label] || 0) + 1;
        }
      });
    });

    return counts;
  }, [products]);
};