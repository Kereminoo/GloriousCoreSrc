import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'src/electron-process/index.ts'),
                },
            },
        },
        optimizeDeps: {
            exclude: ['build_cmake/_deps', 'build_cmake_js/_deps']
        },
    },
    preload: {
        plugins: [externalizeDepsPlugin()],
        optimizeDeps: {
            exclude: ['build_cmake/_deps', 'build_cmake_js/_deps']
        },

    },
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer-process'),
            },
        },
        plugins: [react()],
        build: {
            outDir: 'out/renderer-process',
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'src/renderer-process/index.html'),
                },
            },
        },
        root: 'src/renderer-process/',
        optimizeDeps: {
            exclude: ['build_cmake/_deps', 'build_cmake_js/_deps']
        },
        server:
        {
            watch:
            {
                ignored: ['**/build_cmake_js/**']
            }
        }

    },
});
