import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // CRITICAL: This '/' forces the browser to look for CSS and JS at the root domain,
  // fixing the "Verify stylesheet URLs" error on nested shop/product pages.
  base: '/', 
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'framer-motion',
      '@supabase/supabase-js'
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'framer-motion'],
        },
        // Ensures clean filenames for reliable loading
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    minify: 'esbuild',
    sourcemap: false,
  },
  server: {
    historyApiFallback: true, // Helps with local routing refresh
  },
});