// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                // ESTO ES LO IMPORTANTE:
                // Convierte "/api/pacientes" en "/pacientes" antes de mandarlo al back
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }   
    }
});