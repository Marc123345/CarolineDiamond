/**
 * useShopFilters Hook
 *
 * Single source of truth for shop filter state.
 * Clean, focused, no side effects beyond state updates.
 */

import { useState, useCallback, useMemo } from 'react';
import type { ProductFilters } from '../config/filterConfig';
import { applyFilterChange, cleanFilters } from '../lib/shop/filterRules';

export interface UseShopFiltersResult {
  filters: ProductFilters;
  searchQuery: string;
  setFilters: (filters: ProductFilters) => void;
  setSearchQuery: (query: string) => void;
  updateFilter: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void;
  removeFilter: (key: keyof ProductFilters) => void;
  clearAll: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

export function useShopFilters(
  initialFilters: ProductFilters = {},
  initialSearch: string = ''
): UseShopFiltersResult {
  const [filters, setFiltersState] = useState<ProductFilters>(() => cleanFilters(initialFilters));
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const setFilters = useCallback((newFilters: ProductFilters) => {
    setFiltersState(cleanFilters(newFilters));
  }, []);

  const updateFilter = useCallback(
    <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
      setFiltersState(current => applyFilterChange(current, key, value));
    },
    []
  );

  const removeFilter = useCallback((key: keyof ProductFilters) => {
    setFiltersState(current => {
      const updated = { ...current };
      delete updated[key];
      return cleanFilters(updated);
    });
  }, []);

  const clearAll = useCallback(() => {
    setFiltersState({});
    setSearchQuery('');
  }, []);

  const hasActiveFilters = useMemo(() => {
    return searchQuery.trim() !== '' || Object.keys(filters).length > 0;
  }, [filters, searchQuery]);

  const activeFilterCount = useMemo(() => {
    let count = searchQuery.trim() ? 1 : 0;

    Object.values(filters).forEach(value => {
      if (Array.isArray(value)) {
        count += value.length;
      } else if (value !== undefined && value !== null) {
        count++;
      }
    });

    return count;
  }, [filters, searchQuery]);

  return {
    filters,
    searchQuery,
    setFilters,
    setSearchQuery,
    updateFilter,
    removeFilter,
    clearAll,
    hasActiveFilters,
    activeFilterCount,
  };
}
