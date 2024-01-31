// // webpack.config.js
const { composePlugins, withNx } = require('@nx/webpack')
// Nx plugins for webpack.
module.exports = composePlugins(
  withNx({
    target: 'node',
  }),
  config => {
    config.devtool = 'source-map'
    return config
  }
)
