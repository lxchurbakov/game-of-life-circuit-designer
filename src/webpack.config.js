const path = require('path')

module.exports = {
  context: __dirname,
  entry: './index.ts',

  output: {
    path: path.resolve(__dirname, '../docs'),
    filename: 'bundle.js',
  },

  resolve: {
    extensions: [
      '.ts', '.js', '.tsx', '.json'
    ],
  },

  module: {
    rules: [
      { test: /\.ts/, loader: 'ts-loader' },
      { test: /\.js/, loader: 'babel-loader' },
      { test: /\.html$/, loader: 'file-loader?name=[name].html' },
    ],
  },
}