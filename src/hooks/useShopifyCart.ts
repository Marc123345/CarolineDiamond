import { useState, useEffect, useCallback } from 'react';
import { shopifyClient } from '../utils/shopifyClient';
import { ShopifyCart, ProcessedCartItem } from '../types/shopify';

const CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
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
                product {
                  id
                  title
                  handle
                  images(first: 1) {
                    edges {
                      node { url }
                    }
                  }
                }
                selectedOptions { name value }
              }
            }
            attributes { key value }
            cost { totalAmount { amount currencyCode } }
          }
        }
      }
      cost {
        totalAmount { amount currencyCode }
        subtotalAmount { amount currencyCode }
      }
    }
  }
`;

const CREATE_CART = `
  mutation CreateCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { id checkoutUrl }
    }
  }
`;

const ADD_TO_CART = `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { id }
    }
  }
`;

const UPDATE_CART = `
  mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id }
    }
  }
`;

const REMOVE_FROM_CART = `
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
    }
  }
`;

export const useShopifyCart = () => {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCartId = () => localStorage.getItem('shopify_cart_id');
  const setCartId = (id: string) => localStorage.setItem('shopify_cart_id', id);

  const fetchCart = useCallback(async () => {
    const cartId = getCartId();
    if (!cartId) return;

    try {
      const response = await shopifyClient.request(CART_QUERY, { cartId });
      setCart(response.cart);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  }, []);

  const addToCart = useCallback(async (variantId: string, quantity = 1, attributes: any[] = []) => {
    setLoading(true);
    setError(null);

    try {
      const cartId = getCartId();
      const lines = [{ merchandiseId: variantId, quantity, attributes }];

      if (cartId) {
        await shopifyClient.request(ADD_TO_CART, { cartId, lines });
      } else {
        const response = await shopifyClient.request(CREATE_CART, { lines });
        setCartId(response.cartCreate.cart.id);
      }

      await fetchCart();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  const updateCartLine = useCallback(async (lineId: string, quantity: number) => {
    const cartId = getCartId();
    if (!cartId) return;

    setLoading(true);
    try {
      await shopifyClient.request(UPDATE_CART, { cartId, lines: [{ id: lineId, quantity }] });
      await fetchCart();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  const removeFromCart = useCallback(async (lineId: string) => {
    const cartId = getCartId();
    if (!cartId) return;

    setLoading(true);
    try {
      await shopifyClient.request(REMOVE_FROM_CART, { cartId, lineIds: [lineId] });
      await fetchCart();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  const clearCart = useCallback(() => {
    localStorage.removeItem('shopify_cart_id');
    setCart(null);
  }, []);

  const getCheckoutUrl = useCallback(() => cart?.checkoutUrl || null, [cart]);
  const getTotalPrice = useCallback(() => parseFloat(cart?.cost?.totalAmount?.amount || '0'), [cart]);
  const getTotalQuantity = useCallback(() =>
    cart?.lines?.edges?.reduce((sum, { node }) => sum + node.quantity, 0) || 0
  , [cart]);

  const cartItems: ProcessedCartItem[] = cart?.lines?.edges?.map(({ node }) => ({
    id: node.id,
    quantity: node.quantity,
    productId: node.merchandise.product.id,
    variantId: node.merchandise.id,
    title: node.merchandise.title,
    variantTitle: node.merchandise.title,
    name: node.merchandise.product.title,
    productTitle: node.merchandise.product.title,
    productHandle: node.merchandise.product.handle,
    image: node.merchandise.product.images.edges[0]?.node.url || '',
    price: parseFloat(node.merchandise.price.amount),
    totalPrice: parseFloat(node.cost.totalAmount.amount),
    selectedOptions: node.merchandise.selectedOptions.reduce((acc, opt) => ({
      ...acc,
      [opt.name]: opt.value
    }), {}),
    attributes: node.attributes?.reduce((acc, attr) => ({
      ...acc,
      [attr.key]: attr.value
    }), {}) || {}
  })) || [];

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    cartItems,
    loading,
    error,
    addToCart,
    updateCartLine,
    removeFromCart,
    clearCart,
    getCheckoutUrl,
    getTotalPrice,
    getTotalQuantity,
    refetchCart: fetchCart
  };
};
