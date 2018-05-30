var ws = require("nodejs-websocket")

var clientCount = 0;


// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
	console.log("New connection")

	clientCount++;
	conn.nickname = 'user' + clientCount;

	var message = {};
	message.type = "enter";
	message.data = conn.nickname + 'comes in';

	broadCast(JSON.stringify(message));

	conn.on("text", function (str) {
		console.log("Received "+str)

		var message = {};
		message.type = "message";
		message.data = conn.nickname + " : " + str;

		broadCast(JSON.stringify(message));
	})
	conn.on("close", function (code, reason) {
		console.log("Connection closed")

		var message = {};
		message.type = "leave";
		message.data = conn.nickname + 'left';

		broadCast(JSON.stringify(message));
	})
}).listen(8001)

function broadCast(str){
	server.connections.forEach(connection=>{
		connection.sendText(str)
	})
}