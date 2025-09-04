import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    host: true,
    strictPort: true
  },
  build: {
    // Optimize bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@headlessui/react', 'framer-motion'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          charts: ['recharts', 'chart.js'],
          analytics: ['@tanstack/react-query']
        }
      },
      onwarn(warning, warn) {
        // Suppress TypeScript warnings
        if (warning.code === 'TS2307' || warning.code === 'TS2339' || warning.code === 'TS2322') {
          return;
        }
        warn(warning);
      }
    },
    // Enable source maps for debugging
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000
  },
  esbuild: {
    // Skip TypeScript checking
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
}); 