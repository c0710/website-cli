const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const root = path.resolve(__dirname, '..');




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
    })
    return {
        entries,
        htmls
    }
}