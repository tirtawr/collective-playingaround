
// Open and connect input socket
let socket = io();


/*
to-do:
make sure it works??
*/

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected", socket.id);
});

//keep track of all users
let players;
// Is it my turn?
let myTurn = false;
//keep track of color
let myColor;
//keep track of ink;
let ink = 0;


let getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function setup() {

  socket.on('setPrompt', function ({ prompt }) {
    console.log(prompt)
  })

  socket.on('gameFinished', function(){
    background(255);
    text("DONE", width/2, height/2);
  });

  myColor = getRandomColor();

  frameRate(30);
  createCanvas(windowWidth, windowHeight);

  socket.on('currentPlayer', function({ currentPlayer }){
    if(currentPlayer === socket.id){
      console.log(`ITS YOUR TURN DAWG`)

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected", socket.id);

  socket.on('setPrompt', function ({ prompt }) {
    // TODO fill this in
    // Update prompt on screen and erase canvas to make way for new drawing
  })

  // Listen for my turn
  socket.on('currentPlayer', function(currentPlayer) {
    if(currentPlayer === socket.id){
      myTurn = true;
      ink = 255;
    } else {
      console.log(`Current player: ${currentPlayer}`)

    }
  })

  // Listen for changes to text
  socket.on('drawPoint', function(drawData) {
    // Update line on screen
      myTurn = false;
    }
  });

  // Listen for changes to text
  socket.on('drawPoint', function(drawData) {

    // Update string on screen
    drawLine(drawData);
  });
});


  socket.on('allPlayers', function(data) {
    players = data;
  });


function setup() {

  frameRate(30);
  createCanvas(windowWidth, windowHeight);
}

// Draw line
function drawLine(drawData) {
  //then we are drawing the line in the correct color

  stroke(drawData.data.color,drawData.data.inkLeft);
  line(drawData.data.x,drawData.data.y,drawData.data.pX,drawData.data.pY);

  stroke(drawData.color,drawData.inkLeft);
  line(drawData.x,drawData.y,drawData.pX,drawData.pY);
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (myTurn) {
      socket.emit('finishRound');
    };
  }
}

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
    socket.emit('drawPoint', {
      x: x,
      y: y,
      pX: pX,
      pY: pY,
      inkLeft: ink,

      color: myColor
      color: '#111'

    });
    if (ink < 1) {
      myTurn = false;
      socket.emit('nextPlayer');
    }
    ink -= 1.5;
  }
}

//TITOS STUFF i dont in there yet
/*

*/
