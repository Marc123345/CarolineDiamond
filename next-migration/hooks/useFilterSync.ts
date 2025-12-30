/**
 * useFilterSync Hook
 *
 * Synchronizes filters with URL search params.
 * Unidirectional: URL → State on mount, State → URL on change.
 * No circular dependencies, no complex guards.
 */

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ProductFilters } from '../config/filterConfig';
import { filtersToSearchParams, searchParamsToFilters, areFiltersEqual } from '../lib/shop/filterSerializer';

export interface UseFilterSyncOptions {
  onFiltersChange: (filters: ProductFilters, searchQuery: string) => void;
  enabled?: boolean;
}

export function useFilterSync(
  filters: ProductFilters,
  searchQuery: string,
  options: UseFilterSyncOptions
): void {
  const { onFiltersChange, enabled = true } = options;
  const [searchParams, setSearchParams] = useSearchParams();
  const isInitialMount = useRef(true);
  const lastSyncedFilters = useRef<ProductFilters>(filters);
  const lastSyncedSearch = useRef(searchQuery);

  // On mount: Load filters from URL if present
  useEffect(() => {
    if (!enabled || !isInitialMount.current) return;

    isInitialMount.current = false;

    const hasURLParams = Array.from(searchParams.keys()).length > 0;

    if (hasURLParams) {
      const { filters: urlFilters, searchQuery: urlSearch } = searchParamsToFilters(searchParams);
      onFiltersChange(urlFilters, urlSearch);
      lastSyncedFilters.current = urlFilters;
      lastSyncedSearch.current = urlSearch;
    } else {
      lastSyncedFilters.current = filters;
      lastSyncedSearch.current = searchQuery;
    }
  }, [enabled]);

  // On filter/search change: Update URL
  useEffect(() => {
    if (!enabled || isInitialMount.current) return;

    // Avoid updating URL if nothing changed
    const filtersChanged = !areFiltersEqual(filters, lastSyncedFilters.current);
    const searchChanged = searchQuery !== lastSyncedSearch.current;

    if (!filtersChanged && !searchChanged) return;

    const newParams = filtersToSearchParams(filters, searchQuery);
    setSearchParams(newParams, { replace: true });

    lastSyncedFilters.current = filters;
    lastSyncedSearch.current = searchQuery;
  }, [filters, searchQuery, enabled, setSearchParams]);
}
