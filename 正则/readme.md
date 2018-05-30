正则表达式是匹配模式，要么匹配字符，要么匹配位置。

# 第一章. 字符匹配

## 1.1 模糊匹配
### 1.1.1 横向模糊匹配

横向模糊匹配指的是，一个正则可匹配的字符串的长度不是固定的；

```javascript
var reg = /ab{2,4}c/g;
var str = 'abc abbc abbbc abbbbc abbbbbc';
console.log(str.match(reg)) //["abbc", "abbbc", "abbbbc"]

var reg = /ab{2,4}c/;
var str = 'abc abbc abbbc abbbbc abbbbbc';
console.log(str.match(reg)) //["abbc"]
```

### 1.1.2 纵向模糊匹配

纵向模糊匹配指的是，一个正则匹配的字符串，具体到某一位字符时，它可以不是某个特定的字符，可以有多种可能。

```javascript
var reg = /a[2-4]c/g
var str = 'a1c a2c a3ca4c a5c'
console.log(str.match(reg)) //["a2c", "a3c", "a4c"]
```

## 1.2 字符组

虽然叫字符组，但是只表示一个字符；如[abc]

### 1.2.1 范围表示法

```javascript
[abcde123456FGHIJK] => [a-b1-6F-K]
```

### 1.2.2 排除字符组

```javascript
//除了a,b,c以外的所有字符
var reg = /[^abc]/
```

### 1.2.3 常见的简写形式

字符组 | 具体含义
---- | ----
\d | [0-9]
\D | [^0-9]
\w | [0-9a-zA-Z_] 数字，字母和下划线（w:word）
\W | [^0-9a-zA-Z_]
\s | [\t\v\n\r\f] 空白符(s:space)
\S | [^\t\v\n\r\f] 非空白符
. | [^\n\r\u2028\u2029] 通配符。几乎表示任何字符，换行符，回车符，行分隔符和段分隔符除外

(在glob匹配中，*才表示通配符)

若想匹配任何字符，/[\d\D]/,/[\s\S]/,/[\w\W]/,/[^]/中任何一个即可

## 1.3 量词

### 1.3.1 简写形式

量词 | 具体含义
---- | ----
{m,} | 至少出现m次
{m} | 等价于{m,m},表示出现m次
? | 等价于{0,1},表示出现或者不出现
+ | 等价于{1,},表示至少出现一次
* | 等价于{0,},表示出现任意次

### 1.3.2 <span style="color:red">贪婪匹配与惰性匹配</span>


```javascript
var reg = /\d{2,4}/g;
var str = '1 12 123 1234 12345';
console.log(str.match(reg)) //["12", "123", "1234", "1234"]
```

上面例子中的正则/\d{2,4}/，表示数字连续出现2次到4次。但它默认是贪婪的，会尽可能多的匹配。

```javascript
var reg = /\d{2,4}?/g;
var str = '1 12 123 1234 12345';
console.log(str.match(reg)) //["12", "12", "12", "34", "12", "34"]
```
上例中，{2,4}表示，虽然2次到4次都行，但当2次就够的时候，就不再往下尝试了。

通过在量词后面加个问号就能实现惰性匹配。很多情况下，惰性匹配和只写最小值效果是一样的，如?和{1}，{2,5}?和{2}

惰性匹配：满足条件后立刻停止（具体见常见题目中的“匹配id”）

惰性量词 | 非惰性量词
---- | ----
{m,n}? | {m,n}
{m,}? | {m,}
?? | ?
+? | +
*? | *

练习 ： 
```javascript
let str = 'as357sda91';
let str1 = str.replace(/\d+/g,function(){
	console.log(arguments)
	return '哈'
})
console.log(str1) 	//as哈sda哈
```
```javascript
let str = 'as357sda91';
let str2 = str.replace(/\d+?/g,function(){
	console.log(arguments)
	return '哈'
})
console.log(str2);	//as哈哈哈sda哈哈
```
## 1.4 多选分支

具体形式如下 (p1|p2|p3),其中p1,p2,p3是子模式，用管道符相隔，表示其中之一。

```javascript
var reg = /good|nice/;
var str = 'good idea,nice try';
str.match(reg)  //["good", "nice"]
```

但是有个事实我们应该注意,比如我用/good|goodbye/去匹配'goodbye'

```javascript
var reg = /good|goodbye/g;
var str = 'goodbye';
str.match(reg)  //['good']
```
```javascript
var reg = /goodbye|good/g;
var str = 'goodbye';
str.match(reg)  //['goodbye']
```

这说明，分支也是惰性结构，匹配到前面的，就不再去匹配后面的了。


