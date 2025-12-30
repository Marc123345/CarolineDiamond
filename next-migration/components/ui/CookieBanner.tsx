'use client';

import React from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { X, Settings, Check, Shield, Eye, Target, Lock } from 'lucide-react';
import { useCookieConsent } from '../../context/CookieContext';

export const CookieBanner: React.FC = () => {
  const { state, dispatch } = useCookieConsent();

  const containerVars = {
    initial: { y: 50, opacity: 0, scale: 0.95 },
    animate: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { y: 20, opacity: 0, scale: 0.95, transition: { duration: 0.4 } }
  };

  if (!state.showBanner && !state.showSettings) return null;

  return (
    <>
      {/* --- FLOATING CONCIERGE PILL (The Banner) --- */}
      <AnimatePresence>
        {state.showBanner && !state.hasConsented && (
          <motion.div
            variants={containerVars}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] w-[95vw] max-w-4xl"
          >
            <div className="bg-white/80 backdrop-blur-2xl border border-black/5 shadow-[0_30px_100px_rgba(0,0,0,0.1)] overflow-hidden rounded-2xl">
              {/* Subtle Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
              
              <div className="relative z-10 p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-Color-Dark-500 flex items-center justify-center flex-shrink-0 shadow-xl">
                    <Shield className="w-5 h-5 text-Color-Champagne-Gold" />
                  </div>
                  <div>
                    <h3 className="text-sm uppercase tracking-[0.3em] font-black text-Color-Dark-500 mb-2">
                      Privacy <span className="italic font-serif normal-case tracking-normal ml-1">Atelier</span>
                    </h3>
                    <p className="text-sm text-Color-Gray-600 font-light leading-relaxed max-w-xl">
                      To ensure your Antwerp experience is as brilliant as our stones, we use cookies to personalize your journey. 
                      You may accept our standard configuration or curate your own preferences.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 lg:flex-shrink-0">
                  <button
                    onClick={() => dispatch({ type: 'SHOW_SETTINGS' })}
                    className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-400 hover:text-Color-Dark-500 transition-colors px-4 py-2"
                  >
                    Customise
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'REJECT_NON_ESSENTIAL' })}
                    className="px-6 py-3 border border-black/10 text-[11px] uppercase tracking-widest font-black hover:bg-black hover:text-white transition-all duration-500"
                  >
                    Essential Only
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'ACCEPT_ALL' })}
                    className="px-8 py-3 bg-Color-Dark-500 text-white text-[11px] uppercase tracking-widest font-black hover:bg-Color-Champagne-Gold hover:text-Color-Dark-500 transition-all duration-500 shadow-lg"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PREFERENCE VAULT (The Modal) --- */}
      <AnimatePresence>
        {state.showSettings && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => dispatch({ type: 'HIDE_SETTINGS' })}
              className="absolute inset-0 bg-Color-Dark-500/40 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-2xl bg-[#FAF9F6] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden rounded-sm"
            >
              <header className="p-8 border-b border-black/5 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-serif text-Color-Dark-500">Curate Privacy</h2>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-Color-Light-300 font-bold mt-1">Refining Your Digital Footprint</p>
                </div>
                <button onClick={() => dispatch({ type: 'HIDE_SETTINGS' })} className="w-12 h-12 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </header>

              <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh] no-scrollbar">
                {[
                  { id: 'essential', title: 'Functional Ledger', desc: 'Required for boutique security and cart persistence.', icon: Lock, required: true },
                  { id: 'analytics', title: 'Experience Analytics', desc: 'Allows us to measure the performance of our collections.', icon: Eye },
                  { id: 'advertising', title: 'Bespoke Discovery', desc: 'Delivers personalized inspirations on social channels.', icon: Target }
                ].map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-8 group">
                    <div className="flex gap-6">
                      <div className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center group-hover:border-Color-Champagne-Gold transition-colors">
                        <item.icon className="w-4 h-4 text-Color-Light-300" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-Color-Dark-500 mb-1">{item.title}</h4>
                        <p className="text-xs text-Color-Gray-500 leading-relaxed max-w-sm">{item.desc}</p>
                      </div>
                    </div>

                    {item.required ? (
                      <span className="text-[9px] uppercase tracking-widest font-black text-Color-Light-300 px-3 py-1 bg-black/5 rounded-full">Always On</span>
                    ) : (
                      <BoutiqueToggle 
                        checked={state.preferences[item.id as keyof typeof state.preferences]} 
                        onChange={(val) => dispatch({ type: 'UPDATE_PREFERENCES', payload: { ...state.preferences, [item.id]: val } })}
                      />
                    )}
                  </div>
                ))}
              </div>

              <footer className="p-8 bg-white border-t border-black/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
                 <button onClick={() => dispatch({ type: 'HIDE_SETTINGS' })} className="text-[10px] uppercase tracking-widest font-bold text-Color-Gray-400 hover:text-Color-Dark-500 transition-colors">Cancel</button>
                 <button 
                  onClick={() => dispatch({ type: 'SAVE_PREFERENCES' })}
                  className="w-full sm:w-auto px-12 py-4 bg-Color-Dark-500 text-white uppercase text-[10px] tracking-[0.4em] font-black hover:bg-black transition-all"
                 >
                   Save Selections
                 </button>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

/* --- CUSTOM BOUTIQUE TOGGLE COMPONENT --- */
const BoutiqueToggle = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
  <button 
    onClick={() => onChange(!checked)}
    className="relative w-12 h-6 rounded-full transition-colors duration-500 flex items-center p-1"
    style={{ backgroundColor: checked ? '#C9A86A' : '#E5E5E5' }}
  >
    <motion.div 
      animate={{ x: checked ? 24 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="w-4 h-4 bg-white rounded-full shadow-lg"
    />
  </button>
);