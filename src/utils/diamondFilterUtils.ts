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

  // 3. Check Variants (Essential for your new structure)
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

  // 4. Check tags (CSV format: "0.30ct", "0.50ct", "1.00ct", "1.50ct")
  if (product.tags) {
    for (const tag of product.tags) {
      // Match exact carat tags from CSV: "0.30ct", "0.50 ct", etc. (with optional space)
      const exactMatch = tag.match(/^(\d+\.?\d*)\s*ct$/i);
      if (exactMatch) return parseFloat(exactMatch[1]);

      // Also match "carat:" prefix format
      const prefixMatch = tag.match(/carat[:\s]*(\d+\.?\d*)/i);
      if (prefixMatch) return parseFloat(prefixMatch[1]);
    }
  }

  return null;
}

/**
 * Extract ALL possible carat weights from product
 * Necessary for products with multiple sizes (e.g., earrings)
 */
export function extractAllCaratWeights(product: ProcessedProduct): number[] {
  const carats = new Set<number>();

  // Check Variants first as per your new backend structure
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach(variant => {
      if (variant.selectedOptions) {
        Object.values(variant.selectedOptions).forEach(value => {
          const optionMatch = String(value).match(/(\d+\.?\d*)\s*ct/i);
          if (optionMatch) {
            const val = parseFloat(optionMatch[1]);
            if (!isNaN(val) && val > 0 && val < 10) carats.add(val);
          }
        });
      }
      
      const titleMatch = variant.title?.match(/(\d+\.?\d*)\s*ct/i);
      if (titleMatch) {
        const val = parseFloat(titleMatch[1]);
        if (!isNaN(val) && val > 0 && val < 10) carats.add(val);
      }
    });
  }

  // Check Metafields
  if (product.metafields?.carat) {
    const val = parseFloat(product.metafields.carat);
    if (!isNaN(val)) carats.add(val);
  }

  // Check name and tags
  if (product.name) {
    const matches = product.name.matchAll(/(\d+\.?\d*)\s*ct/gi);
    for (const match of matches) {
      const carat = parseFloat(match[1]);
      if (!isNaN(carat) && carat > 0) carats.add(carat);
    }
  }

  return Array.from(carats).sort((a, b) => a - b);
}

/**
 * Check if product matches carat weight filter range
 */
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
    return inRange;
  });
}

/**
 * Clarity and Certification extraction
 * CSV data shows "D-VS2" format in descriptions and tags
 */
export function extractClarityGrade(product: ProcessedProduct): ClarityGrade | null {
  const clarityGrades: ClarityGrade[] = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'];

  // Check metafields first
  if (product.metafields?.clarity) {
    const clarity = product.metafields.clarity.toUpperCase();
    for (const grade of clarityGrades) {
      if (clarity.includes(grade)) return grade;
    }
  }

  // Check tags for clarity (e.g., "D-VS2", "VS2", etc.)
  if (product.tags) {
    for (const tag of product.tags) {
      const tagUpper = tag.toUpperCase();
      for (const grade of clarityGrades) {
        // Match "D-VS2" or just "VS2"
        if (tagUpper.includes(grade)) return grade;
      }
    }
  }

  // Check description (common location for "D-VS2" notation)
  if (product.description) {
    const descUpper = product.description.toUpperCase();
    for (const grade of clarityGrades) {
      if (descUpper.includes(grade)) return grade;
    }
  }

  return null;
}

export function extractCertification(product: ProcessedProduct): Certification | null {
  const certifications: Certification[] = ['GIA', 'HRD', 'IGI'];

  // Check tags first (most explicit)
  if (product.tags) {
    for (const tag of product.tags) {
      const tagUpper = tag.toUpperCase();
      for (const cert of certifications) {
        if (tagUpper.includes(cert)) return cert;
      }
    }
  }

  // Check description (CSV shows "IGI/GIA/HRD-certified" in descriptions)
  if (product.description) {
    const descUpper = product.description.toUpperCase();
    for (const cert of certifications) {
      if (descUpper.includes(cert)) return cert;
    }
  }

  // Check product name
  if (product.name) {
    const nameUpper = product.name.toUpperCase();
    for (const cert of certifications) {
      if (nameUpper.includes(cert)) return cert;
    }
  }

  return null;
}

/**
 * Check if product matches clarity grade filter
 */
export function productMatchesClarityGrade(
  product: ProcessedProduct,
  clarityGrade: ClarityGrade
): boolean {
  const productClarity = extractClarityGrade(product);
  return productClarity === clarityGrade;
}

/**
 * Check if product matches certification filter
 */
export function productMatchesCertification(
  product: ProcessedProduct,
  certification: Certification
): boolean {
  const productCert = extractCertification(product);
  return productCert === certification;
}