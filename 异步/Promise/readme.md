**一. Promise是什么**

Promise的本质，就是把回调函数换了个位置写；好处是可以解决多个异步函数嵌套的问题（回调地狱）。它不是新的语法功能，而是一种新的写法，**允许将回调函数的嵌套，改成链式调用**。

```javascript
new Promise(function(resolve,reject){

}).then(()=>{},()=>{})
```

* Promise里面的这个函数叫做执行器
* 通过引入一个回调，避免更多的回调
* Promise实例一经创建，里面的函数立刻执行

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
new Promise(
  (resolve,reject)=>{
    image.onload = function(){
      resolve()
    }
  }
).then(()=>{
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

**二. Promise链式调用**

首先，下面这段代码是可以执行的，因为**then方法默认返回一个Promise**,Promise就有then方法。想要传递参数需要return（new Promise中不使用reject/resolve无法进入then，但是then中不使用return也可以进入下一个then）;

```javascript
new Promise((resolve, reject) => {
    resolve('li')
}).then((value) => {
  console.log(value)
  return 'hello ' + value;
}).then(val=>{
	console.log(val)  //hello val
})

```

但是直接return无法使用异步（因为是立刻return的）；如下为**错误代码**

```javascript
new Promise((resolve, reject) => {
    resolve('li')
}).then((value) => {
  console.log(value)
  setTimeout(function(){
    return 'hello ' + value;
  },200)
  
}).then(val=>{
	console.log(val)  //这儿返回undefined
})
```

如果想要异步传递参数，需要在then里面return一个Promise，这样会以return的Promise作为then的返回值

```javascript
new Promise((resolve, reject) => {
  console.log('starting');
  setTimeout(()=>{
    resolve('111')
  },1000)
}).then((value) => {
	//只有new Promise的时候才会有resolve,reject,所以不能在此处resolve
  console.log('first')
  console.log(value)
	return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve(1)
    },2000)
		
	})
}).then(val=>{
  console.log('second')
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

**三. Promise已完成的情况**

如果then的时候，Promise已经是fullfill的状态，会如何？

会继续执行，因为promise的状态已经变成fulfilled

```javascript
var promise = new Promise((resolve,reject)=>{
  setTimeout(function(){
    resolve('hello');
  },1000)
})

setTimeout(function(){
  promise.then(function(val){
    console.log(val);   //hello
  })
},3000)

```

**四. Promise报错**

Promise会自动捕获内部异常，并交给rejected响应函数处理。rejected响应函数有两种写法：
```javascript
//第一种
new Promise((resolve,reject)=>{

}).then(function(){

},function(){

})

//第二种
new Promise((resolve,reject)=>{

}).then(function(){

}).catch(function()){

}

```
推荐使用第二种，可以捕获前面所有的错误。
```javascript
//下面两种都可以捕获到
new Promise((resolve,reject)=>{
    throw new Error('bye');
}).then(value=>{
  console.log(value)
}).catch(error=>{
  console.log('Error');
})

new Promise((resolve,reject)=>{
  resolve('hello');
}).then(value=>{
  console.log(value);
  return new Promise(function(resolve,reject){
      throw new Error('bye');
  })
}).catch(error=>{
  console.log('Error'+error.message);
})
```
但是异步的报错是捕获不到的,除非在错误那里reject；
```javascript
//"下面只会报错，不会输出“Error”这几个字
new Promise((resolve,reject)=>{
  setTimeout(function(){
    throw new Error('bye');
  },2000)
}).then(value=>{
  console.log(value)
}).catch(error=>{
  console.log('Error');
})

//下面会输出“Error”这几个字
new Promise((resolve,reject)=>{
  setTimeout(function(){
    reject(new Error('bye'));
  },2000)
}).then(value=>{
  console.log(value)
}).catch(error=>{
  console.log('Error');
})

```
axios在catch中是可以捕获到异步操作里面的error的，axios做了封装
```javascript
axios.get('/notExistPath')
	  .then(function (response) {
	    console.log(response);
	  })
	  .catch(function (error) {
	    console.log(error.message);
	  });

```
同步操作中的error可以直接进catch
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
//'now error'
```
```javascript
new Promise((resolve,reject)=>{
  setTimeout(()=>{
    throw new Error('bye');
  },2000)
  //没有resolve，也没有reject，因此不会立刻进入then/catch里面
}).then(value=>{
  console.log(value)
}).catch(error=>{
  console.log('Error'+error.message);
})

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

**五. Promise.all**

Promise.all的返回值默认是一个数组。

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
**六. Promise.resolve**
返回一个fulfilled的Promise实例，或一个原始的Promise实例

* 参数为空,返回一个状态为fulfilled的Promise实例
* 参数是一个与Promise无关的值,同上，不过fullfilled响应函数会得到这个参数
* 参数是Promise实例，就直接返回这个实例，不做任何修改
* 参数是thenable,立即执行他的.then函数

```javascript
Promise.resolve().then((val)=>{
  console.log(val)    //undefined
  return Promise.resolve('Hello')
}).then(val=>{
    console.log(val)  //hello

    return Promise.resolve(
        new Promise((resolve,reject)=>{
          setTimeout(function(){
            resolve('Hello')
          },2000)
        }
    )
  )
})
.then(val=>{
  console.log(val)  //2秒后“Hello”
  return Promise.resolve({
    then(){
      console.log('then') //立即输出'then'
    }
  })
})

```

**七. Promise.race**
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

**八. Promise的其他应用场景**
```javascript
//弹出窗体
class Confirm {
  constructor(){
    this.promise = new Promise((resolve,reject)=>{
      //用户的操作是异步的
      this.confirmBtn.onClick = resolve;
      this.cancelBtn.onClick = reject;
    })

    this.promise.then(()=>{
      //do confirm staff
    }).catch(()=>{
      //do cancel staff
    })
  }
}

```

**九. 在IE中使用Promise**
IE8,9,10,11均不原生支持Promise；IE Edge支持

解决方案： BlueBird/Promise Polyfill