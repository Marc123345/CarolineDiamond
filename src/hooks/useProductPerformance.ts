import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useProductPerformance = () => {
  const trackProductView = async (productId: string, variantId?: string) => {
    try {
      const { error } = await supabase.rpc('track_product_view', {
        p_product_id: productId,
        p_variant_id: variantId || null
      });

      if (error) {
        console.error('Error tracking product view:', error);
      }
    } catch (err) {
      console.error('Failed to track product view:', err);
    }
  };

  const trackCartAdd = async (productId: string, variantId?: string) => {
    try {
      const { error } = await supabase.rpc('track_cart_add', {
        p_product_id: productId,
        p_variant_id: variantId || null
      });

      if (error) {
        console.error('Error tracking cart add:', error);
      }
    } catch (err) {
      console.error('Failed to track cart add:', err);
    }
  };

  const trackPurchase = async (productId: string, variantId: string | undefined, amount: number) => {
    try {
      const { error } = await supabase.rpc('track_purchase', {
        p_product_id: productId,
        p_variant_id: variantId || null,
        p_amount: amount
      });

      if (error) {
        console.error('Error tracking purchase:', error);
      }
    } catch (err) {
      console.error('Failed to track purchase:', err);
    }
  };

  return {
    trackProductView,
    trackCartAdd,
    trackPurchase
  };
};
