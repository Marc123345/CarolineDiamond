import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion', 'gsap'],
          'ui-vendor': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'icon-vendor': ['lucide-react'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'graphql-vendor': ['graphql', 'graphql-request'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    minify: 'esbuild',
    target: 'es2015',
    sourcemap: false,
    cssCodeSplit: true,
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
});
