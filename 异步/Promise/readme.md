## 1. Promise是什么

Promise的提出，解决了异步函数回调地狱的问题，也更加符合开放封闭原则；

示例一：

```javascript
image.onload = function() {
      cb_success()
};

function cb_success(){
	console.log('success');
}

```
Promise形式

```javascript

function loadImg(src){
  let pr = new Promise((resolve,reject)=>{
      var img = document.createElement('img');
      img.onload = function(){
        resolve(img)
      }
      img.onerror = function(err){
        reject('加载失败')
      }
      img.src = src;
    }
  )

  return pr;
}

let pr = loadImg('https://www.baidu.com/img/superlogo_c4d7df0a003d3db9b65e9ef0fe6da1ec.png?where=super');

pr.then((img)=>{
  console.log(img.width)
  return img  //注意这儿必须return img，后面的then才能访问到
}).then((img)=>{
  console.log(img.height)
}).catch(err=>{
  console.log(err)
})

```

示例二：

```javascript
fs.readFile(fileA, 'utf-8', function (err, data) {
  fs.readFile(fileB, 'utf-8', function (err, data) {
    // ...
  });
});

```
Promise形式
```javascript
const fs = require('fs');

new Promise((resolve,reject)=>{
    fs.readFile('./index.html',(err,data)=>{
        resolve(data)
    })
}).then(res=>{
    console.log(res)

    //注意 这儿return的不是具体的内容 而是一个Promise
    //具体的内容是通过resolve返回的 但是能在下一个then里面直接拿到
    //因为Promise内部做了处理，如果返回值是Promise，则直接返回其resolve/reject的内容
    return new Promise((resolve,reject)=>{
        fs.readFile('./page.html',(err,data)=>{
            resolve(data)
        })
    })
}).then(res=>{
    console.log(res)  //resolve的data
})

```


## 2. Promise异常捕获

#### @1. 不止在reject的时候会进入catch。前面语法有报错，同样会自动进入catch进行捕获。

```js
const fs = require('fs');

new Promise((resolve,reject)=>{
    f11s.readFile('./index.html',(err,data)=>{ //f11s变量不存在，代码报错
        if(err){
            reject(err)
            return;
        }
        resolve(data)
    })
}).then(res=>{
    console.log(res)
}).catch(err=>{
    console.log(err)  //  直接进catch
})
```

```js
const fs = require('fs');

new Promise((resolve,reject)=>{
    fs.readFile('./in123dex.html',(err,data)=>{ //这个文件不存在
        ////这个时候进入回调函数的这部分
        if(err){
            //手动抛出异常也可以进入catch
            throw new Error(err);
            return;
        }
        resolve(data)
    })
}).then(res=>{
    console.log(res)
}).catch(err=>{
    console.log(err)  //前面throw new Error,所以直接进catch
})
```

#### @2 then里面写两个回调的写法在链式调用时，catch捕获异常容易出问题；所以一般在链式调用时推荐在最后写一次。

```js

let pr = new Promise(function(resolve,reject){
  reject(1)
})

pr.then(
  ()=>console.log('success 1'),
  ()=>console.log('error 1')
)
pr.then(
  ()=>console.log('success 2'),
  ()=>console.log('error 2')
)

//打印 error1 error2
```

```js

let pr = new Promise(function(resolve,reject){
  reject(1)
})

pr.then(
  ()=>console.log('success 1'),
  ()=>console.log('error 1')
).then(
  ()=>console.log('success 2'),
  ()=>console.log('error 2')
)

//打印 error1 success2
```

所以推荐写法：统一进行错误捕捉

```js

//链式调用
let pr1 = new Promise(function(resolve,reject){
  reject(1)
})

pr1.then(
  ()=>console.log('success 1')
).then(
  ()=>console.log('success 2')
).catch(err=>{
  console.log(err);
})
```




### 3. Promise链式调用

then函数必须返回Promise的实例。

首先，下面这段代码是可以执行的，因为**then方法默认返回一个Promise**,Promise就有then方法。想要传递参数需要return；

```javascript
new Promise((resolve, reject) => {
    resolve('li')
}).then((value) => {
  console.log(value)  //li
  return 'hello ' + value;
}).then(val=>{
	console.log(val)  //hello val
})
```

但Promise规范规定 `then回调函数return的应该是一个Promise`，所以可以这么写

```js
new Promise((resolve, reject) => {
    resolve('li')
}).then((value) => {
  console.log(value)  //li
  return  new Promise(resolve=>{
    resolve('hello ' + value);
  })
}).then(val=>{
	console.log(val)  //hello val
})

```

正常使用：

```js
const fs = require('fs');

new Promise((resolve,reject)=>{
    fs.readFile('./index.html',(err,data)=>{
        resolve(data)
    })
}).then(res=>{
    console.log(res)

    //注意 这儿return的不是具体的内容 而是一个Promise
    //具体的内容是通过resolve返回的 但是能在下一个then里面直接拿到
    //因为Promise内部做了处理，如果返回值是Promise，则直接返回其resolve/reject的内容
    return new Promise((resolve,reject)=>{
        fs.readFile('./page.html',(err,data)=>{
            resolve(data)
        })
    })
}).then(res=>{
    console.log(res)  //resolve的data
})

```

#### 4. Promise.all**

Promise.all的返回值默认是一个数组。在参数里的全部promise运行完成后执行。

```javascript
const p1 = getData({
        url: '/common/GetPassportName',
        method: 'get',
        params: {
            passportid: info.agentPassportID
        }
}).then(res => res)
.catch(e => alert('获取agentID失败'));

const p2 = getData({
    url: '/common/GetPassportName',
    method: 'get',
    params: {
        passportid: info.customerPassportID
    }
}).then(res => res)
.catch(e => alert('获取customerID失败'));

Promise.all([p1, p2])
.then(result => { //result是个数组，里面是各个Promise 的resolve结果
    return getData({
        url: 'http://api.im.fang.com/server/UserServiceInterface.api',
        method: 'get',
        params: {
            command: 'getMessage',
            from: result[0].data.Data,
            sendto: result[1].data.Data
        }
    })
})
.catch(e => alert('获取聊天记录失败'));
```

### 5. Promise.race**
与Promise.all相同，区别是只要有一个完成就算完成。

常见用法:
* 把异步操作和定时器放在一起
* 如果定时器先触发，就认定超时,告知用户

```javascript
let p1 = new Promise((resolve,reject)=>{
  console.log('this is p1')
  setTimeout(function(){
    resolve('aaa')
  },5000)
})
let p2 = new Promise((resolve,reject)=>{
  console.log('this is p2')
  setTimeout(function(){
    resolve('bbb')
  },2000)
})

Promise.race([p1,p2]).then(val=>{
  console.log(val)  //bbb
})
```


### 6. 在IE中使用Promise**
IE8,9,10,11均不原生支持Promise；IE Edge支持

解决方案： BlueBird/Promise Polyfill