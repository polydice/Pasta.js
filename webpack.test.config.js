/* eslint-disable no-var */

const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
  resolve: {
    alias: {
      'Pasta.js': path.join(__dirname, 'src'),
    },
  },
}

