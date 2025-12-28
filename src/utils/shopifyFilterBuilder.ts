import { ProductFilters } from '../config/filterConfig';

/**
 * Shopify Filter Builder
 *
 * Builds proper Shopify Storefront API queries using product-level attributes ONLY.
 *
 * GOLDEN RULE: Collections filter products. Product pages select variants.
 *
 * Product-level filters (use these for collection filtering):
 * - Jewelry Type (metafield: shopify.jewelry-type)
 * - Ring Design (metafield: shopify.ring-design)
 * - Target Gender (metafield: shopify.target-gender)
 * - Metal Material (metafield: shopify.jewelry-material)
 * - Product Type (Shopify product_type field)
 * - Tags (Shopify tags field)
 *
 * Variant-level attributes (DO NOT use for collection filtering):
 * - Carat weight (variant option)
 * - Size (variant option)
 * - Metal color (variant option)
 */

export interface ShopifyFilterQuery {
  query: string;
  filters: string[];
}

/**
 * Normalize shape values to match Shopify metafield values
 */
const normalizeShapeForShopify = (shape: string): string => {
  const shapeMap: Record<string, string> = {
    'round': 'round',
    'princess': 'princess',
    'oval': 'oval',
    'emerald': 'emerald',
    'cushion': 'cushion',
    'pear': 'pear',
    'marquise': 'marquise',
    'radiant': 'radiant',
    'asscher': 'asscher',
    'heart': 'heart'
  };

  return shapeMap[shape.toLowerCase()] || shape.toLowerCase();
};

/**
 * Normalize category to match Shopify jewelry-type metafield
 */
const normalizeCategoryForShopify = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'rings': 'ring',
    'ring': 'ring',
    'necklaces': 'necklace',
    'necklace': 'necklace',
    'earrings': 'earring',
    'earring': 'earring'
  };

  return categoryMap[category.toLowerCase()] || category.toLowerCase();
};

/**
 * Build Shopify Storefront API query string from filters
 * Uses product-level attributes ONLY (metafields, tags, product_type)
 */
export const buildShopifyFilterQuery = (filters: ProductFilters): ShopifyFilterQuery => {
  const queryParts: string[] = [];
  const appliedFilters: string[] = [];

  // 1. Jewelry Category Filter (product-level metafield)
  if (filters.jewelryCategory) {
    const normalizedCategory = normalizeCategoryForShopify(filters.jewelryCategory);
    queryParts.push(`(product_type:*${filters.jewelryCategory}*)`);
    appliedFilters.push(`Jewelry Type: ${filters.jewelryCategory}`);
  }

  // 2. Ring Style/Design Filter (product-level metafield for ring-design)
  if (filters.ringStyle) {
    queryParts.push(`tag:${filters.ringStyle}`);
    appliedFilters.push(`Ring Style: ${filters.ringStyle}`);
  }

  // 3. Diamond Shape Filter (product-level - shape availability)
  // This should be a product-level attribute indicating which shapes are AVAILABLE for this product
  if (filters.shapes && filters.shapes.length > 0) {
    const shapeQueries = filters.shapes.map(shape => {
      const normalized = normalizeShapeForShopify(shape);
      return `tag:${shape}`;
    });

    if (shapeQueries.length > 0) {
      queryParts.push(`(${shapeQueries.join(' OR ')})`);
      appliedFilters.push(`Shapes: ${filters.shapes.join(', ')}`);
    }
  }

  // 4. Metal Colors (product-level - which metals are AVAILABLE)
  // Products should be tagged with available metal options, not variant-specific
  if (filters.metalColors && filters.metalColors.length > 0) {
    const metalQueries = filters.metalColors.map(metal => {
      return `tag:"${metal}"`;
    });

    if (metalQueries.length > 0) {
      queryParts.push(`(${metalQueries.join(' OR ')})`);
      appliedFilters.push(`Metal Colors: ${filters.metalColors.join(', ')}`);
    }
  }

  // 5. Stone Type (product-level tag)
  if (filters.stoneType) {
    queryParts.push(`tag:${filters.stoneType}`);
    appliedFilters.push(`Stone Type: ${filters.stoneType}`);
  }

  // 6. Search Text (searches title, description, tags)
  if (filters.searchText && filters.searchText.trim()) {
    const searchTerm = filters.searchText.trim();
    queryParts.push(`(title:*${searchTerm}* OR tag:*${searchTerm}*)`);
    appliedFilters.push(`Search: "${searchTerm}"`);
  }

  // 7. Availability (product-level)
  if (filters.inStockOnly) {
    queryParts.push('available_for_sale:true');
    appliedFilters.push('In Stock Only');
  }

  // NOTE: We do NOT filter by:
  // - Carat weight (variant option, selected on product page)
  // - Ring size (variant option, selected on product page)
  // - Clarity (variant attribute, not a collection filter)
  // - Certification (variant attribute, not a collection filter)
  // - Price ranges (better done client-side for UX, or use Shopify's price filters)

  // Combine all query parts with AND
  const query = queryParts.length > 0 ? queryParts.join(' AND ') : '';

  return {
    query,
    filters: appliedFilters
  };
};

/**
 * Apply client-side filters that cannot be done via Shopify API
 * Only use this for truly client-side concerns like price ranges
 */
export const applyClientSideFilters = (
  products: any[],
  filters: ProductFilters
): any[] => {
  let filtered = [...products];

  // Price Range Filter (client-side for better UX)
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    filtered = filtered.filter(product => {
      const price = product.price || product.priceRange?.minVariantPrice?.amount;
      const numPrice = typeof price === 'string' ? parseFloat(price) : price;

      if (filters.minPrice !== undefined && numPrice < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && numPrice > filters.maxPrice) {
        return false;
      }
      return true;
    });
  }

  return filtered;
};

/**
 * Validate that product data structure is correct for filtering
 * Helps identify data quality issues
 */
export const validateProductForFiltering = (product: any): {
  isValid: boolean;
  issues: string[];
} => {
  const issues: string[] = [];

  // Check if product-level attributes exist
  if (!product.productType && !product.tags?.length) {
    issues.push('Product has no productType or tags - cannot be filtered by category');
  }

  // Check if metafields are present (for advanced filtering)
  if (!product.metafields || Object.keys(product.metafields).length === 0) {
    issues.push('Product has no metafields - advanced filtering unavailable');
  }

  // Check if tags are being used for variant-level attributes (anti-pattern)
  const variantTags = ['0.50ct', '1.00ct', 'Size 52', 'Size 54'];
  const hasVariantTags = product.tags?.some((tag: string) =>
    variantTags.some(vt => tag.includes(vt))
  );

  if (hasVariantTags) {
    issues.push('WARNING: Product tags contain variant-specific values - this is an anti-pattern');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
};
