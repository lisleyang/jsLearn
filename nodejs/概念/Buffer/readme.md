## 一. 为什么有Buffer

和前端不同，在Node中，需要处理网络协议、操作数据库、处理图片、接收上传文件等，在网络流和文件的操作中，还要产生大量的`二进制数据`，Javascript自有的字符串远远不能满足这些需求，于是Buffer对象应运而生。

Buffer在文件IO和网络IO中应用广泛。

在应用中，我们通常会操作字符串。但一旦在网络中传输，都需要转化为Buffer，以进行二进制数据传输。

## 二. Buffer是什么

Buffer像一个Array对象，它的元素为一个字节，即16进制的两位数，即0~255的数值。但它主要用来操作`字节`。

除了可以读取文件得到Buffer的实例外，还能够直接构造，例如：

方法一: 直接使用十六进制
```javascript
var bin = new Buffer([ 0x68, 0x65, 0x6c, 0x6c, 0x6f ]);
console.log(bin)//<Buffer 68 65 6c 6c 6f>
console.log(bin.toString()) // hello
```

方法二: 使用字符串转化

```javascript
var bin = new Buffer('hello', 'utf-8'); 
console.log(bin)//<Buffer 68 65 6c 6c 6f>
console.log(bin.toString()) // hello
```

**总之，Buffer将JS的数据处理能力从字符串扩展到了任意二进制数据。**

## 三. Buffer的转化

#### Buffer目前支持的字符串编码类型

* ASCII
* UTF-8
* UTF-16LE/UCS-2
* Base64
* Binary
* Hex

不支持的编码，可以通过第三方库，比如`iconv`和`icon-lite`来支持

#### 字符串转Buffer

主要是通过构造函数完成的。

```js
var bin = new Buffer('hello', 'utf-8'); // <Buffer 68 65 6c 6c 6f>
```

#### Buffer转字符串

想要将Buffer转化为字符串，调用它自身的toString方法即可

```js
var bin = new Buffer([ 0x68, 0x65, 0x6c, 0x6c, 0x6f ]);
//十六进制的68对应二进制是0110 1000，在ASCII码表中对应的是`h`
console.log(bin.toString());    //'hello'
console.log(bin.toString('utf-8')); //指定转化的编码
```

**一般读取文件的时候，就是把文件转化为Buffer（文件本身就是二进制数据）。无论是文本文件还是二进制文件。**

## Buffer的拼接

Buffer在使用场景中，通常是以一段一段的方式传输。以下是从输入流中读取内容的示例代码:
```javascript
const fs = require('fs');

const rs = fs.createReadStream('index.js');
var data = '';
rs.on("data",function (chunk) {//chunk就是Buffer
    console.log(chunk)

    //这儿默认执行了toString，相当于data = data.toString() + chunk.toString()
    data += chunk; 
})
rs.on("end",function () {
    //console.log(data)
})
```
