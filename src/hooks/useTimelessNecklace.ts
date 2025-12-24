// src/hooks/useTimelessNecklace.ts
import { useState, useCallback } from 'react';
import { useCart } from '../context/CartContext'; // Added to handle actual cart logic
import type { ProductVariant } from '../config/productVariantsConfig';

interface UseTimelessNecklaceReturn {
  handleVariantAddToCart: (variant: ProductVariant, productTitle: string) => void;
  handlePriceRequest: (variant: ProductVariant) => void;
  showPriceRequestModal: boolean;
  setShowPriceRequestModal: (show: boolean) => void;
  requestedVariant: ProductVariant | null;
}

/**
 * Hook to manage selection and cart/price request actions 
 * for the unified product collection.
 */
export function useTimelessNecklace(): UseTimelessNecklaceReturn {
  const { dispatch } = useCart();
  const [showPriceRequestModal, setShowPriceRequestModal] = useState(false);
  const [requestedVariant, setRequestedVariant] = useState<ProductVariant | null>(null);

  /**
   * Dispatches the ADD_ITEM action to the global cart context.
   */
  const handleVariantAddToCart = useCallback((variant: ProductVariant, productTitle: string) => {
    if (!variant.price) return;

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: variant.shopifyHandle,
        title: productTitle,
        price: variant.price,
        image: '', // Will be populated by the page component
        quantity: 1,
        variant: {
          metal: variant.metalColor,
          diamond: variant.diamondType,
          carat: variant.caratWeight
        }
      }
    });
  }, [dispatch]);

  /**
   * Opens the Price Request Modal for "Natural" or high-value diamonds.
   */
  const handlePriceRequest = useCallback((variant: ProductVariant) => {
    setRequestedVariant(variant);
    setShowPriceRequestModal(true);
  }, []);

  return {
    handleVariantAddToCart,
    handlePriceRequest,
    showPriceRequestModal,
    setShowPriceRequestModal,
    requestedVariant
  };
}