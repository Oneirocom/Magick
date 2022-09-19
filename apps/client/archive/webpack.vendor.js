var webpack = require('webpack')
const path = require('path')
module.exports = {
  mode: 'development',
  entry: {
    vendor: [
      'lodash',
      'react',
      '@material-ui/core',
      '@mui/material',
      '@reduxjs/toolkit',
      'redux',
      '@feathersjs/client',
      'sharedb',
      'react-dom',
      '@psychedelic/dab-js',
      'flexlayout-react',
      'jodit-react',
      'react-icons',
    ],
  },
  output: {
    filename: 'vendor.bundle.js',
    path: path.join(__dirname, 'build'),
    library: 'vendor_lib',
  },
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
    },
  },
  plugins: [
    new webpack.DllPlugin({
      name: 'vendor_lib',
      path: path.join(__dirname, 'build', 'vendor-manifest.json'),
    }),
  ],
}
