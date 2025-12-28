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

// --- CONSTANTS ---
export const STANDARD_RING_SIZES = [
  '48', '49', '50', '51', '52', '53', '54', '55', '56', '57',
  '58', '59', '60', '61', '62', '63', '64', '65', '66', '67'
];

// --- CART HELPERS ---

/**
 * EXPORTED: transformCartLine
 * Fixes the SyntaxError in useShopifyCart.ts
 */
export const transformCartLine = (line: CartLine): ProcessedCartLine => {
  const selectedOptions: Record<string, string> = {};
  line.merchandise.selectedOptions.forEach(opt => {
    selectedOptions[opt.name] = opt.value;
  });

  const attributes: Record<string, string> = {};
  if (line.attributes) {
    line.attributes.forEach(attr => {
      attributes[attr.key] = attr.value;
    });
  }

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

// --- PRODUCT HELPERS ---

/**
 * EXPORTED: isRingProduct
 */
export const isRingProduct = (product: ProcessedProduct): boolean => {
  const type = (product.productType || product.category || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const tags = product.tags?.map(t => t.toLowerCase()) || [];
  return type.includes('ring') || name.includes('ring') || tags.includes('rings');
};

/**
 * EXPORTED: ensureRingSizeOption
 * Fixes the SyntaxError in ProductDetailPage.tsx
 */
export const ensureRingSizeOption = (product: ProcessedProduct): ProcessedProduct => {
  if (!isRingProduct(product)) return product;

  const hasSizeOption = product.options?.some(
    opt => opt.name.toLowerCase() === 'size' || opt.name.toLowerCase() === 'ring size'
  );

  if (hasSizeOption) return product;

  const sizeOption: ProductOption = {
    id: `size-option-${product.id}`,
    name: 'Ring size',
    values: STANDARD_RING_SIZES
  };

  return {
    ...product,
    options: [...(product.options || []), sizeOption]
  };
};

/**
 * EXPORTED: transformShopifyProduct
 * Maps raw GraphQL data to the ProcessedProduct interface used by the UI.
 */
export const transformShopifyProduct = (product: ShopifyProduct): ProcessedProduct => {
  const images = product.images?.edges.map(edge => edge.node.url) || [];
  
  const variants: ProductVariant[] = product.variants.edges.map(edge => ({
    id: edge.node.id,
    title: edge.node.title,
    price: typeof edge.node.price === 'string' ? parseFloat(edge.node.price) : parseFloat(edge.node.price.amount),
    compareAtPrice: edge.node.compareAtPrice ? 
      (typeof edge.node.compareAtPrice === 'string' ? parseFloat(edge.node.compareAtPrice) : parseFloat(edge.node.compareAtPrice.amount)) : undefined,
    availableForSale: edge.node.availableForSale,
    selectedOptions: edge.node.selectedOptions.reduce((acc, opt) => {
      acc[opt.name] = opt.value;
      return acc;
    }, {} as Record<string, string>),
    image: edge.node.image?.url
  }));

  let category = 'Juwelen';
  const rawType = (product.productType || '').toLowerCase();
  if (rawType.includes('ring')) category = 'Rings';
  else if (rawType.includes('earring')) category = 'Earrings';
  else if (rawType.includes('necklace')) category = 'Necklaces';

  return {
    id: product.id,
    handle: product.handle,
    name: product.title,
    description: product.description,
    price: variants[0]?.price || 0,
    compareAtPrice: variants[0]?.compareAtPrice,
    image: images[0],
    images,
    category,
    tags: product.tags || [],
    availableForSale: product.availableForSale,
    variants,
    options: product.options.map(opt => ({ id: opt.id, name: opt.name, values: opt.values })),
    productType: product.productType
  };
};

// --- MATCHING LOGIC ---

const normalizeCaratValue = (value: string): number => {
  if (!value) return 0;
  const match = value.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[0]) : 0;
};

const caratMatches = (variantValue: string, selectedValue: string): boolean => {
  const v = normalizeCaratValue(variantValue);
  const s = normalizeCaratValue(selectedValue);
  return Math.abs(v - s) < 0.01;
};

/**
 * EXPORTED: findVariantByOptions
 * Matches selected UI options (Metal, Type, Size) to a specific SKU.
 */
export const findVariantByOptions = (
  product: ProcessedProduct,
  selectedOptions: Record<string, string>
): ProductVariant | undefined => {
  if (!product.variants?.length) return undefined;
  
  const variantDefiningOptions = Object.entries(selectedOptions).filter(
    ([key]) => !['size', 'ring size'].includes(key.toLowerCase())
  );
  
  if (variantDefiningOptions.length === 0) return product.variants[0];

  return product.variants.find(variant => {
    return variantDefiningOptions.every(([key, value]) => {
      const variantValue = variant.selectedOptions[key];
      if (!variantValue) return false;
      if (key.toLowerCase().includes('shape')) return shapesMatch(variantValue, value);
      if (key.toLowerCase().includes('carat') || key.toLowerCase().includes('type')) return caratMatches(variantValue, value);
      return variantValue === value;
    });
  }) || product.variants[0];
};

// --- FALLBACK LOGIC ---

export const getFallbackProducts = (): ProcessedProduct[] => {
  try {
    return (productsData as any[]).map(transformLocalProduct);
  } catch (e) { return []; }
};

export const transformLocalProduct = (product: any): ProcessedProduct => {
  return {
    id: product.id || `local-${product.handle}`,
    handle: product.handle,
    name: product.name || product.title,
    description: product.description || '',
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
    image: product.image || product.images?.[0],
    images: product.images || [],
    category: product.category || 'Rings',
    tags: product.tags || [],
    variants: product.variants || [],
    options: product.options || []
  };
};