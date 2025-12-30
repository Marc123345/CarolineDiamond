/**
 * Business Rules for Filter Interactions
 *
 * Centralizes all filter dependency logic in one place.
 * Pure functions - no side effects, easy to test.
 */

import type { ProductFilters } from '../../config/filterConfig';

/**
 * Determines which filters should be cleared when another filter changes
 * FIXED: ringStyle no longer clears shapes - incompatible shapes are disabled visually instead
 */
export function getFilterDependencies(
  changedKey: keyof ProductFilters
): Array<keyof ProductFilters> {
  const dependencies: Partial<Record<keyof ProductFilters, Array<keyof ProductFilters>>> = {
    // When jewelry category changes, clear ring-specific filters
    // NOTE: shapes are NOT cleared - they're filtered by product visibility
    jewelryCategory: ['ringStyle', 'ringSizes'],

    // When ring style changes, DO NOT clear shapes
    // The UI disables incompatible shapes, preserving user selection
    // ringStyle: [], // Removed - this was causing frustrating UX

    // When stone type changes, clear diamond-specific or gemstone-specific filters
    stoneType: ['diamondOrigin', 'gemstoneVariant', 'clarityGrades', 'caratWeights'],
  };

  return dependencies[changedKey] || [];
}

/**
 * Validates if a filter value is applicable given current filter state
 */
export function isFilterApplicable(
  key: keyof ProductFilters,
  filters: ProductFilters
): boolean {
  // Shape filter only applicable for Rings
  if (key === 'shapes') {
    const category = filters.jewelryCategory;
    return !category || category === 'Rings';
  }

  // Ring style only applicable for Rings
  if (key === 'ringStyle' || key === 'ringSizes') {
    return filters.jewelryCategory === 'Rings' || !filters.jewelryCategory;
  }

  // Earring filters only for Earrings
  if (key === 'earringType' || key === 'earringBacking') {
    return filters.jewelryCategory === 'Earrings';
  }

  // Necklace filters only for Necklaces
  if (key === 'chainLength' || key === 'pendantSize') {
    return filters.jewelryCategory === 'Necklaces';
  }

  // Diamond-specific filters
  if (key === 'diamondOrigin' || key === 'clarityGrades') {
    return filters.stoneType === 'Diamond' || !filters.stoneType;
  }

  // Gemstone-specific filters
  if (key === 'gemstoneVariant') {
    return filters.stoneType === 'Gemstone' || !filters.stoneType;
  }

  return true;
}

/**
 * Cleans filter object by removing non-applicable or empty values
 */
export function cleanFilters(filters: ProductFilters): ProductFilters {
  const cleaned: ProductFilters = {};

  for (const [key, value] of Object.entries(filters)) {
    const filterKey = key as keyof ProductFilters;

    // Skip if not applicable
    if (!isFilterApplicable(filterKey, filters)) {
      continue;
    }

    // Skip empty arrays
    if (Array.isArray(value) && value.length === 0) {
      continue;
    }

    // Skip undefined/null
    if (value === undefined || value === null) {
      continue;
    }

    cleaned[filterKey] = value;
  }

  return cleaned;
}

/**
 * Applies filter change with automatic dependency cleanup
 */
export function applyFilterChange(
  currentFilters: ProductFilters,
  key: keyof ProductFilters,
  value: any
): ProductFilters {
  const updated = { ...currentFilters };

  // Set or remove the changed filter
  if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
    delete updated[key];
  } else {
    updated[key] = value;
  }

  // Clear dependent filters
  const dependencies = getFilterDependencies(key);
  dependencies.forEach(depKey => {
    delete updated[depKey];
  });

  return cleanFilters(updated);
}
