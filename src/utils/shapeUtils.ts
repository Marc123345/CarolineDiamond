import { ProcessedProduct } from '../types/shopify';

/**
 * Normalize shape strings for consistent comparison
 * Converts to lowercase and removes spaces/special characters
 */
export const normalizeShape = (shape: string): string => {
  if (!shape) return '';
  return shape.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
};

/**
 * Shape synonym mapping to handle variations in naming
 */
export const SHAPE_SYNONYMS: Record<string, string[]> = {
  round: ['round', 'roundbrilliant', 'brilliant', 'round brilliant', 'roundcut'],
  oval: ['oval', 'ovalcut'],
  princess: ['princess', 'square', 'princesscut', 'princess-cut', 'squarecut'],
  pear: ['pear', 'teardrop', 'pearcut', 'pearshaped', 'pear-shaped'],
  marquise: ['marquise', 'navette', 'marquisecut'],
  emerald: ['emerald', 'rectangular', 'emeraldcut'],
  cushion: ['cushion', 'pillow', 'cushioncut'],
  asscher: ['asscher', 'asschercut'],
  radiant: ['radiant', 'radiantcut'],
  heart: ['heart', 'heartcut', 'heartshaped', 'heart-shaped']
};

/**
 * Get the canonical shape name from any variation
 */
export const getCanonicalShape = (shape: string): string => {
  if (!shape) return '';

  const normalized = normalizeShape(shape);

  // Check if it's already a canonical name
  if (SHAPE_SYNONYMS[normalized]) {
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }

  // Search through synonyms
  for (const [canonical, synonyms] of Object.entries(SHAPE_SYNONYMS)) {
    if (synonyms.some(syn => normalizeShape(syn) === normalized)) {
      return canonical.charAt(0).toUpperCase() + canonical.slice(1);
    }
  }

  // Return capitalized original if no match
  return shape.charAt(0).toUpperCase() + shape.slice(1);
};

/**
 * Check if two shape strings match
 */
export const shapesMatch = (shape1: string, shape2: string): boolean => {
  if (!shape1 || !shape2) return false;

  const normalized1 = normalizeShape(shape1);
  const normalized2 = normalizeShape(shape2);

  // Direct match
  if (normalized1 === normalized2) return true;

  // Check if both resolve to the same canonical shape
  const canonical1 = getCanonicalShape(shape1);
  const canonical2 = getCanonicalShape(shape2);

  return normalizeShape(canonical1) === normalizeShape(canonical2);
};

/**
 * Extract shape from product tags
 * Looks for tags like "shape:round", "round", "diamond-round", etc.
 */
export const extractShapeFromTags = (tags: string[]): string | null => {
  if (!tags || tags.length === 0) return null;

  // Priority 1: Look for explicit shape: prefix
  const shapeTag = tags.find(tag => tag.toLowerCase().startsWith('shape:'));
  if (shapeTag) {
    const shape = shapeTag.split(':')[1];
    return getCanonicalShape(shape);
  }

  // Priority 2: Look for diamond-shape pattern
  const diamondShapeTag = tags.find(tag => tag.toLowerCase().includes('diamond-'));
  if (diamondShapeTag) {
    const shape = diamondShapeTag.toLowerCase().replace('diamond-', '');
    return getCanonicalShape(shape);
  }

  // Priority 3: Check if any tag matches known shapes
  for (const tag of tags) {
    const normalized = normalizeShape(tag);
    for (const [canonical, synonyms] of Object.entries(SHAPE_SYNONYMS)) {
      if (synonyms.some(syn => normalizeShape(syn) === normalized)) {
        return canonical.charAt(0).toUpperCase() + canonical.slice(1);
      }
    }
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
      // Look for word boundaries to avoid false matches
      const regex = new RegExp(`\\b${synonym}\\b`, 'i');
      if (regex.test(lowerText)) {
        return canonical.charAt(0).toUpperCase() + canonical.slice(1);
      }
    }
  }

  return null;
};

