const GameState = require('../models/gameState');
const makeid = require('../tools/utility');

const createGame = async (req, res) => {
    const players = 0;
    const gameID = makeid(6);
    const playerNames = [req.body.name];
    const gameState = new GameState({
        gameID: gameID,
        players: players,
        gameStatus: 'waiting',
        playerNames: playerNames
    });

    try {
        await gameState.save();
        req.session.gameID = gameID;
        req.session.playerName = req.body.name;
        req.session.save();
        res.status(201).json(gameState);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const joinGame = async (req, res) => {
    const { gameID } = req.body;

    try {
        const gameState = await GameState.findOne({ gameID });
        if (!gameState) {
            return res.status(404).json({ message: 'Game not found' });
        }
        if (gameState.players >= 2) {
            return res.status(400).json({ message: 'Game is full' });
        }
        gameState.players += 1;
        gameState.playerNames.push(req.body.name);
        gameState.gameStatus = 'full'; 
        await gameState.save();

        req.session.gameID = gameID;
        req.session.playerName = req.body.name;
        req.session.save();

        res.status(200).json(gameState);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const matchMake = async (req, res) => {
    try {
        let gameState = await GameState.findOne({ players: { $lt: 2 }, gameStatus: 'waiting' });
        
        if (gameState) {
            gameState.playerNames.push(req.body.name);
            if (gameState.players === 2) {
                gameState.gameStatus = 'full'; 
            }
            await gameState.save();

            req.session.gameID = gameState.gameID;
            req.session.playerName = req.body.name;
            req.session.save();

            res.status(200).json(gameState);
        } else {
            await createGame(req, res);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createGame, joinGame, matchMake };
