## bundle与chunk的概念

A bundle is some related code packaged into a single file.

If you don't want all of your code be put into a single huge bundle you will split it into multiple bundles which are called chunks in webpack terminology. 

## vendor的概念

Vendor 指第三方的库或者公共的基础组件

## Tree Shaking/scope-hoisting/code-spliting


Tree Shaking:删除多余的代码 https://doc.webpack-china.org/guides/tree-shaking/
scope-hoisting : 作用域提升，减少一部分代码 https://zhuanlan.zhihu.com/p/27980441
code-spliting : 防止重复引用模块。动态引入模块。https://webpack.js.org/guides/code-splitting/

### webpack-dev-server



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