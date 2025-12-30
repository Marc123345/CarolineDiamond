import { useState, useEffect, useCallback, useRef } from 'react';
import { ProductFilters } from '../config/filterConfig';
// IMPORT FIX: Pointing to the file we created in the previous step
import {
  debounce,
  saveFiltersToLocalStorage,
  loadFiltersFromLocalStorage,
  generateQueryHash,
  getSessionId,
} from '../utils/uiHelpers'; 

// IMPORT FIX: Using stubs (defined below) if you don't have these files yet
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
  // @ts-ignore
  const sessionId = getSessionId();

  useEffect(() => {
    const loadSavedFilters = async () => {
      if (enableLocalStorage) {
        const saved = loadFiltersFromLocalStorage();
        if (saved) {
          setFiltersState(saved.filters);
          if (saved.searchQuery) {
            setSearchQueryState(saved.searchQuery);
          }
          return;
        }
      }

      if (user) {
        const defaultPreset = await getDefaultFilterPreset(user.id);
        if (defaultPreset) {
          setFiltersState(defaultPreset.filters);
        }
      }
    };

    loadSavedFilters();
  }, [user, enableLocalStorage]);

  const trackAnalytics = useCallback(
    async (filterData: ProductFilters, resultCount: number) => {
      if (!enableAnalytics) return;

      const queryTime = Date.now() - queryStartTime.current;

      await trackFilterAnalytics(
        sessionId,
        filterData,
        resultCount,
        queryTime,
        user?.id
      );

      Object.entries(filterData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const filterValue = Array.isArray(value) ? value.join(',') : String(value);
          updateFilterPerformanceMetrics(key, filterValue, resultCount);
        }
      });
    },
    [enableAnalytics, sessionId, user]
  );

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

  const getCachedQuery = useCallback(
    async (queryParams: any) => {
      if (!enableCaching) return null;

      const hash = generateQueryHash(filters, searchQuery);
      const cached = await getQueryCache(hash);

      if (cached) {
        return cached.result_data;
      }

      return null;
    },
    [filters, searchQuery, enableCaching]
  );

  const setCachedQuery = useCallback(
    async (queryParams: any, resultData: any, resultCount: number) => {
      if (!enableCaching) return;

      const hash = generateQueryHash(filters, searchQuery);
      await setQueryCache(hash, queryParams, resultData, resultCount, 15);
    },
    [filters, searchQuery, enableCaching]
  );

  const startQuery = useCallback(() => {
    queryStartTime.current = Date.now();
    setIsLoading(true);
  }, []);

  const endQuery = useCallback(
    (resultCount: number) => {
      setIsLoading(false);
      trackAnalytics(filters, resultCount);
    },
    [filters, trackAnalytics]
  );

  const clearFilters = useCallback(() => {
    setFiltersState({});
    setSearchQueryState('');
    if (enableLocalStorage) {
      saveFiltersToLocalStorage({}, '');
    }
  }, [enableLocalStorage]);

  const updateFilter = useCallback(
    <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
      setFilters(prev => {
        const newFilters = { ...prev };

        if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
          delete newFilters[key];
        } else {
          newFilters[key] = value;
        }

        // Logic for dependent filters
        if (key === 'ringStyles') { // fixed key name based on config
           // @ts-ignore
          newFilters.shapes = undefined;
        }

        // @ts-ignore
        if (key === 'stoneType') {
           // @ts-ignore
          newFilters.diamondOrigin = undefined;
           // @ts-ignore
          newFilters.gemstoneVariant = undefined;
        }

        return newFilters;
      });
    },
    [setFilters]
  );

  const removeFilter = useCallback(
    (key: keyof ProductFilters, value?: string) => {
      setFilters(prev => {
        const newFilters = { ...prev };

        if (Array.isArray(newFilters[key]) && value) {
          const arrayValue = newFilters[key] as string[];
          const filtered = arrayValue.filter(item => item !== value);
          if (filtered.length === 0) {
            delete newFilters[key];
          } else {
            (newFilters[key] as string[]) = filtered;
          }
        } else {
          delete newFilters[key];
        }

        return newFilters;
      });
    },
    [setFilters]
  );

  const toggleArrayFilter = useCallback(
    <K extends keyof ProductFilters>(key: K, value: string) => {
      setFilters(prev => {
        const current = (prev[key] as string[]) || [];
        const newValue = current.includes(value)
          ? current.filter(item => item !== value)
          : [...current, value];

        return {
          ...prev,
          [key]: newValue.length > 0 ? newValue : undefined,
        };
      });
    },
    [setFilters]
  );

  const hasActiveFilters = useCallback(() => {
    return (
      searchQuery.trim() !== '' ||
      Object.keys(filters).some(key => {
        const value = filters[key as keyof ProductFilters];
        return Array.isArray(value) ? value.length > 0 : value !== undefined;
      })
    );
  }, [filters, searchQuery]);

  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    if (searchQuery.trim()) count++;

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
    isLoading,
    setFilters,
    setSearchQuery,
    updateFilter,
    removeFilter,
    toggleArrayFilter,
    clearFilters,
    getCachedQuery,
    setCachedQuery,
    startQuery,
    endQuery,
    hasActiveFilters,
    getActiveFilterCount,
  };
};