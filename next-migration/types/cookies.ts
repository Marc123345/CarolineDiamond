// Cookie types for GDPR compliance

export interface CookiePreferences {
  analytics: boolean;
  advertising: boolean;
  functional: boolean;
}

export interface CookieConsentState {
  hasConsented: boolean;
  showBanner: boolean;
  showSettings: boolean;
  preferences: CookiePreferences;
}

export type CookieAction =
  | { type: 'ACCEPT_ALL' }
  | { type: 'REJECT_NON_ESSENTIAL' }
  | { type: 'SHOW_SETTINGS' }
  | { type: 'HIDE_SETTINGS' }
  | { type: 'HIDE_BANNER' }
  | { type: 'SAVE_PREFERENCES'; payload: CookiePreferences }
  | { type: 'UPDATE_PREFERENCES'; payload: CookiePreferences }
  | { type: 'LOAD_PREFERENCES'; payload: CookiePreferences };
