## hybrid文字解释

* hybrid即“混合”，即前端和客户端的混合开发
* 需要前端开发人员和server端开发人员共同开发完成
* 某些环节也可能涉及到server端

## hybrid存在价值

* 可以快速迭代更新【关键】，无需app审核（app之所以需要审核，是因为可能会访问到系统深层的一些api（开启相机等等））
* 体验流畅（和native体验基本类似，肉眼基本看不出区别）
* 减少开发成本，两端通用

## 缺点

* 开发成本高。联调，测试，查bug都比较麻烦。
* 运维成本高。

## webview是什么

* 是app中的一个组件（app中可以有webview，也可以没有，需要承载页面的时候才有）
* 用于加载h5页面，即一个小型的浏览器内核

## file协议

* file协议，本地加载，快；http/https协议，网络加载，慢。所以为了保证速度，hybrid用的是file协议

## 使用场景

* 使用native：体验要求极致，变化不频繁（如头条的首页）（包括react native之类的技术）
* 使用hybrid：体验要求高，变化频繁（如头条的新闻页）
* 使用h5:体验无要求，不常用（如反馈，举报等页面）

## 具体实现

* 前端把页面做好，把文件交给客户端
* 客户端拿到前端静态页面，以文件的形式存储在app中
* 客户端在一个webview中，使用**file协议**加载文件

## hybrid更新流程

* 要替换每个客户端的静态文件
* 只能客户端来做
* 客户端去server下载最新的静态文件
* 我们维护server的静态文件

## 完整流程

* 分版本，有版本号，比如201801100001
* 将静态资源压缩成zip文件，上传到server端
* 客户端每次启动，都去server端检查版本
* 如果服务端版本号大于客户端版本号，下载最新的zip包
* 下载完成后解压，然后将现有文件覆盖

## 新闻详情页适用hybrid。前端如何获取新闻内容？

* 不能用ajax获取。一是速度慢，二是跨域（hybrid是file协议）
* 客户端获取新闻内容，然后与js通讯拿到内容，再渲染（因为js必须等页面加载完以后才开始走ajax请求，客户端则可以提前开始请求）

## js和客户端通讯的基本形式

* js访问客户端能力，传递参数和回调函数
* 客户端通过回调函数返回内容

## schema协议的简介和使用

* schema协议：前端和客户端通讯的约定


## 微信的部分schema协议

* weixin://sl/scan  //扫一扫
* weixin://sl/feedback  //反馈
* weixin://sl/moments   //朋友圈

## schema协议使用示例

```js
//演示代码
var iframe = document.createElement('iframe');
iframe.style.display = 'none';
iframe.src = "weixin://dl/scan";
var body = document.body||document.getElementByTagName('body')[0];
body.appendChild(iframe)

setTimeout(function(){
    body.removeChild(iframe);
    iframe = null;
})
```
```js
//如果加上参数和callback，就得这么写
window['weixin_scan_callback'] = function(result){
    alert(1)
}
//...省略,和上面相同
iframe.src = "weixin://dl/scan?k1=v1&k2=v2&k3=v3&callback=weixin_scan_callback"
```