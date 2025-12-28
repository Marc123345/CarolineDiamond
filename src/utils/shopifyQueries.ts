import { gql } from 'graphql-request';

// --- Fragments for Reusability ---
const CORE_CART_FIELDS = gql`
  fragment CoreCartFields on Cart {
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
              product {
                id
                title
                handle
                images(first: 1) {
                  edges {
                    node {
                      url
                    }
                  }
                }
              }
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
    }
  }
`;

// --- Cart Mutations ---
export const CREATE_CART = gql`
  ${CORE_CART_FIELDS}
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CoreCartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  ${CORE_CART_FIELDS}
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CoreCartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const UPDATE_CART_LINES = gql`
  ${CORE_CART_FIELDS}
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CoreCartFields
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  ${CORE_CART_FIELDS}
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CoreCartFields
      }
    }
  }
`;

export const GET_CART = gql`
  ${CORE_CART_FIELDS}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CoreCartFields
    }
  }
`;

// --- Product Queries ---

/**
 * Common fields for products to ensure consistency 
 * between grid view and single product view.
 */
const PRODUCT_FIELDS = gql`
  fragment ProductFields on Product {
    id
    handle
    title
    description
    vendor
    tags
    availableForSale
    productType
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 50) {
      edges {
        node {
          id
          title
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          availableForSale
          quantityAvailable
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
          }
        }
      }
    }
    options {
      id
      name
      values
    }
    metafields(identifiers: [
      { namespace: "shopify", key: "age-group" },
      { namespace: "shopify", key: "color-pattern" },
      { namespace: "shopify", key: "jewelry-material" },
      { namespace: "shopify", key: "jewelry-type" },
      { namespace: "shopify", key: "ring-design" },
      { namespace: "shopify", key: "necklace-design" },
      { namespace: "shopify", key: "ring-size" },
      { namespace: "shopify", key: "target-gender" },
      { namespace: "custom", key: "birthstone_available" },
      { namespace: "custom", key: "diamond_shape_available" },
      { namespace: "custom", key: "earring_type" },
      { namespace: "custom", key: "earring_backing" },
      { namespace: "custom", key: "chain_length" }
    ]) {
      namespace
      key
      value
      type
    }
  }
`;

export const GET_PRODUCTS = gql`
  ${PRODUCT_FIELDS}
  query GetProducts($first: Int!, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean, $after: String) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse, after: $after) {
      edges {
        node {
          ...ProductFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = gql`
  ${PRODUCT_FIELDS}
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;