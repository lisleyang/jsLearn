//正确的，不会产生乱码的方式

const fs = require('fs');
const chunks = [];
let size = 0;

let rs = fs.createReadStream('test.md',{highWaterMark:11});//rs是可读流，不能直接toString

rs.on('data',function(chunk){
    chunks.push(chunk);
    size += chunk.length
})

rs.on('end',function(){
    var buf = Buffer.concat(chunks,size);       //深入简出nodejs 146页
    console.log(buf.toString())
})
