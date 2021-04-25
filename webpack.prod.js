const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CompressionPlugin({
      test: /\.js$|\.jsx$|\.css$|\.html$|\.jpg$|\.png$|\.gif$|\.ico$|\.eot?.+$|\.otf?.+$|\.ttf?.+$|\.woff?.+$|\.woff2?.+$|\.svg?.+$/,
      threshold: 8192
    })
  ],
  performance: {
    maxAssetSize: 400000,
    maxEntrypointSize: 600000
  },
  node: {
    fs: 'empty'
  },
  output: {
    chunkFilename: '[name].[chunkhash:4].js',
    filename: '[name].[chunkhash:4].js'
  }
});
