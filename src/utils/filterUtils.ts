import { ProductFilters } from '../config/filterConfig';
// import { ProcessedProduct } from '../types'; // Not currently used in this file but good to have available

/**
 * Utility function to debounce actions
 * Prevents search/filter functions from firing too rapidly
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generates a unique hash for a set of filters
 * Uses encodeURIComponent to safely handle non-Latin characters
 */
export function generateQueryHash(filters: ProductFilters, searchQuery?: string): string {
  const normalizedFilters = {
    ...filters,
    shapes: filters.shapes?.sort(),
    metalColors: filters.metalColors?.sort(),
    ringSizes: filters.ringSizes?.sort(),
  };

  const queryString = JSON.stringify({ filters: normalizedFilters, searchQuery });
   
  try {
    // encodeURIComponent is required to avoid crashing on Dutch/French special characters
    return btoa(encodeURIComponent(queryString)).substring(0, 50);
  } catch (e) {
    return `filter_${Date.now()}`;
  }
}

/**
 * Formats a price value for display
 * Handles Caroline's "Price on Request" for Natural Diamonds (where price is 0 or null)
 */
export function formatPrice(amount: number, currency: string = 'EUR'): string {
  if (!amount || amount === 0) return 'Price on Request';

  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(amount);
}

/**
 * Storage and Persistence
 */
export function saveFiltersToLocalStorage(filters: ProductFilters, searchQuery?: string): void {
  try {
    const filterState = { filters, searchQuery, timestamp: Date.now() };
    localStorage.setItem('shop_filters', JSON.stringify(filterState));
  } catch (error) {
    console.error('Failed to save filters:', error);
  }
}

export function loadFiltersFromLocalStorage(): { filters: ProductFilters; searchQuery?: string } | null {
  try {
    const saved = localStorage.getItem('shop_filters');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    // Expire filters after 24 hours
    const age = Date.now() - parsed.timestamp;
    if (age > 24 * 60 * 60 * 1000) return null;
    return { filters: parsed.filters, searchQuery: parsed.searchQuery };
  } catch (error) {
    return null;
  }
}

export function clearFiltersFromLocalStorage(): void {
  localStorage.removeItem('shop_filters');
}

/**
 * Filter and Search logic
 */
export function fuzzySearch(searchTerm: string, text: string, threshold: number = 0.6): boolean {
  if (!searchTerm || !text) return false;
  const search = searchTerm.toLowerCase();
  const target = text.toLowerCase();
  return target.includes(search);
}

export function getSessionId(): string {
  let sessionId = sessionStorage.getItem('filter_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('filter_session_id', sessionId);
  }
  return sessionId;
}