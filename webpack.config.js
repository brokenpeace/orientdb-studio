const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require('path');
var babelPresets = ["es2015"];


module.exports = {
  entry: "./src/app.js",
  output: {
    path: __dirname + "./dist",
    filename: "bundle.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html"
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      _: "underscore",
      S: "string",
      "window.CodeMirror": "codemirror",
      CodeMirror: "codemirror"

    })
  ],
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loaders: ["babel-loader?" + babelPresets.map((preset) => `presets[]=${preset}`).join("&")]
      },
      {
        test: /.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.(eot|svg|ttf|gif|json|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
        loader: 'url-loader'
      },
      {
        test: /\.(jpg|svg|gif|png|json)$/,
        loader: "file-loader"
      },
      {
        test: /\.html$/,
        loader: 'ngtemplate-loader?relativeTo=' + (path.resolve(__dirname, './src')) + '/!html-loader'
      }
    ]
  },
  devtool: "source-map",
  devServer: {
    proxy: {
      '/api/*': {
        target: 'http://localhost:2480',
        pathRewrite: {"^/api": ""}
      }
    }
  }
};
