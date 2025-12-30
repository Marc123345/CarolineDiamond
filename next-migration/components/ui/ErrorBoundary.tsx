'use client';

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

    if (!process.env.NODE_ENV === 'development') {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
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

      const showDetails = this.props.showDetails && process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen flex items-center justify-center bg-Color-Netural-White p-4">
          <div className="max-w-2xl w-full text-center">
            <div className="mb-6 flex justify-center">
              <AlertTriangle className="h-16 w-16 text-Color-Champagne-Gold" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-Color-Dark-500 mb-4">
              Something went wrong
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8">
              We apologize for the inconvenience. Please try one of the options below.
            </p>

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
