import { 
  ShopifyProduct, 
  ProcessedProduct, 
  CartLine, 
  ProcessedCartLine, 
  ProductVariant, 
  ProductOption 
} from '../types/shopify';
import productsData from '../data/products_for_react.json';
import { shapesMatch } from './shapeUtils';

/**
 * Fallback constants for Ring sizes
 */
export const STANDARD_RING_SIZES = [
  '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', 
  '58', '59', '60', '61', '62', '63', '64', '65', '66', '67'
];

/**
 * EXPORTED: getFallbackProducts
 * FIXES THE SYNTAX ERROR in useShopifyProducts.ts
 * Loads products from your local JSON when the Shopify API is offline.
 */
export const getFallbackProducts = (): ProcessedProduct[] => {
  try {
    if (!Array.isArray(productsData)) return [];
    return (productsData as any[]).map(transformLocalProduct);
  } catch (e) {
    console.error('Fallback data error:', e);
    return [];
  }
};

/**
 * EXPORTED: transformLocalProduct
 * Maps local JSON objects (often from CSV) to ProcessedProduct.
 */
export const transformLocalProduct = (product: any): ProcessedProduct => {
  return {
    id: product.id || `local-${product.handle}`,
    handle: product.handle,
    name: product.name || product.title,
    description: product.description || '',
    price: typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0),
    compareAtPrice: product.compareAtPrice ? parseFloat(product.compareAtPrice) : undefined,
    image: product.image || product.images?.[0] || '',
    images: product.images || [],
    category: product.category || 'Rings',
    tags: product.tags || [],
    availableForSale: product.availableForSale ?? true,
    variants: product.variants || [],
    options: product.options || [],
    productType: product.productType || product.category
  };
};

/**
 * EXPORTED: transformCartLine
 * Converts Shopify Cart data for the UI.
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
 * EXPORTED: ensureRingSizeOption
 */
export const ensureRingSizeOption = (product: ProcessedProduct): ProcessedProduct => {
  const type = (product.productType || product.category || '').toLowerCase();
  const isRing = type.includes('ring') || product.tags?.some(t => t.toLowerCase().includes('ring'));

  if (!isRing) return product;
  
  const hasSize = product.options?.some(o => 
    o.name.toLowerCase().includes('size') || o.name.toLowerCase().includes('maat')
  );

  if (hasSize) return product;

  return {
    ...product,
    options: [
      ...(product.options || []),
      { id: `size-${product.id}`, name: 'Ring size', values: STANDARD_RING_SIZES }
    ]
  };
};

/**
 * EXPORTED: transformShopifyProduct
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

  let category = 'Rings'; 
  const typeLower = (product.productType || '').toLowerCase();
  if (typeLower.includes('necklace')) category = 'Necklaces';
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

/**
 * EXPORTED: findVariantByOptions
 */
export const findVariantByOptions = (
  product: ProcessedProduct, 
  selectedOptions: Record<string, string>
): ProductVariant | undefined => {
  if (!product.variants?.length) return undefined;

  const definingOptions = Object.entries(selectedOptions).filter(
    ([k]) => !k.toLowerCase().includes('size')
  );

  if (definingOptions.length === 0) return product.variants[0];

  return product.variants.find(v => 
    definingOptions.every(([k, val]) => {
      const vVal = v.selectedOptions[k];
      if (!vVal) return false;
      if (k.toLowerCase().includes('shape')) return shapesMatch(vVal, val);
      return vVal === val;
    })
  ) || product.variants[0];
};