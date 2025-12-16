import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ChrisStatus {
  is_approaching: boolean;
  message: string;
  eta_minutes: number | null;
  updated_at: string;
}

export const ChrisStatusWidget: React.FC = () => {
  const [status, setStatus] = useState<ChrisStatus | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('chris_status')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching Chris status:', error);
      } else if (data) {
        setStatus(data);
      }

      setLoading(false);
    };

    fetchStatus();

    // Subscribe to real-time updates
    if (supabase) {
      const channel = supabase
        .channel('chris_status_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'chris_status'
          },
          (payload) => {
            setStatus(payload.new as ChrisStatus);
            setDismissed(false); // Show banner again on status change
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  if (loading || !status || !status.is_approaching || dismissed) {
    return null;
  }

  const formatETA = (minutes: number | null) => {
    if (!minutes) return 'soon';
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm sm:text-base font-semibold">
                  {status.message || 'Chris is approaching the store!'}
                </p>
                {status.eta_minutes !== null && (
                  <p className="text-xs sm:text-sm opacity-90">
                    Estimated arrival: {formatETA(status.eta_minutes)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="flex-shrink-0 ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
