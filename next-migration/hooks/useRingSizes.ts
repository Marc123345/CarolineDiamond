import { useMemo } from 'react';
import { ProcessedProduct } from '../types/shopify';
import { getRingSizeOption } from '../utils/variantOptionUtils';

export const useRingSizes = (products: ProcessedProduct[]): string[] => {
  return useMemo(() => {
    const sizesSet = new Set<string>();

    products.forEach(product => {
      if (product.metafields?.ringSize) {
        const sizes = product.metafields.ringSize
          .split(/[;,]/)
          .map(s => s.trim())
          .filter(s => s && !s.includes('gid://'));

        sizes.forEach(size => sizesSet.add(size));
      }

      product.variants.forEach(variant => {
        const sizeOption = getRingSizeOption(variant);
        if (sizeOption && !sizeOption.includes('gid://')) {
          sizesSet.add(sizeOption);
        }
      });
    });

    return Array.from(sizesSet)
      .filter(size => {
        const num = parseFloat(size);
        return !isNaN(num) && num >= 40 && num <= 70;
      })
      .sort((a, b) => parseFloat(a) - parseFloat(b));
  }, [products]);
};
