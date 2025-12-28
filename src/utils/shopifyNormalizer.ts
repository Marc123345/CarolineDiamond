/**
 * Shopify Data Normalizer
 *
 * Centralized normalization layer for Shopify Storefront API data.
 * Handles all edge cases, null safety, and data transformation.
 *
 * Rules:
 * - All GraphQL edges → node traversal happens HERE
 * - All string → number conversion happens HERE
 * - All null/undefined handling happens HERE
 * - UI components NEVER access raw Shopify data
 */

import type {
  ShopifyProduct,
  ProcessedProduct,
  ProductVariant,
  ProductImage,
  ProductOption,
  ProductMetafields,
  ShopifyMetafield,
  CartLine,
  ProcessedCartItem,
} from '../types/shopify';
import { parseMetafieldValue } from './metafieldHelpers';

const PLACEHOLDER_IMAGE = '/images/product-placeholder.jpg';
const PLACEHOLDER_ALT = 'Product image';
const DEFAULT_CURRENCY = 'EUR';

/**
 * Normalizes a Shopify MoneyV2 object to a number
 */
function normalizePrice(moneyV2: { amount: string; currencyCode: string } | null | undefined): number {
  if (!moneyV2 || !moneyV2.amount) return 0;
  const parsed = parseFloat(moneyV2.amount);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Extracts currency code from MoneyV2 with fallback
 */
function extractCurrency(moneyV2: { amount: string; currencyCode: string } | null | undefined): string {
  return moneyV2?.currencyCode || DEFAULT_CURRENCY;
}

/**
 * Normalizes Shopify images from edges to flat array
 */
function normalizeImages(images: {
  edges: Array<{
    node: {
      url: string;
      altText?: string | null;
    };
  }>;
} | null | undefined): ProductImage[] {
  if (!images || !images.edges || images.edges.length === 0) {
    return [{
      url: PLACEHOLDER_IMAGE,
      altText: PLACEHOLDER_ALT,
    }];
  }

  return images.edges.map(edge => ({
    url: edge.node.url,
    altText: edge.node.altText || PLACEHOLDER_ALT,
  }));
}

/**
 * Normalizes a single Shopify variant
 */
function normalizeVariant(
  variantEdge: {
    node: {
      id: string;
      title: string;
      price: {
        amount: string;
        currencyCode: string;
      };
      compareAtPrice?: {
        amount: string;
        currencyCode: string;
      } | null;
      availableForSale: boolean;
      quantityAvailable?: number | null;
      selectedOptions: Array<{
        name: string;
        value: string;
      }>;
      image?: {
        url: string;
        altText?: string | null;
      } | null;
    };
  },
  fallbackImage: ProductImage
): ProductVariant {
  const node = variantEdge.node;

  // Convert selectedOptions array to Record
  const selectedOptions: Record<string, string> = {};
  node.selectedOptions.forEach(opt => {
    selectedOptions[opt.name] = opt.value;
  });

  // Determine availability
  const quantityAvailable = node.quantityAvailable ?? 0;
  const availableForSale = node.availableForSale && quantityAvailable > 0;

  return {
    id: node.id,
    title: node.title,
    price: normalizePrice(node.price),
    compareAtPrice: node.compareAtPrice ? normalizePrice(node.compareAtPrice) : undefined,
    currency: extractCurrency(node.price),
    availableForSale,
    quantityAvailable,
    selectedOptions,
    image: node.image?.url || fallbackImage.url,
    imageAlt: node.image?.altText || fallbackImage.altText,
  };
}

/**
 * Normalizes Shopify metafields to structured object
 */
function normalizeMetafields(metafields: ShopifyMetafield[] | null | undefined): ProductMetafields | undefined {
  if (!metafields || metafields.length === 0) return undefined;

  const normalized: ProductMetafields = {};

  metafields.forEach(metafield => {
    if (!metafield || !metafield.key || !metafield.value) return;

    const parsedValue = parseMetafieldValue(metafield.value);
    if (!parsedValue) return;

    switch (metafield.key) {
      case 'age-group':
        normalized.ageGroup = parsedValue;
        break;
      case 'color-pattern':
        normalized.colorPattern = parsedValue;
        break;
      case 'jewelry-material':
        normalized.jewelryMaterial = parsedValue;
        break;
      case 'jewelry-type':
        normalized.jewelryType = parsedValue;
        break;
      case 'ring-design':
        normalized.ringDesign = parsedValue;
        break;
      case 'ring-size':
        normalized.ringSize = parsedValue;
        break;
      case 'target-gender':
        normalized.targetGender = parsedValue;
        break;
      case 'earring_type':
        normalized.earringType = parsedValue;
        break;
      case 'earring_backing':
        normalized.earringBacking = parsedValue;
        break;
      case 'chain_length':
        normalized.chainLength = parsedValue;
        break;
      case 'pendant_size':
        normalized.pendantSize = parsedValue;
        break;
    }
  });

  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

/**
 * Main normalizer: Shopify Product → ProcessedProduct
 * This is the SINGLE source of truth for product transformation
 */
export function normalizeShopifyProduct(shopifyProduct: ShopifyProduct): ProcessedProduct {
  // Normalize images first (needed for fallback)
  const normalizedImages = normalizeImages(shopifyProduct.images);
  const primaryImage = normalizedImages[0];

  // Normalize all variants
  const variants: ProductVariant[] = shopifyProduct.variants.edges.map(edge =>
    normalizeVariant(edge, primaryImage)
  );

  // Normalize options (already flat, just validate)
  const options: ProductOption[] = shopifyProduct.options.map(opt => ({
    id: opt.id,
    name: opt.name,
    values: opt.values,
  }));

  // Extract prices and currency
  const price = normalizePrice(shopifyProduct.priceRange?.minVariantPrice);
  const compareAtPrice = shopifyProduct.compareAtPriceRange?.minVariantPrice
    ? normalizePrice(shopifyProduct.compareAtPriceRange.minVariantPrice)
    : undefined;
  const currency = extractCurrency(shopifyProduct.priceRange?.minVariantPrice);

  // Normalize metafields
  const metafields = normalizeMetafields(shopifyProduct.metafields);

  // Determine category
  const category = shopifyProduct.productType ||
                  shopifyProduct.tags.find(tag =>
                    ['Trouwringen', 'Juwelen', 'Verlovingsringen', 'Collecties', 'Rings', 'Necklaces', 'Earrings'].includes(tag)
                  ) || 'Juwelen';

  // Check if customizable
  const isCustomizable = shopifyProduct.tags.some(tag =>
    ['customizable', 'personaliseerbaar', 'custom'].includes(tag.toLowerCase())
  );

  return {
    id: shopifyProduct.id,
    handle: shopifyProduct.handle,
    name: shopifyProduct.title,
    description: shopifyProduct.description,
    price,
    compareAtPrice,
    currency,
    image: primaryImage.url,
    imageAlt: primaryImage.altText,
    images: normalizedImages,
    category,
    vendor: shopifyProduct.vendor,
    tags: shopifyProduct.tags,
    availableForSale: shopifyProduct.availableForSale,
    variants,
    options,
    isCustomizable,
    metafields,
    productType: shopifyProduct.productType,
  };
}

/**
 * Normalizes a Shopify cart line to ProcessedCartItem
 * Handles all edge traversal and null safety
 */
export function normalizeCartLine(line: CartLine): ProcessedCartItem {
  // Extract selected options
  const selectedOptions: Record<string, string> = {};
  line.merchandise.selectedOptions.forEach(opt => {
    selectedOptions[opt.name] = opt.value;
  });

  // Extract attributes
  const attributes: Record<string, string> = {};
  if (line.attributes) {
    line.attributes.forEach(attr => {
      attributes[attr.key] = attr.value;
    });
  }

  // Get image with fallback
  const image = line.merchandise.product.images.edges[0]?.node.url || PLACEHOLDER_IMAGE;

  return {
    id: line.id,
    quantity: line.quantity,
    productId: line.merchandise.product.id,
    variantId: line.merchandise.id,
    title: line.merchandise.title,
    variantTitle: line.merchandise.title,
    name: line.merchandise.product.title,
    productTitle: line.merchandise.product.title,
    productHandle: line.merchandise.product.handle,
    image,
    price: normalizePrice(line.merchandise.price),
    totalPrice: normalizePrice(line.cost.totalAmount),
    selectedOptions,
    attributes,
  };
}

/**
 * Validates a variant ID is a valid Shopify GID
 */
export function isValidVariantGID(id: string): boolean {
  return /^gid:\/\/shopify\/ProductVariant\/\d+$/.test(id);
}

/**
 * Validates if a product/variant can be added to cart
 */
export function validateCartAddition(
  product: ProcessedProduct,
  variantId: string,
  quantity: number
): { valid: boolean; error?: string; variant?: ProductVariant } {
  // Check quantity is valid
  if (quantity < 1) {
    return { valid: false, error: 'Quantity must be at least 1' };
  }

  // Find the variant
  const variant = product.variants.find(v => v.id === variantId);
  if (!variant) {
    return { valid: false, error: 'Selected variant not found' };
  }

  // Check variant ID format
  if (!isValidVariantGID(variantId)) {
    return { valid: false, error: 'Invalid variant ID format' };
  }

  // Check availability
  if (!variant.availableForSale) {
    return { valid: false, error: 'This item is currently unavailable' };
  }

  // Check quantity available
  if (variant.quantityAvailable < quantity) {
    return {
      valid: false,
      error: `Only ${variant.quantityAvailable} available`,
    };
  }

  // Check if price is valid (not "Price on Request")
  if (variant.price === 0) {
    return {
      valid: false,
      error: 'This item requires a price inquiry. Please contact us.',
    };
  }

  return { valid: true, variant };
}

/**
 * Finds a variant by selected options
 * Centralized variant selection logic with shape/carat support
 */
export function findVariantBySelectedOptions(
  product: ProcessedProduct,
  selectedOptions: Record<string, string>
): ProductVariant | null {
  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  // If no options selected, return first available variant
  if (Object.keys(selectedOptions).length === 0) {
    return product.variants.find(v => v.availableForSale) || product.variants[0];
  }

  // Filter out Size option (usually not variant-defining)
  const variantDefiningOptions = Object.entries(selectedOptions).filter(
    ([key]) => !['size', 'ring size'].includes(key.toLowerCase())
  );

  // If only Size was selected, return first available
  if (variantDefiningOptions.length === 0) {
    return product.variants.find(v => v.availableForSale) || product.variants[0];
  }

  // Find exact match
  const exactMatch = product.variants.find(variant => {
    return variantDefiningOptions.every(([key, value]) => {
      const variantValue = variant.selectedOptions[key];
      if (!variantValue) return false;

      // Case-insensitive comparison
      return variantValue.toLowerCase() === value.toLowerCase();
    });
  });

  if (exactMatch) return exactMatch;

  // Fallback: partial match or first variant
  const partialMatch = product.variants.find(variant => {
    return variantDefiningOptions.some(([key, value]) => {
      const variantValue = variant.selectedOptions[key];
      return variantValue && variantValue.toLowerCase() === value.toLowerCase();
    });
  });

  return partialMatch || product.variants[0];
}
