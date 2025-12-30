import { useState, useEffect, useCallback } from 'react';
import { gql } from 'graphql-request';
import { shopifyClient, CREATE_CART, ADD_TO_CART } from '../lib/shopify';
import { ShopifyCart, ProcessedCartItem, CartLineInput } from '../types';

// ==========================================
// 1. LOCAL QUERIES (Specific to Cart Management)
// ==========================================

const GET_CART = gql`
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      cost {
        totalAmount { amount currencyCode }
        subtotalAmount { amount currencyCode }
      }
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            attributes { key value }
            merchandise {
              ... on ProductVariant {
                id
                title
                price { amount currencyCode }
                product {
                  id
                  title
                  handle
                  images(first: 1) { edges { node { url } } }
                }
                selectedOptions { name value }
              }
            }
            cost {
              totalAmount { amount currencyCode }
            }
          }
        }
      }
    }
  }
`;

const UPDATE_CART_LINES = gql`
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount { amount currencyCode }
        }
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
                  product { title handle images(first: 1) { edges { node { url } } } }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount { amount currencyCode }
        }
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
                  product { title handle images(first: 1) { edges { node { url } } } }
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
// 2. HELPER FUNCTIONS
// ==========================================

const CART_ID_KEY = 'shopify_cart_id';
const isBrowser = () => typeof window !== 'undefined';

// Safe LocalStorage Wrappers
const getStoredCartId = (): string | null => {
  if (!isBrowser()) return null;
  try {
    return localStorage.getItem(CART_ID_KEY);
  } catch (e) {
    return null;
  }
};

const storeCartId = (cartId: string) => {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(CART_ID_KEY, cartId);
  } catch (e) {
    console.error('Failed to save cart ID', e);
  }
};

const clearStoredCartId = () => {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(CART_ID_KEY);
  } catch (e) {
    console.error('Failed to clear cart ID', e);
  }
};

// Transform Shopify Line Item -> ProcessedCartItem
const transformCartLine = (node: any): ProcessedCartItem => {
  const merchandise = node.merchandise;
  const product = merchandise.product;
  
  return {
    id: node.id,
    quantity: node.quantity,
    productId: product.id,
    variantId: merchandise.id,
    title: product.title,
    variantTitle: merchandise.title === 'Default Title' ? '' : merchandise.title,
    name: product.title, // Unified name field
    productTitle: product.title,
    productHandle: product.handle,
    image: product.images?.edges[0]?.node?.url || '',
    price: parseFloat(merchandise.price.amount),
    totalPrice: parseFloat(node.cost.totalAmount.amount),
    selectedOptions: merchandise.selectedOptions.reduce((acc: any, opt: any) => {
      acc[opt.name] = opt.value;
      return acc;
    }, {}),
    attributes: (node.attributes || []).reduce((acc: any, attr: any) => {
      acc[attr.key] = attr.value;
      return acc;
    }, {})
  };
};

// ==========================================
// 3. MAIN HOOK
// ==========================================

export const useShopifyCart = () => {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [cartItems, setCartItems] = useState<ProcessedCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update internal state from a raw Shopify Cart object
  const updateCartState = useCallback((newCart: any) => {
    if (!newCart) {
      setCart(null);
      setCartItems([]);
      return;
    }

    setCart(newCart);
    if (newCart.lines?.edges && Array.isArray(newCart.lines.edges)) {
      const transformedItems = newCart.lines.edges.map((edge: any) => transformCartLine(edge.node));
      setCartItems(transformedItems);
    } else {
      setCartItems([]);
    }
  }, []);

  // Fetch Cart Action
  const fetchCart = useCallback(async (cartId: string) => {
    if (!shopifyClient) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response: any = await shopifyClient.request(GET_CART, { cartId });

      if (response.cart) {
        updateCartState(response.cart);
      } else {
        // Cart expired or not found
        clearStoredCartId();
        setCart(null);
        setCartItems([]);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      // If 404/Not Found, clear ID
      clearStoredCartId(); 
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [updateCartState]);

  // Create Cart Action
  const createCartAction = async (lines: CartLineInput[] = []) => {
    if (!shopifyClient) throw new Error('Shopify client not available');

    try {
      setLoading(true);
      const response: any = await shopifyClient.request(CREATE_CART, { input: { lines } });
      
      // Handle User Errors
      if (response.cartCreate?.userErrors?.length > 0) {
        throw new Error(response.cartCreate.userErrors[0].message);
      }

      const newCart = response.cartCreate.cart;
      if (newCart) {
        storeCartId(newCart.id);
        updateCartState(newCart);
        return newCart;
      }
    } catch (err) {
      console.error('Error creating cart:', err);
      setError('Failed to create cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add Item Action
  const addToCart = async (
    variantId: string, 
    quantity: number = 1, 
    attributes?: { key: string; value: string }[]
  ) => {
    if (!shopifyClient) throw new Error('Store not available');

    try {
      setLoading(true);
      setError(null);

      const lineInput: CartLineInput = { merchandiseId: variantId, quantity };
      if (attributes?.length) lineInput.attributes = attributes;

      const currentCartId = getStoredCartId();

      if (!currentCartId) {
        await createCartAction([lineInput]);
      } else {
        const response: any = await shopifyClient.request(ADD_TO_CART, {
          cartId: currentCartId,
          lines: [lineInput]
        });

        if (response.cartLinesAdd?.userErrors?.length > 0) {
          throw new Error(response.cartLinesAdd.userErrors[0].message);
        }

        if (response.cartLinesAdd.cart) {
          updateCartState(response.cartLinesAdd.cart);
        }
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update Line Action
  const updateCartLine = async (lineId: string, quantity: number) => {
    const cartId = getStoredCartId();
    if (!cartId || !shopifyClient) return;

    try {
      setLoading(true);
      const response: any = await shopifyClient.request(UPDATE_CART_LINES, {
        cartId,
        lines: [{ id: lineId, quantity }]
      });

      if (response.cartLinesUpdate.cart) {
        updateCartState(response.cartLinesUpdate.cart);
      }
    } catch (err) {
      console.error('Error updating line:', err);
      setError('Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  // Remove Line Action
  const removeFromCart = async (lineId: string) => {
    const cartId = getStoredCartId();
    if (!cartId || !shopifyClient) return;

    try {
      setLoading(true);
      const response: any = await shopifyClient.request(REMOVE_FROM_CART, {
        cartId,
        lineIds: [lineId]
      });

      if (response.cartLinesRemove.cart) {
        updateCartState(response.cartLinesRemove.cart);
      }
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  // Initialization
  useEffect(() => {
    if (isBrowser()) {
      const storedId = getStoredCartId();
      if (storedId) {
        fetchCart(storedId);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [fetchCart]);

  return {
    cart,
    cartItems,
    loading,
    error,
    addToCart,
    updateCartLine,
    removeFromCart,
    clearCart: () => {
      clearStoredCartId();
      setCart(null);
      setCartItems([]);
    },
    getCheckoutUrl: () => cart?.checkoutUrl || null,
    getTotalPrice: () => cart ? parseFloat(cart.cost.totalAmount.amount) : 0,
    getTotalQuantity: () => cart?.totalQuantity || 0
  };
};