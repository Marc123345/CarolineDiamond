/**
 * Diamond Type Normalization Utilities
 * Handles all variations in Shopify product data
 */

/**
 * Normalizes diamond type option values to a consistent format
 * Handles variations like:
 * - "0.50ct", "0.50c" -> "Lab-Grown 0.50ct"
 * - "All Lab-Grown 0.50ct" -> "Lab-Grown 0.50ct"
 * - "Lab-Grown 0.50ct" -> "Lab-Grown 0.50ct"
 * - "Natural Diamond" -> "Natural Diamond"
 * - "All Natural Diamond" -> "Natural Diamond"
 */
export function normalizeDiamondType(value: string | undefined): string | null {
  if (!value) return null;

  const normalized = value.trim();

  // Handle "All Lab-Grown X" format -> "Lab-Grown X"
  if (normalized.startsWith('All Lab-Grown')) {
    return normalized.replace('All Lab-Grown', 'Lab-Grown').trim();
  }

  // Handle "All Natural Diamond" -> "Natural Diamond"
  if (normalized === 'All Natural Diamond') {
    return 'Natural Diamond';
  }

  // Handle standalone carat values like "0.50ct" or "0.50c" -> "Lab-Grown 0.50ct"
  // Assume standalone carat values are lab-grown
  const caratMatch = normalized.match(/^(0\.30|0\.50|1\.00|1\.50|2\.00)c(t)?$/i);
  if (caratMatch) {
    const carat = caratMatch[1];
    return `Lab-Grown ${carat}ct`;
  }

  // Already in correct format
  if (normalized.startsWith('Lab-Grown') || normalized === 'Natural Diamond') {
    return normalized;
  }

  return normalized;
}

/**
 * Extracts carat weight from a diamond type option
 * Examples:
 * - "Lab-Grown 0.50ct" -> 0.50
 * - "0.50ct" -> 0.50
 * - "Natural Diamond" -> null
 */
export function extractCaratFromDiamondType(value: string | undefined): number | null {
  if (!value) return null;

  const match = value.match(/(0\.30|0\.50|1\.00|1\.50|2\.00)ct?/i);
  return match ? parseFloat(match[1]) : null;
}

/**
 * Checks if a diamond type represents lab-grown diamonds
 */
export function isLabGrown(value: string | undefined): boolean {
  if (!value) return false;

  const normalized = value.toLowerCase();
  return normalized.includes('lab-grown') ||
         normalized.includes('lab grown') ||
         normalized.includes('labgrown') ||
         normalized.includes('synthetic') ||
         /^(0\.30|0\.50|1\.00|1\.50|2\.00)c(t)?$/i.test(value); // Standalone carats are lab-grown
}

/**
 * Checks if a diamond type represents natural diamonds
 */
export function isNatural(value: string | undefined): boolean {
  if (!value) return false;

  const normalized = value.toLowerCase();
  return normalized.includes('natural');
}

/**
 * Compares two diamond type values for equality
 * Handles all variations and normalizes before comparing
 */
export function diamondTypesMatch(value1: string | undefined, value2: string | undefined): boolean {
  const norm1 = normalizeDiamondType(value1);
  const norm2 = normalizeDiamondType(value2);

  if (!norm1 || !norm2) return false;

  return norm1 === norm2;
}

/**
 * Gets the display label for a diamond type filter
 */
export function getDiamondTypeDisplayLabel(value: string | undefined): string {
  const normalized = normalizeDiamondType(value);
  return normalized || 'Unknown';
}
