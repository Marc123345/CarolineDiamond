import { supabase } from './supabase';

export const trackProductView = async (productId: string, variantId: string): Promise<void> => {
  try {
    if (!supabase) {
      console.log('Supabase not configured - skipping view tracking');
      return;
    }

    const { error } = await supabase.rpc('increment_product_views', {
      p_product_id: productId,
      p_variant_id: variantId
    });

    if (error) {
      console.error('Error tracking product view:', error);
    }
  } catch (error) {
    console.error('Error tracking product view:', error);
  }
};

export const trackProductCartAdd = async (productId: string, variantId: string): Promise<void> => {
  try {
    if (!supabase) {
      console.log('Supabase not configured - skipping cart add tracking');
      return;
    }

    const { error } = await supabase.rpc('increment_product_cart_adds', {
      p_product_id: productId,
      p_variant_id: variantId
    });

    if (error) {
      console.error('Error tracking cart add:', error);
    }
  } catch (error) {
    console.error('Error tracking cart add:', error);
  }
};

export const trackProductPurchase = async (
  productId: string,
  variantId: string,
  revenue: number
): Promise<void> => {
  try {
    if (!supabase) {
      console.log('Supabase not configured - skipping purchase tracking');
      return;
    }

    const { error } = await supabase.rpc('increment_product_purchases', {
      p_product_id: productId,
      p_variant_id: variantId,
      p_revenue: revenue
    });

    if (error) {
      console.error('Error tracking purchase:', error);
    }
  } catch (error) {
    console.error('Error tracking purchase:', error);
  }
};

export interface ProductPerformanceMetrics {
  product_id: string;
  variant_id: string;
  views: number;
  cart_adds: number;
  purchases: number;
  revenue: number;
  conversion_rate: number;
  last_viewed_at: string | null;
  last_purchased_at: string | null;
}

export const getProductPerformance = async (
  productId: string
): Promise<{ data: ProductPerformanceMetrics[] | null; error: any }> => {
  try {
    if (!supabase) {
      return { data: null, error: 'Supabase not configured' };
    }

    const { data, error } = await supabase
      .from('product_performance')
      .select('*')
      .eq('product_id', productId)
      .order('views', { ascending: false });

    if (error) {
      console.error('Error fetching product performance:', error);
      return { data: null, error };
    }

    const metricsWithConversion = data?.map((metric: any) => ({
      ...metric,
      conversion_rate: metric.views > 0 ? (metric.purchases / metric.views) * 100 : 0
    }));

    return { data: metricsWithConversion, error: null };
  } catch (error) {
    console.error('Error fetching product performance:', error);
    return { data: null, error };
  }
};

export const getTopPerformingProducts = async (
  limit: number = 10
): Promise<{ data: ProductPerformanceMetrics[] | null; error: any }> => {
  try {
    if (!supabase) {
      return { data: null, error: 'Supabase not configured' };
    }

    const { data, error } = await supabase
      .from('product_performance')
      .select('*')
      .order('revenue', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top products:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching top products:', error);
    return { data: null, error };
  }
};
