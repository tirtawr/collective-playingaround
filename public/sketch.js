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
// Canvas element
let cnv;
//keep track of color
let myColor;
//keep track of ink;
let ink = 0;

function setup() {

  frameRate(30);

  cnv = createCanvas(windowWidth, windowHeight);

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
  stroke()
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
  } else {
    let x = mouseX / width;
    let y = mouseY / height;
    let pX = pmouseX / width;
    let pY = pmouseY / height;
    stroke(0,0,0,ink);
    line(x, y, pX, pY);
    socket.emit('draw', {
      x: x,
      y: y,
      pX: pX,
      pY: pY,
      inkLeft: ink
    }
    });
    if (ink < 1) {
      myTurn = false;
    }
    ink -= 1.5;
  }
  //we are gonna emit draw here
  //and send the drawing data
}

/*
if it's your turn

so first, get the data that it's your turn

if the mouse is pressed
how would this work...
opacity goes down while the mouse is pressed
if opacity reaches 0, your turn is over
if you press enter, your turn is also over
*/
