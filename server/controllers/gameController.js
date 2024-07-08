const GameState = require('../models/gameState');
const makeid = require('../utils/utility');

const createGame = async (req, res) => {
    const {players} = req.body;
    const gameID = makeid(6);
    const gameState = new GameState({
        gameID: gameID,
        players: players,
        gameStatus: 'waiting'
    });

    try {
        await gameState.save();
        res.status(201).json(gameState);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}