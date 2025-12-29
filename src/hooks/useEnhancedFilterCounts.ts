import { useMemo } from 'react';
import { ProcessedProduct } from '../types/shopify';
import { ProductFilters, RING_STYLES, ALL_SHAPES, METAL_COLORS, DIAMOND_ORIGINS, DIAMOND_TYPES, GEMSTONE_VARIANTS, CARAT_WEIGHTS, CLARITY_GRADES, CERTIFICATIONS } from '../config/filterConfig';
import { productMatchesMetalColor } from '../utils/metalColorUtils';
import { productMatchesCaratWeight, productMatchesClarityGrade, productMatchesCertification } from '../utils/diamondFilterUtils';
import { productMatchesCategory } from '../utils/categoryHelpers';
import { productMatchesRingStyle, productHasMetalColor, productHasDiamondType } from '../utils/productTagMatcher';
import { productMatchesShape } from '../utils/shapeUtils';

export interface EnhancedFilterCounts {
  ringStyles: Record<string, number>;
  shapes: Record<string, number>;
  metalColors: Record<string, number>;
  diamondOrigins: Record<string, number>;
  diamondTypes: Record<string, number>;
  gemstoneVariants: Record<string, number>;
  caratWeights: Record<string, number>;
  clarityGrades: Record<string, number>;
  certifications: Record<string, number>;
  ringSizes: Record<string, number>;
  priceRanges: Record<string, number>;
  totalProducts: number;
}

export interface FilterAvailability {
  ringStyles: Set<string>;
  shapes: Set<string>;
  metalColors: Set<string>;
  diamondOrigins: Set<string>;
  diamondTypes: Set<string>;
  gemstoneVariants: Set<string>;
  caratWeights: Set<string>;
  clarityGrades: Set<string>;
  certifications: Set<string>;
  ringSizes: Set<string>;
  hasInStock: boolean;
}

