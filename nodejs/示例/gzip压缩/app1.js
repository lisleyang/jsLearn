var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    var stream = fs.createReadStream(__dirname + '/index.html');
    stream.pipe(res);
});
server.listen(8001);