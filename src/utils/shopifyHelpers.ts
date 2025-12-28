import { ShopifyProduct, ProcessedProduct, CartLine, ProcessedCartLine, ProductVariant, ProductOption } from '../types/shopify';
import { shapesMatch } from './shapeUtils';

export const STANDARD_RING_SIZES = ['48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67'];

export const transformCartLine = (line: CartLine): ProcessedCartLine => {
  const selectedOptions: Record<string, string> = {};
  line.merchandise.selectedOptions.forEach(opt => { selectedOptions[opt.name] = opt.value; });
  const attributes: Record<string, string> = {};
  line.attributes?.forEach(attr => { attributes[attr.key] = attr.value; });

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

export const isRingProduct = (product: ProcessedProduct): boolean => {
  const type = (product.productType || product.category || '').toLowerCase();
  return type.includes('ring');
};

export const ensureRingSizeOption = (product: ProcessedProduct): ProcessedProduct => {
  if (!isRingProduct(product)) return product;
  const hasSize = product.options?.some(o => o.name.toLowerCase().includes('size'));
  if (hasSize) return product;
  return { ...product, options: [...(product.options || []), { id: `size-${product.id}`, name: 'Ring size', values: STANDARD_RING_SIZES }] };
};

export const findVariantByOptions = (product: ProcessedProduct, selectedOptions: Record<string, string>): ProductVariant | undefined => {
  if (!product.variants?.length) return undefined;
  const defining = Object.entries(selectedOptions).filter(([k]) => !k.toLowerCase().includes('size'));
  if (defining.length === 0) return product.variants[0];

  return product.variants.find(v => defining.every(([k, val]) => {
    const vVal = v.selectedOptions[k];
    if (!vVal) return false;
    if (k.toLowerCase().includes('shape')) return shapesMatch(vVal, val);
    return vVal === val;
  })) || product.variants[0];
};

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

  let category = 'Rings'; // Default
  if (product.productType?.toLowerCase().includes('necklace')) category = 'Necklaces';
  if (product.productType?.toLowerCase().includes('earring')) category = 'Earrings';

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
    tags: product.tags,
    availableForSale: product.availableForSale,
    variants,
    options: product.options,
    productType: product.productType
  };
};