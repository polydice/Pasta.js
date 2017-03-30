/* eslint-disable no-var */

const webpack = require('webpack');

module.exports = {
  entry: {
    pasta: __dirname + '/src/index.js',
  },
  output: {
    libraryTarget: 'umd',
    filename: '[name].js',
    chunkFilename: '[name].min.js',
    path: __dirname + '/dist',
    publicPath: '/dist/',
  },
  target: 'web',
  plugins: [
	 new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    })
  ],
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
}

