import { useState, useEffect, useCallback, useRef } from 'react';
import { ProductFilters, JewelryCategory } from '../config/filterConfig';
import {
  debounce,
  saveFiltersToLocalStorage,
  loadFiltersFromLocalStorage,
  generateQueryHash,
  getSessionId,
} from '../utils/filterUtils';
import {
  trackFilterAnalytics,
  getQueryCache,
  setQueryCache,
  updateFilterPerformanceMetrics,
  getDefaultFilterPreset,
} from '../lib/filterDb';
import { useAuth } from '../context/AuthContext';

interface UseFilterManagerOptions {
  enableLocalStorage?: boolean;
  enableAnalytics?: boolean;
  enableCaching?: boolean;
  debounceMs?: number;
}

export const useFilterManager = (
  initialFilters: ProductFilters = {},
  options: UseFilterManagerOptions = {}
) => {
  const {
    enableLocalStorage = true,
    enableAnalytics = true,
    enableCaching = true,
    debounceMs = 300,
  } = options;

  const { user } = useAuth();
  const [filters, setFiltersState] = useState<ProductFilters>(initialFilters);
  const [searchQuery, setSearchQueryState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const queryStartTime = useRef<number>(0);
  const sessionId = getSessionId();

  // Initial load from LocalStorage or User Presets
  useEffect(() => {
    const loadSavedFilters = async () => {
      if (enableLocalStorage) {
        const saved = loadFiltersFromLocalStorage();
        if (saved) {
          setFiltersState(saved.filters);
          if (saved.searchQuery) setSearchQueryState(saved.searchQuery);
          return;
        }
      }

      if (user) {
        const defaultPreset = await getDefaultFilterPreset(user.id);
        if (defaultPreset) setFiltersState(defaultPreset.filters);
      }
    };

    loadSavedFilters();
  }, [user, enableLocalStorage]);

  // Debounced persistence
  const debouncedSaveFilters = useCallback(
    debounce((filterData: ProductFilters, search: string) => {
      if (enableLocalStorage) {
        saveFiltersToLocalStorage(filterData, search);
      }
    }, debounceMs),
    [enableLocalStorage, debounceMs]
  );

  const setFilters = useCallback(
    (newFilters: ProductFilters | ((prev: ProductFilters) => ProductFilters)) => {
      setFiltersState(prev => {
        const updated = typeof newFilters === 'function' ? newFilters(prev) : newFilters;
        debouncedSaveFilters(updated, searchQuery);
        return updated;
      });
    },
    [searchQuery, debouncedSaveFilters]
  );

  const setSearchQuery = useCallback(
    (query: string) => {
      setSearchQueryState(query);
      debouncedSaveFilters(filters, query);
    },
    [filters, debouncedSaveFilters]
  );

  /**
   * Updates a single filter value and handles cascading resets.
   * e.g., Changing category should clear ring styles.
   */
  const updateFilter = useCallback(
    <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
      setFilters(prev => {
        const newFilters = { ...prev };

        // 1. Basic Update/Delete
        if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
          delete newFilters[key];
        } else {
          newFilters[key] = value;
        }

        // 2. Cascade Resets for Category
        if (key === 'jewelryCategory') {
          // Clear everything that is category-specific
          delete newFilters.ringStyle;
          delete newFilters.shapes;
          delete newFilters.ringSizes;
          delete newFilters.earringType;
          delete newFilters.earringBacking;
          delete newFilters.chainLength;
          delete newFilters.sideDiamonds;
        }

        // 3. Cascade Resets for Ring Style
        if (key === 'ringStyle') {
          delete newFilters.shapes;
          delete newFilters.sideDiamonds;
        }

        // 4. Cascade Resets for Stone Type
        if (key === 'stoneType') {
          delete newFilters.diamondOrigin;
          delete newFilters.gemstoneVariant;
          delete newFilters.diamondTypes;
        }

        return newFilters;
      });
    },
    [setFilters]
  );

  const removeFilter = useCallback(
    (key: keyof ProductFilters, value?: any) => {
      setFilters(prev => {
        const newFilters = { ...prev };
        const currentValue = newFilters[key];

        if (Array.isArray(currentValue) && value !== undefined) {
          const filtered = (currentValue as any[]).filter(item => 
            // Handle both primitive values and objects with IDs
            (item?.id || item) !== (value?.id || value)
          );
          
          if (filtered.length === 0) delete newFilters[key];
          else newFilters[key] = filtered as any;
        } else {
          delete newFilters[key];
        }

        return newFilters;
      });
    },
    [setFilters]
  );

  const toggleArrayFilter = useCallback(
    <K extends keyof ProductFilters>(key: K, value: any) => {
      setFilters(prev => {
        const current = (prev[key] as any[]) || [];
        const valueId = value?.id || value;
        
        const exists = current.some(item => (item?.id || item) === valueId);
        
        const newValue = exists
          ? current.filter(item => (item?.id || item) !== valueId)
          : [...current, value];

        return {
          ...prev,
          [key]: newValue.length > 0 ? newValue : undefined,
        };
      });
    },
    [setFilters]
  );

  const clearFilters = useCallback(() => {
    setFiltersState({});
    setSearchQueryState('');
    if (enableLocalStorage) saveFiltersToLocalStorage({}, '');
  }, [enableLocalStorage]);

  // Analytics Helpers
  const startQuery = useCallback(() => {
    queryStartTime.current = Date.now();
    setIsLoading(true);
  }, []);

  const endQuery = useCallback(
    (resultCount: number) => {
      setIsLoading(false);
      if (enableAnalytics) {
        trackFilterAnalytics(sessionId, filters, resultCount, Date.now() - queryStartTime.current, user?.id);
      }
    },
    [filters, enableAnalytics, sessionId, user]
  );

  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    Object.values(filters).forEach(value => {
      if (Array.isArray(value)) count += value.length;
      else if (value !== undefined && value !== null) count++;
    });
    return count;
  }, [filters, searchQuery]);

  return {
    filters,
    searchQuery,
    isLoading,
    setFilters,
    setSearchQuery,
    updateFilter,
    removeFilter,
    toggleArrayFilter,
    clearFilters,
    startQuery,
    endQuery,
    getActiveFilterCount,
    hasActiveFilters: () => getActiveFilterCount() > 0,
  };
};