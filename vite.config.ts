import path from 'node:path';
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname = path.dirname(fileURLToPath(import.meta.url));
// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
// eslint-disable-next-line node/prefer-global/process
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig({
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  plugins: [react()],
  cacheDir: './.cache',
  resolve: {
    tsconfigPaths: true,
  },
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
    hmr: host
      ? {
          host,
          port: 1421,
          protocol: 'ws',
        }
      : undefined,
  },
  test: {
    projects: [
      {
        extends: true,
        cacheDir: './.cache/unit-tests',
        resolve: {
          tsconfigPaths: true,
        },
        test: {
          name: 'unit',
          environment: 'node',
          include: ['**/*.{test,spec}.ts'],
          exclude: ['**/node_modules/**', '**/.git/**', './.next/**', './cache/**'],
        },
      },
      {
        extends: true,
        cacheDir: './.cache/sb-tests',
        resolve: {
          tsconfigPaths: true,
        },
        plugins: [
        // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            disableAddonDocs: true,
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          setupFiles: ['./vitest.storybook.setup.mjs'],
          exclude: ['**/node_modules/**', '**/.git/**', './.next/**', './cache/**'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
