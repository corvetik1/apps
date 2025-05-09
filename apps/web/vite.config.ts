/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'; // Temporarily removed
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import path from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/web',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [react(), /* nxViteTsPaths(), */ nxCopyAssetsPlugin(['*.md'])], // Temporarily removed nxViteTsPaths()
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ /* nxViteTsPaths() */ ], // Also remove here if it was active
  // },
  resolve: {
    alias: {
      '@finance-platform/shared': path.resolve(__dirname, '../../libs/shared/src/index.ts'),
      '@finance-platform/web-mocks': path.resolve(__dirname, '../../mocks/src/index.ts'),
      '@finance-platform/web-state': path.resolve(__dirname, '../../state/src/index.ts'),
      '@finance-platform/web-ui': path.resolve(__dirname, '../../ui/src/index.ts'),
    },
  },
  build: {
    outDir: '../../dist/apps/web',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['./src/vitest-setup.ts'],
  },
}));
