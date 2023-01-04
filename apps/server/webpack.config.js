const { merge } = require('webpack-merge')

module.exports = (config, context) => {
  return merge(config, {
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
  })
}
