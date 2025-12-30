import { ProcessedProduct, ProductOption } from '../types/shopify';

/**
 * Extracts all unique metal colors from product variants
 */
export function extractMetalColorsFromVariants(products: ProcessedProduct[]): string[] {
  const metalColors = new Set<string>();

  products.forEach(product => {
    if (!product.options) return;

    // Find the "Metal Color" option
    const metalColorOption = product.options.find(
      opt => opt.name === 'Metal Color' || opt.name === 'metal color'
    );

    if (metalColorOption) {
      // Standardize metal color names
      metalColorOption.values.forEach(value => {
        const standardized = standardizeMetalColor(value);
        if (standardized) {
          metalColors.add(standardized);
        }
      });
    }
  });

  return Array.from(metalColors).sort();
}

/**
 * Extracts all unique carat weights from product variants
 */
export function extractCaratWeightsFromVariants(products: ProcessedProduct[]): string[] {
  const caratWeights = new Set<string>();

  products.forEach(product => {
    if (!product.options) return;

    // Find the "Diamond Type" option (which contains carat weights)
    const diamondTypeOption = product.options.find(
      opt => opt.name === 'Diamond Type' || opt.name === 'diamond type'
    );

    if (diamondTypeOption) {
      // Standardize carat weight names
      diamondTypeOption.values.forEach(value => {
        const standardized = standardizeCaratWeight(value);
        if (standardized) {
          caratWeights.add(standardized);
        }
      });
    }
  });

  // Sort: Lab-grown weights first (ascending), then Natural Diamond
  return Array.from(caratWeights).sort((a, b) => {
    if (a === 'Natural Diamond') return 1;
    if (b === 'Natural Diamond') return -1;

    // Extract numeric values for lab-grown diamonds
    const aValue = parseFloat(a.replace(/[^\d.]/g, ''));
    const bValue = parseFloat(b.replace(/[^\d.]/g, ''));

    return aValue - bValue;
  });
}

/**
 * Standardizes metal color names to consistent format
 */
export function standardizeMetalColor(value: string): string | null {
  const normalized = value.toLowerCase().trim();

  if (normalized.includes('rose gold')) return '18K Rose Gold';
  if (normalized.includes('yellow gold')) return '18K Yellow Gold';
  if (normalized.includes('white gold')) return '18K White Gold';

  return null;
}

/**
 * Standardizes carat weight names to consistent format
 */
export function standardizeCaratWeight(value: string): string | null {
  const normalized = value.toLowerCase().trim();

  // Handle Lab-Grown diamonds
  if (normalized.includes('lab-grown') || normalized.includes('lab grown')) {
    if (normalized.includes('0.30') || normalized.includes('0.3')) return 'Lab-Grown 0.30ct';
    if (normalized.includes('0.50') || normalized.includes('0.5')) return 'Lab-Grown 0.50ct';
    if (normalized.includes('1.00') || normalized.includes('1.0')) return 'Lab-Grown 1.00ct';
    if (normalized.includes('1.50') || normalized.includes('1.5')) return 'Lab-Grown 1.50ct';
  }

  // Handle direct carat weights (without "Lab-Grown" prefix)
  if (normalized.includes('0.30') || normalized.includes('0.3')) return 'Lab-Grown 0.30ct';
  if (normalized.includes('0.50') || normalized.includes('0.5') || normalized === '0.50c') return 'Lab-Grown 0.50ct';
  if (normalized.includes('1.00') || normalized.includes('1.0')) return 'Lab-Grown 1.00ct';
  if (normalized.includes('1.50') || normalized.includes('1.5')) return 'Lab-Grown 1.50ct';

  // Handle Natural Diamond
  if (normalized.includes('natural')) return 'Natural Diamond';

  return null;
}

/**
 * Checks if a product has a specific metal color variant
 */
export function productHasMetalColor(product: ProcessedProduct, metalColor: string): boolean {
  if (!product.options) return false;

  const metalColorOption = product.options.find(
    opt => opt.name === 'Metal Color' || opt.name === 'metal color'
  );

  if (!metalColorOption) return false;

  return metalColorOption.values.some(value => {
    const standardized = standardizeMetalColor(value);
    return standardized === metalColor;
  });
}

/**
 * Checks if a product has a specific carat weight variant
 */
export function productHasCaratWeight(product: ProcessedProduct, caratWeight: string): boolean {
  if (!product.options) return false;

  const diamondTypeOption = product.options.find(
    opt => opt.name === 'Diamond Type' || opt.name === 'diamond type'
  );

  if (!diamondTypeOption) return false;

  return diamondTypeOption.values.some(value => {
    const standardized = standardizeCaratWeight(value);
    return standardized === caratWeight;
  });
}

/**
 * Counts products that have a specific metal color
 */
export function countProductsByMetalColor(
  products: ProcessedProduct[],
  metalColor: string,
  currentFilters?: any
): number {
  return products.filter(product => {
    // Apply any existing filters first (category, ring style, shape, etc.)
    // ... we'll expand this in the actual implementation

    return productHasMetalColor(product, metalColor);
  }).length;
}

/**
 * Counts products that have a specific carat weight
 */
export function countProductsByCaratWeight(
  products: ProcessedProduct[],
  caratWeight: string,
  currentFilters?: any
): number {
  return products.filter(product => {
    // Apply any existing filters first (category, ring style, shape, etc.)
    // ... we'll expand this in the actual implementation

    return productHasCaratWeight(product, caratWeight);
  }).length;
}

/**
 * Gets the display label for a metal color
 */
export function getMetalColorDisplayLabel(metalColor: string): string {
  return metalColor; // Already in "18K Rose Gold" format
}

/**
 * Gets the display label for a carat weight
 */
export function getCaratWeightDisplayLabel(caratWeight: string): string {
  if (caratWeight === 'Natural Diamond') {
    return 'Natural Diamond (Price on Request)';
  }
  return caratWeight;
}

/**
 * Checks if a product matches the current filter selections
 */
export function productMatchesFilters(
  product: ProcessedProduct,
  filters: {
    metalColors?: string[];
    caratWeights?: string[];
  }
): boolean {
  // If metal colors are filtered
  if (filters.metalColors && filters.metalColors.length > 0) {
    const hasMatchingMetalColor = filters.metalColors.some(color =>
      productHasMetalColor(product, color)
    );
    if (!hasMatchingMetalColor) return false;
  }

  // If carat weights are filtered
  if (filters.caratWeights && filters.caratWeights.length > 0) {
    const hasMatchingCaratWeight = filters.caratWeights.some(weight =>
      productHasCaratWeight(product, weight)
    );
    if (!hasMatchingCaratWeight) return false;
  }

  return true;
}
