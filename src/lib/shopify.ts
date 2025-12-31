import { GraphQLClient, gql } from 'graphql-request';
import type {
  ProcessedProduct,
  ShopifyProductsResponse,
  ShopifyProductResponse,
  ProductVariant,
  ProductOption,
  ProductMetafields,
  CartLineInput
} from '../types/shopify';

// ==========================================
// 1. CLIENT INITIALIZATION
// ==========================================
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

console.log('🔍 Shopify Client Initialization:', {
  domain: SHOPIFY_DOMAIN || 'MISSING',
  hasToken: !!STOREFRONT_ACCESS_TOKEN,
  env: import.meta.env.MODE
});

let shopifyClientInstance: GraphQLClient | null = null;

if (SHOPIFY_DOMAIN && STOREFRONT_ACCESS_TOKEN) {
  try {
    const apiUrl = `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`;
    shopifyClientInstance = new GraphQLClient(apiUrl, {
      headers: {
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    });
    console.log('✅ Shopify client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Shopify client:', error);
    shopifyClientInstance = null;
  }
}

export const shopifyClient = shopifyClientInstance;

// ==========================================
// 2. DATA CLEANING & MAPPING UTILITIES
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

const cleanValue = (val: string): string => {
  if (!val) return '';
  const trimmed = val.trim();
  return DATA_FIXES[trimmed] || trimmed;
};

const mapMetafields = (edges: any[]): ProductMetafields => {
  if (!edges || !Array.isArray(edges)) return {};

  const map: Record<string, string> = {};

  edges.forEach(mf => {
    if (!mf || !mf.key || !mf.value) return;

    switch(mf.key) {
      case 'age-group': map.ageGroup = mf.value; break;
      case 'color-pattern': map.colorPattern = mf.value; break;
      case 'jewelry-material': map.jewelryMaterial = mf.value; break;
      case 'jewelry-type': map.jewelryType = mf.value; break;
      case 'ring-design': map.ringDesign = mf.value; break;
      case 'ring-size': map.ringSize = mf.value; break;
      case 'target-gender': map.targetGender = mf.value; break;
      case 'earring_type': map.earringType = mf.value; break;
      case 'earring_backing': map.earringBacking = mf.value; break;
      case 'chain_length': map.chainLength = mf.value; break;
      case 'pendant_size': map.pendantSize = mf.value; break;
    }
  });

  return map;
};

const transformProduct = (node: any): ProcessedProduct => {
  const variants: ProductVariant[] = node.variants.edges.map(({ node: v }: any) => ({
    id: v.id,
    title: v.title,
    price: parseFloat(v.price.amount),
    compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : undefined,
    availableForSale: v.availableForSale,
    quantityAvailable: v.quantityAvailable,
    image: v.image?.url,
    selectedOptions: v.selectedOptions.reduce((acc: any, opt: any) => {
      acc[cleanValue(opt.name)] = cleanValue(opt.value);
      return acc;
    }, {} as Record<string, string>)
  }));

  const options: ProductOption[] = node.options.map((opt: any) => ({
    id: opt.id,
    name: cleanValue(opt.name),
    values: opt.values.map(cleanValue)
  }));

  return {
    id: node.id,
    handle: node.handle,
    name: node.title,
    description: node.description,
    price: parseFloat(node.priceRange.minVariantPrice.amount),
    images: node.images.edges.map((img: any) => img.node.url),
    image: node.images.edges[0]?.node.url || '',
    category: node.productType || 'Jewelry',
    vendor: node.vendor,
    tags: node.tags,
    availableForSale: node.availableForSale,
    variants,
    options,
    metafields: mapMetafields(node.metafields || [])
  };
};

// ==========================================
// 3. GRAPHQL QUERIES & MUTATIONS
// ==========================================

export const GET_PRODUCTS = gql`
  query GetProducts($first: Int!, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean, $after: String) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse, after: $after) {
      edges {
        node {
          id
          handle
          title
          description
          vendor
          tags
          availableForSale
          productType
          priceRange {
            minVariantPrice { amount }
          }
          images(first: 10) {
            edges { node { url altText } }
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                price { amount }
                compareAtPrice { amount }
                availableForSale
                quantityAvailable
                selectedOptions { name value }
                image { url }
              }
            }
          }
          options { id name values }
          metafields(identifiers: [
            { namespace: "shopify", key: "age-group" },
            { namespace: "shopify", key: "jewelry-type" },
            { namespace: "shopify", key: "ring-size" },
            { namespace: "custom", key: "chain_length" }
          ]) {
            namespace key value
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = gql`
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      vendor
      tags
      availableForSale
      productType
      priceRange {
        minVariantPrice { amount }
      }
      images(first: 10) {
        edges { node { url altText } }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            price { amount }
            compareAtPrice { amount }
            availableForSale
            quantityAvailable
            selectedOptions { name value }
            image { url }
          }
        }
      }
      options { id name values }
      metafields(identifiers: [
        { namespace: "shopify", key: "age-group" },
        { namespace: "shopify", key: "jewelry-material" },
        { namespace: "shopify", key: "jewelry-type" },
        { namespace: "shopify", key: "ring-size" },
        { namespace: "custom", key: "chain_length" }
      ]) {
        namespace key value
      }
    }
  }
`;

export const CREATE_CART = gql`
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price { amount currencyCode }
                  product { title handle image: images(first: 1) { edges { node { url } } } }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price { amount currencyCode }
                  product { title handle image: images(first: 1) { edges { node { url } } } }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// ==========================================
// 4. API FUNCTIONS
// ==========================================

export const fetchAllProducts = async (): Promise<ProcessedProduct[]> => {
  if (!shopifyClient) return [];
  try {
    const data = await shopifyClient.request<ShopifyProductsResponse>(GET_PRODUCTS, { first: 250 });
    return data.products.edges.map(({ node }) => transformProduct(node));
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return [];
  }
};

export const fetchProductByHandle = async (handle: string): Promise<ProcessedProduct | null> => {
  if (!shopifyClient) return null;
  try {
    const data = await shopifyClient.request<ShopifyProductResponse>(GET_PRODUCT_BY_HANDLE, { handle });
    if (!data.product) return null;
    return transformProduct(data.product);
  } catch (error) {
    console.error(`❌ Error fetching product ${handle}:`, error);
    return null;
  }
};

export const createCart = async (lines: CartLineInput[]) => {
  if (!shopifyClient) return null;
  try {
    const data = await shopifyClient.request<any>(CREATE_CART, { input: { lines } });
    return data.cartCreate.cart;
  } catch (error) {
    console.error('❌ Error creating cart:', error);
    return null;
  }
};

export const addToCart = async (cartId: string, lines: CartLineInput[]) => {
  if (!shopifyClient) return null;
  try {
    const data = await shopifyClient.request<any>(ADD_TO_CART, { cartId, lines });
    return data.cartLinesAdd.cart;
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    return null;
  }
};
