import { ProductFilters } from '../config/filterConfig';

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function saveFiltersToLocalStorage(filters: ProductFilters, key: string = 'productFilters'): void {
  try {
    localStorage.setItem(key, JSON.stringify(filters));
  } catch (error) {
    console.error('Error saving filters to localStorage:', error);
  }
}

export function loadFiltersFromLocalStorage(key: string = 'productFilters'): ProductFilters | null {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading filters from localStorage:', error);
    return null;
  }
}

export function generateQueryHash(filters: ProductFilters): string {
  const sortedKeys = Object.keys(filters).sort();
  const normalized = sortedKeys.reduce((acc, key) => {
    const value = filters[key as keyof ProductFilters];
    if (value !== undefined && value !== null) {
      acc[key] = Array.isArray(value) ? [...value].sort() : value;
    }
    return acc;
  }, {} as Record<string, any>);

  return btoa(JSON.stringify(normalized));
}

export function getSessionId(): string {
  let sessionId = sessionStorage.getItem('sessionId');

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', sessionId);
  }

  return sessionId;
}

export function fuzzySearch(text: string, searchTerm: string): boolean {
  if (!searchTerm) return true;

  const lowerText = text.toLowerCase();
  const lowerSearch = searchTerm.toLowerCase();

  let searchIndex = 0;
  let textIndex = 0;

  while (textIndex < lowerText.length && searchIndex < lowerSearch.length) {
    if (lowerText[textIndex] === lowerSearch[searchIndex]) {
      searchIndex++;
    }
    textIndex++;
  }

  return searchIndex === lowerSearch.length;
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
