
process.env.NODE_ENV = '"production"';

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const base = require('./webpack.base.config');



module.exports = merge(base, {
   plugins: [
       ...base.plugins,
       new UglifyJSPlugin()
   ]
});