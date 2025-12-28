import { useState, useEffect, useCallback } from 'react';
import { ProcessedProduct, ShopifyProductsResponse } from '../types/shopify';
import { 
  transformShopifyProduct, 
  getFallbackProducts 
} from '../utils/shopifyHelpers';

// The GraphQL query for the Storefront API
const PRODUCTS_QUERY = `
  query getProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
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
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const useShopifyProducts = () => {
  const [products, setProducts] = useState<ProcessedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Attempt API Fetch
      const response = await fetch(
        `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
          },
          body: JSON.stringify({
            query: PRODUCTS_QUERY,
            variables: { first: 250 },
          }),
        }
      );

      if (!response.ok) throw new Error('Network response was not ok');

      const json = await response.json();

      if (json.errors) {
        console.error('Shopify API Errors:', json.errors);
        throw new Error('GraphQL error');
      }

      const shopifyData: ShopifyProductsResponse = json.data;
      const transformedProducts = shopifyData.products.edges.map(edge => 
        transformShopifyProduct(edge.node)
      );

      setProducts(transformedProducts);
      setUsingFallback(false);
    } catch (err) {
      // 2. Fallback Logic: Triggered on API failure
      console.warn('Shopify fetch failed, using local fallback data.', err);
      const fallbackData = getFallbackProducts();
      
      setProducts(fallbackData);
      setUsingFallback(true);
      
      // We don't set a hard 'error' state here so the UI can still render
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { 
    products, 
    loading, 
    error, 
    usingFallback,
    refetch: fetchProducts 
  };
};