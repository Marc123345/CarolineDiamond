import { ProductFilters } from '../config/filterConfig';
import { ProcessedProduct } from '../types/shopify';

/**
 * Advanced filter optimizer for improved performance and UX
 */

export interface FilterSuggestion {
  type: 'add' | 'remove' | 'replace';
  filterKey: keyof ProductFilters;
  filterValue: any;
  reason: string;
  expectedResultCount: number;
  confidence: number; // 0-1
}

export interface FilterOptimization {
  originalCount: number;
  optimizedFilters: ProductFilters;
  suggestions: FilterSuggestion[];
  performanceGain: number; // percentage
}

/**
 * Detect conflicting filters that return zero results
 */
export function detectFilterConflicts(
  filters: ProductFilters,
  products: ProcessedProduct[]
): Array<{ conflict: string; suggestion: string }> {
  const conflicts: Array<{ conflict: string; suggestion: string }> = [];

  // Check for impossible combinations
  if (filters.stoneType === 'Gemstone' && filters.diamondOrigin) {
    conflicts.push({
      conflict: 'Gemstone selected with Diamond Origin filter',
      suggestion: 'Remove Diamond Origin or switch to Diamond stone type',
    });
  }

  if (filters.stoneType === 'Diamond' && filters.gemstoneVariant) {
    conflicts.push({
      conflict: 'Diamond selected with Gemstone Variant filter',
      suggestion: 'Remove Gemstone Variant or switch to Gemstone stone type',
    });
  }

  // Check for overly restrictive price ranges
  if (filters.minPrice && filters.maxPrice) {
    if (filters.maxPrice - filters.minPrice < 100) {
      conflicts.push({
        conflict: 'Price range too narrow (less than €100)',
        suggestion: 'Widen price range for more results',
      });
    }
  }

  // Check for excessive multi-select filters
  if (filters.shapes && filters.shapes.length > 5) {
    conflicts.push({
      conflict: 'Too many shapes selected',
      suggestion: 'Narrow down to 2-3 preferred shapes for better results',
    });
  }

  return conflicts;
}

/**
 * Generate smart filter suggestions based on current selection
 */
