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
        filename: 'js/[name].js',
        path: root + '/dist',
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
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
                use: [
                    'css-hot-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader?limit=8192&name=images/[name].[hash:8].[ext]'
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
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash:8].css',
            chunkFilename: '[id].css',
            publicPath: '../'
        }),
        ...entriesAndHtml.htmls
    ],
    resolve: {
        extensions: [".js", ".json", ".jsx", ".css"]
    },
};


function buildingEntriesAndHTML() {
    const result = glob.sync('src/pages/**/*.js');  // 每个page下的index入口文件
    const config = {
        hash: true,
        inject: true
    };
    const entries = {};
    const htmls = [];
    result.forEach(item => {
        const pathObj = path.parse(item);
        const outputfile = pathObj.dir.split("/").slice(-1)[0];
        entries[outputfile] = './' + item; // 构建entry
        htmls.push(new HtmlWebpackPlugin({
            ...config,
            filename: outputfile === "home" ? "./index.html" : "./" + outputfile + "/index.html", // 输出html文件的路径
            template: `./${pathObj.dir}/index.html`,
            chunks: [outputfile]
        }))
    });
    return {
        entries,
        htmls
    }
}

module.exports = base