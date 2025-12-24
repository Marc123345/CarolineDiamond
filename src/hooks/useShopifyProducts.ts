// Custom hook for fetching products from Shopify
import { useState, useEffect, useCallback } from 'react';
import { shopifyClient } from '../utils/shopifyClient';
import { GET_PRODUCTS, GET_PRODUCT_BY_HANDLE } from '../utils/shopifyQueries';
import { ShopifyProductsResponse, ShopifyProductResponse, ProcessedProduct } from '../types/shopify';
import { transformShopifyProduct, getFallbackProducts, transformLocalProduct, transformConfigProductToProcessedProduct } from '../utils/shopifyHelpers';
import productsData from '../data/shopify_products_detailed.json';

export const useShopifyProducts = (
  query?: string,
  sortKey?: string,
  reverse?: boolean,
  first: number = 20
) => {
  const [products, setProducts] = useState<ProcessedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchProducts = useCallback(async (after?: string) => {
    try {
      setLoading(true);
      setError(null);
      setUsingFallback(false);

      // Check if Shopify client is available
      if (!shopifyClient) {
        if (import.meta.env.DEV) {
          console.log('No Shopify client available - using fallback data');
        }
        throw new Error('Shopify client not configured');
      }

      const variables: any = {
        first,
        query: query || undefined,
        sortKey: sortKey || 'RELEVANCE',
        reverse: reverse || false
      };

      if (after) {
        variables.after = after;
      }

      const response: ShopifyProductsResponse = await shopifyClient.request(GET_PRODUCTS, variables);

      const transformedProducts = response.products.edges.map(edge =>
        transformShopifyProduct(edge.node)
      );

      if (after) {
        // Append to existing products for pagination
        setProducts(prev => [...prev, ...transformedProducts]);
      } else {
        // Replace products for new search/filter
        setProducts(transformedProducts);
      }

      setHasNextPage(response.products.pageInfo.hasNextPage);
      setEndCursor(response.products.pageInfo.endCursor || null);
      
      // Clear any previous errors
      setError(null);
    } catch (err) {
      // Use fallback data when Shopify fails
      if (import.meta.env.DEV) {
        console.error('Shopify API Error:', err instanceof Error ? err.message : 'Unknown error');
      }
      setUsingFallback(true);
      
      let fallbackProducts = getFallbackProducts();
      
      // Apply filters to fallback data
      if (query) {
        const searchTerms = query.toLowerCase();
        fallbackProducts = fallbackProducts.filter(product => 
          product.name.toLowerCase().includes(searchTerms) ||
          product.description.toLowerCase().includes(searchTerms) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchTerms))
        );
      }
      
      // Apply sorting to fallback data
      if (sortKey === 'PRICE') {
        fallbackProducts.sort((a, b) => reverse ? b.price - a.price : a.price - b.price);
      } else if (sortKey === 'TITLE') {
        fallbackProducts.sort((a, b) => reverse ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
      } else if (sortKey === 'CREATED_AT') {
        // For fallback, we'll just reverse the array for "newest first"
        if (reverse) fallbackProducts.reverse();
      }
      
      // Limit results for pagination simulation
      const limitedProducts = fallbackProducts.slice(0, first);
      setProducts(limitedProducts);
      setHasNextPage(fallbackProducts.length > first);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [query, sortKey, reverse, first]);

  const loadMore = useCallback(() => {
    if (hasNextPage && endCursor && !loading) {
      fetchProducts(endCursor);
    }
  }, [hasNextPage, endCursor, loading, fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    usingFallback,
    hasNextPage,
    loadMore,
    refetch: () => fetchProducts()
  };
};

export const useShopifyProduct = (handle: string) => {
  const [product, setProduct] = useState<ProcessedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      // Validate handle before making request
      if (!handle) {
        if (import.meta.env.DEV) {
          console.warn('[useShopifyProduct] No handle provided');
        }
        setLoading(false);
        setError('No product handle provided');
        setProduct(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setUsingFallback(false);

        if (import.meta.env.DEV) {
          console.log('[useShopifyProduct] Fetching product with handle:', handle);
        }

        // Check if Shopify client is available
        if (!shopifyClient) {
          if (import.meta.env.DEV) {
            console.log('[useShopifyProduct] No Shopify client - trying fallback data');
          }
          throw new Error('Shopify client not configured');
        }

        const response: ShopifyProductResponse = await shopifyClient.request(
          GET_PRODUCT_BY_HANDLE,
          { handle }
        );

        if (response.product) {
          const transformed = transformShopifyProduct(response.product);
          if (import.meta.env.DEV) {
            console.log('[useShopifyProduct] Successfully fetched product:', transformed.name);
          }
          setProduct(transformed);
          setError(null);
        } else {
          if (import.meta.env.DEV) {
            console.warn('[useShopifyProduct] Product not found in Shopify:', handle);
          }
          throw new Error('Product not found in Shopify');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';

        if (import.meta.env.DEV) {
          console.error('[useShopifyProduct] Error fetching product:', errorMessage);
          console.error('[useShopifyProduct] Attempting fallback data lookup for handle:', handle);
        }

        // Try fallback data
        setUsingFallback(true);

        // Try to find product in fallback data
        const fallbackProducts = getFallbackProducts();
        const fallbackProduct = fallbackProducts.find(p => p.handle === handle || p.id === handle);

        if (fallbackProduct) {
          if (import.meta.env.DEV) {
            console.log('[useShopifyProduct] Found product in fallback data:', fallbackProduct.name);
          }
          setProduct(fallbackProduct);
          setError(null);
        } else {
          if (import.meta.env.DEV) {
            console.error('[useShopifyProduct] Product not found in fallback data either');
            console.error('[useShopifyProduct] Available handles:', fallbackProducts.map(p => p.handle).slice(0, 10));
          }
          setError('Product not found');
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  return { product, loading, error, usingFallback };
};