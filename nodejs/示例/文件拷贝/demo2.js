const fs = require('fs');

//fs.createReadStream创建了一个源文件的只读数据流，并使用fs.createWriteStream创建了一个目标文件的只写数据流
fs.createReadStream('aaa.png').pipe(fs.createWriteStream('ccc.png'))