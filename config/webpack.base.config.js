const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const root = path.resolve(__dirname, '..');
const entriesAndHtml = buildingEntriesAndHTML();

const base = {
    entry: entriesAndHtml.entries,
    output: {
        filename: '[name].js',
        path: root + '/dist'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                },
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.css$/,
                use: [
                    'css-hot-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                use: {
                    loader: 'less-loader'
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'file-loader'
                }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader', // base64
                    options: {
                        limit: 8192
                    }
                }]
            },
            {
                test: '/\.html$/',
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            interpolate: 'require'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({ //加载jq
            $: 'jquery'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        ...entriesAndHtml.htmls
    ]
};


function buildingEntriesAndHTML() {
    const result = glob.sync('src/pages/**/*.js');  // 每个page下的index入口文件
    const config = {
        hash: true,
        inject: true
    }
    const entries = {};
    const htmls = [];
    result.forEach(item => {
        const pathObj = path.parse(item);
        entries[pathObj.dir.split('/').slice(-1)[0]] = './' + item; // 构建entry
        htmls.push(new HtmlWebpackPlugin({
            ...config,
            template: `./${pathObj.dir}/index.html`,
            chunks: [item]
        }))
    });
    return {
        entries,
        htmls
    }
}

module.exports = base