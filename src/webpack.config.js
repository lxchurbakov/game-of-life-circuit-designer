const path = require('path')

module.exports = {
  context: __dirname,
  entry: './index.js',

  output: {
    path: path.resolve(__dirname, '../pages'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      { test: /\.js/, loader: 'babel-loader' },
      { test: /\.html$/, loader: 'file-loader?name=[name].html' },
    ],
  },
}