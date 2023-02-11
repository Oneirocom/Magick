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
    https: process.env.USESSL === 'true',
  },
  assetsInclude: ['**/*.vrm'],
  resolve: {
    alias: {
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
    react(),
    viteTsConfigPaths({
      root: '../../',
    }),
    spaFallbackWithDot()
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
/**
 * Vite doesn't handle fallback html with dot (.), see https://github.com/vitejs/vite/issues/2415
 * TODO: Review the PR in Vite
 * @returns {import('vite').Plugin}
 */
function spaFallbackWithDot() {
  return {
    name: 'spa-fallback-with-dot',
    configureServer(server) {
      return () => {
        server.middlewares.use(function customSpaFallback(req, res, next) {
          if (req.url.includes('.') && !req.url.endsWith('.html')) {
            req.url = '/index.html'
          }
          next()
        })
      }
    }
  }
}