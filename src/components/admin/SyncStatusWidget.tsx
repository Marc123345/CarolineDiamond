import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { checkSyncStatus, getInventoryAlerts, triggerInventorySync } from '../../utils/syncHelpers';

export const SyncStatusWidget: React.FC = () => {
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    const { lastSync: syncTime } = await checkSyncStatus();
    const { alerts: alertsList } = await getInventoryAlerts();
    setLastSync(syncTime);
    setAlerts(alertsList);
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleManualSync = async () => {
    setSyncing(true);
    await triggerInventorySync();
    setTimeout(() => {
      fetchStatus();
      setSyncing(false);
    }, 2000);
  };

  const getSyncStatus = () => {
    if (!lastSync) return { color: 'text-gray-500', icon: Clock, text: 'Never synced' };

    const syncDate = new Date(lastSync);
    const now = new Date();
    const minutesAgo = Math.floor((now.getTime() - syncDate.getTime()) / 60000);

    if (minutesAgo < 35) {
      return { color: 'text-green-600', icon: CheckCircle, text: `${minutesAgo}m ago` };
    } else if (minutesAgo < 60) {
      return { color: 'text-yellow-600', icon: AlertCircle, text: `${minutesAgo}m ago` };
    } else {
      return { color: 'text-red-600', icon: AlertCircle, text: 'Over 1h ago' };
    }
  };

  const status = getSyncStatus();
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Sync Status</h3>
        <button
          onClick={handleManualSync}
          disabled={syncing || loading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Last Inventory Sync</span>
          <div className={`flex items-center gap-2 ${status.color}`}>
            <StatusIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{status.text}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Active Alerts</span>
          <div className="flex items-center gap-2">
            {alerts.length > 0 ? (
              <>
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">{alerts.length}</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">None</span>
              </>
            )}
          </div>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Alerts</h4>
          <div className="space-y-2">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="text-xs text-gray-600">
                <span className={`font-medium ${
                  alert.alert_type === 'out_of_stock' ? 'text-red-600' : 'text-orange-600'
                }`}>
                  {alert.alert_type === 'out_of_stock' ? 'Out of Stock' : 'Low Stock'}
                </span>
                {' - '}
                Product: {alert.product_id?.slice(-8)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
