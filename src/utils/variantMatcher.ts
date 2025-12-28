import { ProcessedProduct, ProductVariant } from '../types/shopify';

export interface VariantPreferences {
  diamondType?: 'Natural' | 'Lab-Grown';
  caratWeight?: number;
  metalColor?: string;
  size?: string;
}

export interface VariantMatchResult {
  variant: ProductVariant | null;
  price: number;
  priceDisplay: string;
  availableCarats: number[];
  availableDiamondTypes: string[];
  availableMetalColors: string[];
}

const extractCaratFromOption = (optionValue: string): number | null => {
  if (!optionValue) return null;

  const match = optionValue.match(/(\d+\.?\d*)\s*ct/i);
  if (match) {
    return parseFloat(match[1]);
  }

  return null;
};

const extractDiamondTypeFromOption = (optionValue: string): 'Natural' | 'Lab-Grown' | null => {
  if (!optionValue) return null;

  const lower = optionValue.toLowerCase();
  if (lower.includes('lab-grown') || lower.includes('lab grown') || lower.includes('synthetic')) {
    return 'Lab-Grown';
  }
  if (lower.includes('natural')) {
    return 'Natural';
  }

  const caratOnly = /^\d+\.?\d*\s*ct$/i.test(optionValue);
  if (caratOnly) {
    return 'Natural';
  }

  return null;
};

export const matchVariantToPreferences = (
  product: ProcessedProduct,
  preferences: VariantPreferences
): VariantMatchResult => {
  const availableCarats = new Set<number>();
  const availableDiamondTypes = new Set<string>();
  const availableMetalColors = new Set<string>();

  product.variants.forEach(variant => {
    if (!variant.availableForSale) return;
    if (!variant.selectedOptions) return;

    const option1 = variant.selectedOptions['Option1 Value'] || variant.selectedOptions['Diamond Type'];
    const option2 = variant.selectedOptions['Option2 Value'] || variant.selectedOptions['Carat'];
    const colorOption = variant.selectedOptions['Color'] || variant.selectedOptions['Option3 Value'];

    const carat = extractCaratFromOption(option1 || option2 || '');
    if (carat) availableCarats.add(carat);

    const diamondType = extractDiamondTypeFromOption(option1 || option2 || '');
    if (diamondType) availableDiamondTypes.add(diamondType);

    if (colorOption) availableMetalColors.add(colorOption);
  });

  let matchedVariant: ProductVariant | null = null;

  const sortedVariants = [...product.variants].sort((a, b) => {
    if (!a.availableForSale && b.availableForSale) return 1;
    if (a.availableForSale && !b.availableForSale) return -1;
    return 0;
  });

  for (const variant of sortedVariants) {
    if (!variant.availableForSale) continue;
    if (!variant.selectedOptions) continue;

    const option1 = variant.selectedOptions['Option1 Value'] || variant.selectedOptions['Diamond Type'];
    const option2 = variant.selectedOptions['Option2 Value'] || variant.selectedOptions['Carat'];
    const colorOption = variant.selectedOptions['Color'] || variant.selectedOptions['Option3 Value'];

    const variantCarat = extractCaratFromOption(option1 || option2 || '');
    const variantDiamondType = extractDiamondTypeFromOption(option1 || option2 || '');

    let matches = true;

    if (preferences.caratWeight && variantCarat !== preferences.caratWeight) {
      matches = false;
    }

    if (preferences.diamondType && variantDiamondType !== preferences.diamondType) {
      matches = false;
    }

    if (preferences.metalColor && colorOption) {
      const colorLower = colorOption.toLowerCase();
      const prefLower = preferences.metalColor.toLowerCase();
      if (!colorLower.includes(prefLower)) {
        matches = false;
      }
    }

    if (preferences.size) {
      const sizeOption = variant.selectedOptions['Size'] || variant.selectedOptions['Ring Size'];
      if (sizeOption !== preferences.size) {
        matches = false;
      }
    }

    if (matches) {
      matchedVariant = variant;
      break;
    }
  }

  if (!matchedVariant && sortedVariants.length > 0) {
    matchedVariant = sortedVariants[0];
  }

  const price = matchedVariant?.price || 0;
  const priceDisplay = price === 0 || price === null || price === undefined
    ? 'Price on Request'
    : `€${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return {
    variant: matchedVariant,
    price,
    priceDisplay,
    availableCarats: Array.from(availableCarats).sort((a, b) => a - b),
    availableDiamondTypes: Array.from(availableDiamondTypes).sort(),
    availableMetalColors: Array.from(availableMetalColors).sort()
  };
};

export const hasSideDiamonds = (product: ProcessedProduct): boolean => {
  const ringDesign = product.metafields?.ringDesign;
  if (ringDesign) {
    const designLower = ringDesign.toLowerCase();
    if (designLower.includes('side diamond')) {
      return true;
    }
  }

  const handleLower = product.handle.toLowerCase();
  if (handleLower.includes('side-diamond')) {
    return true;
  }

  const titleLower = product.name.toLowerCase();
  if (titleLower.includes('side diamond')) {
    return true;
  }

  return false;
};

export const getAvailableVariantOptions = (product: ProcessedProduct): {
  carats: number[];
  diamondTypes: string[];
  metalColors: string[];
  sizes: string[];
} => {
  const carats = new Set<number>();
  const diamondTypes = new Set<string>();
  const metalColors = new Set<string>();
  const sizes = new Set<string>();

  product.variants.forEach(variant => {
    if (!variant.availableForSale) return;
    if (!variant.selectedOptions) return;

    const option1 = variant.selectedOptions['Option1 Value'] || variant.selectedOptions['Diamond Type'];
    const option2 = variant.selectedOptions['Option2 Value'] || variant.selectedOptions['Carat'];
    const colorOption = variant.selectedOptions['Color'] || variant.selectedOptions['Option3 Value'];
    const sizeOption = variant.selectedOptions['Size'] || variant.selectedOptions['Ring Size'];

    const carat = extractCaratFromOption(option1 || option2 || '');
    if (carat) carats.add(carat);

    const diamondType = extractDiamondTypeFromOption(option1 || option2 || '');
    if (diamondType) diamondTypes.add(diamondType);

    if (colorOption) metalColors.add(colorOption);
    if (sizeOption) sizes.add(sizeOption);
  });

  return {
    carats: Array.from(carats).sort((a, b) => a - b),
    diamondTypes: Array.from(diamondTypes).sort(),
    metalColors: Array.from(metalColors).sort(),
    sizes: Array.from(sizes).sort()
  };
};
