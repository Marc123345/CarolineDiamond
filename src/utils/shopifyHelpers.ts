import { ShopifyProduct, ProcessedProduct, CartLine, ProcessedCartLine, ProductVariant, ProductMetafields, ProductOption } from '../types/shopify';
import productsData from '../data/products_for_react.json';
import { parseMetafieldValue } from './metafieldHelpers';
import { shapesMatch } from './shapeUtils';

/**
 * Extracts options from CSV-style variants.
 * Maps 'Metal Color', 'Diamond Type' (Carat), and 'Ring size'
 */
const extractOptionsFromVariants = (variants: any[]): { variants: ProductVariant[], options: ProductOption[] } => {
  if (!variants || variants.length === 0) return { variants: [], options: [] };

  const optionValues: Record<string, Set<string>> = {};
  
  // Aligning with CSV Column Headers
  const attributeToOptionName: Record<string, string> = {
    'metal': 'Metal Color',
    'metal_color': 'Metal Color',
    'carat': 'Diamond Type',
    'diamond_type': 'Diamond Type',
    'size': 'Ring size',
    'ring_size': 'Ring size'
  };

  variants.forEach(variant => {
    Object.entries(attributeToOptionName).forEach(([attr, optName]) => {
      const value = variant[attr] || variant.selectedOptions?.[optName];
      if (value) {
        if (!optionValues[optName]) optionValues[optName] = new Set();
        optionValues[optName].add(value);
      }
    });
  });

  const options: ProductOption[] = Object.entries(optionValues).map(([name, values]) => ({
    id: `option-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    values: Array.from(values).sort()
  }));

  const processedVariants: ProductVariant[] = variants.map((variant, index) => {
    const selectedOptions: Record<string, string> = variant.selectedOptions || {};
    
    // Ensure standard keys are present for the UI
    if (variant.metal) selectedOptions['Metal Color'] = variant.metal;
    if (variant.carat) selectedOptions['Diamond Type'] = variant.carat;

    return {
      id: variant.id || `v-${index}`,
      title: variant.title || Object.values(selectedOptions).join(' / '),
      price: typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price,
      availableForSale: variant.availableForSale ?? true,
      selectedOptions,
      image: variant.image
    };
  });

  return { variants: processedVariants, options };
};

export const transformShopifyProduct = (product: ShopifyProduct): ProcessedProduct => {
  const images = product.images?.edges.map(edge => edge.node.url) || [];
  
  const variants: ProductVariant[] = product.variants.edges.map(edge => ({
    id: edge.node.id,
    title: edge.node.title,
    price: typeof edge.node.price === 'string' ? parseFloat(edge.node.price) : parseFloat(edge.node.price.amount),
    availableForSale: edge.node.availableForSale,
    selectedOptions: edge.node.selectedOptions.reduce((acc, opt) => {
      acc[opt.name] = opt.value;
      return acc;
    }, {} as Record<string, string>),
    image: edge.node.image?.url
  }));

  // Normalizing Categories from CSV "Type" field
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

/**
 * Normalizes Carat values from various CSV formats
 * Handles: "0.50ct", "Lab-Grown 1.00ct", "0.75c", "1 ct"
 */
const normalizeCaratValue = (value: string): { min: number; max: number } | number => {
  if (!value) return 0;
  
  // Extract just the numeric part (e.g., "Lab-Grown 1.50ct" -> "1.50")
  const numericMatch = value.match(/(\d+(\.\d+)?)/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : 0;

  const cleaned = value.toLowerCase();
  if (cleaned.includes('-')) {
    const parts = cleaned.match(/(\d+(\.\d+)?)/g);
    if (parts && parts.length >= 2) {
      return { min: parseFloat(parts[0]), max: parseFloat(parts[1]) };
    }
  }

  if (cleaned.includes('+')) return { min: numericValue, max: Infinity };
  
  return numericValue;
};

const caratMatches = (variantValue: string, selectedValue: string): boolean => {
  const v = normalizeCaratValue(variantValue);
  const s = normalizeCaratValue(selectedValue);

  if (typeof v === 'number' && typeof s === 'number') return Math.abs(v - s) < 0.01;
  if (typeof s === 'object' && typeof v === 'number') return v >= s.min && v <= s.max;
  return false;
};

export const findVariantByOptions = (
  product: ProcessedProduct,
  selectedOptions: Record<string, string>
): ProductVariant | undefined => {
  if (!product.variants?.length) return undefined;

  // Filter out Size as it usually doesn't change the base price/SKU in this setup
  const variantDefiningOptions = Object.entries(selectedOptions).filter(
    ([key]) => !['size', 'ring size'].includes(key.toLowerCase())
  );

  if (variantDefiningOptions.length === 0) return product.variants[0];

  return product.variants.find(variant => {
    return variantDefiningOptions.every(([key, value]) => {
      const variantValue = variant.selectedOptions[key];
      if (!variantValue) return false;

      // Handle Shape matching (Pear vs Pear Shape)
      if (key.toLowerCase().includes('shape')) {
        return shapesMatch(variantValue, value);
      }

      // Handle Carat/Diamond Type matching
      if (key.toLowerCase().includes('carat') || key.toLowerCase().includes('type')) {
        return caratMatches(variantValue, value);
      }

      return variantValue === value;
    });
  }) || product.variants[0];
};

export const getFallbackProducts = (): ProcessedProduct[] => {
  try {
    return (productsData as any[]).map(transformLocalProduct);
  } catch (e) {
    return [];
  }
};

export const transformLocalProduct = (product: any): ProcessedProduct => {
  const { variants, options } = extractOptionsFromVariants(product.variants || []);
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
    variants,
    options
  };
};