import { ProcessedProduct } from '../types/shopify';
import { ClarityGrade, Certification, CaratWeight } from '../config/filterConfig';

// Extract carat weight from product (returns single value)
export function extractCaratWeight(product: ProcessedProduct): number | null {
  // Check variants first (highest priority - where new data lives)
  if (product.variants && product.variants.length > 0) {
    for (const variant of product.variants) {
      // Check variant title
      if (variant.title) {
        const match = variant.title.match(/(\d+\.?\d*)\s*ct/i);
        if (match) {
          return parseFloat(match[1]);
        }
      }

      // Check variant selected options
      if (variant.selectedOptions) {
        for (const [key, value] of Object.entries(variant.selectedOptions)) {
          if (key.toLowerCase().includes('carat') ||
              key.toLowerCase().includes('weight') ||
              key.toLowerCase().includes('diamond')) {
            const match = String(value).match(/(\d+\.?\d*)\s*ct/i);
            if (match) {
              return parseFloat(match[1]);
            }
          }
        }
      }
    }
  }

  // Check metafields (fallback)
  if (product.metafields?.centerStone) {
    const match = product.metafields.centerStone.match(/(\d+\.?\d*)\s*ct/i);
    if (match) {
      return parseFloat(match[1]);
    }
  }

  if (product.metafields?.carat) {
    const caratValue = parseFloat(product.metafields.carat);
    if (!isNaN(caratValue)) {
      return caratValue;
    }
  }

  // Check product title (most specific)
  if (product.name) {
    const match = product.name.match(/(\d+\.?\d*)\s*ct/i);
    if (match) {
      return parseFloat(match[1]);
    }
  }

  // Check tags (reliable single value)
  if (product.tags) {
    for (const tag of product.tags) {
      const match = tag.match(/carat[:\s]*(\d+\.?\d*)/i) || tag.match(/^(\d+\.?\d*)ct$/i);
      if (match) {
        return parseFloat(match[1]);
      }
    }
  }

  // Check product description (least reliable, may have multiple options)
  if (product.description) {
    const match = product.description.match(/(\d+\.?\d*)\s*ct/i);
    if (match) {
      return parseFloat(match[1]);
    }
  }

  return null;
}

// Extract ALL possible carat weights from product (for products with multiple options)
export function extractAllCaratWeights(product: ProcessedProduct): number[] {
  const carats = new Set<number>();

  // 1. NEW: Check Variants first (highest priority - where new data lives)
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach(variant => {
      // Check variant title for carat weight (e.g., "0.50 ct / Yellow Gold")
      if (variant.title) {
        const titleMatches = variant.title.matchAll(/(\d+\.?\d*)\s*ct/gi);
        for (const match of titleMatches) {
          const carat = parseFloat(match[1]);
          if (!isNaN(carat) && carat > 0 && carat < 10) {
            carats.add(carat);
          }
        }
      }

      // Check variant selectedOptions for carat weight
      if (variant.selectedOptions) {
        Object.entries(variant.selectedOptions).forEach(([key, value]) => {
          // Look for carat in option names like "Carat", "Weight", "Diamond Size"
          if (key.toLowerCase().includes('carat') ||
              key.toLowerCase().includes('weight') ||
              key.toLowerCase().includes('diamond')) {
            const optionMatches = String(value).matchAll(/(\d+\.?\d*)\s*ct/gi);
            for (const match of optionMatches) {
              const carat = parseFloat(match[1]);
              if (!isNaN(carat) && carat > 0 && carat < 10) {
                carats.add(carat);
              }
            }
          }
        });
      }
    });
  }

  // 2. Check metafields (fallback)
  if (product.metafields?.centerStone) {
    const matches = product.metafields.centerStone.matchAll(/(\d+\.?\d*)\s*ct/gi);
    for (const match of matches) {
      const carat = parseFloat(match[1]);
      if (!isNaN(carat) && carat > 0 && carat < 10) {
        carats.add(carat);
      }
    }
  }

  if (product.metafields?.carat) {
    const caratValue = parseFloat(product.metafields.carat);
    if (!isNaN(caratValue)) {
      carats.add(caratValue);
    }
  }

  // Check product title
  if (product.name) {
    const matches = product.name.matchAll(/(\d+\.?\d*)\s*ct/gi);
    for (const match of matches) {
      const carat = parseFloat(match[1]);
      if (!isNaN(carat) && carat > 0 && carat < 10) {
        carats.add(carat);
      }
    }
  }

  // Check tags
  if (product.tags) {
    for (const tag of product.tags) {
      const matches = tag.matchAll(/(\d+\.?\d*)\s*ct/gi);
      for (const match of matches) {
        const carat = parseFloat(match[1]);
        if (!isNaN(carat) && carat > 0 && carat < 10) {
          carats.add(carat);
        }
      }
    }
  }

  // Check description for "Carat Options:" pattern
  if (product.description) {
    // Look for "Carat Options: 0.50 ct / 1.00 ct / 1.50 ct" pattern
    const optionsMatch = product.description.match(/Carat Options?[:\s]*([^•\n]+)/i);
    if (optionsMatch) {
      const matches = optionsMatch[1].matchAll(/(\d+\.?\d*)\s*ct/gi);
      for (const match of matches) {
        const carat = parseFloat(match[1]);
        if (!isNaN(carat) && carat > 0 && carat < 10) {
          carats.add(carat);
        }
      }
    } else {
      // Fallback: check entire description
      const matches = product.description.matchAll(/(\d+\.?\d*)\s*ct/gi);
      for (const match of matches) {
        const carat = parseFloat(match[1]);
        // Only add reasonable carat values (filter out things like 0.25 ct side diamonds)
        if (!isNaN(carat) && carat >= 0.3 && carat < 10) {
          carats.add(carat);
        }
      }
    }
  }

  return Array.from(carats).sort((a, b) => a - b);
}

