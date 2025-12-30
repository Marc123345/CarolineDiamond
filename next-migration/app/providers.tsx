'use client';

import { ToastProvider } from '../context/ToastContext';
import { TranslationProvider } from '../context/TranslationContext';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { CookieProvider } from '../context/CookieContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <TranslationProvider>
        <CookieProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </CookieProvider>
      </TranslationProvider>
    </ToastProvider>
  );
}
