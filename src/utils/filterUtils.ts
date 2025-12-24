import { ProductFilters } from '../config/filterConfig';
import { ProcessedProduct } from '../types/shopify';

/**
 * Utility function to debounce actions [cite: 67]
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
 * Uses encodeURIComponent to safely handle non-Latin characters [cite: 67]
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
    // encodeURIComponent is required to avoid crashing on Dutch/French special characters [cite: 67]
    return btoa(encodeURIComponent(queryString)).substring(0, 50);
  } catch (e) {
    return `filter_${Date.now()}`;
  }
}

/**
 * Formats a price value for display
 * Handles Caroline's "Price on Request" for Natural Diamonds [cite: 67, 68]
 */
export function formatPrice(amount: number, currency: string = 'EUR'): string {
  if (amount === 0) return 'Price on Request';

  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(amount);
}

/**
 * Storage and Persistence [cite: 67]
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
 * Filter and Search logic [cite: 67]
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

/**
 * Calculate dynamic price ranges based on actual product prices
 * Groups products into reasonable price buckets with counts
 */
export function calculateDynamicPriceRanges(products: ProcessedProduct[]): Array<{
  label: string;
  min: number;
  max?: number;
  count: number;
}> {
  if (!products || products.length === 0) {
    return [
      { label: 'Under €1,000', min: 0, max: 1000, count: 0 },
      { label: '€1,000-€1,500', min: 1000, max: 1500, count: 0 },
      { label: '€1,500-€2,500', min: 1500, max: 2500, count: 0 },
      { label: 'Over €2,500', min: 2500, count: 0 }
    ];
  }

  const prices = products.map(p => p.price).filter(p => p > 0);

  if (prices.length === 0) {
    return [
      { label: 'Under €1,000', min: 0, max: 1000, count: 0 },
      { label: '€1,000-€1,500', min: 1000, max: 1500, count: 0 },
      { label: '€1,500-€2,500', min: 1500, max: 2500, count: 0 },
      { label: 'Over €2,500', min: 2500, count: 0 }
    ];
  }

  const ranges = [
    { label: 'Under €1,000', min: 0, max: 1000, count: 0 },
    { label: '€1,000-€1,500', min: 1000, max: 1500, count: 0 },
    { label: '€1,500-€2,500', min: 1500, max: 2500, count: 0 },
    { label: 'Over €2,500', min: 2500, count: 0 }
  ];

  products.forEach(product => {
    const price = product.price;
    if (price <= 0) return;

    if (price < 1000) {
      ranges[0].count++;
    } else if (price < 1500) {
      ranges[1].count++;
    } else if (price < 2500) {
      ranges[2].count++;
    } else {
      ranges[3].count++;
    }
  });

  return ranges;
}