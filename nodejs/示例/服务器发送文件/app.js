const express = require('express');
const app = express();
const fs = require('fs');

app.use('/',function(req,res,next){
    fs.createReadStream('./index.html').pipe(res)
})

app.listen(8081)