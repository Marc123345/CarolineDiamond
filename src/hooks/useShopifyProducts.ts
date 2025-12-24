import { useState, useEffect, useCallback } from 'react';
import { shopifyClient } from '../utils/shopifyClient';
import { GET_PRODUCTS, GET_PRODUCT_BY_HANDLE } from '../utils/shopifyQueries';
import { ShopifyProductsResponse, ShopifyProductResponse, ProcessedProduct } from '../types/shopify';
import { transformShopifyProduct } from '../utils/shopifyHelpers';
import productsData from '../data/shopify_products_detailed.json';

export const useShopifyProducts = (
  query?: string,
  sortKey: string = 'RELEVANCE',
  reverse: boolean = false,
  first: number = 50
) => {
  const [products, setProducts] = useState<ProcessedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);

  const fetchProducts = useCallback(async (loadMore: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const variables: any = { first, sortKey, reverse };
      if (query) variables.query = query;
      if (loadMore && endCursor) variables.after = endCursor;

      const response: ShopifyProductsResponse = await shopifyClient.request(GET_PRODUCTS, variables);

      const transformed = response.products.edges.map(({ node }) => transformShopifyProduct(node));

      setProducts(prev => loadMore ? [...prev, ...transformed] : transformed);
      setHasNextPage(response.products.pageInfo.hasNextPage);
      setEndCursor(response.products.pageInfo.endCursor || null);
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
      setError(err.message);

      const fallback = (productsData as any[]).map((p: any) => ({
        ...p,
        id: p.id || `product-${Math.random()}`,
        handle: p.handle || p.title?.toLowerCase().replace(/\s+/g, '-'),
        images: p.images || [],
        variants: p.variants || [],
        options: p.options || [],
        tags: p.tags || []
      }));

      setProducts(fallback);
    } finally {
      setLoading(false);
    }
  }, [query, sortKey, reverse, first, endCursor]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !loading) {
      fetchProducts(true);
    }
  }, [hasNextPage, loading, fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [query, sortKey, reverse]);

  return {
    products,
    loading,
    error,
    hasNextPage,
    loadMore,
    refetch: () => fetchProducts(false)
  };
};

export const useShopifyProduct = (handle: string) => {
  const [product, setProduct] = useState<ProcessedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;

      setLoading(true);
      setError(null);

      try {
        const response: ShopifyProductResponse = await shopifyClient.request(GET_PRODUCT_BY_HANDLE, { handle });

        if (response.productByHandle) {
          setProduct(transformShopifyProduct(response.productByHandle));
        } else {
          const fallback = (productsData as any[]).find((p: any) => p.handle === handle);
          if (fallback) {
            setProduct({
              ...fallback,
              id: fallback.id || `product-${handle}`,
              images: fallback.images || [],
              variants: fallback.variants || [],
              options: fallback.options || [],
              tags: fallback.tags || []
            });
          } else {
            setError('Product not found');
          }
        }
      } catch (err: any) {
        console.error('Failed to fetch product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  return { product, loading, error };
};
