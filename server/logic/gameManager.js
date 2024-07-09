const PokerGame = require('./pokerGame');
const Player = require('./player');

class GameManager {
    constructor(gameState) {
        this.gameID = gameState.gameID;
        this.players = gameState.players.map(player => new Player(player.name));
        this.pokerGame = new PokerGame(this.players);
    }

    getGameState() {
        return {
            gameID: this.gameID,
            players: this.players.map(player => player.getName()),
            gameStatus: this.pokerGame.getStatus()
        };
    }
}

module.exports = GameManager;
