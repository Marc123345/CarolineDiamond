import { useState, useEffect, useCallback } from 'react';
import { shopifyClient, GET_PRODUCTS, GET_PRODUCT_BY_HANDLE } from '../lib/shopify';
import { ProcessedProduct, ProductVariant, ProductOption, ProductMetafields } from '../types';
// We don't need external helpers anymore because we are defining the "Cleaning" transformer right here
import { getFallbackProducts } from '../utils/shopifyHelpers'; 

// ==========================================
// 1. DATA CLEANING & TRANSFORMATION LOGIC
// ==========================================
// This ensures that "0.50c" becomes "0.50ct" and "Rose Gold" becomes "18K Rose Gold"
// immediately when data arrives from the API.

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

const cleanAndTransformProduct = (node: any): ProcessedProduct => {
  const variants: ProductVariant[] = node.variants.edges.map(({ node: v }: any) => ({
    id: v.id,
    title: v.title,
    price: parseFloat(v.price.amount),
    compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : undefined,
    availableForSale: v.availableForSale,
    quantityAvailable: v.quantityAvailable,
    image: v.image?.url,
    // FIX: Clean options here
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
// 2. HOOK: USE SHOPIFY PRODUCTS
// ==========================================

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

      if (!shopifyClient) {
        if (import.meta.env.DEV) console.log('No Shopify client available - using fallback data');
        throw new Error('Shopify client not configured');
      }

      const variables: any = {
        first,
        query: query || undefined,
        sortKey: sortKey || 'RELEVANCE',
        reverse: reverse || false
      };

      if (after) variables.after = after;

      const response: any = await shopifyClient.request(GET_PRODUCTS, variables);

      // Use our local Cleaning Transformer
      const transformedProducts = response.products.edges.map((edge: any) =>
        cleanAndTransformProduct(edge.node)
      );

      if (after) {
        setProducts(prev => [...prev, ...transformedProducts]);
      } else {
        setProducts(transformedProducts);
      }

      setHasNextPage(response.products.pageInfo.hasNextPage);
      setEndCursor(response.products.pageInfo.endCursor || null);
      
    } catch (err) {
      // Fallback Logic
      if (import.meta.env.DEV) {
        console.error('Shopify API Error:', err instanceof Error ? err.message : 'Unknown error');
      }
      setUsingFallback(true);
      
      let fallbackProducts = getFallbackProducts();
      
      if (query) {
        const searchTerms = query.toLowerCase();
        fallbackProducts = fallbackProducts.filter(product => 
          product.name.toLowerCase().includes(searchTerms) ||
          product.description.toLowerCase().includes(searchTerms) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchTerms))
        );
      }
      
      if (sortKey === 'PRICE') {
        fallbackProducts.sort((a, b) => reverse ? b.price - a.price : a.price - b.price);
      } else if (sortKey === 'TITLE') {
        fallbackProducts.sort((a, b) => reverse ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
      } else if (sortKey === 'CREATED_AT' && reverse) {
        fallbackProducts.reverse();
      }
      
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

// ==========================================
// 3. HOOK: USE SHOPIFY PRODUCT (SINGLE)
// ==========================================

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

        if (!shopifyClient) {
          if (import.meta.env.DEV) console.log('No Shopify client - using fallback for:', handle);
          throw new Error('Shopify client not configured');
        }

        const response: any = await shopifyClient.request(
          GET_PRODUCT_BY_HANDLE,
          { handle }
        );

        if (response.product) {
          // Use our local Cleaning Transformer
          const transformed = cleanAndTransformProduct(response.product);
          setProduct(transformed);
        } else {
          throw new Error('Product not found in Shopify');
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Error fetching product:', err instanceof Error ? err.message : 'Unknown error');
        }
        setUsingFallback(true);
        
        const fallbackProducts = getFallbackProducts();
        const fallbackProduct = fallbackProducts.find(p => p.handle === handle || p.id === handle);
        
        if (fallbackProduct) {
          setProduct(fallbackProduct);
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