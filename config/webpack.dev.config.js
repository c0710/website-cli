const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config');

module.exports = merge(base, {
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 8000,
        hot: true
    },
    devtool: 'inline-source-map',

});