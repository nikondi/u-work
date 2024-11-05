import {defineConfig} from 'vite';
import laravel from 'laravel-vite-plugin';
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    laravel({
      input: ['resources/css/app.scss', 'resources/js/index.tsx', 'resources/js/app.tsx'],
      refresh: true,
    }),
  ],
  css: {
    postcss: 'resources/js/postcss.config.js'
  },
});
