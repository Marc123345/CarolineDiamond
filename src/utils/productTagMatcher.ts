import { ProcessedProduct } from '../types/shopify';
import { RingStyle, Shape, MetalColor } from '../config/filterConfig';

export function productMatchesRingStyle(product: ProcessedProduct, ringStyle: RingStyle): boolean {
  if (!product.tags) return false;

  const tags = product.tags.map(t => t.toLowerCase());
  const title = product.name?.toLowerCase() || '';
  const description = product.description?.toLowerCase() || '';

  const hasTag = (tag: string) => tags.some(t => t === tag || t === tag.replace(/-/g, ' ') || t.includes(tag));
  const hasInTitle = (text: string) => title.includes(text.toLowerCase());
  const hasInDescription = (text: string) => description.includes(text.toLowerCase());

  const hasSideDiamonds = hasTag('side diamonds') || hasTag('with side diamonds') ||
                         hasTag('side-diamonds') || hasTag('with-side-diamonds') ||
                         hasInTitle('side diamond') || hasInDescription('side diamond');

  const isSolitaire = hasTag('solitaire') || hasInTitle('solitaire');
  const isHalo = hasTag('halo') || hasInTitle('halo');

  switch (ringStyle) {
    case 'Solitaire':
      return isSolitaire && !hasSideDiamonds;

    case 'Solitaire + Side Diamonds':
      return isSolitaire && hasSideDiamonds;

    case 'Halo':
      return isHalo && !hasSideDiamonds;

    case 'Halo + Side Diamonds':
      return isHalo && hasSideDiamonds;

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
