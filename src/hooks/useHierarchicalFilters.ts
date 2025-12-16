import { useState, useEffect, useCallback } from 'react';
import { ProductFilters } from '../config/filterConfig';
import {
  getFilterDependencies,
  FilterDependency,
  getDependentFilters
} from '../lib/hierarchicalFilterDb';

interface UseHierarchicalFiltersOptions {
  onFiltersChange?: (filters: ProductFilters) => void;
  enableDependencyTracking?: boolean;
}

export function useHierarchicalFilters(
  initialFilters: ProductFilters = {},
  options: UseHierarchicalFiltersOptions = {}
) {
  const { onFiltersChange, enableDependencyTracking = true } = options;
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [dependencies, setDependencies] = useState<FilterDependency[]>([]);

  useEffect(() => {
    if (enableDependencyTracking) {
      getFilterDependencies().then(setDependencies);
    }
  }, [enableDependencyTracking]);

  const updateFilterWithCascade = useCallback(
    (key: keyof ProductFilters, value: ProductFilters[keyof ProductFilters]) => {
      setFilters(prevFilters => {
        const newFilters = { ...prevFilters, [key]: value };

        if (enableDependencyTracking && dependencies.length > 0) {
          const dependentKeys = getDependentFilters(key, dependencies);

          dependentKeys.forEach(depKey => {
            const filterKey = depKey as keyof ProductFilters;
            newFilters[filterKey] = undefined as any;
          });
        }

        if (onFiltersChange) {
          onFiltersChange(newFilters);
        }

        return newFilters;
      });
    },
    [dependencies, enableDependencyTracking, onFiltersChange]
  );

  const clearFilters = useCallback(() => {
    const emptyFilters: ProductFilters = {};
    setFilters(emptyFilters);
    if (onFiltersChange) {
      onFiltersChange(emptyFilters);
    }
  }, [onFiltersChange]);

  const resetDependentFilters = useCallback(
    (parentKey: keyof ProductFilters) => {
      if (!enableDependencyTracking || dependencies.length === 0) return;

      setFilters(prevFilters => {
        const newFilters = { ...prevFilters };
        const dependentKeys = getDependentFilters(parentKey, dependencies);

        dependentKeys.forEach(depKey => {
          const filterKey = depKey as keyof ProductFilters;
          newFilters[filterKey] = undefined as any;
        });

        if (onFiltersChange) {
          onFiltersChange(newFilters);
        }

        return newFilters;
      });
    },
    [dependencies, enableDependencyTracking, onFiltersChange]
  );

  return {
    filters,
    setFilters,
    updateFilter: updateFilterWithCascade,
    clearFilters,
    resetDependentFilters,
    dependencies
  };
}
