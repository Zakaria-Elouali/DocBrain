import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
    const isDevelopment = mode === 'development';

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
                components: resolve(__dirname, './src/components'),
                utils: resolve(__dirname, './src/components/ui/lib/utils'),
                ui: resolve(__dirname, './src/components/ui'),
                lib: resolve(__dirname, './src/components/ui/lib'),
                hooks: resolve(__dirname, './src/components/Hooks'),
            },
        },
        server: {
            port: 3000,
            open: false,
            hmr: {
                // Optimize HMR for better performance
                overlay: false, // Disable the error overlay
            },
            watch: {
                usePolling: false, // Disable polling for better performance
                interval: 1000, // Check for changes less frequently
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    quietDeps: true, // Suppress deprecation warnings
                    includePaths: ['node_modules'], // Help resolve imports from node_modules
                    outputStyle: 'compressed', // Minify CSS output
                    sourceMap: false, // Disable source maps for better performance
                },
            },
            // Optimize CSS processing
            devSourcemap: false, // Disable source maps in development for better performance
        },
        // Optimize build process
        build: {
            // Optimize chunk size
            chunkSizeWarningLimit: 1000, // Increase the warning limit
            cssCodeSplit: false, // Generate a single CSS file
            rollupOptions: {
                output: {
                    manualChunks: {
                        // Split vendor code into separate chunks
                        'vendor-react': ['react', 'react-dom'],
                        'vendor-redux': ['redux', 'react-redux', 'redux-saga', 'redux-persist'],
                        'vendor-ui': ['bootstrap', 'reactstrap', 'react-toastify'],
                    },
                    assetFileNames: (assetInfo) => {
                        // Place CSS in a separate directory
                        const info = assetInfo.name || '';
                        if (info.endsWith('.css')) {
                            return 'assets/css/[name]-[hash][extname]';
                        }
                        return 'assets/[name]-[hash][extname]';
                    },
                },
                treeshake: true, // Enable tree shaking
            },
            // Optimize minification
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: !isDevelopment, // Remove console logs in production
                    drop_debugger: !isDevelopment, // Remove debugger statements in production
                    passes: 2, // Multiple passes for better minification
                },
            },
            reportCompressedSize: false, // Skip calculating compressed size for faster builds
        },
        // Optimize dependency optimization
        optimizeDeps: {
            include: [
                'react',
                'react-dom',
                'redux',
                'react-redux',
                'redux-saga',
                'redux-persist',
                'bootstrap',
                'reactstrap',
                'react-toastify'
            ],
            esbuildOptions: {
                target: 'es2020', // Optimize for modern browsers
                treeShaking: true, // Enable tree shaking
                legalComments: 'none', // Remove comments
            },
            force: false, // Only optimize when needed
        },
    };
});