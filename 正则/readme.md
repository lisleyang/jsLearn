### 问号的问题

问号?单独使用表示匹配前面一个表达式0次或者1次。等价于 {0,1}。

```javascript
'solo'.match(/o?l/)	;	// ['ol',index:1,input:'solo']
'salo'.match(/o?l/)		//['l',index:2,input:'salo'] 
```

但是如果问号紧跟在任何量词 *、 +、? 或 {} 的后面，将会使量词变为非贪婪的（匹配尽量少的字符）

很多情况下，非贪婪匹配和只写最小值效果是一样的，如?和{1}，{2,5}?和{2}

```javascript
let str = 'as357sda91';
let str1 = str.replace(/\d+/g,function(){
	console.log(arguments)
	return '哈'
})
console.log(str1) 	//as哈sda哈
let str2 = str.replace(/\d+?/g,function(){
	console.log(arguments)
	return '哈'
})
console.log(str2);	//as哈哈哈sda哈哈
```
```javascript
var regExp = /\d{2,5}/g;
var string = '123 1234 12345 123456';
console.log(string.match(regExp))//[123,1234,12345,123456]

var regExp = /\d{2,5}?/g;
var string = '123 1234 12345 123456';
console.log(string.match(regExp))//[12,12,34,12,34,12,34,56]


```

### 特殊字符

匹配所有合法字符 : /[^\\:*<>|"?\r\n]/

.英文句号 ： 表示[^\n\r\u2028\u2029] ，所有字符，除了 换行符，回车符，行分隔符和段分隔符





### 正则替换

##### 回调函数中的参数问题

  ```javascript
  var str = 'as357sda65';
  str.replace(/([a-zA-Z]+)(\d+)/g,function(){
  	console.log(arguments) 		
  	//Arguments(5) ["as357", "as", "357", 0, "as357sda65", callee: ƒ, Symbol(Symbol.iterator): ƒ]
  	//Arguments(5) ["sda65", "sda", "65", 5, "as357sda65", callee: ƒ, Symbol(Symbol.iterator): ƒ]
  	//arguments[0]是字符串中被匹配到的整个部分
  	//arguments[1-n]是括号中的被匹配到的某部分
  	//arguments[length-2]是整个被匹配到的部分在整个字符串中的位置
  	//arguments[length-1] 是整个字符串
  	return arguments[1]
  })
  ```

  ##### 回掉函数中的$1,$2

  $1就相当于arguments[1],$2就相当于arguments[2]

  ```javascript
'as357sda65'.replace(/([a-zA-Z]+)(\d+)/g,'$1')	//"assda"
  ```

  ### 关于"(?:x)","x(?=y)"和"y(?!y)"

  ```javascript
// (?:x)表示匹配x但是不记住x
'JackSpratABC'.replace(/(?:Jack)Sprat/,"$1")	//"$1ABC"s	 $1没有进行转化，说明没有$1
'JackSpratABC'.replace(/(?:Jack)(Sprat)/,"$1ss")	//"SpratssABC" 没有$2
'JackSpratABC'.replace(/Jack(Sprat)/,"$1ss")	//"SpratssABC"  和?:结果相同  说明主要是为了$1 $2的使用才加上
  ```

```javascript
x(?=y)表示匹配'x'仅仅当'x'后面跟着'y'.这种叫做正向肯定查找。
/Jack(?=Sprat)/.test('JackSprat')	//true
/Jack(?=Sprat)/.test('JackSpra')	//false
'JackSpratABC'.replace(/Jack(?=Sprat)/,'x')	//"xSpratABC"  只会被替换到前面的Jack
```
x(?!y)与x(?=y)相反
