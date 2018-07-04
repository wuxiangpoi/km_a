var path = require("path");
var webpack = require("webpack");
var CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    // 你想要打包的模块的数组
    entry: {
        vendor: [
            'jquery',
            './bower_components/jquery-ui/jquery-ui.js',
            './bower_components/jquery.cookie/jquery.cookie.js'
        ],
        angularVendor: [
            'angular',
            'angular-ui-router',
            './bower_components/angular-animate/angular-animate.min.js',
            './src/libs/bindonce.js',
            './src/libs/localService.js',
            './bower_components/oclazyload/dist/ocLazyLoad',
            './bower_components/angular-ui-sortable/sortable.js',
            './bower_components/angular-strap/dist/angular-strap.min.js',
            './bower_components/angular-strap/dist/angular-strap.tpl.min.js',
            './bower_components/ng-dialog/js/ngDialog.js',
            './bower_components/angular-toastr/dist/angular-toastr.tpls.min.js',
            './bower_components/angular-file-upload/dist/angular-file-upload.min.js',
            './bower_components/angular-messages/angular-messages.min.js',
            './src/libs/angular-slider/angular-slider.min.js',
            './src/libs/smart-table/smart-table.js'
        ]
    },
    output: {
        path: path.join(__dirname, '../static/dll'), 
        filename: '[name].[hash].dll.js',
        library: '[name]_library'
    },
    plugins: [
        new CleanWebpackPlugin(path.resolve(__dirname, '../static/dll'), {
            root: path.resolve(__dirname, '../'),
            verbose: true
        }),
        new webpack.DllPlugin({
            path: path.join(__dirname, '../static/dll', '[name]-manifest.json'),
            name: '[name]_library',
            context: __dirname
        }),
        // 压缩打包的文件，与该文章主线无关
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};