const Player = require('./player');

class PokerGame {
  constructor(gameId) {
    this.gameId = gameId;
    this.players = [];
    this.gameState = {
      status: 'waiting',
    };
  }
  addPlayer(name) {
    const player = new Player(name);
    this.players.push(player);
  }
  getPlayers() {
    return this.players;
  }

  updateState(newState) {
    //we update it with mongo or maybe just get rid of it 
    this.gameState = { ...this.gameState, ...newState };
  }

}

module.exports = PokerGame;
