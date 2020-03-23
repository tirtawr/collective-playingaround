
// Open and connect input socket
let socket = io();

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected", socket.id);
});

//keep track of all users
let users = {};
// Is it my turn?
let myTurn = false;
//keep track of color
let myColor;
//keep track of ink;
let ink = 0;

function setup() {

  frameRate(30);
  createCanvas(windowWidth, windowHeight);

  // Listen for my turn
  socket.on('go', function() {
    myTurn = true;
    ink = 255;
  });

  // Listen for changes to text
  socket.on('draw', function(drawData) {

    // Update string on screen
    drawLine(drawData);
  });

}

// Draw line
function drawLine(drawData) {

  //then we are drawing the line in the correct color
  stroke(drawData.color,drawData.data.inkLeft);
  line(drawData.data.x,drawData.data.y,drawData.data.pX,drawData.data.pY);
}

//mouseDragged function
//so IF IT'S YOUR TURN AND YOU'VE DRAWN, WE NEED TO EMIT THIS DATA SO EVERYONE ELSE
//CAN DRAW IT TOO, RIGHT?
//wait, we just want this to send the coordinates right. we dont actually want it drawn here,
//we want it drawn through drawline
//yes, that's what the draw in server does, ok cool
function mouseDragged() {
  // Ignore if it's not your turn
  if (!myTurn) {
    return;
    //else send it all the drawing data you'll need
  } else {
    let x = mouseX / width;
    let y = mouseY / height;
    let pX = pmouseX / width;
    let pY = pmouseY / height;
    socket.emit('draw', {
      x: x,
      y: y,
      pX: pX,
      pY: pY,
      inkLeft: ink
    });
    if (ink < 1) {
      myTurn = false;
      socket.emit('next');
    }
    ink -= 1.5;
  }
}

//TITOS STUFF
/*
let socket = io()

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected")
})

socket.on('setPrompt', function ({ prompt }) {
  console.log(prompt)
})

socket.on('currentPlayer', function({ currentPlayer }){
  if(currentPlayer === socket.id){
    console.log(`ITS YOUR TURN DAWG`)
  } else {
    console.log(`Current player: ${currentPlayer}`)
  }
})

socket.on('allPlayers', function({ players }) {
  console.log(players)
})

socket.on('gameFinished', function(){
  console.log('game has finished dawg, go home')
})

function finishRound(){
  socket.emit('finishRound')
}

function setup(){
  createCanvas(800, 600);
  background(0);
} 
*/

