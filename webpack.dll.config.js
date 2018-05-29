const webpack = require('webpack')
const library = '[name]_lib'
const path = require('path')

module.exports = {
    entry: {
        jqLibs: [
            'jquery',
            './bower_components/jquery-ui/jquery-ui.js',
            './bower_components/layer/dist/layer.js',
            './bower_components/jquery.cookie/jquery.cookie.js',
            './src/libs/bootstrap/dist/js/bootstrap.min.js'
        ],
        angularLibs: [
            'angular',
            'angular-ui-router',
            './bower_components/angular-animate/angular-animate.min.js',
            './src/libs/localService.js',
            './bower_components/oclazyload/dist/ocLazyLoad',
            './bower_components/angular-ui-sortable/sortable.js',
            './bower_components/angular-strap/dist/angular-strap.min.js',
            './bower_components/angular-strap/dist/angular-strap.tpl.min.js',
            './bower_components/ng-dialog/js/ngDialog.js',
            './bower_components/angular-file-upload/dist/angular-file-upload.min.js',
            './bower_components/angular-messages/angular-messages.min.js',
            './src/libs/smart-table/smart-table.js'
        ],
        echart: ['./src/libs/chart/echarts.min.js']
    },

    output: {
        path: path.join(__dirname, '/static/dll'), // 生成的文件存放路径
        filename: '[name].dll.js', // 生成的文件名字(默认为vendor.dll.js)
        library: library  // 生成文件的映射关系，与下面DllPlugin中配置对应
    },

    plugins: [
        new webpack.DllPlugin({
            // 会生成一个json文件，里面是关于dll.js的一些配置信息
            path: path.join(__dirname, '/static/dll', '[name]-manifest.json'),
            name: library, // 与上面output中配置对应
            context: __dirname // 上下文环境路径（必填，为了与DllReferencePlugin存在与同一上下文中）
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
}