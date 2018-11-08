const fs = require('fs');

const rs = fs.createReadStream('index.js');


// var data = '';

// let length = 0
// rs.on("data",function (chunk) {//chunk就是buffer
//     console.log(chunk)
//     length++;
//     data += chunk;  //这儿默认执行了toString,在中文环境下可能会存在问题。一个中文字符在utf-8编码下是3个字节
// })
// rs.on("end",function () {
//     console.log(length)
// })

var chunks = [];
var size = 0;
rs.on('data',function (chunk) {
    chunks.push(chunk);
    size += chunk.length;
})
rs.on('end',function(){
    var buf = Buffer.concat(chunks,size);
    var str = iconv.decode(buf,'utf-8')
    console.log(str);
})