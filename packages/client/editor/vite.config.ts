import { defineConfig } from 'vite'

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import dts from 'vite-plugin-dts'
import { join } from 'path'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import mdPlugin, { Mode } from 'vite-plugin-markdown'

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/editor',
  assetsInclude: ['**/*.svg'],
  plugins: [
    dts({
      entryRoot: 'src',
      tsConfigFilePath: join(__dirname, 'tsconfig.lib.json'),
      skipDiagnostics: true,
    }),
    react(),
    nxViteTsPaths(),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  viteTsConfigPaths({
  //    root: '../../../',
  //  }),
  // },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    outDir: '../../../dist/packages/client/editor',
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: 'editor',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forgot to update your package.json as well.
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
      // External packages that should not be bundled into your library.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
})
