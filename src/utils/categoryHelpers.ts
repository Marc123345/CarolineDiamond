import { ProcessedProduct } from '../types/shopify';
import { JewelryCategory } from '../config/filterConfig';

/**
 * Category matching patterns for accurate product filtering
 */

export const CATEGORY_PATTERNS: Record<JewelryCategory, RegExp[]> = {
  'Engagement Ring': [
    /^ring$/i,
    /^rings$/i,
    /engagement\s*ring/i,
    /wedding\s*ring/i,
    /diamond\s*ring/i,
    /band$/i,
    /^ring\s/i,
    /\sring$/i,
  ],
  'Earrings': [
    /^earring$/i,
    /^earrings$/i,
    /stud\s*earring/i,
    /diamond\s*earring/i,
    /hoop\s*earring/i,
    /drop\s*earring/i,
    /dangle\s*earring/i,
    /^earring\s/i,
    /\searring/i,
  ],
  'Necklace': [
    /^necklace$/i,
    /^necklaces$/i,
    /pendant$/i,
    /diamond\s*necklace/i,
    /chain$/i,
    /^necklace\s/i,
    /\snecklace$/i,
  ],
};

export const CATEGORY_KEYWORDS: Record<JewelryCategory, string[]> = {
  'Engagement Ring': [
    'Ring',
    'Rings',
    'ring',
    'rings',
    'Engagement Ring',
    'engagement ring',
    'Wedding Ring',
    'Wedding Band',
    'Band',
    'Diamond Ring',
    'Solitaire Ring',
    'Halo Ring',
  ],
  'Earrings': [
    'Earring',
    'Earrings',
    'earring',
    'earrings',
    'Diamond Earrings',
    'Hoop Earrings',
    'Drop Earrings',
  ],
  'Necklace': [
    'Necklace',
    'Necklaces',
    'necklace',
    'necklaces',
    'Pendant',
    'Diamond Necklace',
    'Chain',
  ],
};

/**
 * Mapping of category plural forms to singular forms
 */
const CATEGORY_SINGULAR_FORMS: Record<JewelryCategory, string> = {
  'Engagement Ring': 'ring',
  'Earrings': 'earring',
  'Necklace': 'necklace'
};

/**
 * Check if a product belongs to a specific category
 */
export function productMatchesCategory(
  product: ProcessedProduct,
  category: JewelryCategory
): boolean {
  if (!product.tags || product.tags.length === 0) {
    return false;
  }

  // Check exact keyword matches first (fastest)
  const keywords = CATEGORY_KEYWORDS[category];
  if (keywords) {
    for (const keyword of keywords) {
      if (product.tags.some(tag => tag === keyword || tag.toLowerCase() === keyword.toLowerCase())) {
        return true;
      }
    }
  }

  // Check pattern matches (more flexible)
  const patterns = CATEGORY_PATTERNS[category];
  if (patterns) {
    for (const pattern of patterns) {
      if (product.tags.some(tag => pattern.test(tag))) {
        return true;
      }
    }
  }

  // Check product title as fallback (with word boundaries to avoid false matches)
  if (product.name) {
    const categoryLower = category.toLowerCase();
    const categorySingular = CATEGORY_SINGULAR_FORMS[category];

    // Use word boundaries to avoid matching "ring" in "earring" or "necklace" in other words
    const categoryRegex = new RegExp(`\\b${categoryLower}\\b`, 'i');
    const singularRegex = new RegExp(`\\b${categorySingular}\\b`, 'i');

    if (categoryRegex.test(product.name) || singularRegex.test(product.name)) {
      return true;
    }
  }

  // Check product type metadata (with word boundaries)
  if (product.metafields?.productType) {
    const categoryLower = category.toLowerCase();
    const categorySingular = CATEGORY_SINGULAR_FORMS[category];
    
    const categoryRegex = new RegExp(`\\b${categoryLower}\\b`, 'i');
    const singularRegex = new RegExp(`\\b${categorySingular}\\b`, 'i');
    
    if (categoryRegex.test(product.metafields.productType) || singularRegex.test(product.metafields.productType)) {
      return true;
    }
  }

  return false;
}

/**
 * Extract category from product
 */
export function extractCategoryFromProduct(product: ProcessedProduct): JewelryCategory | null {
  // Check each category in priority order
  const categories: JewelryCategory[] = ['Engagement Ring', 'Earrings', 'Necklace'];

  for (const category of categories) {
    if (productMatchesCategory(product, category)) {
      return category;
    }
  }

  return null;
}

/**
 * Get products by category
 */
export function filterProductsByCategory(
  products: ProcessedProduct[],
  category: JewelryCategory
): ProcessedProduct[] {
  return products.filter(product => productMatchesCategory(product, category));
}

/**
 * Get category distribution for products
 */
export function getCategoryDistribution(products: ProcessedProduct[]): Record<JewelryCategory, number> {
  const distribution: Record<JewelryCategory, number> = {
    'Engagement Ring': 0,
    'Earrings': 0,
    'Necklace': 0,
  };

  products.forEach(product => {
    const category = extractCategoryFromProduct(product);
    if (category) {
      distribution[category]++;
    }
  });

  return distribution;
}

/**
 * Validate category filter
 */
export function isCategoryFilterValid(category: any): category is JewelryCategory {
  return category === 'Engagement Ring' || category === 'Earrings' || category === 'Necklace' ||
         category === 'Rings' || category === 'Necklaces'; // Legacy support
}
