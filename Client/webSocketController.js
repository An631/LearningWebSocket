const host = "wss://learning-web-socket.herokuapp.com/"
//const host = "ws://127.0.0.1:9999/"
var score = 0;

// DEFINE UI ELEMENTS
var clientOutgoing;
var serverResponse;
var clientServerResult;

var serverIncoming;
var clientResponse;
var serverClientResult;

var scoreUI;
var ws;

// GAME LOGIC FUNCTIONS //

// Starts the game by initializing all of its components
function initiliazeGame(){
    setupUIElements();
    setupConnection();
}

// Grabs all UI elements and intializes the variables used
// to access them.
function setupUIElements(){
    clientOutgoing = document.getElementById("client-outgoing");
    serverResponse = document.getElementById("server-response");
    clientServerResult = document.getElementById("client-server-result");

    serverIncoming = document.getElementById("server-incoming");
    clientResponse = document.getElementById("client-response");
    serverClientResult = document.getElementById("server-client-result");

    scoreUI = document.getElementById("score");
}

// Initiates a connection with the websocket server and 
// setting up its connection listeners
function setupConnection(){
    ws = new WebSocket(host);
    
    ws.addEventListener("open",()=>{
        console.log("Connection started");
    },false);

    ws.addEventListener("message", (e) => {
        var str = e.data;
        var msg = parseMsg(str);
        switch(msg.type){
            case "client": {
                console.log("Received a response to client message: " + msg.responseValue);
                serverResponse.innerHTML = "Server: "+msg.responseValue;
                var gameResult = checkWin(msg.requestValue, msg.responseValue);
                clientServerResult.innerHTML = translateGameResult(gameResult);
                break;
            }
            case "server":{
                console.log("Received a new server message: " + msg.responseValue);
                serverIncoming.innerHTML = "Server: "+msg.responseValue;
                var clientChoice = pickRandomHand();
                clientResponse.innerHTML = "Client: "+clientChoice;
                var gameResult = checkWin(clientChoice, msg.responseValue);
                serverClientResult.innerHTML = translateGameResult(gameResult);
                break;
            }
        }
        
        score += gameResult;
        scoreUI.innerHTML = score;
    },false);

    ws.addEventListener("close", () => {
        console.log("Connection closed");
    },false);

    ws.addEventListener("error", (e) => {
        console.log("The connection failed");

    }, false);
}

// ON HTML FUNCTIONS //
function sendChoice(selection){
    // TODO: Check for connection state before sending msg
    clientOutgoing.innerHTML = "You: "+selection;
    if(ws.readyState !== ws.OPEN) setupConnection();        
        ws.send(selection);
}

// UTILITY FUNCTIONS //

// Parses a str with the form "origin-clientMsg-serverMsg"
// Sends back an object with the following properties:
// .type = origin
// .requestValue = clientMsg
// .responseValue = serverMsg
function parseMsg(str){
    var splitMsg = str.split('-');
    var msg = {};
    msg.type = splitMsg[0];
    msg.requestValue = splitMsg[1];
    msg.responseValue = splitMsg[2];

    return msg;
}

// Checks the outcome of a rock paper scissor game
function checkWin(playerOne, playerTwo){
    console.log("comparing: "+playerOne+" "+playerTwo);
   // Both players tied
   if(playerOne == playerTwo) return 0;
   
   // Player one winning conditions
    if((playerOne === "Rock" && playerTwo === "Scissors") 
    || (playerOne === "Paper" && playerTwo === "Rock")
    || (playerOne === "Scissors" && playerTwo === "Paper"))
        return 1;
   
   // If none of the above then player one lost
   return -1
}

function translateGameResult(gameResult){
    var resultStr = "";
    resultStr = (gameResult > 0) ? 
                "WON!! =D" : 
                (gameResult === 0)? "DRAW!! :|": "LOST!! :(";
    return resultStr;
}

function pickRandomHand() {
    var randomChoice = Math.floor((Math.random() * 3) + 1);
    var choice = "";
    switch (randomChoice) {
        case 1: { choice = "Rock"; break; }
        case 2: { choice = "Paper"; break; }
        case 3: { choice = "Scissors"; break; }
    }
    return choice;
}

// INITIALIZE GAME //
window.addEventListener("load", initiliazeGame, false);