const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app: './src/app.js',
        editor: './editor/main.js',
        'vendor': [
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
            './src/libs/smart-table/smart-table.js'
        ],
        'jqVenter': [
            'jquery',
            './bower_components/jquery-ui/jquery-ui.js',
            './bower_components/layer/dist/layer.js',
            './bower_components/jquery.cookie/jquery.cookie.js',
            './src/libs/bootstrap/dist/js/bootstrap.min.js',
            './src/libs/jquery.media.js'
        ]
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[hash].js'
    },
    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [{
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            minimize: true
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader",
                        options: {
                            minimize: true
                        }
                    },{
                        loader: 'less-loader'
                    }]
                })
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                query: {
                    minimize: true
                }
            },
            {
                test: /\.(png|jpg|gif|jpeg|eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader?name=images/[name].[ext]'
            },
        ]
    },
    externals: {
        'echarts': 'echarts'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.temp': {
                NODE_TEMP: +(new Date())
            }
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('../static/dll/vendor-manifest.json')
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('../static/dll/angularVendor-manifest.json')
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor','manifest'],
            minChunks: Infinity,
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html'),
            favicon: path.resolve(__dirname, '../src/favicon.ico')
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: [
                '/static/js/chart/echarts.min.js',
                '/static/dll/vendor.813e50006b1b29267fca.dll.js',
                '/static/dll/angularVendor.813e50006b1b29267fca.dll.js'
            ],
            append: false,
            hash: false
        }),
        new ExtractTextPlugin({
            filename: 'styles.[chunkhash].css',
        })

    ]
};