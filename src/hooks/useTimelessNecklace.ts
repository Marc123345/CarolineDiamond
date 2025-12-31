import { useState, useCallback } from 'react';
import type { NecklaceVariant } from '../config/necklaceVariantsConfig'; // Adjusted path
// import { useCart } from '../context/CartContext'; // Uncomment when connecting real cart

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
  
  // const { addToCart } = useCart(); // Access global cart

  const isTimelessNecklace = useCallback((handle: string) => {
    return handle.includes('timeless-diamond-necklace');
  }, []);

  const handleVariantAddToCart = useCallback((variant: NecklaceVariant) => {
    console.log('Adding variant to cart:', variant);

    if (variant.available) {
        // TODO: Replace this alert with actual cart integration
        // const attributes = [{ key: 'Metal', value: variant.metalColor }, { key: 'Diamond', value: variant.diamondType }];
        // addToCart(variant.shopifyHandle, 1, attributes);
        
        alert(`Adding to cart:\n${variant.metalColor} - ${variant.diamondType} - ${variant.caratWeight}\nPrice: €${variant.price}`);
    } else {
        alert('This variant is currently unavailable.');
    }
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