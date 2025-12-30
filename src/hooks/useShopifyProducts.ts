// Custom hook for fetching products from Shopify
import { useState, useEffect, useCallback } from 'react';
import { shopifyClient } from '../utils/shopifyClient';
import { GET_PRODUCTS, GET_PRODUCT_BY_HANDLE } from '../utils/shopifyQueries';
import { ShopifyProductsResponse, ShopifyProductResponse, ProcessedProduct } from '../types/shopify';
import { transformShopifyProduct, getFallbackProducts, transformLocalProduct, transformConfigProductToProcessedProduct } from '../utils/shopifyHelpers';
import { normalizeProduct } from '../utils/productNormalizer';
import productsData from '../data/products_for_react.json';

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

      const transformedProducts = response.products.edges
        .map(edge => transformShopifyProduct(edge.node))
        .map(product => normalizeProduct(product))
        .filter((p): p is ProcessedProduct => p !== null);

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

      let fallbackProducts = getFallbackProducts()
        .map(product => normalizeProduct(product))
        .filter((p): p is ProcessedProduct => p !== null);

      // Don't apply query filtering to fallback data
      // Filtering will be handled client-side in ShopPage using filterProducts()
      // This prevents trying to search for complex Shopify query strings like "(tag:"solitaire" OR ...)"

      // Apply sorting to fallback data
      if (sortKey === 'PRICE') {
        fallbackProducts.sort((a, b) => reverse ? b.price - a.price : a.price - b.price);
      } else if (sortKey === 'TITLE') {
        fallbackProducts.sort((a, b) => reverse ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
      } else if (sortKey === 'CREATED_AT') {
        // For fallback, we'll just reverse the array for "newest first"
        if (reverse) fallbackProducts.reverse();
      }

      // Return ALL products when using fallback - filtering happens client-side
      setProducts(fallbackProducts);
      setHasNextPage(false);
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
      if (!handle) return;

      try {
        setLoading(true);
        setError(null);
        setUsingFallback(false);

        // Check if Shopify client is available
        if (!shopifyClient) {
          if (import.meta.env.DEV) {
            console.log('No Shopify client available - using fallback data for product:', handle);
          }
          throw new Error('Shopify client not configured');
        }
        const response: ShopifyProductResponse = await shopifyClient.request(
          GET_PRODUCT_BY_HANDLE,
          { handle }
        );

        if (response.product) {
          const transformed = transformShopifyProduct(response.product);
          const normalized = normalizeProduct(transformed);
          setProduct(normalized);
        } else {
          throw new Error('Product not found in Shopify');
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Error fetching product:', err instanceof Error ? err.message : 'Unknown error');
        }

        // Try fallback data
        setUsingFallback(true);
        
        // Try to find product in fallback data
        const fallbackProducts = getFallbackProducts();
        const fallbackProduct = fallbackProducts.find(p => p.handle === handle || p.id === handle);

        if (fallbackProduct) {
          const normalized = normalizeProduct(fallbackProduct);
          setProduct(normalized);
          setError(null);
        } else {
          // Create a basic product if not found
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