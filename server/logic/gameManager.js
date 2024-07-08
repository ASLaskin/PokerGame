const PokerGame = require('./pokerGame');

class GameManager {
  constructor() {
    this.games = {};
  }

  createGame(gameId, players) {
    if (!this.games[gameId]) {
      this.games[gameId] = new PokerGame(gameId, players);
    }
    return this.games[gameId];
  }

  getGame(gameId) {
    return this.games[gameId];
  }

  deleteGame(gameId) {
    delete this.games[gameId];
  }

  updateGameState(gameId, gameState) {
    if (this.games[gameId]) {
      this.games[gameId].updateState(gameState);
    }
  }
}

module.exports = new GameManager();
