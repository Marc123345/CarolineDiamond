import { ComponentType, lazy } from 'react';

interface LazyWithRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  fallbackComponent?: ComponentType<any>;
}

/**
 * Enhanced lazy loading with automatic retry on failure
 * Handles network issues and chunk loading failures in production
 * 
 * @param importFunc - The dynamic import function
 * @param options - Configuration options for retry behavior
 * @returns A React lazy component with retry logic
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T } | { [key: string]: T }>,
  options: LazyWithRetryOptions & { componentName?: string } = {}
) {
  const {
    maxRetries = 3,
    retryDelay = 1500,
    componentName = 'Component',
  } = options;

  return lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      let retryCount = 0;

      const attemptImport = () => {
        importFunc()
          .then((module) => {
            // Handle both default and named exports
            if ('default' in module) {
              resolve(module as { default: T });
            } else {
              // If no default export, use the componentName to find the export
              const namedExport = module[componentName];
              if (namedExport) {
                resolve({ default: namedExport as T });
              } else {
                // Try to find any export that looks like a component
                const firstExport = Object.values(module)[0];
                if (firstExport) {
                  resolve({ default: firstExport as T });
                } else {
                  reject(new Error(`No valid export found in module for ${componentName}`));
                }
              }
            }
          })
          .catch((error) => {
            retryCount++;

            // Log the error for debugging
            console.error(
              `Failed to load ${componentName} (attempt ${retryCount}/${maxRetries + 1}):`,
              error
            );

            if (retryCount <= maxRetries) {
              // Exponential backoff for retries
              const delay = retryDelay * Math.pow(2, retryCount - 1);
              
              console.log(`Retrying ${componentName} in ${delay}ms...`);
              
              setTimeout(() => {
                attemptImport();
              }, delay);
            } else {
              // All retries exhausted
              console.error(
                `Failed to load ${componentName} after ${maxRetries} retries. Giving up.`
              );
              
              // Reject with enhanced error message
              const enhancedError = new Error(
                `Failed to load ${componentName} after ${maxRetries} retries. ` +
                `This may be due to a network issue or the chunk file not being available. ` +
                `Original error: ${error.message}`
              );
              enhancedError.stack = error.stack;
              reject(enhancedError);
            }
          });
      };

      attemptImport();
    });
  });
}

/**
 * Preload a lazy component to warm up the cache
 * Useful for components that are likely to be needed soon
 * 
 * @param lazyComponent - The lazy component to preload
 */
export function preloadLazyComponent(lazyComponent: any): void {
  try {
    // Try to preload the component
    if (lazyComponent && typeof lazyComponent._init === 'function') {
      lazyComponent._init(lazyComponent._payload);
    }
  } catch (error) {
    console.warn('Failed to preload component:', error);
  }
}

/**
 * Create a lazy component with a specific error boundary
 * Provides better error handling for production
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T } | { [key: string]: T }>,
  componentName: string,
  options?: LazyWithRetryOptions
) {
  return lazyWithRetry(importFunc, {
    ...options,
    componentName,
  });
}
