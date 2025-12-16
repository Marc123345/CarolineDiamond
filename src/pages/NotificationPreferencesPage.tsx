import React, { useState, useEffect } from 'react';
import { Bell, Loader, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { supabase } from '../lib/supabase';

interface NotificationPreferencesPageProps {
  onNavigate: (page: string) => void;
}

interface Preferences {
  back_in_stock: boolean;
  price_drops: boolean;
  new_arrivals: boolean;
  order_updates: boolean;
  promotions: boolean;
}

export const NotificationPreferencesPage: React.FC<NotificationPreferencesPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<Preferences>({
    back_in_stock: true,
    price_drops: true,
    new_arrivals: false,
    order_updates: true,
    promotions: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.id || !supabase) return;

      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        setError('Failed to load preferences');
        console.error('Preferences load error:', fetchError);
      } else if (data) {
        setPreferences({
          back_in_stock: data.back_in_stock,
          price_drops: data.price_drops,
          new_arrivals: data.new_arrivals,
          order_updates: data.order_updates,
          promotions: data.promotions
        });
      }

      setLoading(false);
    };

    loadPreferences();
  }, [user?.id]);

  const handleToggle = (key: keyof Preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (!user?.id || !supabase) return;

    setSaving(true);
    setError('');
    setSuccess('');

    const { error: saveError } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        ...preferences
      });

    if (saveError) {
      setError('Failed to save preferences. Please try again.');
      console.error('Preferences save error:', saveError);
    } else {
      setSuccess('Preferences saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-Color-Netural-White py-20 sm:py-32 lg:py-40">
        <div className="max-w-3xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="flex items-center justify-center py-20">
            <Loader className="h-8 w-8 animate-spin text-Color-Light-300" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-Color-Netural-White py-20 sm:py-32 lg:py-40">
      <div className="max-w-3xl mx-auto px-8 sm:px-12 lg:px-16">
        <div className="mb-12">
          <Breadcrumbs
            items={[
              { label: 'Notification Preferences', icon: Bell }
            ]}
            onNavigate={onNavigate}
          />
        </div>

        <div className="bg-white border border-Color-Rich-Gray/10 p-8 rounded-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-Color-Light-300/10 rounded-full">
              <Bell className="h-6 w-6 text-Color-Light-300" />
            </div>
            <div>
              <h1 className="font-serif text-h2 text-Color-Dark-500">Notification Preferences</h1>
              <p className="text-sm text-Color-Rich-Gray mt-1">Manage how you receive updates from us</p>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-sm rounded">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Back in Stock */}
            <div className="flex items-start justify-between py-4 border-b border-Color-Rich-Gray/10">
              <div className="flex-1">
                <h3 className="font-semibold text-Color-Dark-500 mb-1">Back in Stock Alerts</h3>
                <p className="text-sm text-Color-Rich-Gray">
                  Get notified when products you requested are available again
                </p>
              </div>
              <button
                onClick={() => handleToggle('back_in_stock')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-Color-Light-300 focus:ring-offset-2 ${
                  preferences.back_in_stock ? 'bg-Color-Light-300' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.back_in_stock ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Price Drops */}
            <div className="flex items-start justify-between py-4 border-b border-Color-Rich-Gray/10">
              <div className="flex-1">
                <h3 className="font-semibold text-Color-Dark-500 mb-1">Price Drop Alerts</h3>
                <p className="text-sm text-Color-Rich-Gray">
                  Receive emails when items in your wishlist go on sale
                </p>
              </div>
              <button
                onClick={() => handleToggle('price_drops')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-Color-Light-300 focus:ring-offset-2 ${
                  preferences.price_drops ? 'bg-Color-Light-300' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.price_drops ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* New Arrivals */}
            <div className="flex items-start justify-between py-4 border-b border-Color-Rich-Gray/10">
              <div className="flex-1">
                <h3 className="font-semibold text-Color-Dark-500 mb-1">New Arrivals</h3>
                <p className="text-sm text-Color-Rich-Gray">
                  Be the first to know about new products and collections
                </p>
              </div>
              <button
                onClick={() => handleToggle('new_arrivals')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-Color-Light-300 focus:ring-offset-2 ${
                  preferences.new_arrivals ? 'bg-Color-Light-300' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.new_arrivals ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Order Updates */}
            <div className="flex items-start justify-between py-4 border-b border-Color-Rich-Gray/10">
              <div className="flex-1">
                <h3 className="font-semibold text-Color-Dark-500 mb-1">Order Updates</h3>
                <p className="text-sm text-Color-Rich-Gray">
                  Important notifications about your order status and shipping
                </p>
              </div>
              <button
                onClick={() => handleToggle('order_updates')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-Color-Light-300 focus:ring-offset-2 ${
                  preferences.order_updates ? 'bg-Color-Light-300' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.order_updates ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Promotions */}
            <div className="flex items-start justify-between py-4">
              <div className="flex-1">
                <h3 className="font-semibold text-Color-Dark-500 mb-1">Promotional Emails</h3>
                <p className="text-sm text-Color-Rich-Gray">
                  Special offers, sales, and exclusive promotions
                </p>
              </div>
              <button
                onClick={() => handleToggle('promotions')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-Color-Light-300 focus:ring-offset-2 ${
                  preferences.promotions ? 'bg-Color-Light-300' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.promotions ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-Color-Rich-Gray/10">
            <div className="flex items-center gap-2 text-sm text-Color-Rich-Gray mb-4">
              <Mail className="h-4 w-4" />
              <span>Notifications will be sent to: <strong>{user?.email}</strong></span>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-Color-Light-300 text-white font-medium hover:bg-Color-Light-Dark transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
