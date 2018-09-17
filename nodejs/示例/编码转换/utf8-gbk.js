const iconv = require('iconv-lite');
const fs = require('fs');

fs.writeFileSync('gbk.html',iconv.decode(fs.readFileSync('./index.html'),'gbk'))