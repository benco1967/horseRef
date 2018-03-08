const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


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
        include: [path.resolve(__dirname, "client"), path.resolve(__dirname, "node_modules")],
        loader: "style-loader!css-loader"
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, "client"),
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['ui']),
    new CopyWebpackPlugin([
      { from: './client/assets/*.png', to: 'assets/', flatten: true},
    ]),
    new HtmlWebpackPlugin({
      title: 'horseRef',
      favicon: './client/assets/favicon.ico',
      template: './client/index.html'
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'ui'),
  }
};