import { ProcessedProduct } from '../types/shopify';
import { ClarityGrade, Certification, CaratWeight } from '../config/filterConfig';

/**
 * Normalizes and extracts numeric carat values from a variety of string formats.
 * Handles: "0.50ct", "0.50c", "Lab-Grown 1.50ct", "1.00 Carat", "0.5-0.99ct"
 */
const parseCaratString = (str: string): number | null => {
  if (!str) return null;
  
  // Use regex to find the first decimal or integer followed by carat indicators
  // It handles the "Lab-Grown 0.50ct" case by ignoring the prefix
  const match = str.match(/(\d+\.?\d*)\s*(?:ct|c|carat)/i);
  if (match) {
    const val = parseFloat(match[1]);
    return !isNaN(val) && val > 0 ? val : null;
  }
  
  // Fallback for bare numbers if they look like carats (e.g. "0.50")
  const bareMatch = str.match(/^(\d+\.?\d*)$/);
  if (bareMatch) {
    const val = parseFloat(bareMatch[1]);
    return val > 0 && val < 15 ? val : null;
  }

  return null;
};

/**
 * Extract the primary carat weight from the product.
 * Priority: Shopify Option "Diamond Type" > Tags > Title.
 */
export function extractCaratWeight(product: ProcessedProduct): number | null {
  // 1. Check Variants (maps to CSV Option 2 "Diamond Type")
  if (product.variants?.length) {
    for (const variant of product.variants) {
      const options = variant.selectedOptions || {};
      // Explicitly check the CSV header name
      const caratValue = options['Diamond Type'] || options['Carat'] || options['carat'];
      if (caratValue) {
        const weight = parseCaratString(caratValue);
        if (weight) return weight;
      }
    }
  }

  // 2. Check Tags (matches CSV tags like "0.50ct")
  if (product.tags?.length) {
    for (const tag of product.tags) {
      const weight = parseCaratString(tag);
      if (weight) return weight;
    }
  }

  // 3. Fallback to Metafields or Title
  return parseCaratString(product.metafields?.carat || product.name || '');
}

/**
 * Extract ALL unique carat weights available for this product handle.
 * Essential for accurate faceted counting when one product has multiple sizes.
 */
export function extractAllCaratWeights(product: ProcessedProduct): number[] {
  const carats = new Set<number>();

  // Scan variants (Option 2 in CSV)
  product.variants?.forEach(variant => {
    Object.values(variant.selectedOptions || {}).forEach(val => {
      const weight = parseCaratString(val);
      if (weight) carats.add(weight);
    });
  });

  // Scan tags
  product.tags?.forEach(tag => {
    const weight = parseCaratString(tag);
    if (weight) carats.add(weight);
  });

  return Array.from(carats).sort((a, b) => a - b);
}

/**
 * Check if a product matches a specific CaratWeight range.
 */
export function productMatchesCaratWeight(
  product: ProcessedProduct,
  caratWeight: CaratWeight
): boolean {
  const productCarats = extractAllCaratWeights(product);
  if (productCarats.length === 0) return false;

  return productCarats.some(val => {
    const isAboveMin = val >= caratWeight.min;
    const isBelowMax = caratWeight.max === undefined || val <= caratWeight.max;
    return isAboveMin && isBelowMax;
  });
}

/**
 * Clarity extraction - handles industry notation like "D-VS2" or "VS1"
 */
export function extractClarityGrade(product: ProcessedProduct): ClarityGrade | null {
  const grades: ClarityGrade[] = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'];
  
  // Combine tags and description for a comprehensive search
  const content = `${product.tags?.join(' ')} ${product.description} ${product.metafields?.clarity || ''}`.toUpperCase();

  for (const grade of grades) {
    // Word boundary \b prevents matching "SI" in "Antwerp since..."
    const regex = new RegExp(`\\b${grade}\\b`, 'i');
    if (regex.test(content)) return grade;
  }

  return null;
}

/**
 * Certification extraction - looks for GIA, HRD, or IGI.
 */
export function extractCertification(product: ProcessedProduct): Certification | null {
  const certs: Certification[] = ['GIA', 'HRD', 'IGI'];
  const content = `${product.name} ${product.tags?.join(' ')} ${product.description}`.toUpperCase();

  for (const cert of certs) {
    if (content.includes(cert)) return cert;
  }

  return null;
}

export function productMatchesClarityGrade(product: ProcessedProduct, grade: ClarityGrade): boolean {
  return extractClarityGrade(product) === grade;
}

export function productMatchesCertification(product: ProcessedProduct, cert: Certification): boolean {
  return extractCertification(product) === cert;
}