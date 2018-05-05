var WebSocketServer = require("websocket").server;
var server = require("http").createServer();
var clients = [];

// Configure the websocket
var ws = new WebSocketServer({
    httpServer : server,
    autoAcceptConnections:true
});

// Start the WebSocket and server
ws.on("connect",connectHandler);
server.listen(9999);
console.log("RockPaperScissor listening on port 9999:");

// Set a timeout for server to play with a random client every 3 seconds
setTimeout(sendMessage, 3000);

// HANDLER FUNCTIONS //
function connectHandler(conn){
    // identify the connected client
    conn.identifier = conn.remoteAddress;
    conn.on("message",messageHandler);
    conn.on("close",closeHandler);
    clients.push(conn);
    console.log("New Client connected: "+conn.identifier);
}

function messageHandler(message){
    var clientChoice = message.utf8Data.toString();
    console.log("Received message from client: "+this.identifier+" message: "+clientChoice);
    var serverChoice = pickRandomHand();
    this.sendUTF("client-"+clientChoice+"-"+serverChoice);
    console.log("Answered with: "+serverChoice);
}

function closeHandler(){
    // Find the closed client connection in our list of clients
    var index = clients.indexOf(this);
    var clientID = clients[index].identifier;
    console.log("Client " + clientID + " has closed connection");
    if (index < 0){
        console.log("The client " + clientID + " was not found in the server list of clients");
        return;
    }

    clients.splice(index,1);
    console.log("Client "+clientID+" was removed successfully from registered clients");
}

function sendMessage(){
    // Setting another timer for next play
    var timer = ((Math.random() * 5)+2) * 1000;
    setTimeout(sendMessage, timer);
    // Make sure there are connected users to play with
    if(clients.length <= 0) return;

    // Randomly pick a user to play with
    var clientIndex = Math.floor(Math.random()*clients.length);
    var client = clients[clientIndex];
    var msg = pickRandomHand();
    client.sendUTF("server--"+msg);
    console.log("Picked: "+msg+" Sent to: "+client.identifier);
    
}

function pickRandomHand(){
    var randomChoice = Math.floor((Math.random() * 3) + 1);
    var serverChoice = "";
    switch (randomChoice) {
        case 1: { serverChoice = "Rock"; break; }
        case 2: { serverChoice = "Paper"; break; }
        case 3: { serverChoice = "Scissors"; break; }
    }
    return serverChoice;
}