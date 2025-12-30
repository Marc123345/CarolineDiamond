import { supabase } from '../lib/supabase';

export interface InventoryStatus {
  available: boolean;
  quantity: number | null;
  lowStock: boolean;
  message: string;
  quantityKnown: boolean;
}

export const getInventoryStatus = (quantityAvailable?: number): InventoryStatus => {
  if (quantityAvailable === undefined || quantityAvailable === null) {
    return {
      available: true,
      quantity: null,
      lowStock: false,
      message: 'Contact us for availability',
      quantityKnown: false
    };
  }

  const quantity = quantityAvailable;

  if (quantity === 0) {
    return {
      available: false,
      quantity: 0,
      lowStock: false,
      message: 'Out of stock',
      quantityKnown: true
    };
  }

  if (quantity <= 3) {
    return {
      available: true,
      quantity,
      lowStock: true,
      message: `Only ${quantity} left in stock`,
      quantityKnown: true
    };
  }

  return {
    available: true,
    quantity,
    lowStock: false,
    message: 'In stock',
    quantityKnown: true
  };
};

export const getStockAlert = (quantityAvailable?: number): string | null => {
  const status = getInventoryStatus(quantityAvailable);

  if (!status.available) {
    return 'Out of stock';
  }

  if (status.lowStock) {
    return status.message;
  }

  return null;
};

export const trackCartAdd = async (
  productId: string,
  variantId: string,
  quantity: number
): Promise<void> => {
  try {
    if (!supabase) {
      // Supabase is optional for dev, log only
      if (import.meta.env.DEV) console.log('Supabase not configured - skipping cart tracking');
      return;
    }

    const { error } = await supabase
      .from('cart_events')
      .insert({
        product_id: productId,
        variant_id: variantId,
        quantity,
        event_type: 'add_to_cart',
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error tracking cart add:', error);
    }
  } catch (error) {
    console.error('Error tracking cart add:', error);
  }
};

interface BackInStockRequest {
  email: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  variant_title?: string;
  user_id?: string;
}

export const requestBackInStockNotification = async (
  request: BackInStockRequest
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Database not configured'
      };
    }

    if (!request.email || !request.email.includes('@')) {
      return {
        success: false,
        error: 'Please provide a valid email address'
      };
    }

    const { data, error} = await supabase
      .from('back_in_stock_notifications')
      .insert({
        email: request.email,
        product_id: request.product_id,
        variant_id: request.variant_id,
        product_name: request.product_name,
        variant_title: request.variant_title || null,
        user_id: request.user_id || null,
        notified: false
      })
      .select()
      .single();

    if (error) {
      // Unique constraint violation (already subscribed)
      if (error.code === '23505') {
        return {
          success: false,
          error: 'You are already subscribed to notifications for this product'
        };
      }
      console.error('Error requesting back in stock notification:', error);
      return {
        success: false,
        error: 'Failed to subscribe. Please try again later.'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error requesting back in stock notification:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
};