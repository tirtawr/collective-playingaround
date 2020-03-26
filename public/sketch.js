
const startingInkLevel = 500;

//keep track of all users
let allPlayers = []
// Is it my turn?
let myTurn = false;
//keep track of color
let myColor;
//keep track of ink;
let ink = 0;

let socket 

// Color patch
let colors = ['#000000', '#4C4C4C', '#ED150A', '#FE6F00', '#FAE502', '#03CB02', '#00B3FD', '#211FD2', '#A801BE', '#A1512B'];
let colorPatches = [];
let myTurnSound
let joinSound

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

  socket = io();
  socket.on('connect', function() {
    console.log("Connected", socket.id);
  
    socket.on('setPrompt', function ({ prompt }) {
      document.getElementById("prompt").innerHTML = prompt
      background('white')
    });
  
    socket.on('gameFinished', function(){
      background(255);
      text("DONE", width/2, height/2);
    });
  
    socket.on('currentPlayer', function({ currentPlayer }){
      queueCurrentPlayer = currentPlayer 
      makeQueue(allPlayers)
      if(currentPlayer === socket.id){
        myTurnSound.play()
        myTurn = true;
        document.getElementById('turn-notif').innerHTML = "it's your turn!"
        ink = startingInkLevel;
      } else {
        console.log(`Current player: ${currentPlayer}`)
        document.getElementById('turn-notif').innerHTML = "waiting for your turn..."
      }
    });
  
    socket.on('drawPoint', function(drawData) {
      drawPoint(drawData)
    });
  
    socket.on('allPlayers', function({players}) {
      if(allPlayers.length && allPlayers.length < players.length) {
        joinSound.play()
      }
      allPlayers = players
      makeQueue(allPlayers)
    })

    socket.on('initialState', function({ canvas }){
      canvas.forEach(instruction => {
        drawPoint(instruction)
      })
    })
  
  });

  myColor = hexToRgb(getRandomColor());

  frameRate(30);

  let y = 20;
  colors.forEach(color => {
    colorPatches.push(new ColorPatch(20, y, color))
    y += 58;
  });
  
}


function preload() {
  soundFormats('mp3', 'ogg')
  myTurnSound = loadSound('ping')
  joinSound = loadSound('join')
}


function draw() {
  // Draw color patches
  colorPatches.forEach(colorPatch => {
    colorPatch.draw();
  });

  // Draw color indicator
  
  noStroke()
  fill('white')
  rect(width - 20, 0, 20, height);
  fill(myColor.r, myColor.g, myColor.b)
  let rectHeight = height * ink / startingInkLevel
  rect(width - 20, height - rectHeight, 20, height * ink / startingInkLevel);
}

// Draw line
function drawPoint({x, y, color, inkLeft}) {
  const {r, g, b} = color
  stroke(r, g, b, inkLeft)
  strokeWeight(2)
  point(x * width, y * height)
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (myTurn) {
      myTurn = false
      ink = 0
      socket.emit('finishRound')
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
    socket.emit('drawPoint', {
      x: x,
      y: y,
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

function mouseClicked() {
  colorPatches.forEach(colorPatch => {
    if (colorPatch.isClicked(mouseX, mouseY)) {
      myColor = hexToRgb(colorPatch.getHexValue());
    }
  });
}

let queueCurrentPlayer = ''

function makeQueue(players){
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
