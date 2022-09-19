import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths({
      root: '../..',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        format: 'umd',
        inlineDynamicImports: true,
      },
    },
  },
})