// Extract clarity grade from product
export function extractClarityGrade(product: ProcessedProduct): ClarityGrade | null {
  const clarityGrades: ClarityGrade[] = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'];

  // Check metafields
  if (product.metafields?.clarity) {
    const clarity = product.metafields.clarity.toUpperCase();
    for (const grade of clarityGrades) {
      if (clarity.includes(grade)) {
        return grade;
      }
    }
  }

  // Check tags
  if (product.tags) {
    for (const tag of product.tags) {
      const tagUpper = tag.toUpperCase();
      for (const grade of clarityGrades) {
        if (tagUpper === grade || tagUpper.includes(`CLARITY:${grade}`) || tagUpper.includes(`CLARITY ${grade}`)) {
          return grade;
        }
      }
    }
  }

  // Check title
  if (product.name) {
    const nameUpper = product.name.toUpperCase();
    for (const grade of clarityGrades) {
      if (nameUpper.includes(grade)) {
        return grade;
      }
    }
  }

  return null;
}

// Extract certification from product
export function extractCertification(product: ProcessedProduct): Certification | null {
  const certifications: Certification[] = ['GIA', 'HRD', 'IGI'];

  // Check metafields
  if (product.metafields?.certification) {
    const cert = product.metafields.certification.toUpperCase();
    for (const certification of certifications) {
      if (cert.includes(certification)) {
        return certification;
      }
    }
  }

  // Check tags
  if (product.tags) {
    for (const tag of product.tags) {
      const tagUpper = tag.toUpperCase();
      for (const cert of certifications) {
        if (tagUpper === cert || tagUpper.includes(`CERT:${cert}`) || tagUpper.includes(`${cert} CERTIFIED`)) {
          return cert;
        }
      }
    }
  }

  // Check title
  if (product.name) {
    const nameUpper = product.name.toUpperCase();
    for (const cert of certifications) {
      if (nameUpper.includes(cert)) {
        return cert;
      }
    }
  }

  // Check description
  if (product.description) {
    const descUpper = product.description.toUpperCase();
    for (const cert of certifications) {
      if (descUpper.includes(cert)) {
        return cert;
      }
    }
  }

  return null;
}

// Check if product matches carat weight filter
export function productMatchesCaratWeight(
  product: ProcessedProduct,
  caratWeight: CaratWeight
): boolean {
  // Get all possible carat weights for this product (handles products with multiple options)
  const productCarats = extractAllCaratWeights(product);

  if (productCarats.length === 0) {
    return false;
  }

  // Product matches if ANY of its carat options fall within the filter range
  return productCarats.some(productCarat => {
    const inRange = productCarat >= caratWeight.min;

    if (caratWeight.max !== undefined) {
      return inRange && productCarat <= caratWeight.max;
    }

    return inRange; // For "2+ ct" option
  });
}

// Check if product matches clarity grade
export function productMatchesClarityGrade(
  product: ProcessedProduct,
  clarityGrade: ClarityGrade
): boolean {
  const productClarity = extractClarityGrade(product);
  return productClarity === clarityGrade;
}

// Check if product matches certification
export function productMatchesCertification(
  product: ProcessedProduct,
  certification: Certification
): boolean {
  const productCert = extractCertification(product);
  return productCert === certification;
}

// Get clarity grade quality score (higher is better)
export function getClarityScore(clarity: ClarityGrade): number {
  const scores: Record<ClarityGrade, number> = {
    'FL': 110,
    'IF': 100,
    'VVS1': 90,
    'VVS2': 85,
    'VS1': 80,
    'VS2': 75,
    'SI1': 65,
    'SI2': 60,
    'I1': 40,
    'I2': 30,
    'I3': 20,
  };
  return scores[clarity];
}

