import { useState, useEffect, useCallback, useRef } from 'react';
import { shopifyClient } from '../utils/shopifyClient';
import { GET_PRODUCTS, GET_PRODUCT_BY_HANDLE } from '../utils/shopifyQueries';
import { ShopifyProductsResponse, ShopifyProductResponse, ProcessedProduct } from '../types/shopify';
import { transformShopifyProduct, getFallbackProducts } from '../utils/shopifyHelpers';

export const useShopifyProducts = (
  query?: string,
  sortKey: string = 'RELEVANCE',
  reverse: boolean = false,
  first: number = 20
) => {
  const [products, setProducts] = useState<ProcessedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Use a ref to track the current request to avoid race conditions
  const requestCount = useRef(0);

  const fetchProducts = useCallback(async (after?: string) => {
    const currentRequest = ++requestCount.current;
    
    try {
      setLoading(true);
      setError(null);

      // 1. Attempt Shopify API Request
      if (!shopifyClient) {
        throw new Error('Shopify client not configured');
      }

      const variables: any = {
        first,
        query: query || undefined, // Empty query returns all products
        sortKey: sortKey,
        reverse: reverse
      };

      if (after) {
        variables.after = after;
      }

      const response: ShopifyProductsResponse = await shopifyClient.request(GET_PRODUCTS, variables);

      // Ensure we only update state if this is still the most recent request
      if (currentRequest !== requestCount.current) return;

      const transformedProducts = response.products.edges.map(edge =>
        transformShopifyProduct(edge.node)
      );

      if (after) {
        setProducts(prev => [...prev, ...transformedProducts]);
      } else {
        setProducts(transformedProducts);
      }

      setHasNextPage(response.products.pageInfo.hasNextPage);
      setEndCursor(response.products.pageInfo.endCursor || null);
      setUsingFallback(false);
      
    } catch (err) {
      if (currentRequest !== requestCount.current) return;

      // 2. Fallback Logic (When API fails or client is missing)
      if (import.meta.env.DEV) {
        console.warn('Shopify Hook: Using fallback data pool.', err instanceof Error ? err.message : '');
      }
      
      setUsingFallback(true);
      
      // We fetch ALL local products. 
      // The ShopPage's useMemo filter will handle the query parsing and narrowing.
      let fallbackPool = getFallbackProducts();
      
      // Basic simulation of Shopify's 'RELEVANCE' or 'TITLE' sorting for fallback
      if (sortKey === 'TITLE') {
        fallbackPool.sort((a, b) => reverse ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
      } else if (sortKey === 'PRICE') {
        fallbackPool.sort((a, b) => reverse ? b.price - a.price : a.price - b.price);
      }

      // If there's a simple search term (not a complex query), we do a quick title filter
      if (query && !query.includes('tag:') && !query.includes('variants.')) {
        const term = query.toLowerCase();
        fallbackPool = fallbackPool.filter(p => 
          p.name.toLowerCase().includes(term) || p.tags.some(t => t.toLowerCase().includes(term))
        );
      }

      setProducts(fallbackPool.slice(0, after ? 100 : first * 2)); // Return a generous slice
      setHasNextPage(false); 
      setError(null);
    } finally {
      if (currentRequest === requestCount.current) {
        setLoading(false);
      }
    }
  }, [query, sortKey, reverse, first]);

  const loadMore = useCallback(() => {
    if (hasNextPage && endCursor && !loading && !usingFallback) {
      fetchProducts(endCursor);
    }
  }, [hasNextPage, endCursor, loading, usingFallback, fetchProducts]);

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
    refetch: fetchProducts
  };
};

export const useShopifyProduct = (handle: string) => {
  const [product, setProduct] = useState<ProcessedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;

      try {
        setLoading(true);
        setError(null);

        if (!shopifyClient) throw new Error('Client missing');

        const response: ShopifyProductResponse = await shopifyClient.request(
          GET_PRODUCT_BY_HANDLE,
          { handle }
        );

        if (response.product) {
          setProduct(transformShopifyProduct(response.product));
          setUsingFallback(false);
        } else {
          throw new Error('Not found');
        }
      } catch (err) {
        setUsingFallback(true);
        const fallbackProducts = getFallbackProducts();
        const found = fallbackProducts.find(p => p.handle === handle);
        
        if (found) {
          setProduct(found);
          setError(null);
        } else {
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