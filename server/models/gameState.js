const mongoose = require('mongoose');

const gameStateSchema = new mongoose.Schema({
    //this will be either waiting, inProgress, or complete
    gameStatus: {
        type: String,
        required: true
    },
    gameID: {
        type: String,
        required: true
    },
    //dont know if we need but could be used to keep track of amount of players
    players: {
        type: Array,
        required: true
    },
});

const GameState = mongoose.model('GameState', gameStateSchema);

module.exports = GameState;