const webpack = require('webpack');
const webpackConfig = require('./webpack.dev.conf.js');

webpack(webpackConfig, function(err, stats) {
  console.log(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }))
});