process.env.NODE_ENV = '"development"';

const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const base = require('./webpack.base.config');

module.exports = merge(base, {
    devServer: {
        contentBase: path.resolve(__dirname, "../dist"),
        compress: true,
        port: 8000,
        hot: true
    },
    devtool: 'inline-source-map',
    plugins: [
        ...base.plugins,
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
});