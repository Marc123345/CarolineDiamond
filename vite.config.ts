import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite Configuration
 * CRITICAL FIX: The 'base: /' setting resolves the white screen 
 * and stylesheet loading errors on nested product routes.
 */
export default defineConfig({
  plugins: [react()],
  // 1. CRITICAL: Ensures all asset paths start with /
  base: '/', 
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'framer-motion',
      '@supabase/supabase-js',
      'graphql-request'
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion', 'gsap'],
          'ui-vendor': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'icon-vendor': ['lucide-react'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'graphql-vendor': ['graphql', 'graphql-request'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 600,
    minify: 'esbuild',
    target: 'es2015',
    sourcemap: false,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    reportCompressedSize: false,
  },
  server: {
    hmr: {
      overlay: true, // This will show errors in the browser for easier debugging
    },
  },
});