export function generateSmartSuggestions(
  currentFilters: ProductFilters,
  allProducts: ProcessedProduct[],
  currentResultCount: number
): FilterSuggestion[] {
  const suggestions: FilterSuggestion[] = [];

  // If no results, suggest removing most restrictive filters
  if (currentResultCount === 0) {
    if (currentFilters.clarityGrades && currentFilters.clarityGrades.length > 0) {
      suggestions.push({
        type: 'remove',
        filterKey: 'clarityGrades',
        filterValue: undefined,
        reason: 'No products match the selected clarity grades. Try broader clarity options.',
        expectedResultCount: estimateResultCount(
          { ...currentFilters, clarityGrades: undefined },
          allProducts
        ),
        confidence: 0.9,
      });
    }

    if (currentFilters.caratWeights && currentFilters.caratWeights.length === 1) {
      suggestions.push({
        type: 'remove',
        filterKey: 'caratWeights',
        filterValue: undefined,
        reason: 'No products in this carat range. Try expanding the range.',
        expectedResultCount: estimateResultCount(
          { ...currentFilters, caratWeights: undefined },
          allProducts
        ),
        confidence: 0.85,
      });
    }
  }

  // If too few results (< 3), suggest broadening
  if (currentResultCount > 0 && currentResultCount < 3) {
    if (currentFilters.shapes && currentFilters.shapes.length === 1) {
      suggestions.push({
        type: 'add',
        filterKey: 'shapes',
        filterValue: [...currentFilters.shapes, 'Oval', 'Cushion'],
        reason: 'Only a few products match. Consider adding similar shapes for more options.',
        expectedResultCount: estimateResultCount(
          { ...currentFilters, shapes: [...currentFilters.shapes, 'Oval', 'Cushion'] },
          allProducts
        ),
        confidence: 0.7,
      });
    }
  }

  // If too many results (> 50), suggest narrowing
  if (currentResultCount > 50) {
    if (!currentFilters.minPrice && !currentFilters.maxPrice) {
      const avgPrice =
        allProducts.reduce((sum, p) => sum + p.price, 0) / allProducts.length;
      suggestions.push({
        type: 'add',
        filterKey: 'minPrice',
        filterValue: Math.round(avgPrice * 0.8),
        reason: 'Many products available. Consider setting a budget for focused results.',
        expectedResultCount: Math.round(currentResultCount * 0.6),
        confidence: 0.6,
      });
    }

    if (!currentFilters.clarityGrades) {
      suggestions.push({
        type: 'add',
        filterKey: 'clarityGrades',
        filterValue: ['VS1', 'VS2', 'SI1'],
        reason: 'Many options available. Consider filtering by clarity for quality assurance.',
        expectedResultCount: Math.round(currentResultCount * 0.5),
        confidence: 0.7,
      });
    }
  }

  // Suggest popular combinations
  if (currentFilters.ringStyle === 'Solitaire' && !currentFilters.shapes) {
    suggestions.push({
      type: 'add',
      filterKey: 'shapes',
      filterValue: ['Round'],
      reason: 'Round diamonds are the most popular choice for solitaire rings.',
      expectedResultCount: estimateResultCount(
        { ...currentFilters, shapes: ['Round'] },
        allProducts
      ),
      confidence: 0.8,
    });
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Estimate result count for a given filter combination
 */
function estimateResultCount(
  filters: ProductFilters,
  products: ProcessedProduct[]
): number {
  // Simple estimation - in production, this would use cached analytics
  let estimate = products.length;

  if (filters.ringStyle) estimate *= 0.25;
  if (filters.shapes && filters.shapes.length > 0) estimate *= 0.3;
  if (filters.metalColors && filters.metalColors.length > 0) estimate *= 0.4;
  if (filters.stoneType) estimate *= 0.5;
  if (filters.minPrice || filters.maxPrice) estimate *= 0.6;
  if (filters.clarityGrades && filters.clarityGrades.length > 0) estimate *= 0.4;
  if (filters.caratWeights && filters.caratWeights.length > 0) estimate *= 0.5;

  return Math.max(1, Math.round(estimate));
}

/**
 * Optimize filters for better performance
 */
export function optimizeFilters(
  filters: ProductFilters,
  products: ProcessedProduct[]
): FilterOptimization {
  const originalCount = estimateResultCount(filters, products);
  let optimizedFilters = { ...filters };
  const suggestions: FilterSuggestion[] = [];
  let performanceGain = 0;

  // Remove redundant filters
  if (filters.stoneType === 'Diamond' && filters.gemstoneVariant) {
    delete optimizedFilters.gemstoneVariant;
    performanceGain += 5;
    suggestions.push({
      type: 'remove',
      filterKey: 'gemstoneVariant',
      filterValue: undefined,
      reason: 'Removed conflicting gemstone filter (Diamond selected)',
      expectedResultCount: estimateResultCount(optimizedFilters, products),
      confidence: 1.0,
    });
  }

  if (filters.stoneType === 'Gemstone' && filters.diamondOrigin) {
    delete optimizedFilters.diamondOrigin;
    performanceGain += 5;
    suggestions.push({
      type: 'remove',
      filterKey: 'diamondOrigin',
      filterValue: undefined,
      reason: 'Removed conflicting diamond origin filter (Gemstone selected)',
      expectedResultCount: estimateResultCount(optimizedFilters, products),
      confidence: 1.0,
    });
  }

  // Optimize shape selection based on ring style
  if (filters.ringStyle && filters.shapes && filters.shapes.length > 3) {
    optimizedFilters.shapes = filters.shapes.slice(0, 3);
    performanceGain += 10;
    suggestions.push({
      type: 'replace',
      filterKey: 'shapes',
      filterValue: optimizedFilters.shapes,
      reason: 'Reduced shape selection to top 3 for faster results',
      expectedResultCount: estimateResultCount(optimizedFilters, products),
      confidence: 0.8,
    });
  }

  return {
    originalCount,
    optimizedFilters,
    suggestions,
    performanceGain,
  };
}

/**
 * Calculate filter specificity score (0-100)
 * Higher score = more specific filters = fewer results
 */
export function calculateFilterSpecificity(filters: ProductFilters): number {
  let score = 0;

  if (filters.ringStyle) score += 15;
  if (filters.shapes && filters.shapes.length > 0) {
    score += 10 + filters.shapes.length * 2;
  }
  if (filters.metalColors && filters.metalColors.length > 0) {
    score += 8 + filters.metalColors.length * 2;
  }
  if (filters.stoneType) score += 12;
  if (filters.diamondOrigin) score += 10;
  if (filters.gemstoneVariant) score += 10;
  if (filters.caratWeights && filters.caratWeights.length > 0) {
    score += 8 + filters.caratWeights.length * 3;
  }
  if (filters.clarityGrades && filters.clarityGrades.length > 0) {
    score += 8 + filters.clarityGrades.length * 2;
  }
  if (filters.certifications && filters.certifications.length > 0) {
    score += 6 + filters.certifications.length * 2;
  }
  if (filters.minPrice || filters.maxPrice) score += 10;
  if (filters.ringSizes && filters.ringSizes.length > 0) score += 8;
  if (filters.inStockOnly) score += 5;

  return Math.min(100, score);
}

/**
 * Recommend complementary filters based on current selection
 */
export function recommendComplementaryFilters(
  currentFilters: ProductFilters,
  products: ProcessedProduct[]
): Array<{ filterKey: keyof ProductFilters; filterValue: any; reason: string }> {
  const recommendations: Array<{
    filterKey: keyof ProductFilters;
    filterValue: any;
    reason: string;
  }> = [];

  // If ring style selected but no metal color, recommend most popular
  if (currentFilters.ringStyle && !currentFilters.metalColors) {
    recommendations.push({
      filterKey: 'metalColors',
      filterValue: ['White Gold'],
      reason: 'White Gold is the most popular metal color for this ring style',
    });
  }

  // If shape selected but no stone type, recommend diamond
  if (
    currentFilters.shapes &&
    currentFilters.shapes.length > 0 &&
    !currentFilters.stoneType
  ) {
    recommendations.push({
      filterKey: 'stoneType',
      filterValue: 'Diamond',
      reason: 'Most customers prefer diamonds with this shape',
    });
  }

  // If diamond selected but no clarity, recommend VS range
  if (
    currentFilters.stoneType === 'Diamond' &&
    !currentFilters.clarityGrades
  ) {
    recommendations.push({
      filterKey: 'clarityGrades',
      filterValue: ['VS1', 'VS2'],
      reason: 'VS clarity offers best value for quality',
    });
  }

  // If high price range but no certification, recommend GIA
  if (
    (currentFilters.minPrice && currentFilters.minPrice > 3000) &&
    !currentFilters.certifications
  ) {
    recommendations.push({
      filterKey: 'certifications',
      filterValue: ['GIA'],
      reason: 'GIA certification recommended for higher-value diamonds',
    });
  }

  return recommendations;
}

/**
 * Analyze filter effectiveness based on result distribution
 */
export interface FilterEffectiveness {
  filterKey: keyof ProductFilters;
  filterValue: any;
  effectiveness: number; // 0-1, how much it narrows results
  isUseful: boolean;
}

export function analyzeFilterEffectiveness(
  filters: ProductFilters,
  allProducts: ProcessedProduct[],
  filteredProducts: ProcessedProduct[]
): FilterEffectiveness[] {
  const analysis: FilterEffectiveness[] = [];
  const totalReduction = allProducts.length - filteredProducts.length;

  Object.entries(filters).forEach(([key, value]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return;

    // Estimate how much this filter contributed to narrowing
    const withoutFilter = { ...filters };
    delete withoutFilter[key as keyof ProductFilters];

    const estimatedWithout = estimateResultCount(withoutFilter, allProducts);
    const estimatedWith = filteredProducts.length;
    const reduction = estimatedWithout - estimatedWith;

    const effectiveness = totalReduction > 0 ? reduction / totalReduction : 0;

    analysis.push({
      filterKey: key as keyof ProductFilters,
      filterValue: value,
      effectiveness: Math.max(0, Math.min(1, effectiveness)),
      isUseful: effectiveness > 0.1, // Filter is useful if it reduces by >10%
    });
  });

  return analysis.sort((a, b) => b.effectiveness - a.effectiveness);
}
