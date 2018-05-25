const webpack = require('webpack')
const library = '[name]_lib'
const path = require('path')

module.exports = {
    entry: {
        jqLibs: ['jquery', './bower_components/jquery-ui/jquery-ui.js', './bower_components/layer/dist/layer.js', './bower_components/jquery.cookie/jquery.cookie.js', './src/libs/bootstrap/dist/js/bootstrap.min.js'],
        angularLibs: [
            './bower_components/angular-animate/angular-animate.min.js', './src/libs/localService.js', './bower_components/oclazyload/dist/ocLazyLoad', './bower_components/angular-ui-sortable/sortable.js', './bower_components/angular-strap/dist/angular-strap.min.js', './bower_components/angular-strap/dist/angular-strap.tpl.min.js', './bower_components/ng-dialog/js/ngDialog.js', './bower_components/angular-file-upload/dist/angular-file-upload.min.js', './bower_components/angular-messages/angular-messages.min.js', './src/libs/smart-table/smart-table.js'
        ]
    },

    output: {
        filename: '[name].dll.js',
        path: './static/dll/',
        library
    },

    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, './static/dll/[name]-manifest.json'),
            name: library, // 这里的命名要遵循变量命名规范，它是最终的包变量名
        }),
        new webpack.optimize.UglifyJsPlugin({ 
            compress: {
              warnings: false
            }
          })
    ],
}