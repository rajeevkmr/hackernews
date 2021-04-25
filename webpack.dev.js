const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'public/'),
    port: process.env.PORT || 3000,
    https: process.env.SSL === 'true',
    hot: true,
    open: true,
    historyApiFallback: true,
    publicPath: '/'
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new ErrorOverlayPlugin(), new FriendlyErrorsWebpackPlugin()]
});
