import { 
  ShopifyProduct, 
  ProcessedProduct, 
  CartLine, 
  ProcessedCartLine, 
  ProductVariant, 
  ProductOption 
} from '../types/shopify';
import { shapesMatch } from './shapeUtils';

/**
 * Standard EU ring sizes used as a fallback if a product 
 * is identified as a ring but lacks size variants.
 */
export const STANDARD_RING_SIZES = [
  '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', 
  '58', '59', '60', '61', '62', '63', '64', '65', '66', '67'
];

/**
 * CART TRANSFORMATION
 * Converts raw Shopify CartLine data into a flat object for the UI.
 */
export const transformCartLine = (line: CartLine): ProcessedCartLine => {
  const selectedOptions: Record<string, string> = {};
  line.merchandise.selectedOptions.forEach(opt => {
    selectedOptions[opt.name] = opt.value;
  });

  const attributes: Record<string, string> = {};
  line.attributes?.forEach(attr => {
    attributes[attr.key] = attr.value;
  });

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
    image: line.merchandise.product.images.edges[0]?.node.url || '',
    price: parseFloat(line.merchandise.price.amount),
    totalPrice: parseFloat(line.cost.totalAmount.amount),
    selectedOptions,
    attributes
  };
};

/**
 * RING LOGIC
 */
export const isRingProduct = (product: ProcessedProduct): boolean => {
  const type = (product.productType || product.category || '').toLowerCase();
  const tags = product.tags?.map(t => t.toLowerCase()) || [];
  return type.includes('ring') || tags.includes('rings');
};

/**
 * Ensures Ring products always have a "Size" selection option in the UI.
 */
export const ensureRingSizeOption = (product: ProcessedProduct): ProcessedProduct => {
  if (!isRingProduct(product)) return product;
  
  const hasSize = product.options?.some(o => 
    o.name.toLowerCase().includes('size') || o.name.toLowerCase().includes('maat')
  );

  if (hasSize) return product;

  return {
    ...product,
    options: [
      ...(product.options || []),
      { 
        id: `size-${product.id}`, 
        name: 'Ring size', 
        values: STANDARD_RING_SIZES 
      }
    ]
  };
};

/**
 * VARIANT MATCHING
 * Finds the correct SKU based on user-selected "Metal Color", "Shape", etc.
 */
export const findVariantByOptions = (
  product: ProcessedProduct, 
  selectedOptions: Record<string, string>
): ProductVariant | undefined => {
  if (!product.variants?.length) return undefined;

  // Filter out Ring Size when finding the variant, as size is often 
  // handled as a custom attribute rather than a separate SKU for these items.
  const definingOptions = Object.entries(selectedOptions).filter(
    ([k]) => !k.toLowerCase().includes('size')
  );

  if (definingOptions.length === 0) return product.variants[0];

  return product.variants.find(v => 
    definingOptions.every(([k, val]) => {
      const vVal = v.selectedOptions[k];
      if (!vVal) return false;
      
      // Use shape synonym matching for flexible CSV tag support
      if (k.toLowerCase().includes('shape')) return shapesMatch(vVal, val);
      
      return vVal === val;
    })
  ) || product.variants[0];
};

/**
 * PRODUCT TRANSFORMATION
 * Maps Shopify GraphQL response to the local ProcessedProduct type.
 */
export const transformShopifyProduct = (product: ShopifyProduct): ProcessedProduct => {
  const variants = product.variants.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    price: parseFloat(node.price.amount),
    compareAtPrice: node.compareAtPrice ? parseFloat(node.compareAtPrice.amount) : undefined,
    availableForSale: node.availableForSale,
    selectedOptions: node.selectedOptions.reduce((acc, o) => ({ ...acc, [o.name]: o.value }), {}),
    image: node.image?.url
  }));

  // Map product type to UI categories
  let category = 'Rings'; 
  const typeLower = product.productType?.toLowerCase() || '';
  if (typeLower.includes('necklace') || typeLower.includes('pendant')) category = 'Necklaces';
  else if (typeLower.includes('earring')) category = 'Earrings';

  return {
    id: product.id,
    handle: product.handle,
    name: product.title,
    description: product.description,
    price: variants[0]?.price || 0,
    compareAtPrice: variants[0]?.compareAtPrice,
    image: product.images.edges[0]?.node.url || '',
    images: product.images.edges.map(e => e.node.url),
    category,
    tags: product.tags || [],
    availableForSale: product.availableForSale,
    variants,
    options: product.options,
    productType: product.productType
  };
};