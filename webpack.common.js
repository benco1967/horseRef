const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './client/index.js',
  },
  module: {
    rules: [
      {
        test: /(\.js|\.jsx)$/,
        include: path.resolve(__dirname, "client"),
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "client"),
        loader: "style-loader!css-loader"
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['ui']),
    new HtmlWebpackPlugin({
      title: 'horseRef',
      favicon: './client/assets/favicon.ico',
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'ui'),
  }
};