'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Navigation, Radio } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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
      const { data } = await supabase
        .from('chris_status')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) setStatus(data);
      setLoading(false);
    };

    fetchStatus();

    if (supabase) {
      const channel = supabase
        .channel('chris_status_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chris_status' }, 
        (payload) => {
          setStatus(payload.new as ChrisStatus);
          setDismissed(false);
        })
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, []);

  if (loading || !status || !status.is_approaching || dismissed) return null;

  const formatETA = (minutes: number | null) => {
    if (!minutes) return 'Imminent';
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  return (
    <AnimatePresence>
      <div className="fixed top-24 left-0 right-0 z-[150] flex justify-center pointer-events-none px-6">
        <motion.div
          initial={{ y: -50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 150 }}
          className="pointer-events-auto relative group"
        >
          {/* --- GLOW EFFECT --- */}
          <div className="absolute -inset-1 bg-gradient-to-r from-Color-Champagne-Gold/40 to-Color-Light-300/40 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

          {/* --- MAIN PILL CONTAINER --- */}
          <div className="relative flex items-center gap-6 bg-Color-Dark-500/90 backdrop-blur-2xl border border-white/10 pl-2 pr-6 py-2 rounded-full shadow-2xl overflow-hidden">
            
            {/* Radar / Sonar Icon */}
            <div className="relative flex items-center justify-center w-12 h-12">
              <motion.div 
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full border border-Color-Champagne-Gold"
              />
              <motion.div 
                animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                className="absolute inset-0 rounded-full border border-Color-Champagne-Gold"
              />
              <div className="relative z-10 w-10 h-10 bg-Color-Dark-500 rounded-full flex items-center justify-center border border-Color-Champagne-Gold/50 shadow-inner">
                <Navigation className="w-4 h-4 text-Color-Champagne-Gold fill-Color-Champagne-Gold animate-pulse" />
              </div>
            </div>

            {/* Content Text */}
            <div className="flex flex-col min-w-[140px] max-w-[200px] sm:max-w-xs">
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-Color-Light-300">Live Update</span>
                <span className="w-1 h-1 rounded-full bg-red-500 animate-ping" />
              </div>
              <p className="text-sm font-medium text-white line-clamp-1">
                {status.message || 'Chris is approaching the studio'}
              </p>
            </div>

            {/* ETA Badge */}
            {status.eta_minutes !== null && (
              <div className="hidden sm:flex flex-col items-center border-l border-white/10 pl-6 pr-2">
                <span className="text-[8px] uppercase tracking-widest font-bold text-white/40">Arrival</span>
                <span className="text-lg font-serif italic text-Color-Champagne-Gold leading-none mt-1">
                  {formatETA(status.eta_minutes)}
                </span>
              </div>
            )}

            {/* Close / Dismiss */}
            <button
              onClick={() => setDismissed(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors group/close"
            >
              <X className="w-4 h-4 text-white/40 group-hover/close:text-white transition-colors" />
            </button>
          </div>

          {/* Liquid Progress Bar Background */}
          <div className="absolute bottom-0 left-10 right-10 h-[1px] bg-white/5 overflow-hidden rounded-full">
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-Color-Champagne-Gold to-transparent opacity-50"
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};