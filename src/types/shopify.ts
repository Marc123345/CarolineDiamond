export interface ProductMetafields {
  ageGroup?: string;
  colorPattern?: string;
  jewelryMaterial?: string;
  jewelryType?: string;
  ringDesign?: string;
  ringSize?: string;
  targetGender?: string;
  earringType?: string;
  earringBacking?: string;
  chainLength?: string;
  pendantSize?: string;
}

export interface ProductImage {
  url: string;
  altText: string;
}

export interface ProcessedProduct {
  id: string;
  handle: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  image: string;
  imageAlt: string;
  images: ProductImage[];
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
  productType?: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  availableForSale: boolean;
  quantityAvailable: number;
  selectedOptions: Record<string, string>;
  image: string;
  imageAlt: string;
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
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText?: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice?: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        quantityAvailable?: number;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
        image?: {
          url: string;
          altText?: string;
        };
        media?: {
          edges: Array<{
            node: {
              image?: {
                url: string;
                altText?: string;
              };
            };
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

export interface ShopifyProductsResponse {
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor?: string;
    };
  };
}

export interface ShopifyProductResponse {
  product: ShopifyProduct;
}

export interface CartLine {
  id: string;
  quantity: number;
  attributes?: Array<{
    key: string;
    value: string;
  }>;
  merchandise: {
    id: string;
    title: string;
    product: {
      id: string;
      title: string;
      handle: string;
      images: {
        edges: Array<{
          node: {
            url: string;
          };
        }>;
      };
    };
    price: {
      amount: string;
      currencyCode: string;
    };
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
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

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{
      node: CartLine;
    }>;
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface ProcessedCartItem {
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

export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
  attributes?: { key: string; value: string }[];
}
