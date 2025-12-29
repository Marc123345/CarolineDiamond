/**
 * src/utils/shapeUtils.ts
 * Refactored for Diamonds By CS Canonical Schema
 */
import { ProcessedProduct } from '../types/shopify';
import { ALL_SHAPES, SHAPES_BY_STYLE, Shape, RingStyle } from '../config/filterConfig';

/**
 * Normalizes shape strings to canonical backend values.
 * Required: round-diamond, princess-diamond, etc.
 */
export const SHAPE_TO_TAG: Record<string, string> = {
  'Round': 'round-diamond',
  'Princess': 'princess-diamond',
  'Cushion': 'cushion-diamond',
  'Emerald': 'emerald-diamond',
  'Oval': 'oval-diamond',
  'Pear': 'pear-diamond',
  'Marquise': 'marquise-diamond',
  'Heart': 'heart-diamond'
};

/**
 * Maps variant option values or synonyms to canonical Shape labels.
 */
export const SHAPE_SYNONYMS: Record<string, Shape> = {
  'round': 'Round',
  'brilliant': 'Round',
  'princess': 'Princess',
  'cushion': 'Cushion',
  'emerald': 'Emerald',
  'oval': 'Oval',
  'pear': 'Pear',
  'marquise': 'Marquise',
  'heart': 'Heart'
};

/**
 * Extracts the canonical Shape from product tags or variant options.
 */
export function extractProductShape(product: ProcessedProduct): Shape | null {
  // 1. Check Tags for canonical format (e.g., 'round-diamond')
  const canonicalTags = Object.values(SHAPE_TO_TAG);
  const foundTag = product.tags?.find(tag => canonicalTags.includes(tag.toLowerCase()));
  if (foundTag) {
    return (Object.keys(SHAPE_TO_TAG).find(key => SHAPE_TO_TAG[key] === foundTag.toLowerCase()) as Shape) || null;
  }

  // 2. Fallback: Check Variant Options
  const shapeOption = product.variants?.[0]?.selectedOptions?.['Shape']?.toLowerCase();
  if (shapeOption && SHAPE_SYNONYMS[shapeOption]) {
    return SHAPE_SYNONYMS[shapeOption];
  }

  // 3. Fallback: Check Product Title
  const titleLower = product.name.toLowerCase();
  for (const [synonym, canonical] of Object.entries(SHAPE_SYNONYMS)) {
    if (titleLower.includes(synonym)) return canonical;
  }

  return null;
}

/**
 * Required Rule: Disable incompatible shapes dynamically, do NOT hide silently.
 * Returns 'available' if the shape is valid for the current style, 'disabled' otherwise.
 */
export function getShapeAvailability(shape: Shape, activeStyle?: RingStyle): 'available' | 'disabled' {
  if (!activeStyle) return 'available';
  
  const allowedShapes = SHAPES_BY_STYLE[activeStyle];
  return allowedShapes?.includes(shape) ? 'available' : 'disabled';
}

/**
 * Checks if a product/variant matches the selected shape filters.
 */
export function productMatchesShapes(product: ProcessedProduct, selectedShapes: string[]): boolean {
  if (selectedShapes.length === 0) return true;
  
  const productShape = extractProductShape(product);
  return productShape ? selectedShapes.includes(productShape) : false;
}