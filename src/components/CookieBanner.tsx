import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Check, Shield, Eye, Target } from 'lucide-react';
import { useCookieConsent } from '../context/CookieContext';

export const CookieBanner: React.FC = () => {
  const { state, dispatch } = useCookieConsent();

  const handleAcceptAll = () => {
    dispatch({ type: 'ACCEPT_ALL' });
  };

  const handleRejectNonEssential = () => {
    dispatch({ type: 'REJECT_NON_ESSENTIAL' });
  };

  const handleShowSettings = () => {
    dispatch({ type: 'SHOW_SETTINGS' });
  };

  const handleUpdatePreference = (type: keyof typeof state.preferences, value: boolean) => {
    dispatch({
      type: 'UPDATE_PREFERENCES',
      payload: {
        ...state.preferences,
        [type]: value
      }
    });
  };

  const handleSavePreferences = () => {
    dispatch({ type: 'SAVE_PREFERENCES' });
  };

  const handleCloseSettings = () => {
    dispatch({ type: 'HIDE_SETTINGS' });
  };

  return (
    <>
      {/* Cookie Banner */}
      <AnimatePresence>
        {state.showBanner && !state.hasConsented && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-Color-Light-300 shadow-2xl w-full max-w-full safe-area-bottom safe-area-left safe-area-right"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 w-full max-w-full">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 w-full max-w-full">
                {/* Content */}
                <div className="flex-1 w-full max-w-full">
                  <div className="flex items-center mb-4">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3 shadow-lg"
                    >
                      <Shield className="h-4 w-4 text-white" />
                    </motion.div>
                    <h3 className="typography-h6 text-Color-Dark-500 font-bold">
                      Cookie Preferences
                    </h3>
                  </div>
                  <p className="typography-body text-Color-Gray-700 leading-relaxed max-w-full lg:max-w-4xl">
                    We use cookies to personalize content, to provide social media features, and to analyze our traffic. 
                    You can accept all cookies, reject non-essential ones, or manage preferences.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0 w-full lg:w-auto max-w-full">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAcceptAll}
                    className="bg-black text-white hover:bg-gray-900 px-6 py-3 flex items-center justify-center typography-body font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto rounded-none"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Accept All
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRejectNonEssential}
                    className="border-2 border-Color-Dark-500 text-Color-Dark-500 hover:bg-Color-Dark-500 hover:text-white px-6 py-3 flex items-center justify-center typography-body font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto rounded-none"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject Non-Essential
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShowSettings}
                    className="border-2 border-Color-Champagne-Gold text-Color-Dark-500 hover:bg-Color-Champagne-Gold hover:text-white px-6 py-3 flex items-center justify-center typography-body font-semibold transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto rounded-none"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Preferences
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Settings Modal */}
      <AnimatePresence>
        {state.showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4 w-full max-w-full"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white rounded-none sm:rounded-2xl w-full max-w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[90vh] overflow-hidden shadow-2xl border border-Color-Light-300"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-8 border-b border-Color-Light-300 bg-white flex-shrink-0">
                <div className="flex items-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 bg-black rounded-full flex items-center justify-center mr-4 shadow-lg"
                  >
                    <Settings className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="typography-h5 text-black font-bold">Cookie Preferences</h2>
                    <p className="typography-caption text-Color-Netural-Black">Manage your privacy settings</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseSettings}
                  className="p-3 sm:p-2 hover:bg-Color-Netural-White rounded-full transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
                >
                  <X className="h-6 w-6 text-black" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-8 overflow-y-auto flex-1 w-full max-w-full">
                <div className="space-y-6 sm:space-y-8 w-full max-w-full">
                  {/* Essential Cookies */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-Color-Netural-White p-4 sm:p-6 rounded-xl border border-Color-Light-300 w-full max-w-full"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Shield className="h-6 w-6 text-black mr-3" />
                        <div>
                          <h3 className="typography-h6 text-black font-bold">Functional Cookies</h3>
                          <p className="typography-caption text-Color-Netural-Black">Essential for website functionality</p>
                        </div>
                      </div>
                      <div className="bg-black text-white px-3 py-1 rounded-full typography-caption font-bold">
                        Always Active
                      </div>
                    </div>
                    <p className="typography-body text-Color-Netural-Black leading-relaxed">
                      These cookies are necessary for the website to function and cannot be switched off. 
                      They enable core functionality such as security, network management, and accessibility.
                    </p>
                  </motion.div>

                  {/* Analytics Cookies */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-Color-Netural-White p-4 sm:p-6 rounded-xl border border-Color-Light-300 w-full max-w-full"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Eye className="h-6 w-6 text-blue-500 mr-3" />
                        <div>
                          <h3 className="typography-h6 text-black font-bold">Analytics Cookies</h3>
                          <p className="typography-caption text-Color-Netural-Black">Help us understand how visitors use our site</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={state.preferences.analytics}
                          onChange={(e) => handleUpdatePreference('analytics', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-Color-Secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    <p className="typography-body text-Color-Netural-Black leading-relaxed">
                      These cookies allow us to count visits and traffic sources so we can measure and improve 
                      the performance of our site. They help us understand which pages are most popular.
                    </p>
                  </motion.div>

                  {/* Advertising Cookies */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-Color-Netural-White p-4 sm:p-6 rounded-xl border border-Color-Light-300 w-full max-w-full"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Target className="h-6 w-6 text-purple-500 mr-3" />
                        <div>
                          <h3 className="typography-h6 text-black font-bold">Advertising Cookies</h3>
                          <p className="typography-caption text-Color-Netural-Black">Used to deliver relevant advertisements</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={state.preferences.advertising}
                          onChange={(e) => handleUpdatePreference('advertising', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-Color-Secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    <p className="typography-body text-Color-Netural-Black leading-relaxed">
                      These cookies may be set through our site by our advertising partners. They may be used 
                      to build a profile of your interests and show you relevant ads on other sites.
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 p-4 sm:p-8 border-t border-Color-Light-300 bg-white flex-shrink-0 w-full max-w-full">
                <button
                  onClick={handleCloseSettings}
                  className="border-2 border-Color-Champagne-Gold text-Color-Netural-Black hover:bg-Color-Champagne-Gold hover:text-white px-6 py-3 typography-body font-medium w-full sm:w-auto rounded-none transition-all duration-300"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSavePreferences}
                  className="bg-black text-white hover:bg-gray-900 px-8 py-3 flex items-center justify-center typography-body font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto rounded-none"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Save Preferences
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};