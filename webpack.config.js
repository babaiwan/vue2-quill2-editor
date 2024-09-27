const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');


module.exports = {
    mode: 'development',
    entry: './dev/main.js', // 开发入口文件
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js', // 使用完整版 Vue 以支持模板编译
        },
        extensions: ['*', '.js', '.vue', '.json'],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'), // 指定静态文件目录
        },
        compress: true,
        port: 8080,
        hot: true, // 启用热重载
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './dev/index.html',
            inject: true,
        }),
        new VueLoaderPlugin(),
    ],
};
