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
 * @param importFunc - The dynamic import function that returns a module with default export
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
    componentName,
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
            } else if (componentName && componentName in module) {
              // If componentName is provided and exists, use it
              const namedExport = module[componentName];
              resolve({ default: namedExport as T });
            } else {
              // No valid export found
              reject(new Error(
                `Module does not have a default export${componentName ? ` or a named export "${componentName}"` : ''}. ` +
                `Please ensure the module exports the component correctly.`
              ));
            }
          })
          .catch((error) => {
            retryCount++;

            // Log the error for debugging
            const componentLabel = componentName || 'Component';
            console.error(
              `Failed to load ${componentLabel} (attempt ${retryCount}/${maxRetries + 1}):`,
              error
            );

            if (retryCount <= maxRetries) {
              // Exponential backoff for retries
              const delay = retryDelay * Math.pow(2, retryCount - 1);
              
              console.log(`Retrying ${componentLabel} in ${delay}ms...`);
              
              setTimeout(() => {
                attemptImport();
              }, delay);
            } else {
              // All retries exhausted
              console.error(
                `Failed to load ${componentLabel} after ${maxRetries} retries. Giving up.`
              );
              
              // Reject with enhanced error message
              const enhancedError = new Error(
                `Failed to load ${componentLabel} after ${maxRetries} retries. ` +
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
