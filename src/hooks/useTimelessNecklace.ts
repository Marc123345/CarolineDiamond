import { useState, useCallback } from 'react';
import type { NecklaceVariant } from '../config/necklaceVariantsConfig';

interface UseTimelessNecklaceReturn {
  isTimelessNecklace: (handle: string) => boolean;
  handleVariantAddToCart: (variant: NecklaceVariant) => void;
  handlePriceRequest: (variant: NecklaceVariant) => void;
  showPriceRequestModal: boolean;
  setShowPriceRequestModal: (show: boolean) => void;
  requestedVariant: NecklaceVariant | null;
}

export function useTimelessNecklace(): UseTimelessNecklaceReturn {
  const [showPriceRequestModal, setShowPriceRequestModal] = useState(false);
  const [requestedVariant, setRequestedVariant] = useState<NecklaceVariant | null>(null);

  const isTimelessNecklace = useCallback((handle: string) => {
    return handle.includes('timeless-diamond-necklace');
  }, []);

  const handleVariantAddToCart = useCallback((variant: NecklaceVariant) => {
    console.log('Adding variant to cart:', variant);

    // TODO: Integrate with existing cart system
    // For now, just log the action
    alert(`Adding to cart:\n${variant.metalColor} - ${variant.diamondType} - ${variant.caratWeight}\nPrice: €${variant.price}`);
  }, []);

  const handlePriceRequest = useCallback((variant: NecklaceVariant) => {
    setRequestedVariant(variant);
    setShowPriceRequestModal(true);
  }, []);

  return {
    isTimelessNecklace,
    handleVariantAddToCart,
    handlePriceRequest,
    showPriceRequestModal,
    setShowPriceRequestModal,
    requestedVariant
  };
}
