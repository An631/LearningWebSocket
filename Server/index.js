var WebSocketServer = require("websocket").server;

var server = require("http").createServer();

var ws = new WebSocketServer({
    httpServer : server,
    autoAcceptConnections:true
});

console.log("Chat Server listening on port 9999:");

server.listen(9999);