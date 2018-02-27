let rm = require('rimraf');
let path = require('path');
let config = require('./config');
let webpack = require('webpack');
let webpackConfig = require('./webpack.prod.conf');

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err) throw err;
    webpack(webpackConfig, function (err, stats) {
        if (err) throw err;
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n');
    })
});