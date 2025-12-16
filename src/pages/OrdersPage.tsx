import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, Loader, ChevronRight, Calendar, CreditCard, Truck, CheckCircle, RefreshCw, ExternalLink, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getUserOrders, Order } from '../lib/ordersDb';
import { formatPrice } from '../utils/priceHelpers';

interface OrdersPageProps {
  onNavigate: (page: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'shipped':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getFinancialStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'refunded':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getFulfillmentStatusColor = (status: string) => {
  switch (status) {
    case 'fulfilled':
      return 'bg-green-100 text-green-800';
    case 'partial':
      return 'bg-blue-100 text-blue-800';
    case 'unfulfilled':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async (isRefresh = false) => {
    if (!user?.id) return;

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const { data, error: fetchError } = await getUserOrders(user.id);

    if (fetchError) {
      setError('Failed to load orders');
      console.error('Orders fetch error:', fetchError);
    } else if (data) {
      setOrders(data);
      setError('');
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadOrders();
  }, [user?.id]);

  const handleRefresh = () => {
    loadOrders(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-Color-Netural-White py-20 sm:py-32 lg:py-40">
        <div className="max-w-5xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="flex items-center justify-center py-20">
            <Loader className="h-8 w-8 animate-spin text-Color-Light-300" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-Color-Netural-White py-20 sm:py-32 lg:py-40">
      <div className="max-w-5xl mx-auto px-8 sm:px-12 lg:px-16">
        <div className="mb-12">
          <Breadcrumbs
            items={[
              { label: 'My Orders', icon: ShoppingBag }
            ]}
            onNavigate={onNavigate}
          />
        </div>

        <div className="bg-white border border-Color-Rich-Gray/10 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-h2 text-Color-Dark-500">My Orders</h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-Color-Light-300 text-white rounded-lg hover:bg-Color-Light-300/90 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Orders'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-Color-Rich-Gray/40 mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-Color-Dark-500 mb-2">No Orders Yet</h3>
              <p className="text-Color-Rich-Gray mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <button
                onClick={() => onNavigate('/shop')}
                className="px-8 py-3 bg-Color-Light-300 text-white font-medium hover:bg-Color-Light-Dark transition-all rounded"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-Color-Rich-Gray/20 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-Color-Dark-500">
                          Order #{order.order_number}
                        </h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        {order.financial_status && (
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getFinancialStatusColor(order.financial_status)}`}>
                            {order.financial_status === 'paid' && <CheckCircle className="inline h-3 w-3 mr-1" />}
                            {order.financial_status.charAt(0).toUpperCase() + order.financial_status.slice(1)}
                          </span>
                        )}
                        {order.fulfillment_status && (
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getFulfillmentStatusColor(order.fulfillment_status)}`}>
                            {order.fulfillment_status === 'fulfilled' && <Truck className="inline h-3 w-3 mr-1" />}
                            {order.fulfillment_status.charAt(0).toUpperCase() + order.fulfillment_status.slice(1)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-Color-Rich-Gray flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          {formatPrice(order.total)}
                        </span>
                        {order.currency && order.currency !== 'EUR' && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                            {order.currency}
                          </span>
                        )}
                        {order.shopify_order_id ? (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Synced with Shopify
                          </span>
                        ) : order.shopify_checkout_id ? (
                          <span className="text-xs text-yellow-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Awaiting Payment
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-Color-Rich-Gray" />
                  </div>

                  {order.items && Array.isArray(order.items) && order.items.length > 0 && (
                    <div className="border-t border-Color-Rich-Gray/10 pt-4">
                      <p className="text-sm text-Color-Rich-Gray mb-3">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                      <div className="space-y-2">
                        {order.items.slice(0, 2).map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 text-sm">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name || 'Product'}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <p className="text-Color-Dark-500 font-medium">
                                {item.name || item.product_name || item.title || 'Product'}
                              </p>
                              {item.variant && (
                                <p className="text-xs text-Color-Rich-Gray">{item.variant}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-Color-Dark-500 font-medium">
                                {item.quantity}x {formatPrice(item.price)}
                              </p>
                              {item.total && (
                                <p className="text-xs text-Color-Rich-Gray">
                                  Total: {formatPrice(item.total)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-Color-Rich-Gray bg-Color-Netural-White px-2 py-1 rounded inline-block">
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {order.tracking_info && Object.keys(order.tracking_info).length > 0 && (
                    <div className="border-t border-Color-Rich-Gray/10 pt-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Truck className="h-4 w-4 text-blue-600" />
                          <span className="text-Color-Rich-Gray">Tracking information available</span>
                        </div>
                        {order.tracking_info.url && (
                          <a
                            href={order.tracking_info.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            Track Package
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {order.shopify_order_id && (
                    <div className="border-t border-Color-Rich-Gray/10 pt-4 mt-4">
                      <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-green-900">Order Confirmed</p>
                            <p className="text-xs text-green-700">Payment received and order is being processed</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
