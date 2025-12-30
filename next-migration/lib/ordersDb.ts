import { supabase } from './supabase';

export interface Order {
  id: string;
  user_id: string | null;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: any[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shipping_info: any;
  payment_info: any;
  notes: string | null;
  created_at: string;
  updated_at: string;
  shopify_order_id?: string | null;
  shopify_checkout_id?: string | null;
  fulfillment_status?: string;
  financial_status?: string;
  currency?: string;
  customer_email?: string;
  tracking_info?: any;
}

export const getUserOrders = async (
  userId: string
): Promise<{ data: Order[] | null; error: any }> => {
  try {
    if (!supabase) {
      return { data: null, error: 'Supabase not configured' };
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { data: null, error };
  }
};

export const getOrderByNumber = async (
  orderNumber: string,
  userId: string
): Promise<{ data: Order | null; error: any }> => {
  try {
    if (!supabase) {
      return { data: null, error: 'Supabase not configured' };
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching order:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { data: null, error };
  }
};

export interface CreateOrderData {
  user_id?: string | null;
  order_number: string;
  status: string;
  items: any[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shipping_info?: any;
  payment_info?: any;
  notes?: string;
  shopify_order_id?: string;
  shopify_checkout_id?: string;
  fulfillment_status?: string;
  financial_status?: string;
  currency?: string;
  customer_email?: string;
  tracking_info?: any;
}

export const createOrder = async (
  orderData: CreateOrderData
): Promise<{ data: Order | null; error: any }> => {
  try {
    if (!supabase) {
      return { data: null, error: 'Supabase not configured' };
    }

    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creating order:', error);
    return { data: null, error };
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: string
): Promise<{ data: Order | null; error: any }> => {
  try {
    if (!supabase) {
      return { data: null, error: 'Supabase not configured' };
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { data: null, error };
  }
};

export const getOrderByEmailAndNumber = async (
  email: string,
  orderNumber: string
): Promise<{ data: Order | null; error: any }> => {
  try {
    if (!supabase) {
      return { data: null, error: 'Supabase not configured' };
    }

    const { data, error } = await supabase
      .rpc('get_order_by_email_and_number', {
        p_email: email,
        p_order_number: orderNumber
      })
      .maybeSingle();

    if (error) {
      console.error('Error fetching order by email:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching order by email:', error);
    return { data: null, error };
  }
};

export const createCheckoutOrder = async (
  checkoutId: string,
  cartItems: any[],
  totalPrice: number,
  customerEmail?: string
): Promise<{ data: any | null; error: any }> => {
  try {
    if (!supabase) {
      return { data: null, error: 'Supabase not configured' };
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return { data: null, error: 'Not authenticated' };
    }

    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/checkout-complete`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkoutId,
        cartItems,
        totalPrice,
        customerEmail
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { data: null, error: errorData.error || 'Failed to create order' };
    }

    const result = await response.json();
    return { data: result.order, error: null };
  } catch (error) {
    console.error('Error creating checkout order:', error);
    return { data: null, error };
  }
};
