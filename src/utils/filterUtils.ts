/**
 * src/utils/filterUtils.ts
 * Finalizing Vendor Normalization and Price Logic for Diamonds By CS
 */
import { ProductFilters } from '../config/filterConfig';

/**
 * Required Rule: Normalize Vendor "Diamonds By CS"
 * Ensures inconsistent backend entries like "Diamonds by CS" map to the canonical value.
 */
export function normalizeVendor(vendor: string | undefined): string {
  if (!vendor) return 'Diamonds By CS';
  const v = vendor.trim().toLowerCase();
  if (v.includes('diamonds by cs') || v === 'diamondsbycs') {
    return 'Diamonds By CS';
  }
  return vendor;
}

/**
 * Required Rule: Natural Diamonds MUST switch pricing logic (Price on Request)
 * Also handles standard currency formatting for the nl-BE locale.
 */
export function formatPrice(
  amount: number, 
  isNatural: boolean = false, 
  currency: string = 'EUR'
): string {
  // Rule 5: Natural diamonds or zero price trigger "Price on Request"
  if (isNatural || amount === 0) return 'Price on Request';

  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(amount);
}

/**
 * Generates a unique hash for a set of filters for state persistence
 */
export function generateQueryHash(filters: ProductFilters, searchQuery?: string): string {
  const queryString = JSON.stringify({ filters, searchQuery });
  try {
    return btoa(encodeURIComponent(queryString)).substring(0, 50);
  } catch (e) {
    return `filter_${Date.now()}`;
  }
}

/**
 * Utility to debounce filter changes to prevent UI lag during rapid selection
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
 * LocalStorage Persistence for user filter states
 */
export function saveFiltersToLocalStorage(filters: ProductFilters, searchQuery?: string): void {
  try {
    const filterState = { filters, searchQuery, timestamp: Date.now() };
    localStorage.setItem('shop_filters', JSON.stringify(filterState));
  } catch (error) {
    console.error('Failed to save filters:', error);
  }
}