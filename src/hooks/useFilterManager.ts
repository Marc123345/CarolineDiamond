/**
 * src/hooks/useFilterManager.ts
 * The State Orchestrator for Diamonds By CS
 * FIXED: Improved shape compatibility logic and filter state management
 */
import { useState, useCallback, useMemo } from 'react';
import { ProductFilters, RING_STYLE_TO_TAG, DIAMOND_TYPE_TO_TAG, SHAPES_BY_STYLE, RingStyle, Shape } from '../config/filterConfig';
import { ProcessedProduct, ProductVariant } from '../types/shopify';
import { findVariantByCarat } from '../utils/diamondFilterUtils';
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
    return product.variants.find(variant => {
      // Intersection: Match Metal
      if (filters.metalColors?.length) {
        const vMetal = normalizeMetal(variant.selectedOptions?.['Metal']);
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
    }) || product.variants[0]; // Fallback to first variant if no intersection exists
  }, [filters]);

  // 2. Filtering Logic: AND-based product selection
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      // Product Type Match
      if (filters.productType && product.productType !== filters.productType) return false;

      // Ring Style Match (using canonical tags)
      if (filters.ringStyle) {
        const canonicalTag = RING_STYLE_TO_TAG[filters.ringStyle];
        if (!product.tags.includes(canonicalTag)) return false;
      }

      // Diamond Type Match (Lab vs Natural)
      if (filters.diamondType) {
        const canonicalTag = DIAMOND_TYPE_TO_TAG[filters.diamondType];
        if (!product.tags.includes(canonicalTag)) return false;
      }

      // Search Query Match (Vendor Normalization included)
      if (searchQuery) {
        const search = searchQuery.toLowerCase();
        const vendor = (product.vendor || '').toLowerCase(); // Rule: Normalize Diamonds By CS
        if (!product.name.toLowerCase().includes(search) && !vendor.includes('diamonds by cs')) {
          return false;
        }
      }

      // Intersection Check: Does at least one variant satisfy the active option filters?
      const hasMatchingVariant = product.variants.some(v => {
        const metalMatch = !filters.metalColors?.length || 
          filters.metalColors.includes(normalizeMetal(v.selectedOptions?.['Metal']) || '');
        const caratMatch = !filters.carat || v.selectedOptions?.['Carat'] === filters.carat;
        return metalMatch && caratMatch;
      });

      return hasMatchingVariant;
    });
  }, [initialProducts, filters, searchQuery]);

  // 3. Update Filter (Intelligent Normalization)
  const updateFilter = useCallback((key: keyof ProductFilters, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };

      // Rule: Reset ring-specific filters when switching away from Engagement Ring
      if (key === 'productType' && value !== 'Engagement Ring') {
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
    isSizeVisible: filters.productType === 'Engagement Ring'
  };
};