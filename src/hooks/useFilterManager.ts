/**
 * src/hooks/useFilterManager.ts
 * The State Orchestrator for Diamonds By CS
 * FIXED: Improved shape compatibility logic and filter state management
 */
import { useState, useCallback, useMemo } from 'react';
import { ProductFilters, SHAPES_BY_STYLE, RingStyle, Shape } from '../config/filterConfig';
import { ProcessedProduct, ProductVariant } from '../types/shopify';
import { filterProducts } from '../lib/shop/productFiltering';
import { normalizeMetal } from '../utils/metalColorUtils';
import { normalizeDiamondType, diamondTypesMatch } from '../utils/diamondTypeUtils';
import { getMetalColorOption, getDiamondTypeOption, getRingSizeOption } from '../utils/variantOptionUtils';

/**
 * Removes shapes that are incompatible with the selected ring style
 * Returns only valid shapes for the current style
 */
const getCompatibleShapes = (shapes: string[] | undefined, ringStyle: string | undefined): string[] | undefined => {
  if (!shapes || shapes.length === 0) return shapes;
  if (!ringStyle) return shapes;

  const allowedShapes = SHAPES_BY_STYLE[ringStyle];
  if (!allowedShapes) return shapes;

  const compatible = shapes.filter(shape => allowedShapes.includes(shape as Shape));
  return compatible.length > 0 ? compatible : undefined;
};

export const useFilterManager = (initialProducts: ProcessedProduct[]) => {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Core Logic: Find the "Active Variant" for a product based on filters
  // Required: Variant filters must intersect, not override.
  const getActiveVariant = useCallback((product: ProcessedProduct): ProductVariant | null => {
    // Check if any variant-level filters are active
    const hasFilters =
      filters.metalColors?.length ||
      filters.diamondTypeOption ||
      filters.carat ||
      filters.caratWeights?.length ||
      filters.specificCarats?.length ||
      filters.ringSize;

    if (!hasFilters) {
      // Return the cheapest available variant for base display
      const availableVariants = product.variants.filter(v => v.availableForSale);
      if (availableVariants.length > 0) {
        return availableVariants.reduce((cheapest, current) =>
          current.price < cheapest.price ? current : cheapest
        );
      }
      return product.variants[0];
    }

    // Find variant matching all active filters
    const matchingVariant = product.variants.find(variant => {
      // Intersection: Match Metal Color
      // Use helper to get metal option (handles "Metal", "Metal Color", "Color" variations)
      if (filters.metalColors?.length) {
        const vMetalRaw = getMetalColorOption(variant);
        const vMetal = normalizeMetal(vMetalRaw);
        if (!vMetal || !filters.metalColors.includes(vMetal)) return false;
      }

      // Intersection: Match Diamond Type + Carat (Combined Option)
      // Use helper to get diamond type option (handles "Diamond Type", "Diamond Type:" variations)
      // Normalize values to handle "All Lab-Grown 0.50ct" vs "Lab-Grown 0.50ct" etc.
      if (filters.diamondTypeOption) {
        const vDiamondTypeRaw = getDiamondTypeOption(variant);
        if (!diamondTypesMatch(vDiamondTypeRaw, filters.diamondTypeOption)) return false;
      }

      // Legacy: Match Carat (if using old single carat filter)
      if (filters.carat) {
        const vCarat = variant.selectedOptions?.['Carat'];
        if (vCarat !== filters.carat) return false;
      }

      // Legacy: Match Carat Weights (if using caratWeights array)
      if (filters.caratWeights?.length) {
        const vDiamondTypeRaw = getDiamondTypeOption(variant);
        const vDiamondType = normalizeDiamondType(vDiamondTypeRaw);
        const matchesCarat = filters.caratWeights.some(w => {
          const caratLabel = w.label || `${w.value}ct`;
          return vDiamondType?.includes(caratLabel);
        });
        if (!matchesCarat) return false;
      }

      // Legacy: Match Specific Carats (if using specificCarats array)
      if (filters.specificCarats?.length) {
        const vDiamondTypeRaw = getDiamondTypeOption(variant);
        const vDiamondType = normalizeDiamondType(vDiamondTypeRaw);
        const matchesCarat = filters.specificCarats.some(carat => {
          return vDiamondType?.includes(`${carat}ct`);
        });
        if (!matchesCarat) return false;
      }

      // Intersection: Match Ring Size (Only for Engagement Rings)
      // Use helper to get ring size option (handles "Ring Size", "Ring size", "Ring Size:" variations)
      if (product.productType === 'Engagement Ring' && filters.ringSize) {
        const vSize = getRingSizeOption(variant);
        if (vSize !== filters.ringSize) return false;
      }

      return true;
    });

    // Return matching variant or first available variant as fallback
    return matchingVariant || product.variants.find(v => v.availableForSale) || product.variants[0];
  }, [filters]);

  // 2. Filtering Logic: Use centralized filtering system
  const filteredProducts = useMemo(() => {
    const filtersWithSearch = { ...filters, searchText: searchQuery };
    return filterProducts(initialProducts, filtersWithSearch);
  }, [initialProducts, filters, searchQuery]);

  // 3. Update Filter (Intelligent Normalization)
  const updateFilter = useCallback((key: keyof ProductFilters, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };

      // Rule: Reset ring-specific filters when switching away from Engagement Rings
      if (key === 'productType' && value !== 'Engagement Rings') {
        delete newFilters.ringSize;
        delete newFilters.ringStyle;
        delete newFilters.shapes; // Shapes only apply to rings
      }

      // Rule: When ringStyle changes, filter out incompatible shapes (don't clear all)
      // This preserves user selection while maintaining compatibility
      if (key === 'ringStyle') {
        newFilters.shapes = getCompatibleShapes(prev.shapes, value);
      }

      // Rule: When shapes are updated, ensure they're compatible with current style
      if (key === 'shapes') {
        newFilters.shapes = getCompatibleShapes(value, prev.ringStyle);
      }

      return newFilters;
    });
  }, []);

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return {
    filters,
    searchQuery,
    setSearchQuery,
    updateFilter,
    clearFilters,
    filteredProducts,
    getActiveVariant, // Required: Use this to update Price + SKU in the Product Card
    isSizeVisible: filters.productType === 'Engagement Rings'
  };
};