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

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generates a unique hash for a set of filters
 * Uses encodeURIComponent to safely handle non-Latin characters (e.g. Dutch)
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
    // FIX: encodeURIComponent prevents btoa crash on special characters found in Dutch/International names
    return btoa(encodeURIComponent(queryString)).substring(0, 50);
  } catch (e) {
    // Fallback ID if hashing fails
    return `filter_${Date.now()}`;
  }
}

/**
 * Formats a price value for display
 */
export function formatPrice(amount: number, currency: string = 'EUR'): string {
  // If price is 0, this is a "Natural Diamond" which is Price on Request per Caroline's instructions
  if (amount === 0) return 'Price on Request';

  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(amount);
}

export function saveFiltersToLocalStorage(filters: ProductFilters, searchQuery?: string): void {
  try {
    const filterState = {
      filters,
      searchQuery,
      timestamp: Date.now(),
    };
    localStorage.setItem('shop_filters', JSON.stringify(filterState));
  } catch (error) {
    console.error('Failed to save filters to localStorage:', error);
  }
}

export function loadFiltersFromLocalStorage(): { filters: ProductFilters; searchQuery?: string } | null {
  try {
    const saved = localStorage.getItem('shop_filters');
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    const age = Date.now() - parsed.timestamp;
    const MAX_AGE = 24 * 60 * 60 * 1000;

    if (age > MAX_AGE) {
      localStorage.removeItem('shop_filters');
      return null;
    }

    // Validate and fix array fields to prevent crashes from corrupted localStorage data
    const filters = parsed.filters || {};
    if (filters.shapes && !Array.isArray(filters.shapes)) {
      filters.shapes = [filters.shapes];
    }
    if (filters.metalColors && !Array.isArray(filters.metalColors)) {
      filters.metalColors = [filters.metalColors];
    }
    if (filters.ringSizes && !Array.isArray(filters.ringSizes)) {
      filters.ringSizes = [filters.ringSizes];
    }
    if (filters.caratWeights && !Array.isArray(filters.caratWeights)) {
      filters.caratWeights = [filters.caratWeights];
    }
    if (filters.clarityGrades && !Array.isArray(filters.clarityGrades)) {
      filters.clarityGrades = [filters.clarityGrades];
    }
    if (filters.certifications && !Array.isArray(filters.certifications)) {
      filters.certifications = [filters.certifications];
    }

    return {
      filters,
      searchQuery: parsed.searchQuery,
    };
  } catch (error) {
    console.error('Failed to load filters from localStorage:', error);
    return null;
  }
}

export function clearFiltersFromLocalStorage(): void {
  try {
    localStorage.removeItem('shop_filters');
  } catch (error) {
    console.error('Failed to clear filters from localStorage:', error);
  }
}

export function calculateFilterCombinations(products: ProcessedProduct[]): Map<string, number> {
  const combinations = new Map<string, number>();

  products.forEach(product => {
    const keys: string[] = [];

    if (product.tags) {
      product.tags.forEach(tag => {
        keys.push(`tag:${tag}`);
      });
    }

    if (product.category) {
      keys.push(`category:${product.category}`);
    }

    const priceRanges = [
      { min: 0, max: 1500, label: 'under-1500' },
      { min: 1500, max: 3000, label: '1500-3000' },
      { min: 3000, max: 5000, label: '3000-5000' },
      { min: 5000, max: Infinity, label: 'over-5000' },
    ];

    priceRanges.forEach(range => {
      if (product.price >= range.min && product.price < range.max) {
        keys.push(`price:${range.label}`);
      }
    });

    keys.forEach(key => {
      combinations.set(key, (combinations.get(key) || 0) + 1);
    });
  });

  return combinations;
}

