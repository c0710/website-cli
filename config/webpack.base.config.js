const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const root = path.resolve(__dirname, '..');
const entriesAndHtml = buildingEntriesAndHTML();
const isDev = process.env.NODE_ENV === 'development';

const base = {
	entry: {
		...entriesAndHtml.entries,
		jquery: 'jquery'
	},
	output: {
		filename: 'js/[name].js',
		path: root + '/dist',
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
                    isDev?'style-loader': {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        },
                    },
					'css-loader',
					'postcss-loader',
					'less-loader'
				]
			},
			{
				test: /\.(png|jpg|gif)$/,
				loader: 'url-loader',
                options: {
                    limit: 100,
                    name: 'img/[name].[hash:7].[ext]',
                }
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
    optimization: {
        splitChunks: {
            cacheGroups: { // 单独提取JS文件引入html
                aaa: { // 键值可以自定义
                    chunks: 'initial', //
                    name: 'jquery', // 入口的entry的key
                    enforce: true   // 强制
                }
            }
        }
    },
	plugins: [
		new webpack.ProvidePlugin({ //加载jq
			$: 'jquery',
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
			chunks: [outputfile, 'jquery']
		}))
	});
	return {
		entries,
		htmls
	}
}

console.log('-----------------------')
console.log(process.env.NODE_ENV)
console.log('-----------------------')
module.exports = base