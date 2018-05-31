const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require("path");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const baseConf = require('./webpack.base.config');

module.exports = merge(baseConf, {
    devServer: {
        port: 7070,
        hot: true,
        inline: true,
        open: true,
        proxy: {
            '/api': {
                target: 'http://47.92.116.16:7070',
                secure: false
            }
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
});