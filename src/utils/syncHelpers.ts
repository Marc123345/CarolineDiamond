import { supabase } from '../lib/supabase';

export const triggerInventorySync = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('inventory-sync', {
      method: 'POST'
    });

    if (error) {
      console.error('Error triggering inventory sync:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Failed to trigger inventory sync:', err);
    return { success: false, error: err };
  }
};

export const checkSyncStatus = async () => {
  try {
    const { data, error } = await supabase
      .from('inventory_snapshots')
      .select('snapshot_at')
      .order('snapshot_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error checking sync status:', error);
      return { lastSync: null, error };
    }

    return { lastSync: data?.snapshot_at || null, error: null };
  } catch (err) {
    console.error('Failed to check sync status:', err);
    return { lastSync: null, error: err };
  }
};

export const getInventoryAlerts = async () => {
  try {
    const { data, error } = await supabase
      .from('inventory_alerts')
      .select('*')
      .eq('acknowledged', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inventory alerts:', error);
      return { alerts: [], error };
    }

    return { alerts: data || [], error: null };
  } catch (err) {
    console.error('Failed to fetch inventory alerts:', err);
    return { alerts: [], error: err };
  }
};

export const acknowledgeAlert = async (alertId: string) => {
  try {
    const { error } = await supabase
      .from('inventory_alerts')
      .update({
        acknowledged: true,
        acknowledged_at: new Date().toISOString()
      })
      .eq('id', alertId);

    if (error) {
      console.error('Error acknowledging alert:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Failed to acknowledge alert:', err);
    return { success: false, error: err };
  }
};
