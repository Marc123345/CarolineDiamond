import { useState, useCallback } from 'react';
import { ProductFilters } from '../config/filterConfig';

/**
 * Defines which filters should be reset when a parent filter changes.
 */
const FILTER_DEPENDENCY_MAP: Record<keyof ProductFilters, (keyof ProductFilters)[]> = {
  jewelryCategory: ['ringStyle', 'shapes', 'ringSizes', 'earringType', 'earringBacking', 'chainLength', 'sideDiamonds'],
  ringStyle: ['shapes', 'sideDiamonds'],
  shapes: ['metalColors'],
  diamondOrigin: ['caratWeights', 'diamondTypes'],
  diamondTypes: ['caratWeights'],
  // Price and Search usually don't trigger cascades
  searchText: [],
  minPrice: [],
  maxPrice: [],
  metalColors: []
};

interface UseHierarchicalFiltersOptions {
  onFiltersChange?: (filters: ProductFilters) => void;
}

export function useHierarchicalFilters(
  initialFilters: ProductFilters = {},
  options: UseHierarchicalFiltersOptions = {}
) {
  const { onFiltersChange } = options;
  const [filters, setFiltersState] = useState<ProductFilters>(initialFilters);

  /**
   * Updates a filter and cascades the reset to all dependent child filters.
   */
  const updateFilterWithCascade = useCallback(
    <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
      setFiltersState(prevFilters => {
        const newFilters = { ...prevFilters, [key]: value };

        // 1. Get the list of filters that depend on this one
        const dependents = FILTER_DEPENDENCY_MAP[key] || [];

        // 2. Set all dependent filters to undefined
        dependents.forEach(depKey => {
          delete newFilters[depKey];
        });

        // 3. If the value is being cleared (undefined/null), 
        // we should ensure the cascade still happens.
        if (value === undefined || value === null) {
          delete newFilters[key];
        }

        if (onFiltersChange) {
          onFiltersChange(newFilters);
        }

        return newFilters;
      });
    },
    [onFiltersChange]
  );

  const clearFilters = useCallback(() => {
    const emptyFilters: ProductFilters = {};
    setFiltersState(emptyFilters);
    if (onFiltersChange) {
      onFiltersChange(emptyFilters);
    }
  }, [onFiltersChange]);

  /**
   * Manually trigger a reset of everything below a certain level.
   */
  const resetDependentFilters = useCallback(
    (parentKey: keyof ProductFilters) => {
      setFiltersState(prevFilters => {
        const newFilters = { ...prevFilters };
        const dependents = FILTER_DEPENDENCY_MAP[parentKey] || [];

        dependents.forEach(depKey => {
          delete newFilters[depKey];
        });

        if (onFiltersChange) {
          onFiltersChange(newFilters);
        }

        return newFilters;
      });
    },
    [onFiltersChange]
  );

  return {
    filters,
    setFilters: setFiltersState,
    updateFilter: updateFilterWithCascade,
    clearFilters,
    resetDependentFilters,
    // Exporting the map for UI logic (e.g., greying out disabled steps)
    dependencies: FILTER_DEPENDENCY_MAP
  };
}