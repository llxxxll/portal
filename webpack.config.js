"use strict";
const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackEntries = {};
const jsEntries = glob.sync(
    '**/*.js',
    {
        cwd: path.join(__dirname, 'src', 'entry')
    }
);
jsEntries.forEach(entry => {
    let {base, dir, name} = path.parse(entry);
    webpackEntries[dir + name] = path.join(__dirname, 'src', 'entry', base);
});
// for common libs
jsEntries['common'] = ['jquery', ''];


// html webpack plugins
const htmlPlugins = [];
const htmlEntries = glob.sync(
    '**/*.html',
    {
        cwd: path.join(__dirname, 'src', 'view')
    }
);
htmlEntries.forEach(entry => {
    let {base, dir} = path.parse(entry);
    htmlPlugins.push(
        new HtmlWebpackPlugin({
            filename: path.join(__dirname, 'dist', 'view', dir, base),
            template: path.join(__dirname, 'src', 'view', dir, base),
            inject: false,
            chunks: [
                'common'
            ]
        })
    );
});


const config = {
    context: __dirname,
    entry: webpackEntries,
    output: {
        publicPath: path.resolve(__dirname, 'dist', 'js'),
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist', 'js')
    },
    module: {
        rules: [{
            test: /\.less$/,
            exclude: /node_modules/,
            loader: ExtractTextPlugin.extract({
                fallbackLoader: ['style-loader'],
                loader: ['css-loader', 'less-loader?importLoaders=1']
            })
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /(node_modules|bower_components)/
        }, {
            test: /\.(svg|eot|woff2|woff|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader'
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192&name=../images/[name].[ext]&publicPath=/dist/images/',
        }, {
            test: /\.html$/,
            loader: 'html-loader',
            query: {
                minimize: true
            }
        }]
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new ExtractTextPlugin({
            filename: '../css/[name].css',
            disable: false,
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common'
        }),
        ...htmlPlugins
    ]
};

module.exports = config;