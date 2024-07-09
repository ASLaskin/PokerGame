const mongoose = require('mongoose');

const gameStateSchema = new mongoose.Schema({
    gameID: { type: String, required: true, unique: true },
    players: { type: Number, required: true },
    gameStatus: { type: String, required: true, default: 'waiting' },
    createdAt: { type: Date, default: Date.now }
});

const GameState = mongoose.model('GameState', gameStateSchema);

module.exports = GameState;