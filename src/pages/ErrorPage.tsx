import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  if (process.env.NODE_ENV === 'development') {
    console.error('Route error:', error);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-Color-Netural-White p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <AlertTriangle className="h-16 w-16 text-Color-Champagne-Gold" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-Color-Dark-500 mb-4">
          Something went wrong
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-8">
          We apologize for the inconvenience. Please try going back to the home page.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-Color-Champagne-Gold text-white hover:bg-opacity-90 transition-all duration-300 rounded-lg font-medium"
          >
            Go Home
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 border-2 border-Color-Champagne-Gold text-Color-Champagne-Gold hover:bg-Color-Champagne-Gold hover:text-white transition-all duration-300 rounded-lg font-medium"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};
