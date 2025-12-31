import { useMemo } from 'react';
import { ProcessedProduct } from '../types'; // Adjusted import path

export const useRingSizes = (products: ProcessedProduct[]): string[] => {
  return useMemo(() => {
    const sizesSet = new Set<string>();

    products.forEach(product => {
      // Check Metafields (often comma-separated list of available sizes)
      if (product.metafields?.ringSize) {
        const sizes = product.metafields.ringSize
          .split(/[;,]/)
          .map(s => s.trim())
          .filter(s => s && !s.includes('gid://'));

        sizes.forEach(size => sizesSet.add(size));
      }

      // Check Variants (actual specific stock items)
      product.variants.forEach(variant => {
        if (variant.selectedOptions) {
          const sizeOption = variant.selectedOptions['Size'] || variant.selectedOptions['size'];
          // Filter out garbage data or invalid strings
          if (sizeOption && !sizeOption.includes('gid://')) {
            sizesSet.add(sizeOption);
          }
        }
      });
    });

    // Sort numerically and filter for valid European ring sizes (approx 40-70)
    return Array.from(sizesSet)
      .filter(size => {
        const num = parseFloat(size);
        return !isNaN(num) && num >= 40 && num <= 70;
      })
      .sort((a, b) => parseFloat(a) - parseFloat(b));
  }, [products]);
};