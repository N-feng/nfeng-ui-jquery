let config = require('./config');
let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    entry: {
        'nfeng-ui-jquery': './assets/entry.pc.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: 'js/[name].js',
        publicPath: '/nfeng-ui-jquery/dist/'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
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
    }
};