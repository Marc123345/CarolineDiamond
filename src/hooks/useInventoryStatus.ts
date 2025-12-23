import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface InventoryStatus {
  quantityAvailable: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  lastUpdated: string | null;
}

export const useInventoryStatus = (productId: string, variantId?: string) => {
  const [inventory, setInventory] = useState<InventoryStatus>({
    quantityAvailable: 0,
    isLowStock: false,
    isOutOfStock: false,
    lastUpdated: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchInventory = async () => {
      try {
        setLoading(true);

        let query = supabase
          .from('inventory_snapshots')
          .select('quantity_available, snapshot_at')
          .eq('product_id', productId)
          .order('snapshot_at', { ascending: false })
          .limit(1);

        if (variantId) {
          query = query.eq('variant_id', variantId);
        }

        const { data, error } = await query.maybeSingle();

        if (error) {
          console.error('Error fetching inventory:', error);
          return;
        }

        if (data) {
          const quantity = data.quantity_available || 0;
          setInventory({
            quantityAvailable: quantity,
            isLowStock: quantity > 0 && quantity <= 5,
            isOutOfStock: quantity === 0,
            lastUpdated: data.snapshot_at
          });
        }
      } catch (err) {
        console.error('Failed to fetch inventory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();

    const channel = supabase
      .channel(`inventory:${productId}${variantId ? `:${variantId}` : ''}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'inventory_snapshots',
          filter: variantId
            ? `product_id=eq.${productId} AND variant_id=eq.${variantId}`
            : `product_id=eq.${productId}`
        },
        (payload) => {
          const newData = payload.new as any;
          const quantity = newData.quantity_available || 0;
          setInventory({
            quantityAvailable: quantity,
            isLowStock: quantity > 0 && quantity <= 5,
            isOutOfStock: quantity === 0,
            lastUpdated: newData.snapshot_at
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productId, variantId]);

  return { ...inventory, loading };
};
