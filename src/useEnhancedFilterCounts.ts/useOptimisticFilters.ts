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
  updateMultipleFilters: (updates: Partial<ProductFilters>) => void;
  resetFilters: () => void;
}

export const useOptimisticFilters = ({
  debounceMs = 300,
  onFiltersChange,
  initialFilters
}: UseOptimisticFiltersOptions): UseOptimisticFiltersReturn => {
  const [optimisticFilters, setOptimisticFilters] = useState<ProductFilters>(initialFilters);
  const [isUpdating, setIsUpdating] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastCommittedFilters = useRef<ProductFilters>(initialFilters);

  // Sync with external filter changes
  useEffect(() => {
    setOptimisticFilters(initialFilters);
    lastCommittedFilters.current = initialFilters;
    setIsUpdating(false);
  }, [initialFilters]);

  const commitFilters = useCallback((filters: ProductFilters) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onFiltersChange(filters);
      lastCommittedFilters.current = filters;
      setIsUpdating(false);
    }, debounceMs);
  }, [debounceMs, onFiltersChange]);

  const updateFilter = useCallback((key: keyof ProductFilters, value: any) => {
    setIsUpdating(true);
    const newFilters = { ...optimisticFilters, [key]: value };

    // Remove undefined values
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k as keyof ProductFilters] === undefined) {
        delete newFilters[k as keyof ProductFilters];
      }
    });

    setOptimisticFilters(newFilters);
    commitFilters(newFilters);
  }, [optimisticFilters, commitFilters]);

  const updateMultipleFilters = useCallback((updates: Partial<ProductFilters>) => {
    setIsUpdating(true);
    const newFilters = { ...optimisticFilters, ...updates };

    // Remove undefined values
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k as keyof ProductFilters] === undefined) {
        delete newFilters[k as keyof ProductFilters];
      }
    });

    setOptimisticFilters(newFilters);
    commitFilters(newFilters);
  }, [optimisticFilters, commitFilters]);

  const resetFilters = useCallback(() => {
    setIsUpdating(true);
    setOptimisticFilters({});
    commitFilters({});
  }, [commitFilters]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    optimisticFilters,
    isUpdating,
    updateFilter,
    updateMultipleFilters,
    resetFilters
  };
};
