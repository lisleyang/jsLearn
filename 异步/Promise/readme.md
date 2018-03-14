**Promise是什么**

Promise的本质我的理解，就是把回调函数换了个位置写；好处是可以解决多个异步函数嵌套的问题（回调地狱）。它不是新的语法功能，而是一种新的写法，**允许将回调函数的嵌套，改成链式调用**。

原来
```javascript
image.onload = function() {
      cb_success()
};

function cb_success(){
	console.log('success');
}

```

现在
```javascript
new Promise((resolve,reject)=>{
	image.onload = function(){
		resolve()
	}
}).then(()=>{
	console.log('success')
})

```

原来
```javascript
fs.readFile(fileA, 'utf-8', function (err, data) {
  fs.readFile(fileB, 'utf-8', function (err, data) {
    // ...
  });
});

```
现在
```javascript
var readFile = require('fs-readfile-promise');

readFile(fileA)
.then(function (data) {
  console.log(data.toString());
})
.then(function () {
  return readFile(fileB);
})
.then(function (data) {
  console.log(data.toString());
})
.catch(function (err) {
  console.log(err);
});

```

**Promise链式调用**

首先，下面这段代码是可以执行的，因为then方法返回一个Promise,Promise就有then方法。

但是这样没有办法在then中传递参数，也无法在then中进行异步操作

```javascript
new Promise((resolve, reject) => {
    resolve('111')
}).then((value) => {
	console.log(value)
}).then(val=>{
	console.log(678)
})

/*111
 678*/

```

如果想要传递参数，需要在then里面return一个Promise，这样会以return的Promise作为then的返回值

```javascript
new Promise((resolve, reject) => {
    resolve('111')
}).then((value) => {
	//只有new Promise的时候才会有resolve,reject,所以不能在此处resolve
	return new Promise((resolve,reject)=>{
		resolve(1)
	})
}).then(val=>{
	console.log(val)
})
```
```javascript
getJSON("/post/1.json").then(function(post) {
  return getJSON(post.commentURL);
}).then(function funcA(comments) {
  console.log("resolved: ", comments);
}, function funcB(err){
  console.log("rejected: ", err);
});
```

上面代码中，第一个then方法指定的回调函数，返回的是另一个Promise对象。这时，第二个then方法指定的回调函数，就会等待这个新的Promise对象状态发生变化。如果变为resolved，就调用funcA，如果状态变为rejected，就调用funcB。

**Promise报错**

```javascript
/*下面的代码并不会在浏览器抛出错误，而是会自动转到catch里面*/
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing().then(function() {
  console.log('everything is great');
}).catch(err=>{
	console.log('now err')
});
```
如果前面没有写catch，错误会自动进入到遇到的第一个catch

```javascript
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing().then(function() {
  console.log('everything is great');
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(222);
  });
}).then(val=>{
	console.log(val)
}).catch(err=>{
	console.log('now err')
});
```

**Promise.call**

```javascript
const p1 = getData({
        url: '/common/GetPassportName',
        method: 'get',
        params: {
            passportid: info.agentPassportID
        }
    }).then(res => res).catch(e => alert('获取agentID失败'));
    const p2 = getData({
        url: '/common/GetPassportName',
        method: 'get',
        params: {
            passportid: info.customerPassportID
        }
    }).then(res => res).catch(e => alert('获取customerID失败'));

    return Promise.all([p1, p2])
        .then(result => {
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
