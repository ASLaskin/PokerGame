const Player = require('./player');

class PokerGame {
  constructor(gameId) {
    this.gameId = gameId;
    this.players = [];
    this.activePlayer = 0;
    this.dealer = 0;
    this.di = 0;
    this.deck = [];
    let suits = 'HDCS';
    let values = '234567891JQKA'
    let temp = ''
    for(let j = 0; j < 4; j++) {
      temp = suits[j];
      for(let k = 0; k < 13; k++) {
        temp += values[k];
        this.deck.push(temp)
        temp = suits[j];
      }
    }

    console.log(this.deck);

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

  startGame() {
  }

  shuffleCards() {
    let tempDeck = [];
    for(let i = 0; i < 52; i++) {
      let j = Math.floor(Math.random() * this.deck.length);
      tempDeck.push(this.deck[j]);
      this.deck.splice(j,1);
    }
    this.deck = tempDeck;
    console.log(this.deck);
  }

  dealCards() {
    for(let i = 0; i < this.players.length; i++) {
      this.players[i].hand.push(this.deck[this.di]);
      this.di += 1
      this.players[i].hand.push(this.deck[this.di]);
      this.di += 1
    }
  }

  updateState(newState) {
    //we update it with mongo or maybe just get rid of it 
    this.gameState = { ...this.gameState, ...newState };
  }

}

module.exports = PokerGame;
