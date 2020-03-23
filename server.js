const Game = require('./game.js')
const game = new Game()

// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
// Tell server where to look for files
app.use(express.static('public'));
app.get('/', (req, res) => res.redirect('/player'));

// Create socket connection
let io = require('socket.io').listen(server);

// Listen for individual clients to connect
io.sockets.on('connection',
  function (socket) {
    game.addPlayer(socket)
    socket.emit('setPrompt', { prompt: game.getPrompt() })
    socket.emit('setColor', { color: getRandomColor() })
    io.sockets.emit('allPlayers', { players: game.allPlayers() })
    socket.emit('currentPlayer', { currentPlayer: game.getCurrentPlayer() })

    game.printGameStatus()

    socket.on('nextPlayer', function () {
      game.next()
      io.sockets.emit('currentPlayer', { currentPlayer: game.getCurrentPlayer() })
    })

    socket.on('drawPoint', function(payload) {
      io.sockets.emit('drawPoint', payload)
    })

    // Listen for this client to disconnect
    // Tell everyone client has disconnected
    socket.on('disconnect', function() {
      if(game.getCurrentPlayer() === socket.id){
        game.next()
        io.sockets.emit('currentPlayer', { currentPlayer: game.getCurrentPlayer() })
      }
      game.removePlayer(socket.id)
      io.sockets.emit('allPlayers', { players: game.allPlayers() })
      game.printGameStatus()
    })
  })
