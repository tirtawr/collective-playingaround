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

function setup() {

  frameRate(30);

  cnv = createCanvas(windowWidth, windowHeight);

  // Draw line once connected
  drawLine();

  // Listen for my turn
  socket.on('go', function() {
    myTurn = true;
    //draw the line
    drawLine();
  });

  // Listen for changes to text
  socket.on('draw', function(data) {
    // Update string on screen
    drawLine();
  });

}

// Draw line
function drawLine() {
  let ink;
  // If it's your turn, draw a line
  if (myTurn) {
    ink = 255;
  } else {
    socket.emit("draw", data)
    ink = 0;
  }
}

//mouseDragged function
function mouseDragged() {
  // Ignore if it's not your turn
  if (!myTurn) {
    return;
  } else {
    stroke(0,0,0,ink);
    line(mouseX, mouseY, pmouseX, pmouseY);
    if (ink < 1) {
      myTurn = false;
    }
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
