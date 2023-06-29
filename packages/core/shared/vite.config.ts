import { defineConfig } from 'vite'

import viteTsConfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'
import { join } from 'path'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import mdPlugin, { Mode } from 'vite-plugin-markdown'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/editor',
  assetsInclude: ['**/*.vrm', '**/*.svg'],
  plugins: [
    mdPlugin({ mode: [Mode.HTML, Mode.TOC, Mode.REACT] }),
    dts({
      entryRoot: 'src',
      tsConfigFilePath: join(__dirname, 'tsconfig.lib.json'),
      skipDiagnostics: true,
    }),
    react(),
    viteTsConfigPaths({
      root: '../../../',
    }),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  viteTsConfigPaths({
  //    root: '../../',
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: 'shared-core',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forgot to update your package.json as well.
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
      // External packages that should not be bundled into your library.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
})
