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

Typescript中使用async/await

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