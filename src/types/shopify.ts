export interface ProductMetafields {
  // standard shopify namespace
  ageGroup?: string;
  colorPattern?: string;
  jewelryMaterial?: string;
  jewelryType?: string;
  ringDesign?: string;
  necklaceDesign?: string; // Added from CSV
  ringSize?: string;
  targetGender?: string;
  
  // custom namespace from your CSV
  birthstoneAvailable?: string | boolean; // product.metafields.custom.birthstone_available
  diamondShapeAvailable?: string | boolean; // product.metafields.custom.diamond_shape_available
  
  // existing custom fields
  earringType?: string;
  earringBacking?: string;
  chainLength?: string;
  pendantSize?: string;
  centerStone?: string;
  clarity?: string;
}

export interface ProcessedProduct {
  id: string;
  handle: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images: string[];
  category: string;
  vendor: string;
  tags: string[];
  availableForSale: boolean;
  variants: ProductVariant[];
  options: ProductOption[];
  isCustomizable?: boolean;
  features?: string[];
  materials?: string[];
  deliveryTime?: string;
  metafields?: ProductMetafields;
  productType?: string; // Maps to CSV "Type" column
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  availableForSale: boolean;
  selectedOptions: Record<string, string>; // Keys: "Metal Color", "Diamond Type", etc.
  quantityAvailable?: number;
  image?: string;
  images?: string[]; // Media array for premium gallery
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ShopifyMetafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  vendor: string;
  tags: string[];
  availableForSale: boolean;
  productType?: string;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string; };
    maxVariantPrice: { amount: string; currencyCode: string; };
  };
  compareAtPriceRange?: {
    minVariantPrice: { amount: string; currencyCode: string; };
  };
  images: {
    edges: Array<{
      node: { url: string; altText?: string; };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: { amount: string; currencyCode: string; };
        compareAtPrice?: { amount: string; currencyCode: string; };
        availableForSale: boolean;
        quantityAvailable?: number;
        selectedOptions: Array<{ name: string; value: string; }>;
        image?: { url: string; altText?: string; };
        media?: {
          edges: Array<{
            node: { image?: { url: string; altText?: string; }; };
          }>;
        };
      };
    }>;
  };
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  metafields?: ShopifyMetafield[];
}

/** * Cart & Response Types remain consistent with 
 * Storefront API version 2024-01+
 */
export interface ShopifyProductsResponse {
  products: {
    edges: Array<{ node: ShopifyProduct; }>;
    pageInfo: { hasNextPage: boolean; endCursor?: string; };
  };
}

export interface ShopifyProductResponse {
  product: ShopifyProduct;
}

export interface ProcessedCartLine {
  id: string;
  quantity: number;
  productId: string;
  variantId: string;
  title: string;
  variantTitle: string;
  name: string;
  productTitle: string;
  productHandle: string;
  image: string;
  price: number;
  totalPrice: number;
  selectedOptions: Record<string, string>;
  attributes: Record<string, string>;
}