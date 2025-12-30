/**
 * Variant Option Utilities
 * Handles case-insensitive and variation-tolerant option name lookups
 */

import { ProductVariant } from '../types/shopify';

/**
 * Normalizes an option name for comparison
 * Removes colons, spaces, and converts to lowercase
 * Examples:
 * - "Ring Size:" -> "ringsize"
 * - "Ring size" -> "ringsize"
 * - "Diamond Type" -> "diamondtype"
 */
function normalizeOptionName(name: string): string {
  return name.toLowerCase().replace(/[:\s]/g, '');
}

/**
 * Gets a variant option value by name, handling case and punctuation variations
 * Searches for:
 * - Exact match (case-insensitive)
 * - Match without colons/spaces
 * - Common variations
 */
export function getVariantOption(
  variant: ProductVariant,
  searchName: string
): string | undefined {
  if (!variant.selectedOptions) return undefined;

  const normalizedSearch = normalizeOptionName(searchName);

  // Try to find the option by normalized name
  for (const [optionName, optionValue] of Object.entries(variant.selectedOptions)) {
    if (normalizeOptionName(optionName) === normalizedSearch) {
      return optionValue;
    }
  }

  return undefined;
}

/**
 * Common option name aliases for lookups
 */
export const OPTION_ALIASES = {
  metal: ['Metal', 'Metal Color', 'Color', 'Material'],
  diamondType: ['Diamond Type', 'Diamond Type:', 'Carat'],
  ringSize: ['Ring Size', 'Ring size', 'Ring Size:', 'Ring Size Options:', 'Size'],
  shape: ['Shape'],
} as const;

/**
 * Gets metal color option from a variant using all known aliases
 */
export function getMetalColorOption(variant: ProductVariant): string | undefined {
  for (const alias of OPTION_ALIASES.metal) {
    const value = getVariantOption(variant, alias);
    if (value) return value;
  }
  return undefined;
}

/**
 * Gets diamond type option from a variant using all known aliases
 */
export function getDiamondTypeOption(variant: ProductVariant): string | undefined {
  for (const alias of OPTION_ALIASES.diamondType) {
    const value = getVariantOption(variant, alias);
    if (value) return value;
  }
  return undefined;
}

/**
 * Gets ring size option from a variant using all known aliases
 */
export function getRingSizeOption(variant: ProductVariant): string | undefined {
  for (const alias of OPTION_ALIASES.ringSize) {
    const value = getVariantOption(variant, alias);
    if (value) return value;
  }
  return undefined;
}

/**
 * Gets shape option from a variant
 */
export function getShapeOption(variant: ProductVariant): string | undefined {
  return getVariantOption(variant, 'Shape');
}

/**
 * Checks if a variant has any of the specified option names
 */
export function hasOption(variant: ProductVariant, searchNames: string[]): boolean {
  if (!variant.selectedOptions) return false;

  const normalizedSearch = searchNames.map(normalizeOptionName);

  return Object.keys(variant.selectedOptions).some(optionName =>
    normalizedSearch.includes(normalizeOptionName(optionName))
  );
}
