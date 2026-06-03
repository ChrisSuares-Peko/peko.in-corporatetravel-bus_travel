import path from 'path';

// import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@assets': path.resolve(__dirname, './src/assets'),
            '@store': path.resolve(__dirname, './src/store'),
            '@components': path.resolve(__dirname, './src/components'),
            '@customtypes': path.resolve(__dirname, './src/types'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@src': path.resolve(__dirname, './src'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
            '@routes': path.resolve(__dirname, './src/routes'),
            '@layouts': path.resolve(__dirname, './src/layouts'),
            '@domains': path.resolve(__dirname, './src/domains'),
        },
    },
    build: {
        modulePreload: true, // for enhancing performance for dynamically imported modules
    }
});
