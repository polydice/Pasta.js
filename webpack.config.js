/* eslint-disable no-var */

const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: process.env.NODE_ENV === 'production' ? {
    'pasta-full': __dirname + '/src/index-full.js',
  } : {
    'pasta': __dirname + '/src/index.js',
    'pasta-full': __dirname + '/src/index-full.js',
  },
  output: {
    filename: process.env.NODE_ENV === 'production' ? '[name].min.js' : '[name].js',
    library: 'Pasta',
    libraryTarget: 'umd',
    path: __dirname + '/dist',
    publicPath: '/dist/',
  },
  target: 'web',
  plugins: process.env.NODE_ENV === 'production' ? [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }),
  ]: [],
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
  resolve: {
    alias: {
      'PastaJs': path.join(__dirname, 'src'),
    },
  },
}

