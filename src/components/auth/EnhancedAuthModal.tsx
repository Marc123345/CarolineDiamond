import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles, Shield, Zap, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthLabel, generateSecurePassword } from '../../utils/passwordValidator';

interface EnhancedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'magic';
}

export const EnhancedAuthModal: React.FC<EnhancedAuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset' | 'magic'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const { signIn, signUp, resetPassword, signInWithMagicLink } = useAuth();

  const passwordStrength = mode === 'signup' ? validatePassword(password) : null;

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
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
      } else if (mode === 'magic') {
        setError('Magic link signin is not available. Please use the standard login.');
        setLoading(false);
        return;
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePassword = () => {
    const generated = generateSecurePassword(16);
    setPassword(generated);
    setShowPassword(true);
  };

  const handleClose = () => {
    setMode('signin');
    setEmail('');
    setPassword('');
    setFullName('');
    setShowPassword(false);
    setRememberMe(false);
    setError('');
    setSuccess('');
    setResetSent(false);
    setMagicLinkSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-Color-Gray-700 hover:text-Color-Netural-Black hover:bg-Color-Primary-Beige/20 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            {mode === 'magic' && <Zap className="h-6 w-6 text-Color-Champagne-Gold" />}
            {mode === 'signup' && <Sparkles className="h-6 w-6 text-Color-Champagne-Gold" />}
            {mode === 'signin' && <Shield className="h-6 w-6 text-Color-Champagne-Gold" />}
            <h2 className="text-2xl font-bold text-Color-Netural-Black">
              {mode === 'signin' && 'Welcome Back'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Reset Password'}
              {mode === 'magic' && 'Magic Link Sign In'}
            </h2>
          </div>
          <p className="text-sm text-Color-Gray-700">
            {mode === 'signin' && 'Sign in to access your account'}
            {mode === 'signup' && 'Join Diamonds by CS today'}
            {mode === 'reset' && 'We\'ll send you a reset link'}
            {mode === 'magic' && 'Sign in without a password'}
          </p>
        </div>

        {/* Tab Switcher */}
        {!resetSent && !magicLinkSent && (
          <div className="flex gap-2 mb-6 p-1 bg-Color-Primary-Beige/20 rounded-lg">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                mode === 'signin'
                  ? 'bg-Color-Netural-Black text-white shadow-md'
                  : 'text-Color-Gray-700 hover:text-Color-Netural-Black'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                mode === 'signup'
                  ? 'bg-Color-Netural-Black text-white shadow-md'
                  : 'text-Color-Gray-700 hover:text-Color-Netural-Black'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setMode('magic')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-1 ${
                mode === 'magic'
                  ? 'bg-Color-Champagne-Gold text-white shadow-md'
                  : 'text-Color-Gray-700 hover:text-Color-Netural-Black'
              }`}
            >
              <Zap className="h-3 w-3" />
              Magic
            </button>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        {!resetSent && !magicLinkSent && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Signup only) */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-Color-Netural-Black mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-Color-Gray-700" />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-Color-Champagne-Gold/30 rounded-lg text-Color-Netural-Black placeholder-Color-Gray-700/50 focus:outline-none focus:ring-2 focus:ring-Color-Champagne-Gold focus:border-transparent transition-all"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-Color-Netural-Black mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-Color-Gray-700" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-Color-Champagne-Gold/30 rounded-lg text-Color-Netural-Black placeholder-Color-Gray-700/50 focus:outline-none focus:ring-2 focus:ring-Color-Champagne-Gold focus:border-transparent transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password (Not for magic link or reset) */}
            {mode !== 'reset' && mode !== 'magic' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-Color-Netural-Black mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-Color-Gray-700" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-24 py-3 border border-Color-Champagne-Gold/30 rounded-lg text-Color-Netural-Black placeholder-Color-Gray-700/50 focus:outline-none focus:ring-2 focus:ring-Color-Champagne-Gold focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {mode === 'signup' && (
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="p-1.5 text-Color-Champagne-Gold hover:bg-Color-Primary-Beige/30 rounded transition-colors"
                        title="Generate secure password"
                      >
                        <Sparkles className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 text-Color-Gray-700 hover:bg-Color-Primary-Beige/30 rounded transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Indicator (Signup only) */}
                {mode === 'signup' && password && passwordStrength && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-Color-Gray-700">
                        Password Strength
                      </span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: getPasswordStrengthColor(passwordStrength.level) }}
                      >
                        {getPasswordStrengthLabel(passwordStrength.level)}
                      </span>
                    </div>
                    <div className="w-full bg-Color-Light-300 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${passwordStrength.score}%`,
                          backgroundColor: getPasswordStrengthColor(passwordStrength.level),
                        }}
                      />
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {passwordStrength.feedback.map((fb, i) => (
                          <li key={i} className="text-xs text-Color-Gray-700 flex items-start gap-1">
                            <span className="text-Color-Champagne-Gold mt-0.5">•</span>
                            <span>{fb}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            {mode === 'signin' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-Color-Champagne-Gold border-Color-Champagne-Gold/30 rounded focus:ring-Color-Champagne-Gold"
                  />
                  <span className="text-sm text-Color-Gray-700">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-sm text-Color-Champagne-Gold hover:text-Color-Netural-Black transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Remember Me (Signup) */}
            {mode === 'signup' && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-Color-Champagne-Gold border-Color-Champagne-Gold/30 rounded focus:ring-Color-Champagne-Gold"
                />
                <span className="text-sm text-Color-Gray-700">
                  Keep me signed in for 30 days
                </span>
              </label>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-Color-Netural-Black text-white font-medium rounded-lg hover:bg-Color-Champagne-Gold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Please wait...
                </span>
              ) : (
                <>
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'reset' && 'Send Reset Link'}
                  {mode === 'magic' && 'Send Magic Link'}
                </>
              )}
            </button>
          </form>
        )}

        {/* Back to Sign In */}
        {mode === 'reset' && !resetSent && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setMode('signin')}
              className="text-sm text-Color-Champagne-Gold hover:text-Color-Netural-Black transition-colors"
            >
              Back to sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
