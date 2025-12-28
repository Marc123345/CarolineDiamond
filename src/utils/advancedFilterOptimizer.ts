import { ProductFilters, RING_STYLES, JEWELRY_CATEGORIES, ALL_SHAPES } from '../config/filterConfig';
import { ProcessedProduct } from '../types/shopify';

/**
 * Interface for filter suggestions to improve the UX
 */
export interface FilterSuggestion {
  type: 'add' | 'remove' | 'replace';
  filterKey: keyof ProductFilters;
  filterValue: any;
  reason: string;
  expectedResultCount: number;
  confidence: number;
}

export interface FilterOptimization {
  originalCount: number;
  optimizedFilters: ProductFilters;
  suggestions: FilterSuggestion[];
  performanceGain: number;
}

/**
 * DETECT CONFLICTS: Detects impossible combinations based on CSV structure
 */
export function detectFilterConflicts(
  filters: ProductFilters,
  products: ProcessedProduct[]
): Array<{ conflict: string; suggestion: string }> {
  const conflicts: Array<{ conflict: string; suggestion: string }> = [];

  const isRings = filters.jewelryCategory === 'Rings';
  const isNecklaces = filters.jewelryCategory === 'Necklaces';

  // 1. Category Clashes
  if (isNecklaces && (filters.ringStyle || filters.sideDiamonds || filters.ringSizes)) {
    conflicts.push({
      conflict: 'Ring-specific filters (Style/Size/Side Diamonds) active for Necklaces.',
      suggestion: 'Switch to Rings or remove ring-specific filters.',
    });
  }

  // 2. Stone Logic (Natural vs Lab-Grown conflicts)
  // Note: CSV Option 2 often contains both origin and carat info
  if (filters.diamondOrigin === 'Natural Diamond' && filters.diamondTypes?.some(t => t.origin === 'Lab-Grown')) {
    conflicts.push({
      conflict: 'Conflicting Diamond Origins selected.',
      suggestion: 'Choose either Natural or Lab-Grown, not both.',
    });
  }

  // 3. Shape constraints
  if (filters.ringStyle === 'Solitaire' && filters.shapes?.includes('Cushion')) {
    conflicts.push({
      conflict: 'Cushion cut is rarely available in standard Solitaire styles.',
      suggestion: 'Try a Halo style or a Round/Oval shape.',
    });
  }

  return conflicts;
}

/**
 * SMART SUGGESTIONS: Helps users find products when counts are low or zero
 */
export function generateSmartSuggestions(
  currentFilters: ProductFilters,
  allProducts: ProcessedProduct[],
  currentResultCount: number
): FilterSuggestion[] {
  const suggestions: FilterSuggestion[] = [];

  // Scenario: Zero Results
  if (currentResultCount === 0) {
    // If specific carat weight is too narrow
    if (filtersHasCaratSpecifics(currentFilters)) {
      suggestions.push({
        type: 'remove',
        filterKey: 'caratWeights',
        filterValue: undefined,
        reason: 'No items match this exact weight. Try a broader carat range.',
        expectedResultCount: estimateResultCount({ ...currentFilters, caratWeights: undefined }, allProducts),
        confidence: 0.95,
      });
    }

    // If Metal color is the bottleneck
    if (currentFilters.metalColors?.length === 1) {
      suggestions.push({
        type: 'add',
        filterKey: 'metalColors',
        filterValue: ['White Gold', 'Yellow Gold'],
        reason: 'This item might be available in other gold colors.',
        expectedResultCount: estimateResultCount({ ...currentFilters, metalColors: ['White Gold', 'Yellow Gold'] }, allProducts),
        confidence: 0.8,
      });
    }
  }

  // Scenario: Popular pairings for Diamonds
  if (currentFilters.jewelryCategory === 'Rings' && !currentFilters.shapes) {
    suggestions.push({
      type: 'add',
      filterKey: 'shapes',
      filterValue: ['Round'],
      reason: 'Round Brilliant is the most popular choice for engagement rings.',
      expectedResultCount: Math.round(currentResultCount * 0.4),
      confidence: 0.85,
    });
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

/**
 * HEURISTIC ESTIMATOR: Uses jewelry-specific weights for faster UI previews
 */
function estimateResultCount(
  filters: ProductFilters,
  products: ProcessedProduct[]
): number {
  let estimate = products.length || 100;

  // Heuristic weights based on your CSV distribution
  if (filters.jewelryCategory === 'Rings') estimate *= 0.7; // Rings are ~70% of stock
  else if (filters.jewelryCategory) estimate *= 0.15;

  if (filters.ringStyle) estimate *= 0.3;
  if (filters.shapes && filters.shapes.length > 0) estimate *= (0.2 * filters.shapes.length);
  if (filters.metalColors && filters.metalColors.length > 0) estimate *= 0.5;
  
  // High-end items (>3000) are usually ~20% of catalog
  if (filters.minPrice && filters.minPrice > 3000) estimate *= 0.2;

  return Math.max(1, Math.round(estimate));
}

/**
 * OPTIMIZER: Prunes redundant or invalid filters to keep Shopify queries fast
 */
export function optimizeFilters(
  filters: ProductFilters,
  products: ProcessedProduct[]
): FilterOptimization {
  let optimizedFilters = { ...filters };
  const suggestions: FilterSuggestion[] = [];
  
  // 1. Prune category-irrelevant filters
  if (filters.jewelryCategory !== 'Rings') {
    if (filters.ringStyle || filters.ringSizes || filters.sideDiamonds) {
      delete optimizedFilters.ringStyle;
      delete optimizedFilters.ringSizes;
      delete optimizedFilters.sideDiamonds;
      suggestions.push({
        type: 'remove',
        filterKey: 'ringStyle',
        filterValue: undefined,
        reason: 'Removing ring-specific filters for non-ring category.',
        expectedResultCount: estimateResultCount(optimizedFilters, products),
        confidence: 1.0,
      });
    }
  }

  // 2. Remove redundant "Any" selections
  if (filters.diamondOrigin === 'Natural Diamond' && filters.stoneType === 'Diamond') {
    // StoneType: Diamond is redundant if Natural Diamond is already selected
    // but we keep it for UI consistency unless it slows the query.
  }

  return {
    originalCount: products.length,
    optimizedFilters,
    suggestions,
    performanceGain: suggestions.length * 5, // Simple metric: 5% gain per redundant filter removed
  };
}

/**
 * SPECIFICITY SCORE: High score means the user is looking for something very rare
 */
export function calculateFilterSpecificity(filters: ProductFilters): number {
  let score = 0;
  if (filters.jewelryCategory) score += 10;
  if (filters.ringStyle) score += 20;
  if (filters.shapes?.length === 1) score += 25; // Narrowing to one shape is very specific
  if (filters.caratWeights?.length === 1) score += 15;
  if (filters.clarityGrades?.length) score += 15;
  if (filters.inStockOnly) score += 5;
  
  return Math.min(100, score);
}

// Internal Helper
function filtersHasCaratSpecifics(filters: ProductFilters): boolean {
  return !!(filters.caratWeights?.length || filters.minCarat || filters.diamondTypes?.length);
}