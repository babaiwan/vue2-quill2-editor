const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');


module.exports = {
    mode: 'development',
    entry: './dev/index.js', // 开发入口文件   本地调试 /dev/index.js  打包后  /src/index.js
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'VueQuill2Editor.js',
        library: 'VueQuill2Editor',
        libraryTarget: 'umd',
        umdNamedDefine: true,
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
            {
                test: /\.svg$/,
                use: 'file-loader',
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
