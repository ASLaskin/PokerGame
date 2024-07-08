const Player = require('./player');

class PokerGame {
  constructor(gameId, players) {
    this.gameId = gameId;
    this.players = players.map(player => new Player(player.id, player.name));
    this.gameState = {
      status: 'waiting',
    };
  }

  updateState(newState) {
    //we update it with mongo or maybe just get rid of it 
    this.gameState = { ...this.gameState, ...newState };
  }

}

module.exports = PokerGame;