// Get clarity grade display info
export function getClarityDisplayInfo(clarity: ClarityGrade): {
  name: string;
  fullName: string;
  description: string;
  quality: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
} {
  const info: Record<ClarityGrade, {
    name: string;
    fullName: string;
    description: string;
    quality: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
  }> = {
    'FL': {
      name: 'FL',
      fullName: 'Flawless',
      description: 'No inclusions or blemishes visible under 10x magnification',
      quality: 'Excellent',
    },
    'IF': {
      name: 'IF',
      fullName: 'Internally Flawless',
      description: 'No inclusions, only minor blemishes under 10x magnification',
      quality: 'Excellent',
    },
    'VVS1': {
      name: 'VVS1',
      fullName: 'Very Very Slightly Included 1',
      description: 'Inclusions extremely difficult to see under 10x magnification',
      quality: 'Excellent',
    },
    'VVS2': {
      name: 'VVS2',
      fullName: 'Very Very Slightly Included 2',
      description: 'Inclusions very difficult to see under 10x magnification',
      quality: 'Excellent',
    },
    'VS1': {
      name: 'VS1',
      fullName: 'Very Slightly Included 1',
      description: 'Inclusions minor and difficult to see under 10x magnification',
      quality: 'Very Good',
    },
    'VS2': {
      name: 'VS2',
      fullName: 'Very Slightly Included 2',
      description: 'Inclusions minor and somewhat easy to see under 10x magnification',
      quality: 'Very Good',
    },
    'SI1': {
      name: 'SI1',
      fullName: 'Slightly Included 1',
      description: 'Inclusions noticeable under 10x magnification',
      quality: 'Good',
    },
    'SI2': {
      name: 'SI2',
      fullName: 'Slightly Included 2',
      description: 'Inclusions easily noticeable under 10x magnification',
      quality: 'Good',
    },
    'I1': {
      name: 'I1',
      fullName: 'Included 1',
      description: 'Inclusions visible to the naked eye',
      quality: 'Fair',
    },
    'I2': {
      name: 'I2',
      fullName: 'Included 2',
      description: 'Inclusions easily visible to the naked eye',
      quality: 'Poor',
    },
    'I3': {
      name: 'I3',
      fullName: 'Included 3',
      description: 'Inclusions prominent and affect transparency/brilliance',
      quality: 'Poor',
    },
  };

  return info[clarity];
}

// Get certification display info
export function getCertificationDisplayInfo(cert: Certification): {
  name: string;
  fullName: string;
  description: string;
  reputation: 'Excellent' | 'Very Good' | 'Good';
  logo?: string;
} {
  const info: Record<Certification, {
    name: string;
    fullName: string;
    description: string;
    reputation: 'Excellent' | 'Very Good' | 'Good';
    logo?: string;
  }> = {
    'GIA': {
      name: 'GIA',
      fullName: 'Gemological Institute of America',
      description: 'World\'s most respected diamond grading authority',
      reputation: 'Excellent',
      logo: '/images/logos/gia.svg',
    },
    'HRD': {
      name: 'HRD',
      fullName: 'HRD Antwerp',
      description: 'European leader in diamond certification',
      reputation: 'Excellent',
      logo: '/images/logos/hrd.svg',
    },
    'IGI': {
      name: 'IGI',
      fullName: 'International Gemological Institute',
      description: 'Leading independent laboratory for grading diamonds',
      reputation: 'Very Good',
      logo: '/images/logos/igi.svg',
    },
  };

  return info[cert];
}

// Get available clarity grades from products
export function getAvailableClarityGrades(products: ProcessedProduct[]): Set<ClarityGrade> {
  const grades = new Set<ClarityGrade>();

  products.forEach(product => {
    const clarity = extractClarityGrade(product);
    if (clarity) {
      grades.add(clarity);
    }
  });

  return grades;
}

// Get available certifications from products
export function getAvailableCertifications(products: ProcessedProduct[]): Set<Certification> {
  const certs = new Set<Certification>();

  products.forEach(product => {
    const cert = extractCertification(product);
    if (cert) {
      certs.add(cert);
    }
  });

  return certs;
}

// Get carat weight distribution
export function getCaratWeightDistribution(products: ProcessedProduct[]): {
  range: string;
  count: number;
  percentage: number;
}[] {
  const distribution = {
    '0.5-0.99': 0,
    '1.0-1.49': 0,
    '1.5-1.99': 0,
    '2.0+': 0,
  };

  products.forEach(product => {
    const carat = extractCaratWeight(product);
    if (carat !== null) {
      if (carat >= 0.5 && carat < 1.0) distribution['0.5-0.99']++;
      else if (carat >= 1.0 && carat < 1.5) distribution['1.0-1.49']++;
      else if (carat >= 1.5 && carat < 2.0) distribution['1.5-1.99']++;
      else if (carat >= 2.0) distribution['2.0+']++;
    }
  });

  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);

  return Object.entries(distribution).map(([range, count]) => ({
    range,
    count,
    percentage: total > 0 ? (count / total) * 100 : 0,
  }));
}
