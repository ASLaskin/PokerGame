const GameState = require('../models/gameState');
const makeid = require('../utils/utility');

const createGame = async (req, res) => {
    name = req.body.name;
    const players = 1;
    const gameID = makeid(6);
    const gameState = new GameState({
        gameID: gameID,
        players: players,
        gameStatus: 'waiting'
    });

    try {
        await gameState.save();
        req.session.gameID = gameID;
        req.session.playerName = name;
        req.session.save();
        res.status(201).json(gameState);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}
const joinGame = async (req, res) => {
    const { gameID, player } = req.body;

    try {
        const gameState = await GameState.findOne({ gameID });

        if (!gameState) {
            return res.status(404).json({ message: 'Game not found' });
        }

        gameState.players.push(player);
        await gameState.save();

        req.session.gameID = gameID; 
        req.session.playerName = name;
        req.session.save(); 

        res.status(200).json(gameState);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createGame, joinGame };