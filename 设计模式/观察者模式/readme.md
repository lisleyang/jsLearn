观察者模式的概念

1. 发布/订阅。（状态变化以后，直接触发）
2. 一对一/一对多

所以也叫发布/订阅模式；

异步操作都是观察者模式

## 场景1 ： 网页事件绑定

他们都订阅了点击事件，用户点击以后（状态变化），直接触发时间

```html
<button id="btn"></button>
```
```js
$("#btn").click(function(){
    console.log(1)
})
$("#btn").click(function(){
    console.log(2)
})
$("#btn").click(function(){
    console.log(3)
})

```

## 场景2 ： Promise

then方法对返回结果进行了订阅

```js
let src = 'https://www.baidu.com/img/bd_logo1.png';

loadImg(src).then(img=>{
    console.log(img.width)
    return img
}).then(img=>{
    console.log(img.height)
})
```

## nodejs自定义事件

```node
const EventEmitter = require('events').EventEmitter;
const emitter1 = new EventEmitter();

emitter1.on('some',function(){
    console.log('sth isoccured 1')
})

emitter1.on('some',function(){
    console.log('sth isoccured 1')
})

emitter1.emit('some')


```