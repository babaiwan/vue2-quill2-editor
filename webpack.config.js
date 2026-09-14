const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// 通过 --mode 控制：
//   npm run build  -> production，以 src/index.js 为入口，产出可发布的库
//   npm run serve  -> development，以 dev/index.js 为入口，产出本地调试页面
module.exports = (env, argv) => {
    const mode = (argv && argv.mode) || 'development';
    const isProd = mode === 'production';

    return {
        mode,
        entry: isProd ? './src/index.js' : './dev/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.js',
            library: 'Vue2Quill2Editor',
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
                    // 注意：不能用 exclude: /node_modules/，因为 quill 2 的源码带有
                    // ES2022 的 class fields / static fields（如 static allowedChildren = [...]），
                    // 若原样打进产物，使用方 babel 较旧时会报 "Module parse failed"。
                    // 这里显式把 quill 纳入转译范围。
                    include: [
                        path.resolve(__dirname, 'src'),
                        path.resolve(__dirname, 'dev'),
                        path.resolve(__dirname, 'node_modules/quill'),
                        // highlight.js 也含较新的语法，一并转译以兼容旧版解析器
                        path.resolve(__dirname, 'node_modules/highlight.js'),
                    ],
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
            // 仅在本地调试时生成 html，发布产物不需要
            ...(isProd ? [] : [
                new HtmlWebpackPlugin({
                    template: './dev/index.html',
                    inject: true,
                })
            ]),
            new VueLoaderPlugin(),
        ],
    };
};
