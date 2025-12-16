import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh for better development experience
      fastRefresh: true,
      // Optimize React runtime
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    })
  ],
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
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion', 'gsap'],
          'ui-vendor': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'icon-vendor': ['lucide-react'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'graphql-vendor': ['graphql', 'graphql-request'],
        },
        // Improve chunk naming for better caching
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
    // Increase assetsInlineLimit for small assets
    assetsInlineLimit: 4096,
    // Enable more aggressive tree-shaking
    reportCompressedSize: false,
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
});
