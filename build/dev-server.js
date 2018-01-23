const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware')

const app = express();
const webpackConfig = require('./webpack.dev.conf.js');
const compiler = webpack(webpackConfig);

app.set('views', './view');
app.engine('art', require('express-art-template'));
app.use(express.static('.'));

app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath
}))

app.use(webpackHotMiddleware(compiler));

const router = require('../route');
app.use(router);

app.listen(3000);