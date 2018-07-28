const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const root = path.resolve(__dirname, '../')
const src = path.join(root, '/src')


const baseConf = {

}
console.log(1)
glob("js/*.js",function (er, files) {
    console.log(files)
})
