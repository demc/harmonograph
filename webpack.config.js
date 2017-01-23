var path = require('path');

const config = {
  entry: {
    '1d': './1d',
    '2d': './2d'
  },
  output: {
    path: __dirname,
    filename: '[name].bundle.js'
  },
  module: {
    // rules: [
    //   {test: /\.(js|jsx)$/, use: 'babel-loader'}
    // ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};

module.exports = config;
