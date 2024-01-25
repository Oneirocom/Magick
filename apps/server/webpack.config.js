const CopyPlugin = require('copy-webpack-plugin')
const { merge } = require('webpack-merge')
const { composePlugins, withNx } = require('@nx/webpack')

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx({
    target: 'node'
  }),
  (config) => {
    return merge(config, {
      experiments: {
        topLevelAwait: true
      },

      module: {
        rules: [
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader']
          }
        ]
      },
      plugins: [
        // Copy files pyodide.js will load asynchronously
        new CopyPlugin({
          patterns: [
            {
              from: require.resolve('pyodide/repodata.json'),
              to: 'repodata.json'
            },
            {
              from: require.resolve('pyodide/pyodide_py.tar'),
              to: 'pyodide_py.tar'
            },
            {
              from: require.resolve('pyodide/pyodide.asm.data'),
              to: 'pyodide.asm.data'
            },
            {
              from: require.resolve('pyodide/pyodide.asm.js'),
              to: 'pyodide.asm.js'
            },
            {
              from: require.resolve('pyodide/pyodide.asm.wasm'),
              to: 'pyodide.asm.wasm'
            }
          ]
        })
      ]
    })
  }
)
