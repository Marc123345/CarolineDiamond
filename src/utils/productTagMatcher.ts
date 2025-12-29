import { ProcessedProduct } from '../types/shopify';
import { RingStyle, Shape, MetalColor } from '../config/filterConfig';

export function productMatchesRingStyle(product: ProcessedProduct, ringStyle: RingStyle): boolean {
  if (!product.tags) return false;

  const tags = product.tags.map(t => t.toLowerCase());
  const title = product.name?.toLowerCase() || '';
  const type = product.type?.toLowerCase() || '';

  const hasTag = (tag: string) => tags.some(t =>
    t === tag ||
    t === tag.replace(/-/g, ' ') ||
    t.includes(tag) ||
    t.replace(/\s+/g, '-') === tag
  );

  // Check for solitaire and halo
  const isSolitaire = hasTag('solitaire') ||
                      title.includes('solitaire') ||
                      type.includes('solitaire') ||
                      tags.includes('classic'); // classic is also solitaire

  const isHalo = hasTag('halo') ||
                 title.includes('halo') ||
                 type.includes('halo');

  // Check for side diamonds - look for common patterns including composite tags
  const hasSideDiamonds = hasTag('with-side-diamonds') ||
                         hasTag('side-diamonds') ||
                         hasTag('with side diamonds') ||
                         hasTag('side diamonds') ||
                         hasTag('halo + side diamonds') ||
                         hasTag('solitaire + side diamonds') ||
                         hasTag('halo+side-diamonds') ||
                         hasTag('solitaire+side-diamonds') ||
                         tags.some(t => t.includes('+ side diamonds') || t.includes('+side diamonds')) ||
                         title.includes('with side diamonds') ||
                         title.includes('+ side diamonds') ||
                         title.includes('side diamonds');

  const hasNoSideDiamonds = hasTag('no-side-diamonds') ||
                           hasTag('no side diamonds') ||
                           hasTag('without side diamonds') ||
                           title.includes('no side diamonds') ||
                           title.includes('- no side diamonds');

  switch (ringStyle) {
    case 'Solitaire (Without Side Diamonds)':
      return isSolitaire && !isHalo && (hasNoSideDiamonds || !hasSideDiamonds);

    case 'Solitaire (With Side Diamonds)':
      return isSolitaire && !isHalo && hasSideDiamonds;

    case 'Halo (Without Side Diamonds)':
      return isHalo && (hasNoSideDiamonds || !hasSideDiamonds);

    case 'Halo (With Side Diamonds)':
      return isHalo && hasSideDiamonds;

    default:
      return false;
  }
}

export function productMatchesShape(product: ProcessedProduct, shape: Shape): boolean {
  if (!product.tags) return false;

  const shapeLower = shape.toLowerCase();
  const tags = product.tags.map(t => t.toLowerCase());
  const title = product.name?.toLowerCase() || '';

  // Check various tag patterns
  return tags.some(tag =>
    tag === `${shapeLower}-diamond` ||
    tag === shapeLower ||
    tag === `shape:${shapeLower}` ||
    tag.includes(`${shapeLower} diamond`) ||
    tag.includes(`${shapeLower}-diamond`)
  ) || title.includes(`${shapeLower} diamond`) ||
       title.includes(`${shapeLower}-diamond`);
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
