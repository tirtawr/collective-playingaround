const prompts = require('./prompts.js')

class Game{
  constructor(){
    this.currentPlayer = ''
    this.gameFinished = false
    this.players = []
    this.discardedPile = []
    this.prompt = ''
    this.canvasState = []
  }

  // add input client
  addPlayer (socket) {
    if(!this.players.length) {
      this.currentPlayer = socket.id
      if (!this.prompt.length) { this.setPrompt() }
    }
    this.players.push(socket)
  }

  // remove input client
  removePlayer (id) {
    if(this.players.length === 1){
      this.players = []
      this.currentPlayer = ''
    } else {
      this.players = this.players.filter(d => d.id !== id)
    }
  }

  findPlayer (id) {
    return this.players.find(d => d.id === id)
  }

  allPlayers() {
    return this.players.map(d=>d.id)
  }

  next() {
    const currentPlayerIndex = this.players.findIndex(d => d.id === this.currentPlayer)
    const nextPlayerIndex = (currentPlayerIndex + 1) % this.players.length
    this.currentPlayer = this.players[nextPlayerIndex].id
  }

  getCurrentPlayer() {
    return this.currentPlayer
  }

  setPrompt() {
    let selectedPrompt
    do {
      const randomIndex = Math.floor(Math.random() * prompts.length)
      selectedPrompt = prompts[randomIndex]
    } while (this.discardedPile.includes(selectedPrompt))
    this.discardedPile.push(selectedPrompt)
    this.prompt = selectedPrompt
    
    if(this.discardedPile.length === prompts.length) {
      this.gameFinished = true
    }
  }

  getPrompt(){
    return this.prompt
  }

  hasGameFinished() {
    return this.gameFinished
  }

  reset(){
    this.discardedPile = []
    this.gameFinished = false
    this.setPrompt()
  }

  getCanvasState() {
    return this.canvasState
  }

  addToCanvas(data) {
    this.canvasState.push(data)
  }

  clearCanvas() {
    this.canvasState = []
  }

  printGameStatus() {
    console.log(`Queue length: ${this.players.length}`)
    console.log(`Queue: ${this.players.map(d=>d.id)}`)
    console.log(`Current player: ${this.getCurrentPlayer()}`)
    console.log(`Current prompt: ${this.getPrompt()}`)
    console.log(`Discarded pile: ${this.discardedPile}`)
    console.log(`----------------------------------------`)
  }
}

module.exports = Game