## style-loader负责把css独立出来，默认放到header里面


## bundle与chunk的概念

A bundle is some related code packaged into a single file.

If you don't want all of your code be put into a single huge bundle you will split it into multiple bundles which are called chunks in webpack terminology. （CommonChunkPlugin）

## vendor的概念

Vendor 指第三方的库或者公共的基础组件

## runtime/manifest概念

在浏览器端，用以连接所有打包完以后的模块。

runtime是程序，manifest是数据

## Tree Shaking/scope-hoisting/code-spliting


Tree Shaking:删除多余的代码 https://doc.webpack-china.org/guides/tree-shaking/
scope-hoisting : 作用域提升，减少一部分代码 https://zhuanlan.zhihu.com/p/27980441
code-spliting : 防止重复引用模块。动态引入模块。https://webpack.js.org/guides/code-splitting/

## code-spliting

目的：

1. 把代码打成不同的包，按需加载或者至少并行加载；提升加载速度；
2. 为了不把一些公共代码打包到各个入口，减少体积

三种方法实现code-splitting：

1. 在entry手动分割入口
2. 使用`SplitChunks`来去重和分割代码
3. 动态导入：使用模块的内联函数


#### entryPoints手动分割

最简单，但有陷阱。

webpack4之前通过CommonsChunkPlugin；

废弃了 CommonsChunkPlugin，引入了 optimization.splitChunks 这个选项。optimization.splitChunks 默认是不用设置的。如果 mode 是 production，那 Webpack 4 就会开启 Code Splitting。默认 Webpack 4 只会对按需加载的代码做分割。如果我们需要配置初始加载的代码也加入到代码分割中，可以设置 splitChunks.chunks 为 'all'。


### webpack-dev-server 与 webpack-dev-middleware区别

都是会在源码变化后自动编译；

webpack-dev-server会自动刷新页面；webpack-dev-middleware不会



### webpack.dev.env.js

```javascript
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        app: "./src/index.js"
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "../dist")
    },
    //mode设置为development会增加两个Plugins 
    //new webpack.NamedModulesPlugin(),
    //new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        //contentBase写哪儿都行，因为有HtmlwebpackPlugins来把页面复制过去(同时把对应的静态文件页inject进去了)。没有HtmlwebpackPlugins的时候，就要放到有index.html的地方
        contentBase: path.join(__dirname, "../dist"), //建议使用绝对路径 it is recommended to use an absolute path.
        compress: false,
        port: 8000,
        //If webpack or webpack-dev-server are launched with the --hot option, this plugin(webpack.HotModuleReplacementPlugin) will be added automatically
        hot: true, //HMR(hot module replacement) devServer本身做的是liveReload  不是HMR
        hotOnly: true
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }, {
            test: /\.vue$/,
            use: ["vue-loader"]
        }]
    },
    plugins: [
        //mode 设置为development的时候自动添加NamedModulesPlugin
        //new webpack.NamedModulesPlugin(),
        //devServer.hot设置为true的时候自动添加HotModuleReplacementPlugin
        //new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: "Hot Module Replacement",
            filename: "index.html",
            template: "index.html",
            inject: true
        })
    ]
};

```


### webpack.prod.env.js

```javascript
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
//const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
    entry: {
        app: "./src/index.js"
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "../dist")
    },
    //mode设置为development会增加四个Plugins 
    //new UglifyJsPlugin(/* ... */),
    //new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
    //new webpack.optimize.ModuleConcatenationPlugin(),
    //new webpack.NoEmitOnErrorsPlugin()
    mode: "production",
    externals: {
        jquery: "jQuery", //key是webpack模块中引用的值import $ from 'jquery'  value是全局变量里的值 window.jQuery
    },
    module: {
        noParse: function(content) {
            //如果你 确定一个模块中没有其它新的依赖 就可以配置这项，webpack 将不再扫描这个文件中的依赖。打包速度会变快。
            //但是跟是不是把模块打进去没关系
            return /jquery|lodash/.test(content);
        },
        rules: [{
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }, {
            test: /\.vue$/,
            use: ["vue-loader"]
        }]
    },
    plugins: [
        new CleanWebpackPlugin(["dist"]),
        new HtmlWebpackPlugin({
            title: "Hot Module Replacement",
            filename: "index.html",
            template: "index.html",
            inject: true
        })
    ]
};

```