/**
 * Safe Hydration Utilities
 *
 * These utilities prevent hydration mismatches when using browser-only APIs
 * like localStorage, sessionStorage, or window objects during SSR or initial render.
 */

/**
 * Check if code is running in a browser environment
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};

/**
 * Safely get item from localStorage without causing hydration mismatch
 * Returns null on first render, then the actual value after hydration
 */
export const safeLocalStorageGetItem = (key: string): string | null => {
  if (!isBrowser()) {
    return null;
  }

  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to get item from localStorage: ${key}`, error);
    return null;
  }
};

/**
 * Safely set item in localStorage
 */
export const safeLocalStorageSetItem = (key: string, value: string): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Failed to set item in localStorage: ${key}`, error);
  }
};

/**
 * Safely remove item from localStorage
 */
export const safeLocalStorageRemoveItem = (key: string): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove item from localStorage: ${key}`, error);
  }
};

/**
 * Custom hook for using localStorage with safe hydration
 * Returns a tuple: [value, setValue, isHydrated]
 *
 * @param key - localStorage key
 * @param initialValue - Default value to use
 * @returns [storedValue, setValue, isHydrated]
 *
 * @example
 * const [theme, setTheme, isHydrated] = useLocalStorage('theme', 'light');
 *
 * // On first render: theme = 'light', isHydrated = false
 * // After hydration: theme = localStorage value or 'light', isHydrated = true
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, boolean] {
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [storedValue, setStoredValue] = React.useState<T>(initialValue);

  // Hydrate from localStorage on mount
  React.useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
    } finally {
      setIsHydrated(true);
    }
  }, [key]);

  // Save to localStorage when value changes (only after hydration)
  const setValue = React.useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        if (isBrowser()) {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue, isHydrated];
}

// Need to import React for the hook
import React from 'react';

/**
 * HOC to wrap components that should only render on client-side
 * Prevents hydration mismatches for components using browser-only APIs
 *
 * @example
 * const ClientOnlyMap = withClientOnly(GoogleMap);
 */
export function withClientOnly<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  const ClientOnlyComponent: React.FC<P> = (props) => {
    const [hasMounted, setHasMounted] = React.useState(false);

    React.useEffect(() => {
      setHasMounted(true);
    }, []);

    if (!hasMounted) {
      return null;
    }

    return React.createElement(Component, props);
  };

  return ClientOnlyComponent;
}

/**
 * Component to wrap client-only content
 * Prevents hydration mismatches by only rendering children after mount
 *
 * @example
 * <ClientOnly fallback={<Skeleton />}>
 *   <ComponentThatUsesLocalStorage />
 * </ClientOnly>
 */
export const ClientOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Hook to detect if component has mounted (client-side)
 * Useful for conditional rendering of browser-only features
 *
 * @example
 * const hasMounted = useHasMounted();
 * return hasMounted ? <BrowserOnlyComponent /> : <Skeleton />;
 */
export function useHasMounted(): boolean {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}

/**
 * Safely parse JSON from localStorage
 * Returns default value if parsing fails or item doesn't exist
 */
export function safeJSONParse<T>(value: string | null, defaultValue: T): T {
  if (!value) {
    return defaultValue;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Failed to parse JSON from localStorage:', error);
    return defaultValue;
  }
}
