import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from "@vitejs/plugin-react";

export default defineConfig({
    server: {
        hmr: {
            host: 'docker.local',
        }
    },
    plugins: [
        react(),
        laravel({
            input: ['resources/css/app.scss', 'resources/js/index.tsx'],
            refresh: true,
        }),
    ],
   css: {
       postcss: 'resources/js/postcss.config.js'
    },
});
