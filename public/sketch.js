
// Open and connect input socket
let socket = io();

/*
to-do:
make sure it works??
*/

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected", socket.id);

  socket.on('setPrompt', function ({ prompt }) {
    //document.getElementById("prompt").innerHTML = prompt
    console.log(prompt)
  });

  socket.on('gameFinished', function(){
    background(255);
    text("DONE", width/2, height/2);
  });

  socket.on('currentPlayer', function({ currentPlayer }){
    queueCurrentPlayer = currentPlayer 
    makeQueue(players)
    if(currentPlayer === socket.id){
      console.log(`ITS YOUR TURN DAWG`)
      myTurn = true;
      document.getElementById('turn-notif').innerHTML = "it's your turn!"
      ink = 255;
    } else {
      console.log(`Current player: ${currentPlayer}`)
      document.getElementById('turn-notif').innerHTML = "waiting for your turn..."
    }
  });

  // Listen for changes to text
  socket.on('drawPoint', function(drawData) {
    //console.log(drawData);
    // Update line on screen
    drawLine(drawData);
  });

  socket.on('allPlayers', function(data) {
    players = data;
    makeQueue(data)
  });

});

//keep track of all users
let players = {};
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

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function setup() {

  createCanvas(1000, 600);
  background('white');
  myColor = hexToRgb(getRandomColor());

  frameRate(30);

  let y = 20;
  colors.forEach(color => {
    colorPatches.push(new ColorPatch(20, y, color))
    y += 55;
  });
  
}

function draw() {
  // Draw color patches
  colorPatches.forEach(colorPatch => {
    colorPatch.draw();
  });

  // Draw color indicator
  fill(myColor.r, myColor.g, myColor.b)
  noStroke
  square(width - 80, 20, 60);
}

// Draw line
function drawLine(drawData) {
  //then we are drawing the line in the correct color
  stroke(drawData.color.r,drawData.color.g,drawData.color.b,drawData.inkLeft);
  line(drawData.x * width,drawData.y *height,drawData.pX *width,drawData.pY *height);
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
    });
    if (ink < 1) {
      myTurn = false;
      socket.emit('nextPlayer');
    }
    ink -= 2;
  }
}

let queueCurrentPlayer = ''

function makeQueue({players}){
  const el = document.getElementById('queue-viz')
  el.innerHTML = ''
  for(let i = 0; i < players.length; i++){
    const newDiv = document.createElement("div")
    const newContent = document.createTextNode(`${ players[i] === socket.id ? 'You' : 'Someone' }`)
    newDiv.appendChild(newContent)
    newDiv.classList.add('queue-element')
    if(queueCurrentPlayer === players[i]) {
      newDiv.classList.add('current-player')
    }
    el.appendChild(newDiv)
  }
}
