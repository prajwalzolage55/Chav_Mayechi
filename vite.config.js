import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    // Static assets in the 'public' folder are copied as-is to dist/
    // We use the project root's images directory via a symlink or copy.
    // Vite serves files from 'public/' as static assets at root level.
    publicDir: 'public',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                products: resolve(__dirname, 'products.html'),
                order: resolve(__dirname, 'order.html'),
                dashboard: resolve(__dirname, 'dashboard.html'),
                admin: resolve(__dirname, 'admin.html'),
                login: resolve(__dirname, 'login.html'),
                register: resolve(__dirname, 'register.html')
            }
        }
    }
});
