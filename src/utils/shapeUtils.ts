import { ProcessedProduct } from '../types/shopify';

/**
 * Normalizes shape strings for consistent comparison (e.g., "Pear Shape" -> "pear")
 */
export const normalizeShape = (shape: string): string => {
  if (!shape) return '';
  return shape.toLowerCase().trim().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
};

/**
 * Shape synonym mapping - handles naming variations found in Shopify CSV tags.
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

/**
 * Check if two shape strings match based on canonical names
 */
export const shapesMatch = (shape1: string, shape2: string): boolean => {
  if (!shape1 || !shape2) return false;
  return getCanonicalShape(shape1) === getCanonicalShape(shape2);
};

/**
 * Extract shape from product tags (handles "pear-diamond" pattern)
 */
export const extractShapeFromTags = (tags: string[]): string | null => {
  if (!tags?.length) return null;

  const csvPatternTag = tags.find(tag => tag.toLowerCase().endsWith('-diamond'));
  if (csvPatternTag) {
    const shapePart = csvPatternTag.split('-')[0];
    return getCanonicalShape(shapePart);
  }

  const prefixTag = tags.find(tag => tag.toLowerCase().startsWith('shape:'));
  if (prefixTag) return getCanonicalShape(prefixTag.split(':')[1]);

  for (const tag of tags) {
    const canonical = getCanonicalShape(tag);
    if (SHAPE_SYNONYMS[canonical.toLowerCase()]) return canonical;
  }

  return null;
};

/**
 * Extract shape from product title or description
 */
export const extractShapeFromText = (text: string): string | null => {
  if (!text) return null;
  const lowerText = text.toLowerCase();

  for (const [canonical, synonyms] of Object.entries(SHAPE_SYNONYMS)) {
    for (const synonym of synonyms) {
      const regex = new RegExp(`\\b${synonym}\\b`, 'i');
      if (regex.test(lowerText)) return canonical.charAt(0).toUpperCase() + canonical.slice(1);
    }
  }
  return null;
};

const shapeCache = new Map<string, string | null>();

/**
 * Main logic to extract shape from all product fields
 */
export const extractProductShape = (product: ProcessedProduct): string | null => {
  if (shapeCache.has(product.id)) return shapeCache.get(product.id)!;

  let result: string | null = null;
  const shapeMeta = product.metafields?.diamondShapeAvailable;
  
  if (shapeMeta && typeof shapeMeta === 'string' && shapeMeta !== 'TRUE' && shapeMeta !== 'FALSE') {
    result = getCanonicalShape(shapeMeta);
  }

  if (!result) result = extractShapeFromTags(product.tags);
  if (!result) result = extractShapeFromText(product.name);

  shapeCache.set(product.id, result);
  return result;
};

/**
 * Checks if product supports multiple shapes (CSV metafield check)
 */
export const supportsMultipleShapes = (product: ProcessedProduct): boolean => {
  const meta = product.metafields?.diamondShapeAvailable;
  return meta === 'TRUE' || meta === true || (product.tags || []).includes('multi-shape');
};

/**
 * Builds a map of shapes to images
 */
export const buildShapeImageMap = (product: ProcessedProduct): Record<string, string[]> => {
  const shape = extractProductShape(product);
  const key = shape ? normalizeShape(shape) : 'default';
  
  return {
    [key]: product.images || [],
    default: product.images || []
  };
};

/**
 * EXPORTED: getImagesForShape
 * FIXES THE SYNTAX ERROR in ProductDetailPage.tsx
 */
export const getImagesForShape = (product: ProcessedProduct, shape: string): string[] => {
  const shapeMap = buildShapeImageMap(product);
  const normalized = normalizeShape(shape);

  if (shapeMap[normalized]) {
    return shapeMap[normalized];
  }

  const canonical = normalizeShape(getCanonicalShape(shape));
  if (shapeMap[canonical]) {
    return shapeMap[canonical];
  }

  return shapeMap.default || product.images || [];
};

/**
 * Check if a product matches a shape filter
 */
export const productMatchesShape = (product: ProcessedProduct, targetShape: string): boolean => {
  if (supportsMultipleShapes(product)) return true;
  const productShape = extractProductShape(product);
  return productShape ? shapesMatch(productShape, targetShape) : false;
};