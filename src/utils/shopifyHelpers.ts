import { ShopifyProduct, ProcessedProduct, CartLine, ProcessedCartLine, ProductVariant, ProductMetafields, ProductOption } from '../types'; // Adjusted path to shared types
import productsData from '../data/products_for_react.json';
// If you don't have these specific files yet, simple stubs are provided below the main code
import { parseMetafieldValue } from './metafieldHelpers'; 
import { shapesMatch } from './shapeUtils';

// ==========================================
// 1. DATA CLEANING UTILITIES
// ==========================================
const DATA_FIXES: Record<string, string> = {
  '0.50c': '0.50ct',
  'Rose Gold': '18K Rose Gold',
  '18k Rose Gold': '18K Rose Gold',
  'Yellow Gold': '18K Yellow Gold',
  'White Gold': '18K White Gold',
  'Diamond': 'Natural Diamond',
  'Ring size': 'Ring Size',
  'Ring Size:': 'Ring Size'
};

export const cleanValue = (val: string): string => {
  if (!val) return '';
  // Handle numbers that might be passed as strings
  const strVal = String(val).trim();
  return DATA_FIXES[strVal] || strVal;
};

// ==========================================
// 2. MAIN TRANSFORMATION LOGIC
// ==========================================

/**
 * Extracts product options and transforms variants from local product data
 */
