const Player = require('./player');
const PokerEvaluator = require('poker-evaluator');

class PokerGame {
  constructor(gameId) {
    this.gameId = gameId;
    this.players = [];
    this.bets = [];
    this.activePlayer = 0;
    this.dealer = 0;
    this.pot = 0;
    this.betToMatch = 0;
    this.di = 0;
    this.deck = [];
    this.table = [];
    let suits = 'HDCS';
    let values = '23456789TJQKA'
    let temp = ''
    for(let j = 0; j < 13; j++) {
      temp = values[j];
      for(let k = 0; k < 4; k++) {
        temp += suits[k];
        this.deck.push(temp)
        temp = values[j];
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
    this.bets.push(0);
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

  collectBlinds() {
    let small = 4;
    let big = small * 2;

    let i = this.dealer + 1;
    if(i >= this.players.length) {
      i = 0;
    }
    this.players[i].chips -= small;
    i++;
    if(i >= this.players.length) {
      i = 0;
    }
    this.players[i].chips -= big;
    this.pot += (small + big);
    this.betToMatch = big;
  }

  rotateDealer() {
    if(this.dealer + 1 >= this.players.length) {
      this.dealer = 0;
    } else {
      this.dealer++;
    }
  }

  nextBettingRound() {
    for(let i = 0; i < this.bets.length; i++) {
      this.bets[i] = 0;
    }
    this.rotateDealer();
    this.shuffleCards();
    this.dealCards();
    this.collectBlinds();
    this.activePlayer = this.dealer + 3;
    if(this.activePlayer >= this.players.length) {
      this.activePlayer -= this.players.length;
    }
  }

  handleBet(player, amount) {
    this.bets[this.activePlayer] += amount;
    this.pot += amount;
    this.players[this.activePlayer].chips -= amount;
    this.betToMatch = this.bets[this.activePlayer];
  }

  handleFold(player) {
    this.bets[this.activePlayer] = -1;
  }
  
  handleCall(player) {
    let call = this.betToMatch - this.bets[this.activePlayer];
    this.bets[this.activePlayer] = this.betToMatch;
    this.pot += call;
    this.players[this.activePlayer].chips -= call;
  }

  handleRaise(player, amount) {
    this.bets[this.activePlayer] = this.betToMatch + amount;
    this.pot += amount;
    this.players[this.activePlayer].chips -= amount;
    this.betToMatch = this.bets[this.activePlayer];
  }

  determineWinner() {
    let hands = [];
    let indicies = [];
    for(let i = 0; i < this.players.length; i++) {
      if(this.bets[i] > 0) {
        hands.push(this.players[i].hand);
        indicies.push(i);
      }
    }
    let winner = 0;
    let wi = 0;
    let draw = false;
    let drawPlayers = [];
    for(let i = 0; i < hands.length; i++) {
      let temp = this.table;
      temp.push(hands[i]);
      let val = PokerEvaluator.evalHand(temp).value
      if(val > winner) {
        draw = true;
        winner = val;
        wi = indicies[i];
        drawPlayers = [players[wi]];
      } else if(val == winner) {
        draw = true;
        drawPlayers.push(players[indicies[i]]);
      }
    }

    if(draw) {
      return drawPlayers;
    } 
    return [players[wi]];
  }

  updateState(newState) {
    //we update it with mongo or maybe just get rid of it 
    this.gameState = { ...this.gameState, ...newState };
  }

}

module.exports = PokerGame;
