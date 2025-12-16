import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CookieConsentState, CookieAction, CookiePreferences } from '../types/cookies';

const COOKIE_STORAGE_KEY = 'diamonds_by_cs_cookie_preferences';

const initialState: CookieConsentState = {
  hasConsented: false,
  showBanner: true,
  showSettings: false,
  preferences: {
    analytics: false,
    advertising: false,
    functional: true // Functional cookies are essential
  }
};

const cookieReducer = (state: CookieConsentState, action: CookieAction): CookieConsentState => {
  switch (action.type) {
    case 'ACCEPT_ALL':
      return {
        ...state,
        hasConsented: true,
        showBanner: false,
        showSettings: false,
        preferences: {
          analytics: true,
          advertising: true,
          functional: true
        }
      };

    case 'REJECT_NON_ESSENTIAL':
      return {
        ...state,
        hasConsented: true,
        showBanner: false,
        showSettings: false,
        preferences: {
          analytics: false,
          advertising: false,
          functional: true
        }
      };

    case 'SHOW_SETTINGS':
      return {
        ...state,
        showSettings: true
      };

    case 'HIDE_SETTINGS':
      return {
        ...state,
        showSettings: false
      };

    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: {
          ...action.payload,
          functional: true // Always keep functional cookies enabled
        }
      };

    case 'SAVE_PREFERENCES':
      return {
        ...state,
        hasConsented: true,
        showBanner: false,
        showSettings: false
      };

    case 'HIDE_BANNER':
      return {
        ...state,
        showBanner: false
      };

    case 'LOAD_PREFERENCES':
      return {
        ...state,
        hasConsented: true,
        showBanner: false,
        preferences: action.payload
      };

    default:
      return state;
  }
};

const CookieContext = createContext<{
  state: CookieConsentState;
  dispatch: React.Dispatch<CookieAction>;
} | null>(null);

export const CookieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cookieReducer, initialState);

  // Load saved preferences on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        dispatch({ type: 'LOAD_PREFERENCES', payload: preferences });
      } catch (error) {
        console.error('Error loading cookie preferences:', error);
      }
    }
  }, []);

  // Listen for custom event from privacy policy page
  useEffect(() => {
    const handleShowCookieSettings = () => {
      dispatch({ type: 'SHOW_SETTINGS' });
    };

    window.addEventListener('showCookieSettings', handleShowCookieSettings);
    return () => window.removeEventListener('showCookieSettings', handleShowCookieSettings);
  }, []);

  // Save preferences when they change
  useEffect(() => {
    if (state.hasConsented) {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(state.preferences));
      
      // Apply cookie preferences to actual tracking scripts
      applyCookiePreferences(state.preferences);
    }
  }, [state.preferences, state.hasConsented]);

  return (
    <CookieContext.Provider value={{ state, dispatch }}>
      {children}
    </CookieContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieProvider');
  }
  return context;
};

// Apply cookie preferences to tracking scripts
const applyCookiePreferences = (preferences: CookiePreferences) => {
  // Google Analytics
  if (preferences.analytics) {
    // Enable Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  } else {
    // Disable Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
  }

  // Advertising cookies
  if (preferences.advertising) {
    // Enable advertising cookies
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted'
      });
    }
  } else {
    // Disable advertising cookies
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
  }

  // Functional cookies are always enabled as they're essential
};