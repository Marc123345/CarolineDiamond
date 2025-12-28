export interface ProductMetafields {
  ageGroup?: string;
  colorPattern?: string;
  jewelryMaterial?: string;
  jewelryType?: string;
  ringDesign?: string;
  necklaceDesign?: string;
  ringSize?: string;
  targetGender?: string;
  birthstoneAvailable?: string | boolean;
  diamondShapeAvailable?: string | boolean;
  earringType?: string;
  earringBacking?: string;
  chainLength?: string;
  pendantSize?: string;
  centerStone?: string;
  clarity?: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  availableForSale: boolean;
  selectedOptions: Record<string, string>;
  quantityAvailable?: number;
  image?: string;
  images?: string[];
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
  options: Array<{ id: string; name: string; values: string[] }>;
  isCustomizable?: boolean;
  features?: string[];
  materials?: string[];
  deliveryTime?: string;
  metafields?: ProductMetafields;
  productType?: string;
}

export interface CartLine {
  id: string;
  quantity: number;
  attributes?: Array<{ key: string; value: string }>;
  merchandise: {
    id: string;
    title: string;
    product: {
      id: string;
      title: string;
      handle: string;
      images: { edges: Array<{ node: { url: string } }> };
    };
    price: { amount: string; currencyCode: string };
    selectedOptions: Array<{ name: string; value: string }>;
  };
  cost: { totalAmount: { amount: string; currencyCode: string } };
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

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  vendor: string;
  tags: string[];
  availableForSale: boolean;
  productType?: string;
  priceRange: { minVariantPrice: { amount: string } };
  images: { edges: Array<{ node: { url: string } }> };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: { amount: string };
        compareAtPrice?: { amount: string };
        availableForSale: boolean;
        selectedOptions: Array<{ name: string; value: string }>;
        image?: { url: string };
      };
    }>;
  };
  options: Array<{ id: string; name: string; values: string[] }>;
  metafields?: Array<{ key: string; value: string; namespace: string }>;
}