import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import mdPlugin, { Mode } from 'vite-plugin-markdown'

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
      querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        rollupNodePolyFill(),
      ],
    },
  },
  plugins: [
    react(),
    viteTsConfigPaths({
      root: '../../',
    }),
    spaFallbackWithDot(),
    mdPlugin({ mode: [Mode.HTML, Mode.TOC, Mode.REACT] }),
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
          process: false,
          buffer: true,
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
    },
  }
}
