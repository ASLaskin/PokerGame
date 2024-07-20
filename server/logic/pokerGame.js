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
    this.gameStage = 0;
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
    this.shuffleCards();
    this.dealCards();
  }

  shuffleCards() {
    let tempDeck = [];
    for(let i = 0; i < 52; i++) {
      let j = Math.floor(Math.random() * this.deck.length);
      tempDeck.push(this.deck[j]);
      this.deck.splice(j,1);
    }
    this.deck = tempDeck;
    this.di = 0;
    console.log(this.deck);
  }

  getNewCard() {
    this.di++
    return this.deck[this.di - 1]
  }

  dealCards() {
    for(let player of this.players) {
      player.hand = [this.getNewCard(), this.getNewCard()];
    }
  }

  getHands() {
    let hands = new Map();
    for(let i = 0; i < this.players.length; i++) {
      hands.set(this.players[i].name, this.players[i].hand);
    }
    console.log(hands);
    return hands;
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

  rotateActivePlayer() {
    if(this.activePlayer + 1 >= this.players.length) {
      this.activePlayer = 0;
    } else {
      this.activePlayer++;
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

  handlePlayerAction(player, amount, action) {
    if(action == 'b') {
      this.handleBet(player, amount);
    } else if(action == 'f') {
      this.handleFold(player);
    } else if(action == 'c') {
      this.handleCall(player);
    } else if(action == 'r') {
      this.handleRaise(player, amount);
    }
    this.rotateActivePlayer();
  }

  handleFlop() {
    this.di++;
    this.betToMatch = 0;
    this.table.push(this.getNewCard());
    this.table.push(this.getNewCard());
    this.table.push(this.getNewCard());
    this.activePlayer = this.dealer + 1;
    if(this.activePlayer >= this.players.length) {
      this.activePlayer = 0;
    }
    this.gameStage++;
  }

  handleTurn() {
    this.di++;
    this.betToMatch = 0;
    this.table.push(this.getNewCard());
    this.activePlayer = this.dealer + 1;
    if(this.activePlayer >= this.players.length) {
      this.activePlayer = 0;
    }
    this.gameStage++;
  }

  handleRiver() {
    this.di++;
    this.betToMatch = 0;
    this.table.push(this.getNewCard());
    this.activePlayer = this.dealer + 1;
    if(this.activePlayer >= this.players.length) {
      this.activePlayer = 0;
    }
    this.gameStage++;
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

  distributePot() {
    let winners = this.determineWinner();
    let payout = this.pot;
    if(winners.length > 1) {
      payout /= winners.length;
      for(let i = 0; i < winners.length; i++) {
        winners[i].chips += payout;
      }
    } else {
      winners[0].chips += payout;
    }
  }

  resetRound() {
    this.pot = 0;
    this.betToMatch = 0;
    this.gameStage = 0;
    this.table = [];
    this.shuffleCards();
    this.rotateDealer();

  }

  #getters
  getPot() {
    return this.pot;
  }

  getBetToMatch() {
    return this.betToMatch;
  }

  getBets() {
    return this.bets;
  }

  getActivePlayer() {
    return this.players[this.activePlayer];
  }

  updateState(newState) {
    //we update it with mongo or maybe just get rid of it 
    this.gameState = { ...this.gameState, ...newState };
  }

}

module.exports = PokerGame;