// Cache for shape extraction to improve performance
const shapeCache = new Map<string, string | null>();

/**
 * Extract shape from product data (tags, title, description, metafields)
 * Now supports diamond_shape_available metafield from CSV
 */
export const extractProductShape = (product: ProcessedProduct): string | null => {
  // Use product ID as cache key
  const cacheKey = product.id;
  if (shapeCache.has(cacheKey)) {
    return shapeCache.get(cacheKey) as string | null;
  }

  let result: string | null = null;

  // Priority 1: Check metafields for shape
  if (product.metafields?.ringDesign) {
    const shape = extractShapeFromText(product.metafields.ringDesign);
    if (shape) result = shape;
  }

  // Priority 2: Check tags (including shape: prefixed tags)
  if (!result) {
    const shapeFromTags = extractShapeFromTags(product.tags);
    if (shapeFromTags) result = shapeFromTags;
  }

  // Priority 3: Check product title
  if (!result) {
    const shapeFromTitle = extractShapeFromText(product.name);
    if (shapeFromTitle) result = shapeFromTitle;
  }

  // Priority 4: Check description
  if (!result) {
    const shapeFromDescription = extractShapeFromText(product.description);
    if (shapeFromDescription) result = shapeFromDescription;
  }

  // Cache the result
  shapeCache.set(cacheKey, result);
  return result;
};

/**
 * Check if product supports multiple diamond shapes (via metafield)
 * Used for products with diamond_shape_available: TRUE metafield
 */
export const supportsMultipleShapes = (product: ProcessedProduct): boolean => {
  // Check for diamond_shape_available metafield
  if (product.tags?.includes('diamond_shape_available:true')) {
    return true;
  }

  // Check description for multiple shape mentions
  const description = product.description?.toLowerCase() || '';
  if (description.includes('diamond shapes available:') ||
      description.includes('available shapes:') ||
      description.includes('shapes available:')) {
    return true;
  }

  return false;
};

/**
 * Build a dynamic shape-to-images mapping from product variants
 */
export const buildShapeImageMap = (product: ProcessedProduct): Record<string, string[]> => {
  const shapeMap: Record<string, string[]> = {};

  // Get the product's shape
  const productShape = extractProductShape(product);
  if (!productShape) {
    // If no shape found, return all product images
    return { default: product.images };
  }

  const normalizedShape = normalizeShape(productShape);

  // Since variants don't have shape data in current structure,
  // map all variant images to the product's shape
  const allImages = new Set<string>();

  // Add product-level images
  product.images.forEach(img => allImages.add(img));

  // Add variant images
  product.variants.forEach(variant => {
    if (variant.image) {
      allImages.add(variant.image);
    }
    if (variant.images && variant.images.length > 0) {
      variant.images.forEach(img => allImages.add(img));
    }
  });

  shapeMap[normalizedShape] = Array.from(allImages);

  return shapeMap;
};

/**
 * Get images for a specific shape from a product
 */
export const getImagesForShape = (product: ProcessedProduct, shape: string): string[] => {
  const shapeMap = buildShapeImageMap(product);
  const normalized = normalizeShape(shape);

  // Try to find exact match
  if (shapeMap[normalized]) {
    return shapeMap[normalized];
  }

  // Try to find by canonical name
  const canonical = normalizeShape(getCanonicalShape(shape));
  if (shapeMap[canonical]) {
    return shapeMap[canonical];
  }

  // Fallback to default or all images
  return shapeMap.default || product.images || [];
};

/**
 * Check if a product matches a shape filter
 * Handles both single-shape and multi-shape products
 */
export const productMatchesShape = (product: ProcessedProduct, targetShape: string): boolean => {
  // If product supports multiple shapes (diamond_shape_available: TRUE), match any shape filter
  if (supportsMultipleShapes(product)) {
    return true;
  }

  // Otherwise check if the product's specific shape matches
  const productShape = extractProductShape(product);
  if (!productShape) return false;

  return shapesMatch(productShape, targetShape);
};
