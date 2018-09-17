const fs = require('fs');
var data = '';

//设置highWaterMark:11会出现乱码，因为每次截取11个，有字符从中间被截断了。data+=trunk默认进行了toString。
let rs = fs.createReadStream('a.js',{highWaterMark:11}) 

//let rs = fs.createReadStream('test.md') 
//成功调用 fs.createReadStream() 会返回一个新的 fs.ReadStream 对象。fs.ReadStream 对象都是可读流（stream.Readable 类）。
//stream.Readable 类有close，data，end等事件（http://nodejs.cn/api/stream.html#stream_class_stream_readable）

rs.on('data',function(chunk){
    //参数chunk其实是Buffer，不是字符串
    data += chunk;  //这句代码隐式地将chunk进行了toString()
})
rs.on('end',function(){
    console.log(data);  //字符串
})