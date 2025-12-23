import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: unknown[];
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  resetCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, resetCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState({ errorInfo });

    this.props.onError?.(error, errorInfo);

    // Log error details for debugging
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      isChunkLoadError: error.message.includes('Failed to fetch') || 
                        error.message.includes('Loading chunk') ||
                        error.message.includes('dynamically imported module'),
      isDev: import.meta.env.DEV,
    };

    console.error('Error details:', errorDetails);

    // If it's a chunk loading error, suggest a page reload
    if (errorDetails.isChunkLoadError && !import.meta.env.DEV) {
      console.warn('Chunk loading error detected. A page reload may help resolve this issue.');
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.hasError && prevProps.resetKeys !== this.props.resetKeys) {
      this.reset();
    }
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      resetCount: this.state.resetCount + 1
    });
  };

  goHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const showDetails = this.props.showDetails && import.meta.env.DEV;
      const isChunkError = this.state.error?.message.includes('Failed to fetch') || 
                          this.state.error?.message.includes('Loading chunk') ||
                          this.state.error?.message.includes('dynamically imported module');

      return (
        <div className="min-h-screen flex items-center justify-center bg-Color-Netural-White p-4">
          <div className="max-w-2xl w-full text-center">
            <div className="mb-6 flex justify-center">
              <AlertTriangle className="h-16 w-16 text-Color-Champagne-Gold" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-Color-Dark-500 mb-4">
              Something went wrong
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-4">
              We apologize for the inconvenience. Please try one of the options below.
            </p>

            {isChunkError && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Network or loading issue detected:</strong><br />
                  This error typically occurs due to a temporary network problem or when the site has been recently updated.
                  Reloading the page should resolve the issue.
                </p>
              </div>
            )}

            {showDetails && this.state.error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <p className="font-semibold text-red-800 mb-2">Error Details:</p>
                <p className="text-sm text-red-700 font-mono break-all">
                  {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-red-600">
                      Stack Trace
                    </summary>
                    <pre className="text-xs text-red-600 mt-2 overflow-auto max-h-48">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.reset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-Color-Champagne-Gold text-white hover:bg-opacity-90 transition-all duration-300 rounded-lg font-medium"
              >
                <RefreshCw className="h-5 w-5" />
                Try Again
              </button>
              <button
                onClick={this.goHome}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all duration-300 rounded-lg font-medium"
              >
                <Home className="h-5 w-5" />
                Go Home
              </button>
            </div>

            {this.state.resetCount > 0 && (
              <p className="mt-4 text-sm text-gray-500">
                Reset attempts: {this.state.resetCount}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
