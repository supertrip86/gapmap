const path = require('path');

module.exports = {

  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js'
  },
  
  resolve: {
    alias: {
      jquery: "jquery/dist/jquery.slim.js",
    }
  },

  devtool: 'source-map',

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
        loader: 'style-loader!css-loader'
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