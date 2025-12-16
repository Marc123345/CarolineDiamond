import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const { signIn, signUp, resetPassword } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Redirect to Shopify account management
      const shopifyAccountUrl = 'https://shopify.com/76261228788/account';

      if (mode === 'signin') {
        // Redirect to Shopify login
        window.location.href = `${shopifyAccountUrl}/login`;
        return;
      } else if (mode === 'signup') {
        // Redirect to Shopify account registration
        window.location.href = `${shopifyAccountUrl}/register`;
        return;
      } else if (mode === 'reset') {
        // Redirect to Shopify password reset
        window.location.href = `${shopifyAccountUrl}/login#recover`;
        return;
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMode('signin');
    setEmail('');
    setPassword('');
    setFullName('');
    setError('');
    setResetSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-Color-Netural-White p-8 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-Color-Rich-Gray hover:text-Color-Dark-500 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-8">
          <h2 className="font-serif text-h3 text-Color-Dark-500 mb-2">
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'reset' && 'Reset Password'}
          </h2>
          <p className="text-body text-Color-Rich-Gray">
            {mode === 'signin' && 'Sign in to your account'}
            {mode === 'signup' && 'Join Diamonds by CS'}
            {mode === 'reset' && 'Enter your email to reset your password'}
          </p>
        </div>

        {resetSent ? (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-sm">
            Password reset email sent. Please check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm">
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-Color-Rich-Gray mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-Color-Rich-Gray" />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-Color-Rich-Gray/30 bg-white text-Color-Dark-500 focus:outline-none focus:ring-2 focus:ring-Color-Light-300"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-Color-Rich-Gray mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-Color-Rich-Gray" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-Color-Rich-Gray/30 bg-white text-Color-Dark-500 focus:outline-none focus:ring-2 focus:ring-Color-Light-300"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-Color-Rich-Gray mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-Color-Rich-Gray" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-Color-Rich-Gray/30 bg-white text-Color-Dark-500 focus:outline-none focus:ring-2 focus:ring-Color-Light-300"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            )}

            {mode === 'signin' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-sm text-Color-Light-Dark hover:text-Color-Dark-500 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-Color-Light-300 text-white font-medium hover:bg-Color-Light-Dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {mode !== 'reset' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-Color-Rich-Gray">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-Color-Light-Dark hover:text-Color-Dark-500 font-medium transition-colors"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        )}

        {mode === 'reset' && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setMode('signin')}
              className="text-sm text-Color-Light-Dark hover:text-Color-Dark-500 transition-colors"
            >
              Back to sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
