/**
 * 应用程序的入口文件
 */

const express = require('express');
const app = express();
const fs = require('fs');
const swig = require('swig');

//配置应用模版
//第一个参数是模版名称，也是模版文件的后缀；第二个参数是解析模版内容用到的方法
app.engine('html',swig.renderFile);
//设置模版文件存放目录
app.set('views','./views');
app.set('view engine','html');

//在开发过程中，需要取消模版缓存；否则仅修改模版，node会使用之前缓存的，导致浏览器访问不到
swig.setDefaults({
    cache : false
})

app.get('/',function(req,res,err){
    /**
     * 读取views目录下的指定文件
     * 第一个参数，表示模版的文件，相对于目录来的
     * 第二个参数，传递给模版的数据
     */
    res.render('index')
})

app.get('/main.css',function(req,res){
    res.setHeader('content-type',"text/css")
    res.send('body{background:red;}')
})

app.listen(8081)