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
      plugins: []
    })
  }
)
