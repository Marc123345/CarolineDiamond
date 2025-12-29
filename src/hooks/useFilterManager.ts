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
    // If no filters are set, return the first available variant with the lowest price
    const hasFilters = filters.metalColors?.length || filters.carat || filters.ringSize;

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
      // Intersection: Match Metal
      if (filters.metalColors?.length) {
        const vMetal = normalizeMetal(variant.selectedOptions?.['Metal'] || variant.selectedOptions?.['Metal Color']);
        if (!filters.metalColors.includes(vMetal || '')) return false;
      }

      // Intersection: Match Carat
      if (filters.carat) {
        const vCarat = variant.selectedOptions?.['Carat'];
        if (vCarat !== filters.carat) return false;
      }

      // Intersection: Match Ring Size (Only for Engagement Rings)
      if (product.productType === 'Engagement Ring' && filters.ringSize) {
        const vSize = variant.selectedOptions?.['Size'];
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