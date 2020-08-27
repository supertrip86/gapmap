const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {

  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js'
  },

  devtool: 'source-map',

  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin()
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/bundle.css"
    })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          "presets": [
            [
              "@babel/preset-env",
              {
                "targets": {
                  "esmodules": true
                }
              }
            ]
          ]
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },
      {
        test: /\.hbs$/,
        use: [
          {
            loader: "handlebars-loader",
            options: {
              helperDirs: path.resolve(__dirname, "./src/hbs/helpers"),
              partialDirs: path.join(__dirname, 'src/hbs/partials')
            }
          }
        ]
      }
    ]
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    watchContentBase: true,
    historyApiFallback: true
  }

};