export const useEnhancedFilterCounts = (
  products: ProcessedProduct[],
  currentFilters: ProductFilters
) => {
  return useMemo(() => {
    const counts: EnhancedFilterCounts = {
      ringStyles: {},
      shapes: {},
      metalColors: {},
      diamondOrigins: {},
      diamondTypes: {},
      gemstoneVariants: {},
      caratWeights: {},
      clarityGrades: {},
      certifications: {},
      ringSizes: {},
      priceRanges: {
        'under-1500': 0,
        '1500-3000': 0,
        '3000-5000': 0,
        'over-5000': 0,
      },
      totalProducts: products.length,
    };

    const availability: FilterAvailability = {
      ringStyles: new Set(),
      shapes: new Set(),
      metalColors: new Set(),
      diamondOrigins: new Set(),
      diamondTypes: new Set(),
      gemstoneVariants: new Set(),
      caratWeights: new Set(),
      clarityGrades: new Set(),
      certifications: new Set(),
      ringSizes: new Set(),
      hasInStock: false,
    };

    const productMatchesBaseFilters = (product: ProcessedProduct, excludeFilters: string[] = []): boolean => {
      if (currentFilters.jewelryCategory && !excludeFilters.includes('jewelryCategory')) {
        if (!productMatchesCategory(product, currentFilters.jewelryCategory)) {
          return false;
        }
      }

      if (currentFilters.ringStyle && !excludeFilters.includes('ringStyle')) {
        if (!productMatchesRingStyle(product, currentFilters.ringStyle)) {
          return false;
        }
      }

      if (currentFilters.shapes && currentFilters.shapes.length > 0 && !excludeFilters.includes('shapes')) {
        const hasShape = currentFilters.shapes.some(shape =>
          productMatchesShape(product, shape)
        );
        if (!hasShape) return false;
      }

      if (currentFilters.metalColors && currentFilters.metalColors.length > 0 && !excludeFilters.includes('metalColors')) {
        const matchesAnyMetal = currentFilters.metalColors.some(metal =>
          productHasMetalColor(product, metal)
        );
        if (!matchesAnyMetal) return false;
      }

      if (currentFilters.stoneType && !excludeFilters.includes('stoneType')) {
        const hasStone = product.tags?.some(tag =>
          tag.toLowerCase().includes(currentFilters.stoneType!.toLowerCase())
        );
        if (!hasStone) return false;
      }

      if (currentFilters.diamondOrigin && !excludeFilters.includes('diamondOrigin')) {
        const hasOrigin = product.tags?.some(tag =>
          tag.toLowerCase().includes(currentFilters.diamondOrigin!.toLowerCase())
        );
        if (!hasOrigin) return false;
      }

      if (currentFilters.gemstoneVariant && !excludeFilters.includes('gemstoneVariant')) {
        const hasVariant = product.tags?.some(tag =>
          tag.toLowerCase().includes(currentFilters.gemstoneVariant!.toLowerCase())
        );
        if (!hasVariant) return false;
      }

      if (currentFilters.minPrice && product.price < currentFilters.minPrice) return false;
      if (currentFilters.maxPrice && product.price > currentFilters.maxPrice) return false;

      if (currentFilters.inStockOnly) {
        const inStock = product.variants?.some(
          v => v.availableForSale && (v.quantityAvailable ?? 0) > 0
        );
        if (!inStock) return false;
      }

      return true;
    };

    const wouldMatch = (product: ProcessedProduct, testFilter: Partial<ProductFilters>): boolean => {
      const combined = { ...currentFilters, ...testFilter };

      if (combined.jewelryCategory) {
        if (!productMatchesCategory(product, combined.jewelryCategory)) {
          return false;
        }
      }

      if (combined.ringStyle) {
        if (!productMatchesRingStyle(product, combined.ringStyle)) {
          return false;
        }
      }

      if (combined.shapes && combined.shapes.length > 0) {
        const hasShape = combined.shapes.some(shape =>
          productMatchesShape(product, shape)
        );
        if (!hasShape) return false;
      }

      if (combined.metalColors && combined.metalColors.length > 0) {
        const matchesAnyMetal = combined.metalColors.some(metal =>
          productHasMetalColor(product, metal)
        );
        if (!matchesAnyMetal) return false;
      }

      if (combined.stoneType) {
        const hasStone = product.tags?.some(tag =>
          tag.toLowerCase().includes(combined.stoneType!.toLowerCase())
        );
        if (!hasStone) return false;
      }

      if (combined.diamondOrigin) {
        const hasOrigin = product.tags?.some(tag =>
          tag.toLowerCase().includes(combined.diamondOrigin!.toLowerCase())
        );
        if (!hasOrigin) return false;
      }

      if (combined.gemstoneVariant) {
        const hasVariant = product.tags?.some(tag =>
          tag.toLowerCase().includes(combined.gemstoneVariant!.toLowerCase())
        );
        if (!hasVariant) return false;
      }

      if (combined.minPrice && product.price < combined.minPrice) return false;
      if (combined.maxPrice && product.price > combined.maxPrice) return false;

      if (combined.inStockOnly) {
        const inStock = product.variants?.some(
          v => v.availableForSale && (v.quantityAvailable ?? 0) > 0
        );
        if (!inStock) return false;
      }

      return true;
    };

    const matchingProducts = products.filter(p => productMatchesBaseFilters(p));

    const productsForRingStyleCount = products.filter(p => productMatchesBaseFilters(p, ['ringStyle']));
    productsForRingStyleCount.forEach(product => {
      RING_STYLES.forEach(style => {
        if (productMatchesRingStyle(product, style)) {
          counts.ringStyles[style] = (counts.ringStyles[style] || 0) + 1;
          availability.ringStyles.add(style);
        }
      });
    });

    const productsForShapeCount = products.filter(p => productMatchesBaseFilters(p, ['shapes']));
    productsForShapeCount.forEach(product => {
      ALL_SHAPES.forEach(shape => {
        if (productMatchesShape(product, shape)) {
          counts.shapes[shape] = (counts.shapes[shape] || 0) + 1;
          availability.shapes.add(shape);
        }
      });
    });

    const productsForMetalColorCount = products.filter(p => productMatchesBaseFilters(p, ['metalColors']));
    productsForMetalColorCount.forEach(product => {
      METAL_COLORS.forEach(metal => {
        if (productHasMetalColor(product, metal)) {
          counts.metalColors[metal] = (counts.metalColors[metal] || 0) + 1;
          availability.metalColors.add(metal);
        }
      });
    });

    matchingProducts.forEach(product => {
      product.tags?.forEach(tag => {
        const tagLower = tag.toLowerCase();

        DIAMOND_ORIGINS.forEach(origin => {
          if (tagLower.includes(origin.toLowerCase())) {
            counts.diamondOrigins[origin] = (counts.diamondOrigins[origin] || 0) + 1;
            availability.diamondOrigins.add(origin);
          }
        });

        GEMSTONE_VARIANTS.forEach(variant => {
          if (tagLower.includes(variant.toLowerCase())) {
            counts.gemstoneVariants[variant] = (counts.gemstoneVariants[variant] || 0) + 1;
            availability.gemstoneVariants.add(variant);
          }
        });
      });

      const simpleDiamondTypes = ['0.50ct', '1.00ct', '1.50ct', 'Natural Diamond'];
      simpleDiamondTypes.forEach(type => {
        if (productHasDiamondType(product, type)) {
          counts.diamondTypes[type] = (counts.diamondTypes[type] || 0) + 1;
          availability.diamondTypes.add(type);
        }
      });

      CARAT_WEIGHTS.forEach(weight => {
        if (productMatchesCaratWeight(product, weight)) {
          counts.caratWeights[weight.label] = (counts.caratWeights[weight.label] || 0) + 1;
          availability.caratWeights.add(weight.label);
        }
      });

      CLARITY_GRADES.forEach(clarity => {
        if (productMatchesClarityGrade(product, clarity)) {
          counts.clarityGrades[clarity] = (counts.clarityGrades[clarity] || 0) + 1;
          availability.clarityGrades.add(clarity);
        }
      });

      CERTIFICATIONS.forEach(cert => {
        if (productMatchesCertification(product, cert)) {
          counts.certifications[cert] = (counts.certifications[cert] || 0) + 1;
          availability.certifications.add(cert);
        }
      });

      product.variants?.forEach(variant => {
        const size = variant.selectedOptions?.['Size'] || variant.selectedOptions?.['size'];
        if (size && variant.availableForSale) {
          counts.ringSizes[size] = (counts.ringSizes[size] || 0) + 1;
          availability.ringSizes.add(size);
        }
      });

      if (product.price < 1500) {
        counts.priceRanges['under-1500']++;
      } else if (product.price < 3000) {
        counts.priceRanges['1500-3000']++;
      } else if (product.price < 5000) {
        counts.priceRanges['3000-5000']++;
      } else {
        counts.priceRanges['over-5000']++;
      }

      const hasStock = product.variants?.some(
        v => v.availableForSale && (v.quantityAvailable ?? 0) > 0
      );
      if (hasStock) {
        availability.hasInStock = true;
      }
    });

    return { counts, availability };
  }, [products, currentFilters]);
};