export function fuzzySearch(searchTerm: string, text: string, threshold: number = 0.6): boolean {
  if (!searchTerm || !text) return false;

  const search = searchTerm.toLowerCase();
  const target = text.toLowerCase();

  if (target.includes(search)) return true;

  const distance = levenshteinDistance(search, target);
  const maxLength = Math.max(search.length, target.length);
  const similarity = 1 - distance / maxLength;

  return similarity >= threshold;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

export function generateSearchSuggestions(
  searchTerm: string,
  products: ProcessedProduct[],
  maxSuggestions: number = 5
): string[] {
  if (!searchTerm || searchTerm.length < 2) return [];

  const suggestions = new Set<string>();
  const search = searchTerm.toLowerCase();

  products.forEach(product => {
    if (suggestions.size >= maxSuggestions) return;

    if (product.name.toLowerCase().includes(search)) {
      suggestions.add(product.name);
    }

    product.tags?.forEach(tag => {
      if (suggestions.size >= maxSuggestions) return;
      if (tag.toLowerCase().includes(search)) {
        suggestions.add(tag);
      }
    });
  });

  return Array.from(suggestions).slice(0, maxSuggestions);
}

export function calculateDynamicPriceRanges(products: ProcessedProduct[]): Array<{
  label: string;
  min: number;
  max: number | undefined;
  count: number;
}> {
  if (products.length === 0) {
    return [
      { label: 'Under €1,500', min: 0, max: 1500, count: 0 },
      { label: '€1,500-€3,000', min: 1500, max: 3000, count: 0 },
      { label: '€3,000-€5,000', min: 3000, max: 5000, count: 0 },
      { label: 'Over €5,000', min: 5000, max: undefined, count: 0 },
    ];
  }

  const prices = products.map(p => p.price).sort((a, b) => a - b);
  const min = Math.floor(prices[0] / 100) * 100;
  const max = Math.ceil(prices[prices.length - 1] / 100) * 100;
  const rangeCount = 4;
  const rangeSize = Math.ceil((max - min) / rangeCount / 100) * 100;

  const ranges: Array<{ label: string; min: number; max: number | undefined; count: number }> = [];

  for (let i = 0; i < rangeCount; i++) {
    const rangeMin = min + i * rangeSize;
    const rangeMax = i === rangeCount - 1 ? undefined : rangeMin + rangeSize;

    const count = products.filter(p => {
      if (rangeMax === undefined) return p.price >= rangeMin;
      return p.price >= rangeMin && p.price < rangeMax;
    }).length;

    const label =
      rangeMax === undefined
        ? `Over €${rangeMin.toLocaleString()}`
        : `€${rangeMin.toLocaleString()}-€${rangeMax.toLocaleString()}`;

    ranges.push({ label, min: rangeMin, max: rangeMax, count });
  }

  return ranges;
}

export function getAvailableFilterOptions(
  products: ProcessedProduct[],
  currentFilters: ProductFilters
): {
  ringStyles: Set<string>;
  shapes: Set<string>;
  metalColors: Set<string>;
  stoneTypes: Set<string>;
  ringSizes: Set<string>;
} {
  const available = {
    ringStyles: new Set<string>(),
    shapes: new Set<string>(),
    metalColors: new Set<string>(),
    stoneTypes: new Set<string>(),
    ringSizes: new Set<string>(),
  };

  products.forEach(product => {
    product.tags?.forEach(tag => {
      const tagLower = tag.toLowerCase();

      if (tagLower.includes('solitaire') || tagLower.includes('halo')) {
        available.ringStyles.add(tag);
      }

      if (
        tagLower.includes('round') ||
        tagLower.includes('oval') ||
        tagLower.includes('princess') ||
        tagLower.includes('pear') ||
        tagLower.includes('marquise') ||
        tagLower.includes('emerald') ||
        tagLower.includes('cushion')
      ) {
        available.shapes.add(tag);
      }

      if (
        tagLower.includes('white gold') ||
        tagLower.includes('yellow gold') ||
        tagLower.includes('rose gold')
      ) {
        available.metalColors.add(tag);
      }

      if (tagLower.includes('diamond') || tagLower.includes('gemstone')) {
        available.stoneTypes.add(tag);
      }
    });

    product.variants?.forEach(variant => {
      if (variant.availableForSale && variant.selectedOptions) {
        const size = variant.selectedOptions['Size'] || variant.selectedOptions['size'];
        if (size) {
          available.ringSizes.add(size);
        }
      }
    });
  });

  return available;
}

export function validateFilterCombination(filters: ProductFilters): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  if (filters.shapes && filters.shapes.length > 5) {
    warnings.push('Selecting too many shapes may reduce results significantly');
  }

  if (filters.metalColors && filters.metalColors.length === 0 && filters.ringStyle) {
    warnings.push('Consider selecting a metal color to refine your search');
  }

  if (filters.minPrice && filters.maxPrice && filters.minPrice >= filters.maxPrice) {
    warnings.push('Minimum price must be less than maximum price');
    return { valid: false, warnings };
  }

  if (
    filters.minPrice &&
    filters.maxPrice &&
    filters.maxPrice - filters.minPrice < 100
  ) {
    warnings.push('Price range is very narrow and may return few results');
  }

  return { valid: true, warnings };
}

export function getSessionId(): string {
  let sessionId = sessionStorage.getItem('filter_session_id');

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('filter_session_id', sessionId);
  }

  return sessionId;
}
```