import { useState, useEffect, useCallback, useRef } from 'react';
import { ProductFilters } from '../config/filterConfig';

interface UseOptimisticFiltersOptions {
  debounceMs?: number;
  onFiltersChange: (filters: ProductFilters) => void;
  initialFilters: ProductFilters;
}

interface UseOptimisticFiltersReturn {
  optimisticFilters: ProductFilters;
  isUpdating: boolean;
  updateFilter: (key: keyof ProductFilters, value: any) => void;
  toggleArrayFilter: (key: keyof ProductFilters, value: any) => void;
  updateMultipleFilters: (updates: Partial<ProductFilters>) => void;
  resetFilters: () => void;
}

/**
 * Handles cascading resets for the optimistic state to prevent invalid UI combos.
 */
const applyFilterCascades = (filters: ProductFilters, changedKey: keyof ProductFilters): ProductFilters => {
  const newFilters = { ...filters };

  if (changedKey === 'jewelryCategory') {
    delete newFilters.ringStyle;
    delete newFilters.shapes;
    delete newFilters.ringSizes;
    delete newFilters.sideDiamonds;
    delete newFilters.earringType;
  }

  if (changedKey === 'ringStyle') {
    delete newFilters.shapes;
    delete newFilters.sideDiamonds;
  }

  return newFilters;
};

export const useOptimisticFilters = ({
  debounceMs = 300,
  onFiltersChange,
  initialFilters
}: UseOptimisticFiltersOptions): UseOptimisticFiltersReturn => {
  const [optimisticFilters, setOptimisticFilters] = useState<ProductFilters>(initialFilters);
  const [isUpdating, setIsUpdating] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync internal state if external initialFilters change (e.g., navigation)
  useEffect(() => {
    setOptimisticFilters(initialFilters);
    setIsUpdating(false);
  }, [initialFilters]);

  const commitFilters = useCallback((filters: ProductFilters) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      onFiltersChange(filters);
      setIsUpdating(false);
    }, debounceMs);
  }, [debounceMs, onFiltersChange]);

  const updateFilter = useCallback((key: keyof ProductFilters, value: any) => {
    setIsUpdating(true);
    setOptimisticFilters(prev => {
      let next = { ...prev, [key]: value };
      
      // Clean up undefined
      if (value === undefined || value === null) {
        delete next[key];
      }

      // Apply cascading logic (e.g., Category -> Style -> Shape)
      next = applyFilterCascades(next, key);
      
      commitFilters(next);
      return next;
    });
  }, [commitFilters]);

  /**
   * Specifically for multi-select filters like 'shapes' or 'metalColors'
   */
  const toggleArrayFilter = useCallback((key: keyof ProductFilters, value: any) => {
    setIsUpdating(true);
    setOptimisticFilters(prev => {
      const currentArray = (prev[key] as any[]) || [];
      const exists = currentArray.some(item => (item?.id || item) === (value?.id || value));
      
      const newArray = exists
        ? currentArray.filter(item => (item?.id || item) !== (value?.id || value))
        : [...currentArray, value];

      let next = { ...prev, [key]: newArray.length > 0 ? newArray : undefined };
      if (next[key] === undefined) delete next[key];

      next = applyFilterCascades(next, key);
      commitFilters(next);
      return next;
    });
  }, [commitFilters]);

  const updateMultipleFilters = useCallback((updates: Partial<ProductFilters>) => {
    setIsUpdating(true);
    setOptimisticFilters(prev => {
      let next = { ...prev, ...updates };
      
      // Clean up any undefined values in the updates
      Object.keys(updates).forEach(k => {
        if (next[k as keyof ProductFilters] === undefined) {
          delete next[k as keyof ProductFilters];
        }
      });

      // We assume the caller knows what they are doing with multiple updates, 
      // but we still apply generic cascades.
      Object.keys(updates).forEach(k => {
        next = applyFilterCascades(next, k as keyof ProductFilters);
      });

      commitFilters(next);
      return next;
    });
  }, [commitFilters]);

  const resetFilters = useCallback(() => {
    setIsUpdating(true);
    const empty = {};
    setOptimisticFilters(empty);
    commitFilters(empty);
  }, [commitFilters]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  return {
    optimisticFilters,
    isUpdating,
    updateFilter,
    toggleArrayFilter,
    updateMultipleFilters,
    resetFilters
  };
};