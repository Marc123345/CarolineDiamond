import { useState, useEffect, useCallback } from 'react';
import { 
  ProcessedProduct, 
  ShopifyProductsResponse, 
  ShopifyProductResponse 
} from '../types/shopify';
import { 
  transformShopifyProduct, 
  getFallbackProducts 
} from '../utils/shopifyHelpers';

const PRODUCT_FRAGMENT = `
  id
  handle
  title
  description
  vendor
  tags
  availableForSale
  productType
  images(first: 10) {
    edges {
      node {
        url
        altText
      }
    }
  }
  variants(first: 100) {
    edges {
      node {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        image {
          url
        }
      }
    }
  }
  options {
    id
    name
    values
  }
`;

/**
 * HOOK: useShopifyProducts
 * Fetches the entire collection for the shop grid
 */
export const useShopifyProducts = () => {
  const [products, setProducts] = useState<ProcessedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
          },
          body: JSON.stringify({
            query: `query getProducts { products(first: 250) { edges { node { ${PRODUCT_FRAGMENT} } } } }`,
          }),
        }
      );

      const json = await response.json();
      if (json.errors) throw new Error('GraphQL Error');

      const transformed = json.data.products.edges.map((edge: any) => transformShopifyProduct(edge.node));
      setProducts(transformed);
      setUsingFallback(false);
    } catch (err) {
      setProducts(getFallbackProducts());
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return { products, loading, error, usingFallback };
};

/**
 * EXPORTED: useShopifyProduct (Singular)
 * FIXES THE SYNTAX ERROR in ProductDetailPage.tsx
 * Fetches a single product by its handle.
 */
export const useShopifyProduct = (handle: string | undefined) => {
  const [product, setProduct] = useState<ProcessedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!handle) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
          },
          body: JSON.stringify({
            query: `query getProductByHandle($handle: String!) { product(handle: $handle) { ${PRODUCT_FRAGMENT} } }`,
            variables: { handle },
          }),
        }
      );

      const json = await response.json();
      
      if (json.data?.product) {
        setProduct(transformShopifyProduct(json.data.product));
      } else {
        throw new Error('Product not found');
      }
    } catch (err) {
      // Fallback: Search in local JSON if API fails
      const fallbackProducts = getFallbackProducts();
      const localMatch = fallbackProducts.find(p => p.handle === handle);
      setProduct(localMatch || null);
    } finally {
      setLoading(false);
    }
  }, [handle]);

  useEffect(() => { fetchProduct(); }, [fetchProduct]);

  return { product, loading, error };
};