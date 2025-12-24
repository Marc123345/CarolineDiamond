import { useState, useCallback, useRef, useEffect } from 'react';
import { ProductFilters } from '../config/filterConfig';

interface UseOptimisticFiltersOptions {
  debounceMs?: number;
  onFiltersChange: (filters: ProductFilters) => void;
  initialFilters: ProductFilters;
}

/**
 * Hook to handle "Optimistic UI" updates for filters.
 * It updates the local state instantly while debouncing the 
 * expensive parent-state/URL updates.
 */
export const useOptimisticFilters = ({
  debounceMs = 300,
  onFiltersChange,
  initialFilters
}: UseOptimisticFiltersOptions) => {
  // 1. Local optimistic state for instant UI response
  const [optimisticFilters, setOptimisticFilters] = useState<ProductFilters>(initialFilters);
  const [isUpdating, setIsUpdating] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync with external filter changes (e.g., URL params or Breadcrumbs)
  useEffect(() => {
    setOptimisticFilters(initialFilters);
  }, [initialFilters]);

  const updateMultipleFilters = useCallback((updates: Partial<ProductFilters>) => {
    setIsUpdating(true);
    
    setOptimisticFilters(prev => {
      const next = { ...prev, ...updates };
      
      // Clear the existing debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set a new timer to push the changes up after the user stops clicking
      debounceTimer.current = setTimeout(() => {
        onFiltersChange(next);
        setIsUpdating(false);
      }, debounceMs);

      return next;
    });
  }, [onFiltersChange, debounceMs]);

  const updateFilter = useCallback((key: keyof ProductFilters, value: any) => {
    updateMultipleFilters({ [key]: value });
  }, [updateMultipleFilters]);

  const resetFilters = useCallback(() => {
    const emptyFilters: ProductFilters = {};
    setOptimisticFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  }, [onFiltersChange]);

  return {
    optimisticFilters,
    isUpdating,
    updateFilter,
    updateMultipleFilters,
    resetFilters
  };
};