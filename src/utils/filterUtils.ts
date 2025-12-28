import { ProductFilters } from '../config/filterConfig';
import { ProcessedProduct } from '../types/shopify';

/**
 * Utility function to debounce actions
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

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generates a stable hash for a set of filters.
 * Sorts all arrays to ensure the same selection always results in the same hash.
 */
export function generateQueryHash(filters: ProductFilters, searchQuery?: string): string {
  // Create a copy and sort all array fields for stability
  const normalizedFilters = { ...filters };
  
  const arrayFields: (keyof ProductFilters)[] = [
    'shapes', 'metalColors', 'diamondTypes', 'caratWeights', 
    'clarityGrades', 'certifications', 'ringSizes'
  ];

  arrayFields.forEach(field => {
    if (Array.isArray(normalizedFilters[field])) {
      // For objects (like caratWeights), we sort by a stable property like label
      (normalizedFilters[field] as any) = [...(normalizedFilters[field] as any)].sort((a, b) => {
        const valA = typeof a === 'object' ? (a.id || a.label || JSON.stringify(a)) : String(a);
        const valB = typeof b === 'object' ? (b.id || b.label || JSON.stringify(b)) : String(b);
        return valA.localeCompare(valB);
      });
    }
  });

  const queryString = JSON.stringify({ filters: normalizedFilters, searchQuery: searchQuery?.trim().toLowerCase() });
  
  try {
    // encodeURIComponent handles non-Latin characters (common in Dutch names)
    return btoa(encodeURIComponent(queryString)).substring(0, 50);
  } catch (e) {
    return `f_${Date.now()}`;
  }
}

/**
 * Formats price for nl-BE (Belgium). 
 * If amount is 0, returns "Price on Request" (Prijs op aanvraag).
 */
export function formatPrice(amount: number, currency: string = 'EUR'): string {
  if (amount <= 0) return 'Price on Request';

  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Storage and Persistence
 */
export function saveFiltersToLocalStorage(filters: ProductFilters, searchQuery?: string): void {
  try {
    const filterState = { 
      filters, 
      searchQuery, 
      timestamp: Date.now() 
    };
    localStorage.setItem('shop_filters', JSON.stringify(filterState));
  } catch (error) {
    console.error('Persistence Error:', error);
  }
}

export function loadFiltersFromLocalStorage(): { filters: ProductFilters; searchQuery?: string } | null {
  try {
    const saved = localStorage.getItem('shop_filters');
    if (!saved) return null;
    
    const parsed = JSON.parse(saved);
    const oneDay = 24 * 60 * 60 * 1000;
    
    // Invalidate if older than 24 hours
    if (Date.now() - parsed.timestamp > oneDay) {
      localStorage.removeItem('shop_filters');
      return null;
    }
    
    return { filters: parsed.filters, searchQuery: parsed.searchQuery };
  } catch (error) {
    return null;
  }
}

/**
 * Logic for the sidebar price range facet
 */
export function calculateDynamicPriceRanges(products: ProcessedProduct[]) {
  const ranges = [
    { label: 'Under €1,500', min: 0, max: 1500, count: 0 },
    { label: '€1,500 - €3,000', min: 1500, max: 3000, count: 0 },
    { label: '€3,000 - €5,000', min: 3000, max: 5000, count: 0 },
    { label: 'Over €5,000', min: 5000, count: 0 }
  ];

  products.forEach(product => {
    const p = product.price;
    if (p <= 0) return;

    if (p < 1500) ranges[0].count++;
    else if (p < 3000) ranges[1].count++;
    else if (p < 5000) ranges[2].count++;
    else ranges[3].count++;
  });

  return ranges;
}

export function getSessionId(): string {
  let sessionId = sessionStorage.getItem('filter_session_id');
  if (!sessionId) {
    sessionId = `s_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem('filter_session_id', sessionId);
  }
  return sessionId;
}