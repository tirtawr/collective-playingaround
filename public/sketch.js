let socket = io()

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected")
})

socket.on('setPrompt', function (payload) {
  console.log(payload)
})

socket.on('startDrawing', function(){
  console.log(`start drawing dawg`)
})

socket.on('allPlayers', function(payload) {
  console.log(payload)
})

function setup(){
  createCanvas(800, 600);
  background(0);
}

