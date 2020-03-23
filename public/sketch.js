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

function setup(){
  createCanvas(800, 600);
  background(0);
}

