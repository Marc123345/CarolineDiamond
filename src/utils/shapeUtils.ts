import { ProcessedProduct } from '../types/shopify';

/**
 * Normalize shape strings for consistent comparison
 */
export const normalizeShape = (shape: string): string => {
  if (!shape) return '';
  return shape.toLowerCase().trim().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
};

/**
 * Shape synonym mapping - covers the variations found in your CSV tags and titles
 */
export const SHAPE_SYNONYMS: Record<string, string[]> = {
  round: ['round', 'roundbrilliant', 'brilliant', 'round-diamond', 'roundcut'],
  oval: ['oval', 'oval-diamond', 'ovalcut'],
  princess: ['princess', 'square', 'princess-diamond', 'princesscut'],
  pear: ['pear', 'teardrop', 'pear-diamond', 'pearshaped', 'pear-shaped'],
  marquise: ['marquise', 'navette', 'marquise-diamond', 'marquisecut'],
  emerald: ['emerald', 'emerald-diamond', 'emeraldcut'],
  cushion: ['cushion', 'cushion-diamond', 'pillow', 'cushioncut'],
  asscher: ['asscher', 'asscher-diamond'],
  radiant: ['radiant', 'radiant-diamond'],
  heart: ['heart', 'heart-diamond', 'heartcut', 'heartshaped']
};

/**
 * Get the canonical shape name (e.g., "pear-diamond" -> "Pear")
 */
export const getCanonicalShape = (shape: string): string => {
  if (!shape) return '';
  const normalized = normalizeShape(shape);

  for (const [canonical, synonyms] of Object.entries(SHAPE_SYNONYMS)) {
    if (canonical === normalized || synonyms.some(syn => normalizeShape(syn) === normalized)) {
      return canonical.charAt(0).toUpperCase() + canonical.slice(1);
    }
  }

  return shape.charAt(0).toUpperCase() + shape.slice(1);
};

export const shapesMatch = (shape1: string, shape2: string): boolean => {
  if (!shape1 || !shape2) return false;
  return getCanonicalShape(shape1) === getCanonicalShape(shape2);
};

/**
 * Extracts shape by looking for the *-diamond pattern used in your CSV
 */
export const extractShapeFromTags = (tags: string[]): string | null => {
  if (!tags?.length) return null;

  // 1. Look for explicit shape tags from CSV (e.g., "pear-diamond")
  const csvPatternTag = tags.find(tag => tag.toLowerCase().endsWith('-diamond'));
  if (csvPatternTag) {
    const shapePart = csvPatternTag.split('-')[0];
    return getCanonicalShape(shapePart);
  }

  // 2. Look for "shape:" prefix
  const prefixTag = tags.find(tag => tag.toLowerCase().startsWith('shape:'));
  if (prefixTag) return getCanonicalShape(prefixTag.split(':')[1]);

  // 3. General synonym check
  for (const tag of tags) {
    const canonical = getCanonicalShape(tag);
    if (SHAPE_SYNONYMS[canonical.toLowerCase()]) return canonical;
  }

  return null;
};

export const extractShapeFromText = (text: string): string | null => {
  if (!text) return null;
  const lowerText = text.toLowerCase();

  for (const [canonical, synonyms] of Object.entries(SHAPE_SYNONYMS)) {
    for (const synonym of synonyms) {
      // Use regex to avoid matching "pear" inside "pearly"
      const regex = new RegExp(`\\b${synonym}\\b`, 'i');
      if (regex.test(lowerText)) return canonical.charAt(0).toUpperCase() + canonical.slice(1);
    }
  }
  return null;
};

const shapeCache = new Map<string, string | null>();

/**
 * Main extraction logic - Checks Metafields, then Tags, then Title
 */
export const extractProductShape = (product: ProcessedProduct): string | null => {
  if (shapeCache.has(product.id)) return shapeCache.get(product.id)!;

  let result: string | null = null;

  // Priority 1: Check the specific "Diamond Shape Available" Metafield from CSV
  const shapeMeta = product.metafields?.diamondShapeAvailable;
  if (shapeMeta && typeof shapeMeta === 'string' && shapeMeta !== 'TRUE' && shapeMeta !== 'FALSE') {
    result = getCanonicalShape(shapeMeta);
  }

  // Priority 2: Tags (looking for 'pear-diamond' etc.)
  if (!result) result = extractShapeFromTags(product.tags);

  // Priority 3: Title (e.g., "Solitaire Engagement Ring – Pear Diamond")
  if (!result) result = extractShapeFromText(product.name);

  shapeCache.set(product.id, result);
  return result;
};

/**
 * Checks if the product is a "Multi-Shape" placeholder 
 * (In CSV: diamond_shape_available = TRUE)
 */
export const supportsMultipleShapes = (product: ProcessedProduct): boolean => {
  const meta = product.metafields?.diamondShapeAvailable;
  return meta === 'TRUE' || meta === true || product.tags?.includes('multi-shape');
};

export const productMatchesShape = (product: ProcessedProduct, targetShape: string): boolean => {
  if (supportsMultipleShapes(product)) return true;
  const productShape = extractProductShape(product);
  return productShape ? shapesMatch(productShape, targetShape) : false;
};

export const buildShapeImageMap = (product: ProcessedProduct): Record<string, string[]> => {
  const shape = extractProductShape(product);
  const key = shape ? normalizeShape(shape) : 'default';
  return { [key]: product.images };
};