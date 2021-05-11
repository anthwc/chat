//webpack.config.js
const path = require('path');//引入path 模块
const Webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');//引入html模板模块
const {VueLoaderPlugin} = require('vue-loader'); // 解析vue文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 样式分离打包
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); // 清理出口文件
// const CssCleanupPlugin = require('css-cleanup-webpack-plugin'); // 删除未使用的css 有问题
let title = 'Document';
// let Ip = require('ip').address();
// let Ip = '192.168.8.169';
let Ip = '192.168.18.141';
let Port = 9999;
let buildSocketUrl = Ip;
const BASE_API = process.env.NODE_ENV === 'development' ? 'http://'+Ip+'/thinkphp5/' : 'http://'+Ip+'/thinkphp5/'; //api地址
const BASE_SOCKET = process.env.NODE_ENV === 'development' ? Ip+':2346' : buildSocketUrl+':2346'; //socket地址

module.exports = {
    mode: process.env.NODE_ENV,//webpack4判断是生产环境还是开发环境
    entry: [
        path.resolve(__dirname, "../src/index.js")
    ],//入口文件
    output: {
        path: path.resolve(__dirname, process.env.NODE_ENV === 'development' ? '../test' : '../dist'),//打包输出的文件目录
        filename: "js/[name].[hash].js"//输出的文件名
    },
    resolve: {
        alias:{
            'vue$':'vue/dist/vue.esm.js',//配置别名 确保webpack可以找到.vue文件
            '@': path.resolve(__dirname, '../src')
        },
        extensions: ['.js', '.jsx','.json','.vue']
    },
    devServer: {
        // contentBase: path.resolve(__dirname, "../src"),
        contentBase: path.resolve(__dirname, '../test'),
        compress: true,
        port: Port,
        host : Ip,
        disableHostCheck: true
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader'],
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    process.env.NODE_ENV === 'development' ? 'style-loader' : {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                            modules: true,
                            getLocalIdent: (context, localIdentName, localName, options) => {
                                return localName
                            },
                            publicPath: '../'
                        },
                    },
                    'css-loader',
                    'sass-loader',

                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            config: {
                                // path: './postcss.config.js'
                            }
                        }
                    },
                ]
            },
            {
                test: /\.(gif|jpg|png|bmp|ico)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 100,
                        name: 'assets/images/[name].[ext]'
                    }
                }]
            },
            {
                test: /\.(eot|ttf|woff|woff2|svg|mp4)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 100,
                        name: 'assets/font/[name].[ext]'
                    }
                }]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        // new CssCleanupPlugin(), // 不能用
        new htmlWebpackPlugin({
            title: title,
            template: './src/html/index.html',
            favicon : './src/html/logo.jpg',
            hash: true,
            chunksSortMode: 'none',
        }),
        new VueLoaderPlugin(),
        new Webpack.HotModuleReplacementPlugin(),
        new Webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 5
        }),
        new MiniCssExtractPlugin({
            filename: './style/[name].min.css',
            chunkFilename: './style/[id].min.css',
        }),
        new Webpack.DefinePlugin({
            'BASE_API': JSON.stringify(BASE_API),
            'BASE_SOCKET': JSON.stringify(BASE_SOCKET),
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ]
};