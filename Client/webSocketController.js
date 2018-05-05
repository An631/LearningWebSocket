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

function setupConnection(){
    clientOutgoing = document.getElementById("client-outgoing");
    serverResponse = document.getElementById("server-response");
    clientServerResult = document.getElementById("client-server-result");

    serverIncoming = document.getElementById("server-incoming");
    clientResponse = document.getElementById("client-response");
    serverClientResult = document.getElementById("server-client-result");

    scoreUI = document.getElementById("score");
    ws = new WebSocket("ws://learning-web-socket.herokuapp.com:9999/");
    
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
                if(gameResult > 0){
                        console.log("You won");
                        clientServerResult.innerHTML = "WON!! =D";
                }
                else if(gameResult === 0){
                    console.log("You tied");
                    clientServerResult.innerHTML = "DRAW!! :|";
                }
                else {
                    console.log("You lost");
                    clientServerResult.innerHTML = "LOST!! :(";
                }
                break;
            }
            case "server":{
                console.log("Received a new server message: " + msg.responseValue);
                serverIncoming.innerHTML = "Server: "+msg.responseValue;
                var clientChoice = pickRandomHand();
                clientResponse.innerHTML = "Client: "+clientChoice;
                var gameResult = checkWin(clientChoice, msg.responseValue);
                if (gameResult > 0) {
                    console.log("You won");
                    serverClientResult.innerHTML = "WON!! =D";
                }
                else if (gameResult === 0) {
                    console.log("You tied");
                    serverClientResult.innerHTML = "DRAW!! :|";
                }
                else {
                    console.log("You lost");
                    serverClientResult.innerHTML = "LOST!! :(";
                }
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

// INITIALIZE GAME:
window.addEventListener("load",setupConnection,false);

// ON HTML FUNCTIONS:
function sendChoice(selection){
    
    clientOutgoing.innerHTML = "You: "+selection;
    ws.send(selection);
}

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
   if(playerOne == playerTwo) return 0;
   
   if((playerOne === "Rock" && playerTwo === "Scissors") 
   || (playerOne === "Paper" && playerTwo === "Rock")
   || (playerOne === "Scissors" && playerTwo === "Paper"))
   return 1;
   
   return -1
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