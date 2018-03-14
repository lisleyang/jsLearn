//axios.get返回的是一个Promise
//Promise对象有then方法
//await后面可以接Promise对象	返回的是这个Promise resolve的参数

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