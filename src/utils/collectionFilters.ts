import type { CollectionFilters } from '../config/collectiesConfig';
import type { ShopifyProduct } from '../types/shopify';

export function filterProductsByCollection(
  products: ShopifyProduct[],
  filters: CollectionFilters | undefined
): ShopifyProduct[] {
  if (!filters || !products.length) return [];

  return products.filter(product => {
    // Defensive: Hard-block undefined or corrupted products
    if (!product || !product.priceRange || !product.tags || !product.variants) {
      if (import.meta.env.DEV) {
        console.warn('🚫 Filtered out corrupted product:', product);
      }
      return false;
    }

    if (filters.type) {
      if (product.productType !== filters.type) return false;
    }

    if (filters.tags) {
      const hasAllTags = filters.tags.every(tag =>
        product.tags.some(productTag =>
          productTag.toLowerCase() === tag.toLowerCase()
        )
      );
      if (!hasAllTags) return false;
    }

    if (filters.variantTitle) {
      const hasMatchingVariant = product.variants.some(variant =>
        variant.title.includes(filters.variantTitle!)
      );
      if (!hasMatchingVariant) return false;
    }

    return true;
  });
}

export function getMinPrice(products: ShopifyProduct[]): number | null {
  if (!products.length) return null;

  const minPrice = products.reduce((min, p) => {
    // Defensive: Skip products with missing priceRange
    if (!p || !p.priceRange?.minVariantPrice?.amount) {
      if (import.meta.env.DEV) {
        console.warn('🚫 Product missing priceRange:', p);
      }
      return min;
    }

    const price = parseFloat(p.priceRange.minVariantPrice.amount);
    return price < min ? price : min;
  }, Infinity);

  return minPrice === Infinity ? null : minPrice;
}

export function getCollectionHeroImage(products: ShopifyProduct[]): string | null {
  if (!products.length) return null;

  const productWithImage = products.find(p => p.images.length > 0);
  return productWithImage?.images[0]?.src || null;
}
