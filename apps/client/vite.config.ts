import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

export default defineConfig({
  server: {
    port: 4200,
    host: 'localhost',
  },
  assetsInclude: ['**/*.vrm'],
  resolve: {
    alias: {
      stream: './node_modules/stream-browserify/index.js',
      url: 'rollup-plugin-node-polyfills/polyfills/url',
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        rollupNodePolyFill({
          
        }),
      ],
    },
  },
  plugins: [
    react(),    viteTsConfigPaths({
      root: '../../',
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: false
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  viteTsConfigPaths({
  //    root: '../../',
  //  }),
  // },
})
