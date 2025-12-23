import { ProcessedProduct } from '../types/shopify';
import { ClarityGrade, Certification, CaratWeight } from '../config/filterConfig';

/**
 * Extract carat weight from product (returns single value)
 * Priority: Metafields > Title > Variants > Tags > Description
 */
export function extractCaratWeight(product: ProcessedProduct): number | null {
  // 1. Check metafields first
  if (product.metafields?.centerStone) {
    const match = product.metafields.centerStone.match(/(\d+\.?\d*)\s*ct/i);
    if (match) return parseFloat(match[1]);
  }

  if (product.metafields?.carat) {
    const caratValue = parseFloat(product.metafields.carat);
    if (!isNaN(caratValue)) return caratValue;
  }

  // 2. Check product name
  if (product.name) {
    const match = product.name.match(/(\d+\.?\d*)\s*ct/i);
    if (match) return parseFloat(match[1]);
  }

  // 3. NEW: Check Variants
  if (product.variants && product.variants.length > 0) {
    for (const variant of product.variants) {
      if (variant.selectedOptions) {
        for (const value of Object.values(variant.selectedOptions)) {
          const match = String(value).match(/(\d+\.?\d*)\s*ct/i);
          if (match) return parseFloat(match[1]);
        }
      }
    }
  }

  // 4. Check tags
  if (product.tags) {
    for (const tag of product.tags) {
      const match = tag.match(/carat[:\s]*(\d+\.?\d*)/i) || tag.match(/^(\d+\.?\d*)ct$/i);
      if (match) return parseFloat(match[1]);
    }
  }

  return null;
}

/**
 * Extract ALL possible carat weights from product (CRITICAL FIX)
 * This handles products with multiple sizes (e.g., earrings with 0.30, 0.50, and 1.00ct)
 */
export function extractAllCaratWeights(product: ProcessedProduct): number[] {
  const carats = new Set<number>();

  // 1. Check Variants (This matches your new Shopify structure)
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach(variant => {
      // Check individual options (e.g., "Lab-Grown 1.00ct")
      if (variant.selectedOptions) {
        Object.values(variant.selectedOptions).forEach(value => {
          const optionMatch = String(value).match(/(\d+\.?\d*)\s*ct/i);
          if (optionMatch) {
            const val = parseFloat(optionMatch[1]);
            if (!isNaN(val) && val > 0 && val < 10) carats.add(val);
          }
        });
      }
      
      // Fallback: Check the variant title itself
      const titleMatch = variant.title?.match(/(\d+\.?\d*)\s*ct/i);
      if (titleMatch) {
        const val = parseFloat(titleMatch[1]);
        if (!isNaN(val) && val > 0 && val < 10) carats.add(val);
      }
    });
  }

  // 2. Check Metafields
  if (product.metafields?.centerStone) {
    const matches = product.metafields.centerStone.matchAll(/(\d+\.?\d*)\s*ct/gi);
    for (const match of matches) {
      const carat = parseFloat(match[1]);
      if (!isNaN(carat) && carat > 0 && carat < 10) carats.add(carat);
    }
  }

  if (product.metafields?.carat) {
    const caratValue = parseFloat(product.metafields.carat);
    if (!isNaN(caratValue)) carats.add(caratValue);
  }

  // 3. Check name, tags, and description for backward compatibility
  if (product.name) {
    const matches = product.name.matchAll(/(\d+\.?\d*)\s*ct/gi);
    for (const match of matches) {
      const carat = parseFloat(match[1]);
      if (!isNaN(carat) && carat > 0 && carat < 10) carats.add(carat);
    }
  }

  if (product.tags) {
    product.tags.forEach(tag => {
      const match = tag.match(/(\d+\.?\d*)\s*ct/i);
      if (match) {
        const val = parseFloat(match[1]);
        if (!isNaN(val)) carats.add(val);
      }
    });
  }

  return Array.from(carats).sort((a, b) => a - b);
}

// Check if product matches carat weight filter range
export function productMatchesCaratWeight(
  product: ProcessedProduct,
  caratWeight: CaratWeight
): boolean {
  const productCarats = extractAllCaratWeights(product);

  if (productCarats.length === 0) return false;

  return productCarats.some(productCarat => {
    const inRange = productCarat >= caratWeight.min;
    if (caratWeight.max !== undefined) {
      return inRange && productCarat <= caratWeight.max;
    }
    return inRange; // For "2+ ct"
  });
}

// ... existing clarity and certification extraction logic below ...
export function extractClarityGrade(product: ProcessedProduct): ClarityGrade | null {
  const clarityGrades: ClarityGrade[] = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'];
  if (product.metafields?.clarity) {
    const clarity = product.metafields.clarity.toUpperCase();
    for (const grade of clarityGrades) {
      if (clarity.includes(grade)) return grade;
    }
  }
  if (product.tags) {
    for (const tag of product.tags) {
      const tagUpper = tag.toUpperCase();
      for (const grade of clarityGrades) {
        if (tagUpper === grade || tagUpper.includes(`CLARITY:${grade}`)) return grade;
      }
    }
  }
  return null;
}

export function extractCertification(product: ProcessedProduct): Certification | null {
  const certifications: Certification[] = ['GIA', 'HRD', 'IGI'];
  if (product.metafields?.certification) {
    const cert = product.metafields.certification.toUpperCase();
    for (const c of certifications) {
      if (cert.includes(c)) return c;
    }
  }
  if (product.description) {
    const descUpper = product.description.toUpperCase();
    for (const c of certifications) {
      if (descUpper.includes(c)) return c;
    }
  }
  return null;
}