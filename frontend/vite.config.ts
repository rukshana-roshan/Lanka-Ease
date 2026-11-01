import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const configuredBase = (env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
  let backendOrigin = 'http://localhost:8080';
  if (configuredBase) {
    const url = new URL(configuredBase);
    if (url.username || url.password || url.search || url.hash || !['', '/', '/api'].includes(url.pathname)
        || !['http:', 'https:'].includes(url.protocol)) {
      throw new Error('VITE_API_BASE_URL must be an HTTP(S) backend origin without credentials or query parameters.');
    }
    backendOrigin = url.origin;
    if (command === 'build' && mode !== 'preview' &&
        (url.protocol !== 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) {
      throw new Error('Production VITE_API_BASE_URL must use a public HTTPS backend origin.');
    }
  } else if (command === 'build' && mode !== 'preview') {
    throw new Error('Set VITE_API_BASE_URL in the Netlify build environment before building for production.');
  }
  if (command === 'build' && mode !== 'preview' && env.VITE_ENABLE_DEMO === 'true') {
    throw new Error('VITE_ENABLE_DEMO must be false for a production build.');
  }
  return {
    define: mode === 'preview' ? { 'import.meta.env.VITE_ENABLE_DEMO': JSON.stringify('true') } : {},
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api': {
          target: backendOrigin,
          changeOrigin: true,
        },
        '/ws-lankaease': {
          target: backendOrigin,
          ws: true,
        },
        '/uploads': {
          target: backendOrigin,
          changeOrigin: true,
        },
      },
    },
  };
});