const extractOptionsFromVariants = (variants: any[]): { variants: ProductVariant[], options: ProductOption[] } => {
  if (!variants || variants.length === 0) {
    return { variants: [], options: [] };
  }

  // Collect all unique option values
  const optionValues: Record<string, Set<string>> = {};

  // Map variant attributes to option names
  const attributeToOptionName: Record<string, string> = {
    'metal': 'Color',      // Metal becomes Color for UI
    'carat': 'Carat',
    'sideDiamonds': 'Side Diamonds'
  };

  // First pass: collect unique values
  variants.forEach(variant => {
    Object.entries(attributeToOptionName).forEach(([attribute, optionName]) => {
      if (variant[attribute]) {
        if (!optionValues[optionName]) {
          optionValues[optionName] = new Set();
        }
        optionValues[optionName].add(cleanValue(variant[attribute]));
      }
    });
  });

  // Build options array
  const options: ProductOption[] = Object.entries(optionValues).map(([name, values]) => ({
    id: `option-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    values: Array.from(values).sort()
  }));

  // Transform variants to include selectedOptions
  const processedVariants: ProductVariant[] = variants.map((variant, index) => {
    const selectedOptions: Record<string, string> = {};

    Object.entries(attributeToOptionName).forEach(([attribute, optionName]) => {
      if (variant[attribute]) {
        selectedOptions[optionName] = cleanValue(variant[attribute]);
      }
    });

    const titleParts = Object.values(selectedOptions).filter(Boolean);
    const title = titleParts.length > 0 ? titleParts.join(' / ') : 'Default';

    return {
      id: variant.sku || variant.id || `variant-${index}`,
      title,
      price: typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price,
      compareAtPrice: variant.compareAtPrice,
      availableForSale: variant.availableForSale ?? (variant.inventoryQty > 0),
      quantityAvailable: variant.inventoryQty || variant.quantityAvailable,
      selectedOptions,
      image: variant.image
    };
  });

  return { variants: processedVariants, options };
};

export const transformShopifyProduct = (product: ShopifyProduct): ProcessedProduct => {
  const images = product.images.edges.map(edge => edge.node.url);
  const firstImage = images[0];

  const variants: ProductVariant[] = product.variants.edges.map(edge => {
    const variantImages: string[] = [];
    if (edge.node.image?.url) variantImages.push(edge.node.image.url);
    
    // Check media edges
    if ((edge.node as any).media?.edges) {
      (edge.node as any).media.edges.forEach((mediaEdge: any) => {
        if (mediaEdge.node.image?.url && !variantImages.includes(mediaEdge.node.image.url)) {
          variantImages.push(mediaEdge.node.image.url);
        }
      });
    }

    // Handle prices
    const price = typeof edge.node.price === 'string' 
      ? parseFloat(edge.node.price) 
      : parseFloat((edge.node.price as any).amount);
      
    const compareAtPrice = edge.node.compareAtPrice
      ? typeof edge.node.compareAtPrice === 'string'
        ? parseFloat(edge.node.compareAtPrice)
        : parseFloat((edge.node.compareAtPrice as any).amount)
      : undefined;

    return {
      id: edge.node.id,
      title: edge.node.title,
      price,
      compareAtPrice,
      availableForSale: edge.node.availableForSale,
      quantityAvailable: edge.node.quantityAvailable,
      // CLEAN DATA HERE
      selectedOptions: edge.node.selectedOptions.reduce((acc, opt) => {
        acc[cleanValue(opt.name)] = cleanValue(opt.value);
        return acc;
      }, {} as Record<string, string>),
      image: edge.node.image?.url,
      images: variantImages.length > 0 ? variantImages : undefined
    };
  });

  const category = product.productType || product.tags.find(tag => 
    ['Trouwringen', 'Juwelen', 'Verlovingsringen', 'Collecties'].includes(tag)
  ) || 'Juwelen';

  // Map Metafields
  const metafields: ProductMetafields = {};
  if (product.metafields) {
    product.metafields.forEach(metafield => {
      if (metafield && metafield.key && metafield.value) {
        const parsedValue = parseMetafieldValue ? parseMetafieldValue(metafield.value) : metafield.value;
        if (!parsedValue) return;

        switch (metafield.key) {
          case 'age-group': metafields.ageGroup = parsedValue; break;
          case 'color-pattern': metafields.colorPattern = parsedValue; break;
          case 'jewelry-material': metafields.jewelryMaterial = parsedValue; break;
          case 'jewelry-type': metafields.jewelryType = parsedValue; break;
          case 'ring-design': metafields.ringDesign = parsedValue; break;
          case 'ring-size': metafields.ringSize = parsedValue; break;
          case 'target-gender': metafields.targetGender = parsedValue; break;
        }
      }
    });
  }

  // Handle Price Range
  const priceRange = (product as any).priceRangeV2 || product.priceRange;
  const compareAtPriceRange = (product as any).compareAtPriceRangeV2 || product.compareAtPriceRange;

  // Build Options (Cleaned)
  let options: Array<{ id: string; name: string; values: string[] }> = [];

  if (product.options && product.options.length > 0) {
    options = product.options.map(opt => ({
      id: opt.id,
      name: cleanValue(opt.name),
      values: opt.values.map(cleanValue)
    }));
  } else {
    // Build options from variants if missing
    const optionsMap = new Map<string, Set<string>>();
    product.variants.edges.forEach(edge => {
      edge.node.selectedOptions.forEach(opt => {
        const cName = cleanValue(opt.name);
        if (!optionsMap.has(cName)) optionsMap.set(cName, new Set());
        optionsMap.get(cName)!.add(cleanValue(opt.value));
      });
    });

    options = Array.from(optionsMap.entries()).map(([name, values], index) => ({
      id: `${product.id}-option-${index}`,
      name,
      values: Array.from(values)
    }));
  }

  return {
    id: product.id,
    handle: product.handle,
    name: product.title,
    description: product.description,
    price: priceRange ? parseFloat(priceRange.minVariantPrice.amount) : 0,
    compareAtPrice: compareAtPriceRange ? parseFloat(compareAtPriceRange.minVariantPrice.amount) : undefined,
    image: firstImage,
    images,
    category,
    vendor: product.vendor,
    tags: product.tags,
    availableForSale: product.availableForSale,
    variants,
    options,
    isCustomizable: product.tags.includes('customizable') || product.tags.includes('personaliseerbaar'),
    metafields: Object.keys(metafields).length > 0 ? metafields : undefined,
    productType: product.productType
  };
};

export const transformLocalProduct = (product: any): ProcessedProduct => {
  const processedVariantsAndOptions = extractOptionsFromVariants(product.variants || []);
  
  const variants = processedVariantsAndOptions.variants.length > 0
    ? processedVariantsAndOptions.variants
    : [{
        id: `${product.id}_variant_1`,
        title: 'Default',
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        availableForSale: true,
        selectedOptions: {},
        quantityAvailable: 10
      }];

  return {
    id: product.id || `local-${product.handle}`,
    handle: product.handle || product.id,
    name: product.name || product.title,
    description: product.description || '',
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
    compareAtPrice: product.compareAtPrice,
    image: product.image || product.images?.[0],
    images: product.images || (product.image ? [product.image] : []),
    category: product.category || 'Juwelen',
    vendor: product.vendor || 'Diamonds by CS',
    tags: product.tags || [],
    availableForSale: product.availableForSale ?? true,
    variants,
    options: product.options || processedVariantsAndOptions.options,
    isCustomizable: product.isCustomizable || false,
    features: product.features,
    materials: product.materials,
    deliveryTime: product.deliveryTime
  };
};

export const transformConfigProductToProcessedProduct = (product: any): ProcessedProduct => {
  return {
    id: product.id || `config-${product.handle}`,
    handle: product.handle || product.id,
    name: product.name || product.title,
    description: product.description || '',
    price: typeof product.price === 'string' ? parseFloat(product.price.replace(/[^0-9.]/g, '')) : product.price,
    compareAtPrice: product.compareAtPrice,
    image: product.image || product.images?.[0],
    images: product.images || (product.image ? [product.image] : []),
    category: product.category || 'Juwelen',
    vendor: product.vendor || 'Diamonds by CS',
    tags: product.tags || [],
    availableForSale: product.availableForSale ?? true,
    variants: product.variants || [{
      id: `${product.id || product.handle}_variant_1`,
      title: 'Default',
      price: typeof product.price === 'string' ? parseFloat(product.price.replace(/[^0-9.]/g, '')) : product.price,
      availableForSale: true,
      selectedOptions: {},
      quantityAvailable: product.quantityAvailable || 10
    }],
    options: product.options || [],
    isCustomizable: product.isCustomizable || false,
    features: product.features,
    materials: product.materials,
    deliveryTime: product.deliveryTime
  };
};

export const getFallbackProducts = (): ProcessedProduct[] => {
  try {
    const products = productsData as any[];
    return products.map(transformLocalProduct);
  } catch (error) {
    console.error('Error loading fallback products:', error);
    return [];
  }
};

export const transformCartLine = (line: CartLine): ProcessedCartLine => {
  const selectedOptions: Record<string, string> = {};
  line.merchandise.selectedOptions.forEach(opt => {
    selectedOptions[cleanValue(opt.name)] = cleanValue(opt.value);
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

// ==========================================
// 3. MATCHING HELPERS (Ring Size, Carat)
// ==========================================

const normalizeCaratValue = (value: string): { min: number; max: number } | number => {
  if (!value) return 0;
  const cleaned = value.toLowerCase().replace(/\s+/g, '').replace('ct', '');
  if (cleaned.includes('-')) {
    const [min, max] = cleaned.split('-').map(v => parseFloat(v));
    return { min, max };
  }
  if (cleaned.includes('+')) {
    const min = parseFloat(cleaned.replace('+', ''));
    return { min, max: Infinity };
  }
  return parseFloat(cleaned) || 0;
};

const caratMatches = (variantValue: string, selectedValue: string): boolean => {
  const variant = normalizeCaratValue(cleanValue(variantValue));
  const selected = normalizeCaratValue(cleanValue(selectedValue));

  if (typeof variant === 'number' && typeof selected === 'number') return Math.abs(variant - selected) < 0.01;
  if (typeof selected === 'object' && typeof variant === 'number') return variant >= selected.min && variant <= selected.max;
  if (typeof variant === 'object' && typeof selected === 'number') return selected >= variant.min && selected <= variant.max;
  if (typeof variant === 'object' && typeof selected === 'object') return variant.min <= selected.max && selected.min <= variant.max;
  return false;
};

export const STANDARD_RING_SIZES = [
  '48', '49', '50', '51', '52', '53', '54', '55', '56', '57',
  '58', '59', '60', '61', '62', '63', '64', '65', '66', '67'
];

export const isRingProduct = (product: ProcessedProduct): boolean => {
  const title = product.name?.toLowerCase() || ''; // unified 'name' field
  const handle = product.handle?.toLowerCase() || '';
  const tags = product.tags?.map(t => t.toLowerCase()) || [];
  const productType = product.productType?.toLowerCase() || '';

  return (
    title.includes('ring') ||
    handle.includes('ring') ||
    tags.some(tag => tag.includes('ring') || tag === 'rings' || tag === 'engagement ring') ||
    productType.includes('ring')
  );
};

export const ensureRingSizeOption = (product: ProcessedProduct): ProcessedProduct => {
  if (!isRingProduct(product)) return product;

  // Check cleaned names
  const hasSizeOption = product.options?.some(opt => {
    const name = cleanValue(opt.name).toLowerCase();
    return name === 'size' || name === 'ring size';
  });

  if (hasSizeOption) return product;

  const sizeOption = {
    id: `size-option-${product.id}`,
    name: 'Ring Size',
    values: STANDARD_RING_SIZES
  };

  return {
    ...product,
    options: [...(product.options || []), sizeOption]
  };
};

export const findVariantByOptions = (
  product: ProcessedProduct,
  selectedOptions: Record<string, string>
): ProductVariant | undefined => {
  if (!product.variants || product.variants.length === 0) return undefined;
  if (Object.keys(selectedOptions).length === 0) return product.variants[0];

  const variantDefiningOptions = Object.entries(selectedOptions).filter(
    ([key]) => !['size', 'ring size'].includes(key.toLowerCase())
  );

  if (variantDefiningOptions.length === 0) {
    return product.variants.find(v => v.availableForSale) || product.variants[0];
  }

  // Exact Match Logic
  const exactMatch = product.variants.find(variant => {
    if (!variant.selectedOptions) return false;
    return variantDefiningOptions.every(([key, value]) => {
      const variantValue = cleanValue(variant.selectedOptions[cleanValue(key)] || variant.selectedOptions[key]);
      const targetValue = cleanValue(value);

      if (key.toLowerCase().includes('shape')) return shapesMatch ? shapesMatch(variantValue, targetValue) : variantValue === targetValue;
      if (key.toLowerCase().includes('carat') || key.toLowerCase() === 'weight') return caratMatches(variantValue, targetValue);
      
      return variantValue === targetValue;
    });
  });

  if (exactMatch) return exactMatch;

  // Partial Match Logic
  const partialMatch = product.variants.find(variant => {
    if (!variant.selectedOptions) return false;
    // Return true if it matches AT LEAST ONE option (and doesn't strictly conflict with others if needed)
    // Simplified: Find best effort match
    const matches = variantDefiningOptions.filter(([key, value]) => {
      const variantValue = cleanValue(variant.selectedOptions[cleanValue(key)] || variant.selectedOptions[key]);
      const targetValue = cleanValue(value);
      
      if (key.toLowerCase().includes('carat')) return caratMatches(variantValue, targetValue);
      return variantValue === targetValue;
    });
    return matches.length > 0;
  });

  return partialMatch || product.variants[0];
};