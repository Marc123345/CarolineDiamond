import { ShopifyProduct, ProcessedProduct, CartLine, ProcessedCartLine, ProductVariant, ProductMetafields, ProductOption } from '../types/shopify';
import productsData from '../data/products_for_react.json';
import { parseMetafieldValue } from './metafieldHelpers';
import { shapesMatch } from './shapeUtils';

/**
 * Extracts product options and transforms variants from local product data
 * Maps variant properties (metal, carat, sideDiamonds) to Shopify-style options and selectedOptions
 */
const extractOptionsFromVariants = (variants: any[]): { variants: ProductVariant[], options: ProductOption[] } => {
  if (!variants || variants.length === 0) {
    return { variants: [], options: [] };
  }

  // Collect all unique option values from variants
  const optionValues: Record<string, Set<string>> = {};

  // Map variant attributes to option names
  const attributeToOptionName: Record<string, string> = {
    'metal': 'Color',      // Metal becomes Color for UI consistency
    'carat': 'Carat',
    'sideDiamonds': 'Side Diamonds'
  };

  // First pass: collect all unique values for each option
  variants.forEach(variant => {
    Object.entries(attributeToOptionName).forEach(([attribute, optionName]) => {
      if (variant[attribute]) {
        if (!optionValues[optionName]) {
          optionValues[optionName] = new Set();
        }
        optionValues[optionName].add(variant[attribute]);
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

    // Map variant attributes to selectedOptions
    Object.entries(attributeToOptionName).forEach(([attribute, optionName]) => {
      if (variant[attribute]) {
        selectedOptions[optionName] = variant[attribute];
      }
    });

    // Build variant title from selected options
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
    // Collect all media images for this variant
    const variantImages: string[] = [];

    // Add the primary variant image first
    if (edge.node.image?.url) {
      variantImages.push(edge.node.image.url);
    }

    // Add additional media images if available
    if (edge.node.media?.edges) {
      edge.node.media.edges.forEach(mediaEdge => {
        if (mediaEdge.node.image?.url && !variantImages.includes(mediaEdge.node.image.url)) {
          variantImages.push(mediaEdge.node.image.url);
        }
      });
    }

    // Handle both string prices and price objects with .amount
    const price = typeof edge.node.price === 'string'
      ? parseFloat(edge.node.price)
      : parseFloat(edge.node.price.amount);
    const compareAtPrice = edge.node.compareAtPrice
      ? typeof edge.node.compareAtPrice === 'string'
        ? parseFloat(edge.node.compareAtPrice)
        : parseFloat(edge.node.compareAtPrice.amount)
      : undefined;

    return {
      id: edge.node.id,
      title: edge.node.title,
      price,
      compareAtPrice,
      availableForSale: edge.node.availableForSale,
      quantityAvailable: edge.node.quantityAvailable,
      selectedOptions: edge.node.selectedOptions.reduce((acc, opt) => {
        acc[opt.name] = opt.value;
        return acc;
      }, {} as Record<string, string>),
      image: edge.node.image?.url,
      images: variantImages.length > 0 ? variantImages : undefined
    };
  });

  const category = product.productType || product.tags.find(tag =>
    ['Trouwringen', 'Juwelen', 'Verlovingsringen', 'Collecties'].includes(tag)
  ) || 'Juwelen';

  const metafields: ProductMetafields = {};
  if (product.metafields) {
    product.metafields.forEach(metafield => {
      if (metafield && metafield.key && metafield.value) {
        const parsedValue = parseMetafieldValue(metafield.value);
        if (!parsedValue) return;

        switch (metafield.key) {
          case 'age-group':
            metafields.ageGroup = parsedValue;
            break;
          case 'color-pattern':
            metafields.colorPattern = parsedValue;
            break;
          case 'jewelry-material':
            metafields.jewelryMaterial = parsedValue;
            break;
          case 'jewelry-type':
            metafields.jewelryType = parsedValue;
            break;
          case 'ring-design':
            metafields.ringDesign = parsedValue;
            break;
          case 'ring-size':
            metafields.ringSize = parsedValue;
            break;
          case 'target-gender':
            metafields.targetGender = parsedValue;
            break;
        }
      }
    });
  }

  // Handle both priceRange and priceRangeV2 (for backward compatibility)
  const priceRange = (product as any).priceRangeV2 || product.priceRange;
  const compareAtPriceRange = (product as any).compareAtPriceRangeV2 || product.compareAtPriceRange;

  // Build options array from product.options if available, otherwise from variants
  let options: Array<{ id: string; name: string; values: string[] }> = [];

  if (product.options && product.options.length > 0) {
    options = product.options.map(opt => ({
      id: opt.id,
      name: opt.name,
      values: opt.values
    }));
  } else {
    // Build options from variants if not provided
    const optionsMap = new Map<string, Set<string>>();

    product.variants.edges.forEach(edge => {
      edge.node.selectedOptions.forEach(opt => {
        if (!optionsMap.has(opt.name)) {
          optionsMap.set(opt.name, new Set());
        }
        optionsMap.get(opt.name)!.add(opt.value);
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
  // Extract options and process variants from local product data
  const processedVariantsAndOptions = extractOptionsFromVariants(product.variants || []);

  const variants: ProductVariant[] = processedVariantsAndOptions.variants.length > 0
    ? processedVariantsAndOptions.variants
    : [{
        id: `${product.id}_variant_1`,
        title: 'Default',
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        availableForSale: true,
        selectedOptions: {},
        quantityAvailable: 10
      }];

  // Use extracted options or fallback to provided options
  const options = product.options || processedVariantsAndOptions.options;

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
    options,
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

/**
 * Normalize carat weight values for comparison
 * Handles various formats: "0.50 ct", "0.5-0.99 ct", "1.00", "1 ct", etc.
 */
const normalizeCaratValue = (value: string): { min: number; max: number } | number => {
  if (!value) return 0;

  const cleaned = value.toLowerCase().replace(/\s+/g, '').replace('ct', '');

  // Range format: "0.5-0.99" or "0.50-0.99"
  if (cleaned.includes('-')) {
    const [min, max] = cleaned.split('-').map(v => parseFloat(v));
    return { min, max };
  }

  // Plus format: "2.0+" or "2+"
  if (cleaned.includes('+')) {
    const min = parseFloat(cleaned.replace('+', ''));
    return { min, max: Infinity };
  }

  // Single value: "0.50", "1.00", "1"
  return parseFloat(cleaned) || 0;
};

/**
 * Check if a variant's carat value matches the selected carat option
 */
const caratMatches = (variantValue: string, selectedValue: string): boolean => {
  const variant = normalizeCaratValue(variantValue);
  const selected = normalizeCaratValue(selectedValue);

  if (import.meta.env.DEV) {
    console.log('[CaratMatch] Comparing:', {
      variantValue,
      selectedValue,
      variantNormalized: variant,
      selectedNormalized: selected
    });
  }

  // If both are numbers, exact match
  if (typeof variant === 'number' && typeof selected === 'number') {
    const matches = Math.abs(variant - selected) < 0.01; // Allow tiny floating point differences
    if (import.meta.env.DEV) console.log('[CaratMatch] Number match:', matches);
    return matches;
  }

  // If selected is a range, check if variant falls within
  if (typeof selected === 'object' && typeof variant === 'number') {
    const matches = variant >= selected.min && variant <= selected.max;
    if (import.meta.env.DEV) console.log('[CaratMatch] Variant in range:', matches);
    return matches;
  }

  // If variant is a range and selected is a number, check if selected falls within
  if (typeof variant === 'object' && typeof selected === 'number') {
    const matches = selected >= variant.min && selected <= variant.max;
    if (import.meta.env.DEV) console.log('[CaratMatch] Selected in range:', matches);
    return matches;
  }

  // Both are ranges - check overlap
  if (typeof variant === 'object' && typeof selected === 'object') {
    const matches = variant.min <= selected.max && selected.min <= variant.max;
    if (import.meta.env.DEV) console.log('[CaratMatch] Range overlap:', matches);
    return matches;
  }

  if (import.meta.env.DEV) console.log('[CaratMatch] No match conditions met');
  return false;
};

/**
 * Standard EU ring sizes (most common for European jewelry stores)
 */
export const STANDARD_RING_SIZES = [
  '48', '49', '50', '51', '52', '53', '54', '55', '56', '57',
  '58', '59', '60', '61', '62', '63', '64', '65', '66', '67'
];

/**
 * Check if a product is a ring based on title, handle, tags, or product type
 */
export const isRingProduct = (product: ProcessedProduct): boolean => {
  const title = product.title?.toLowerCase() || '';
  const handle = product.handle?.toLowerCase() || '';
  const tags = product.tags?.map(t => t.toLowerCase()) || [];
  const productType = product.productType?.toLowerCase() || '';

  return (
    title.includes('ring') ||
    handle.includes('ring') ||
    tags.some(tag => tag.includes('ring') || tag === 'rings' || tag === 'engagement ring' || tag === 'wedding ring') ||
    productType.includes('ring')
  );
};

/**
 * Add ring size option to products that are rings but don't have a Size option
 */
export const ensureRingSizeOption = (product: ProcessedProduct): ProcessedProduct => {
  if (!isRingProduct(product)) {
    return product;
  }

  // Check if product already has a Size option
  const hasSizeOption = product.options?.some(
    opt => opt.name.toLowerCase() === 'size' || opt.name.toLowerCase() === 'ring size'
  );

  if (hasSizeOption) {
    return product;
  }

  // Add Size option
  const sizeOption = {
    id: `size-option-${product.id}`,
    name: 'Size',
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
  // If no variants or options, return the first variant
  if (!product.variants || product.variants.length === 0) {
    return undefined;
  }

  if (Object.keys(selectedOptions).length === 0) {
    return product.variants[0];
  }

  // Filter out Size and Ring Size from variant matching since they're usually not variant-defining
  // Size is typically a custom attribute, not a variant selector
  const variantDefiningOptions = Object.entries(selectedOptions).filter(
    ([key]) => !['size', 'ring size'].includes(key.toLowerCase())
  );

  if (import.meta.env.DEV && variantDefiningOptions.length !== Object.keys(selectedOptions).length) {
    console.log('[findVariantByOptions] Filtering out Size option from variant matching');
    console.log('[findVariantByOptions] Variant-defining options:', Object.fromEntries(variantDefiningOptions));
  }

  // If only Size was selected, return first available variant
  if (variantDefiningOptions.length === 0) {
    return product.variants.find(v => v.availableForSale) || product.variants[0];
  }

  // Find exact match with shape normalization and carat range support
  const exactMatch = product.variants.find(variant => {
    if (!variant.selectedOptions) return false;

    // Check if all selected variant-defining options match
    return variantDefiningOptions.every(
      ([key, value]) => {
        const variantValue = variant.selectedOptions[key];

        // Special handling for shape-related options
        if (key.toLowerCase().includes('shape') || key.toLowerCase().includes('form')) {
          return shapesMatch(variantValue, value);
        }

        // Special handling for carat weight options
        if (key.toLowerCase().includes('carat') || key.toLowerCase() === 'weight') {
          return caratMatches(variantValue, value);
        }

        // Regular comparison for other options
        return variantValue === value;
      }
    );
  });

  if (exactMatch) {
    if (import.meta.env.DEV) {
      console.log('[findVariantByOptions] Found exact match:', exactMatch.title);
    }
    return exactMatch;
  }

  // If no exact match, try to find partial match (useful when not all options are selected)
  const partialMatch = product.variants.find(variant => {
    if (!variant.selectedOptions) return false;

    // Check if at least one selected option matches
    const matches = variantDefiningOptions.filter(
      ([key, value]) => {
        const variantValue = variant.selectedOptions[key];

        // Special handling for shape-related options
        if (key.toLowerCase().includes('shape') || key.toLowerCase().includes('form')) {
          return shapesMatch(variantValue, value);
        }

        // Special handling for carat weight options
        if (key.toLowerCase().includes('carat') || key.toLowerCase() === 'weight') {
          return caratMatches(variantValue, value);
        }

        return variantValue === value;
      }
    );

    return matches.length > 0;
  });

  if (import.meta.env.DEV) {
    console.log('[findVariantByOptions] Partial match:', partialMatch?.title || 'none, using fallback');
  }

  // Return partial match or first variant as fallback
  return partialMatch || product.variants[0];
};
