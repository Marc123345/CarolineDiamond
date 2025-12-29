import { ProcessedProduct } from '../types/shopify';
import { RingStyle, Shape, MetalColor } from '../config/filterConfig';

export function productMatchesRingStyle(product: ProcessedProduct, ringStyle: RingStyle): boolean {
  if (!product.tags) return false;

  const tags = product.tags.map(t => t.toLowerCase());

  // First check for composite tags (most reliable)
  const compositeTag = ringStyle.toLowerCase()
    .replace(' (without side diamonds)', '-without-side-diamonds')
    .replace(' (with side diamonds)', '-with-side-diamonds');

  if (tags.includes(compositeTag)) {
    return true;
  }

  // Fallback to detailed matching for products without composite tags
  const title = product.name?.toLowerCase() || '';
  const description = product.description?.toLowerCase() || '';

  const hasTag = (tag: string) => tags.some(t => t === tag || t === tag.replace(/-/g, ' ') || t.includes(tag));
  const hasInTitle = (text: string) => title.includes(text.toLowerCase());
  const hasInDescription = (text: string) => description.includes(text.toLowerCase());

  // Check for side diamonds in tags, title, description, or variant data
  const hasSideDiamondsTag = hasTag('side diamonds') || hasTag('with side diamonds') ||
                             hasTag('side-diamonds') || hasTag('with-side-diamonds') ||
                             hasInTitle('side diamond') || hasInDescription('side diamond');

  // Also check if any variant has actual side diamonds (not "None" and not halo diamonds)
  const hasSideDiamondsInVariants = product.variants?.some(v => {
    const sideDiamondsValue = (v as any).sideDiamonds;
    if (!sideDiamondsValue) return false;
    const value = String(sideDiamondsValue).toLowerCase();
    // Exclude "None" and values that indicate it's just a halo (0.40 carat is typical halo)
    return value !== 'none' &&
           value !== '0.40 carat' && // Halo diamonds, not band diamonds
           !value.includes('halo') &&
           (value.includes('carat') || value.includes('diamond'));
  }) || false;

  const hasSideDiamonds = hasSideDiamondsTag || hasSideDiamondsInVariants;

  const isSolitaire = hasTag('solitaire') || hasInTitle('solitaire');
  const isHalo = hasTag('halo') || hasInTitle('halo');

  switch (ringStyle) {
    case 'Solitaire (Without Side Diamonds)':
      return isSolitaire && !isHalo && !hasSideDiamonds;

    case 'Solitaire (With Side Diamonds)':
      return isSolitaire && !isHalo && hasSideDiamonds;

    case 'Halo (Without Side Diamonds)':
      return isHalo && !isSolitaire && !hasSideDiamonds;

    case 'Halo (With Side Diamonds)':
      return isHalo && !isSolitaire && hasSideDiamonds;

    default:
      return false;
  }
}

export function productMatchesShape(product: ProcessedProduct, shape: Shape): boolean {
  if (!product.tags) return false;

  const shapeTag = `${shape.toLowerCase()}-diamond`;
  const tags = product.tags.map(t => t.toLowerCase());

  return tags.some(tag =>
    tag === shapeTag ||
    tag === shape.toLowerCase() ||
    tag === `shape:${shape.toLowerCase()}`
  );
}

export function productHasMetalColor(product: ProcessedProduct, metalColor: MetalColor): boolean {
  if (!product.variants || product.variants.length === 0) {
    return product.tags?.some(tag =>
      tag.toLowerCase().includes(metalColor.toLowerCase())
    ) || false;
  }

  return product.variants.some(variant => {
    const title = variant.title?.toLowerCase() || '';
    const option1 = variant.selectedOptions?.['Metal Color']?.toLowerCase() ||
                   variant.selectedOptions?.['Color']?.toLowerCase() || '';

    const metalLower = metalColor.toLowerCase();
    const fullMetalName = `18k ${metalLower}`;

    return title.includes(fullMetalName) ||
           title.includes(metalLower) ||
           option1.includes(metalLower) ||
           option1.includes(fullMetalName);
  });
}

export function productHasDiamondType(product: ProcessedProduct, diamondType: string): boolean {
  if (!product.variants || product.variants.length === 0) {
    return product.tags?.some(tag =>
      tag.toLowerCase().includes(diamondType.toLowerCase())
    ) || false;
  }

  return product.variants.some(variant => {
    const title = variant.title?.toLowerCase() || '';
    const option2 = variant.selectedOptions?.['Diamond Type']?.toLowerCase() ||
                   variant.selectedOptions?.['Carat']?.toLowerCase() || '';

    const typeLower = diamondType.toLowerCase();

    return title.includes(typeLower) ||
           option2.includes(typeLower) ||
           title === typeLower ||
           option2 === typeLower;
  });
}

export function getAllShapesFromProducts(products: ProcessedProduct[]): Shape[] {
  const shapes = new Set<Shape>();
  const shapeNames: Shape[] = ['Round', 'Oval', 'Princess', 'Pear', 'Marquise', 'Emerald', 'Cushion', 'Heart'];

  products.forEach(product => {
    shapeNames.forEach(shape => {
      if (productMatchesShape(product, shape)) {
        shapes.add(shape);
      }
    });
  });

  return Array.from(shapes);
}

export function getAllMetalColorsFromProducts(products: ProcessedProduct[]): MetalColor[] {
  const colors = new Set<MetalColor>();
  const metalNames: MetalColor[] = ['Yellow Gold', 'White Gold', 'Rose Gold'];

  products.forEach(product => {
    metalNames.forEach(metal => {
      if (productHasMetalColor(product, metal)) {
        colors.add(metal);
      }
    });
  });

  return Array.from(colors);
}

export function getAllDiamondTypesFromProducts(products: ProcessedProduct[]): string[] {
  const types = new Set<string>();
  const diamondTypeValues = ['0.50ct', '1.00ct', '1.50ct', 'Natural Diamond'];

  products.forEach(product => {
    diamondTypeValues.forEach(type => {
      if (productHasDiamondType(product, type)) {
        types.add(type);
      }
    });
  });

  return Array.from(types);
}
