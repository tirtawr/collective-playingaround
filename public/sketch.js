// Open and connect input socket
let socket = io();

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected", socket.id);
});

// String being typed
let str = '';
// Is it my turn?
let myTurn = false;
// Canvas element
let cnv;
// Margin;
let m = 10;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  // Disable canvas by deafult
  cnv.addClass('disabled');

  // Draw string once connected
  drawString();

  // Listen for my turn
  socket.on('go', function() {
    myTurn = true;
    // Enable can       vas
    cnv.removeClass('disabled');
    // Update instructions on screen
    drawString();
  });

  // Listen for changes to text
  socket.on('add', function(data) {
    // Update string
    str += data;
    // Update string on screen
    drawString();
  });

}

// Draw string, character by character
function drawString() {
  // Draw a white background
  background(255);

  // Start in upper left-hand corner
  let x = m;
  let y = m;
  fill(0);

  // If there's nothing yet...
  // Show instructions
  if (str.length == 0) {
    text(myTurn ? 'type a word' : 'wait...', x, y);

    // The above is the same as:
    // if (myTurn) text('type a word', x, y);
    // else text('wait...', x, y);

  } else {
    // Draw string, character by character
    for (let c = 0; c < str.length; c++) {
      let char = str.charAt(c);
      text(char, x, y);
      x += textWidth(char);
      // Wrap text to next line
      if (x > width - m) {
        x = 0;
        y += textAscent('h') + textDescent('p');
      }
    }
  }
}

// Delete things
function mousePressed() {
  // Ignore if it's not your turn
  if (!myTurn) return;


}

/*
if it's your turn
if the mouse is pressed
how would this work...
draw a line for five seconds?
*/
