const Game = require('./game.js')

function testAdd(){
  const game = new Game()
  game.addPlayer('abc')
  game.addPlayer('def')
  console.log(game)
}

function testDeletionStart(){
  const game = new Game()
  game.addPlayer('abc')
  game.addPlayer('def')
  if(game.getCurrentPlayer() === 'abc'){
    game.next()
  }
  game.removePlayer('abc')
  console.log(game)
}

function testDeletionEnd(){
  const game = new Game()
  game.addPlayer('abc')
  game.addPlayer('def')
  game.removePlayer('def')
  console.log(game)
}

function testDeletionSingle(){
  const game = new Game()
  game.addPlayer('def')
  game.removePlayer('def')
  console.log(game)
}

function testDeletionMiddle(){
  const game = new Game()
  game.addPlayer('abc')
  game.addPlayer('def')
  game.addPlayer('xyz')
  game.addPlayer('rty')
  game.addPlayer('uwe')
  game.removePlayer('xyz')
  console.log(game)
}

function main(){
  testAdd()
  testDeletionStart()
  testDeletionEnd()
  testDeletionSingle()
  testDeletionMiddle()
}

main()