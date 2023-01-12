const { merge } = require('webpack-merge')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (config, context) => {
  return merge(config, {
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    }
  })
}
