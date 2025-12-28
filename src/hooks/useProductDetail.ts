import { useState, useEffect, useMemo, useCallback } from 'react';
import { useShopifyProduct } from './useShopifyProducts';
import { ensureRingSizeOption, findVariantByOptions } from '../utils/shopifyHelpers';
import { normalizeProduct, normalizeVariant, validateCartItem } from '../utils/productNormalizer';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import type { ProductVariant } from '../types/shopify';

export interface UseProductDetailResult {
  product: ReturnType<typeof normalizeProduct>;
  selectedVariant: ReturnType<typeof normalizeVariant>;
  selectedOptions: Record<string, string>;
  quantity: number;
  loading: boolean;
  error: string | null;
  usingFallback: boolean;
  isInWishlist: boolean;
  isAddingToCart: boolean;
  selectOptions: (options: Record<string, string>) => void;
  setQuantity: (quantity: number) => void;
  addToCart: () => Promise<void>;
  toggleWishlist: () => void;
}

export function useProductDetail(handle: string): UseProductDetailResult {
  const { product: rawProduct, loading, error, usingFallback } = useShopifyProduct(handle);
  const { addToCart: addToCartContext, loading: cartLoading } = useCart();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const toast = useToast();

  const product = useMemo(
    () => normalizeProduct(rawProduct ? ensureRingSizeOption(rawProduct) : null),
    [rawProduct]
  );

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const isInWishlist = useMemo(
    () => wishlistState.items.some(item => item.id === product?.id || item.id === handle),
    [wishlistState.items, product?.id, handle]
  );

  useEffect(() => {
    if (!product?.variants?.length) return;

    const initialVariant = product.variants.find(v => v.availableForSale) || product.variants[0];
    setSelectedVariant(initialVariant);
    setSelectedOptions(initialVariant.selectedOptions || {});
  }, [product]);

  useEffect(() => {
    if (!product || !Object.keys(selectedOptions).length) return;

    const variant = findVariantByOptions(product, selectedOptions);
    if (variant && variant.id !== selectedVariant?.id) {
      setSelectedVariant(variant);
    }
  }, [selectedOptions, product, selectedVariant?.id]);

  const selectOptions = useCallback((options: Record<string, string>) => {
    setSelectedOptions(options);
  }, []);

  const addToCart = useCallback(async () => {
    if (isAddingToCart || cartLoading) return;

    const variantToUse = product?.variants?.length ? selectedVariant : null;
    const validation = validateCartItem(product, variantToUse, quantity);

    if (!validation.valid) {
      toast.error(validation.error || 'Cannot add to cart');
      return;
    }

    try {
      setIsAddingToCart(true);

      const variantId = variantToUse?.id || product!.variants[0]?.id;

      if (!variantId) {
        throw new Error('No variant ID available');
      }

      await addToCartContext(variantId, quantity);

      toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add to cart';
      toast.error(errorMessage);

      if (import.meta.env.DEV) {
        console.error('Add to cart error:', err);
      }
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, selectedVariant, quantity, isAddingToCart, cartLoading, addToCartContext, toast]);

  const toggleWishlist = useCallback(() => {
    if (!product) return;

    if (isInWishlist) {
      wishlistDispatch({ type: 'REMOVE_ITEM', payload: product });
      toast.success('Removed from wishlist');
    } else {
      wishlistDispatch({ type: 'ADD_ITEM', payload: product });
      toast.success('Added to wishlist');
    }
  }, [product, isInWishlist, wishlistDispatch, toast]);

  return {
    product,
    selectedVariant: normalizeVariant(selectedVariant),
    selectedOptions,
    quantity,
    loading,
    error,
    usingFallback,
    isInWishlist,
    isAddingToCart,
    selectOptions,
    setQuantity,
    addToCart,
    toggleWishlist,
  };
}
