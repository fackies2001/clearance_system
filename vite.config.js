import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
    server: {
        host: '127.0.0.1',
        port: 5173,
        https: {
            cert: fs.readFileSync('./127.0.0.1.pem'),
            key: fs.readFileSync('./127.0.0.1-key.pem'),
        },
    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
});