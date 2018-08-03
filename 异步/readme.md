
## 1. 什么是单线程，单线程和异步的关系？

* 单线程即只有一个线程，同一时间只能做一件事。
* js是单线程，是为了避免dom渲染的冲突。
* 单线程的解决方案是异步。

顺便提一句，不同的script标签中，前一个抛出错误，则前一个后续的代码都不执行；但不影响后一个script标签的执行

## 2. 为什么要避免dom渲染冲突？

* 浏览器需要渲染dom
* js可以修改dom结构
* js执行的时候，浏览器dom渲染会停止
* 两段js也不能同时执行
* webworker支持多线程，但不能访问dom

即html，css和js对dom的渲染不能同时执行。也可以说他们在同一个线程里面。

## 3. 异步的实现方式：`event loop`

* event loop 即事件轮询；
* 同步函数，直接执行；异步函数，先放在异步队列中（有延时的等延时结束后放到异步队列），`待同步函数执行完成后`，轮询执行`异步队列`的函数；

```javascript
$.ajax({
	url : 'xxxx',
	success : function(){
		console.log('000')
	}
})
setTimeout(function(){
	console.log(100)
},100)
setTimeout(function(){
	console.log(200)
})

console.log(300)
```

```js
//主进程
console.log(399)
```

```js
//异步队列

//立刻被放入
setTimeout(function(){
	console.log(200)
})

//延时100ms和ajax回调都可能先执行

//100ms以后被放入异步队列，在这期间一直在轮询
setTimeout(function(){
	console.log(100)
},100)

//ajax请求成功之后 放到异步队列中
$.ajax({
	url : 'xxxx',
	success : function(){
		console.log('000')
	}
})
```


## 4. 传统异步存在的问题

* 没按照书写的方式执行，可读性差
* callback中不容易模块化

** Promise符合开放封闭原则（对拓展开发，对修改封闭）**

## 5. Promise的前身 jQuery Deferred

```js
function waitHandler(){
	var dtd = $.Deferred(); //创建一个deferred对象

	var wait = function(dtd){
		setTimeout(function(){
			dtd.resolve(123)	//表示异步任务已完成
		},2000)

		return dtd	//dtd才有done/then方法
	}

	return wait(dtd);
}

waitHandler().done(function(res){
	console.log(res)	//123
})

```


## 6. 同一个功能，使用Promise，async/await,Generator不同的写法

Promise写法：

```javascript
const axios = require('axios');

axios.get('https://api.github.com/users/github')
.then(res=>{
	console.log(res.data)
}).catch(err=>{
	console.log(err)
})
```

async/await写法
```javascript
async  function getUser(){
	let res = await axios.get('https://api.github.com/users/github');
	console.log(res.data)
}

getUser()
```

Generator写法
```javascript
function *getUser(){
	let res = yield axios.get('https://api.github.com/users/github');
	console.log(res);
}

let func = getUser();
func.next().value.then(res=>{
	func.next(res.data)	//给getUser中的res赋值
})
```

## 7. Typescript中使用async/await

1. 将tsConfig.json中的compilerOptions.lib添加上es2015;
2. 写源代码
```typescript
class Test{
	constructor(){
		this.goTest()
	}

	async goTest(){
		let aaa = await this.getData();
		console.log(aaa);
	}

	getData(){
		return new Promise((resolve,reject)=>{
			setTimeout(() => {
				resolve(222)
			}, 3000);
		})
		
	}
}

new Test()

```
3. 编译
4. 添加promise-polyfill（Typescript会把async/await编译成Promise）