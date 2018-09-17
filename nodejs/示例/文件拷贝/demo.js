//拷贝小文件，在保证内存不会爆仓的情况下可以使用；因为会把文件转化为Buffer放在内存里
const fs = require('fs');

fs.writeFileSync('b.js',fs.readFileSync('./a.js'));
//会读取为Buffer
console.log(fs.readFileSync('./a.js'))  //<Buffer 61 73 64 64 61 64 61 64 61 61 64>
console.log(fs.readFileSync('aaa.png')) //<Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 05 ce 00 00 05 18 08 06 00 00 00 91 17 41 13 00 00 0c 26 69 43 43 5049 43 43 20 50 72 6f 66 69 ... >
//二进制文件也是可以的
fs.writeFileSync('bbb.jpg',fs.readFileSync('aaa.png'));
fs.writeFileSync('bbb.xlsx',fs.readFileSync('aaa.xlsx'));