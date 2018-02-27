const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  entry: {
    'nfeng-ui-jquery': './assets/entry.pc.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: 'js/[name].js',
    publicPath: path.resolve('/dist/')
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //     compress: {
    //         warnings: false
    //     }
    // }),
    new ExtractTextPlugin({
      filename: 'css/[name].css'
    }),
    // 下面三个是HMR的依赖插件
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [{
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
        options: {
          limit: 10000,
          // name: 'fonts/[name].[hash:7].[ext]'
          name: 'font/[name].[ext]'
        }
      },
      {
        test: /\.scss$/,
        loaders: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192',
        options: {
          limit: 10000,
          name: 'img/[name].[ext]'
        }
      }
    ]
  },
  devServer : {
    contentBase      : __dirname,
    compress         : true,
    port             : 3000,
    inline           : true,
    host             : '0.0.0.0',
    disableHostCheck : true
  }
}