demo最好在safari下执行，chrome会自动进行拦截

demo1访问地址

```js
* 弹框 ：  http://localhost:3000/?xss=<img src="0" onerror="alert(1)">

* 植入广告 ： http://localhost:3000/?xss=<iframe src="http://www.baidu.com">

```