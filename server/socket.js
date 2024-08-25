const GameState = require('./models/gameState');
const pokerGame = require('./logic/pokerGame');

const games = {};

const handleSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('joinGame', async (gameID, name) => {
            console.log('trying to join game:', gameID);
            try {
                const gameState = await GameState.findOne({ gameID });

                if (gameState) {
                    console.log('Game found:');
                    if (gameState.players < 2) {
                        socket.join(gameID);

                        if (!games[gameID]) {
                            games[gameID] = new pokerGame(gameID);
                        }
                        games[gameID].addPlayer(name);

                        console.log('player added to game:', games[gameID].getPlayers());

                        gameState.players += 1;

                        if (gameState.players == 2) {
                            gameState.gameStatus = 'In Progress';
                        }
                        socket.gameID = gameID;
                        socket.counter = 0;
                        await gameState.save();

                        // console.log(`Socket ${socket.id} joined game ${gameID}`);
                        // console.log('socket room has players:', io.sockets.adapter.rooms.get(gameID).size);

                        //it might be worth to emit the pokerGame or Player objects to client

                        if (gameState.players == 2) {
                            io.to(gameID).emit('gameStart', games[gameID].getPlayers());
                        }
                    } else {
                        console.log('Game is full');
                        console.log('gamestate:', gameState);
                        socket.emit('error', { message: 'Game is full' });
                    }
                } else {
                    socket.emit('error', { message: 'Game not found' });
                }
            } catch (error) {
                console.error('Error joining game:', error);
                socket.emit('error', { message: 'Internal server error' });
            }
        });

        socket.on('startRound', async (gameID) => {
            games[gameID].startGame();
            const hands = games[gameID].getHands();
            io.to(gameID).emit('roundStart', Array.from(hands.entries()));
        });

        socket.on('handleBet', async (gameID, name) => {
            if (games[gameID].getActivePlayer().name == name) {
                games[gameID].handlePlayerAction("hi", 40, 'b');
            }
        });

        socket.on('handleCall', async (gameID, name) => {
            if (games[gameID].getActivePlayer().name == name) {
                games[gameID].handlePlayerAction("hi", 0, 'c');
            }

            io.to(gameID).emit('updateTable', games[gameID].getTableCards());
            console.log("Updating table with new cards", games[gameID].getTableCards());
        });

        socket.on('handleCheck', async (gameID, name) => {
            try {
                const game = games[gameID];

                if (game.getActivePlayer().name === name) {
                    if (game.getCurrentBet() === 0) {
                        game.handlePlayerAction(name, 0, 'k');  
                        console.log(`${name} checked.`);

                        io.to(gameID).emit('changeAction', game.getActivePlayer().name);
                        io.to(gameID).emit('updateChips', Array.from(game.getPlayerChips().entries()));

                        if (game.isRoundOver()) {
                            io.to(gameID).emit('updateTable', games[gameID].getTableCards());
                            io.to(gameID).emit('changeAction', game.getActivePlayer().name);
                        }
                    } else {
                        socket.emit('error', { message: 'You cant check theres a bet' });
                    }
                } else {
                    socket.emit('error', { message: 'It aint your turn.' });
                }
            } catch (error) {
                console.error('Error handling check', error);
                socket.emit('error', { message: 'error while  check' });
            }
        });

        socket.on("changeAction", async (gameID) => {
            io.to(gameID).emit('changeAction', games[gameID].getActivePlayer().name);
            const chips = games[gameID].getPlayerChips();
            io.to(gameID).emit('updateChips', Array.from(chips.entries()));
            if (games[gameID].getGameStage() == 0) {
                const hands = games[gameID].getHands();
                io.to(gameID).emit('roundStart', Array.from(hands.entries()));
            }
        });

        socket.on('disconnect', async () => {
            console.log('Client disconnected:', socket.id);
            if (socket.gameID) {
                try {
                    const gameState = await GameState.findOne({ gameID: socket.gameID });
                    if (gameState) {
                        gameState.players -= 1;
                        //change to properly handle player disconnect
                        await gameState.save();

                        //delete game if no players are left
                        if (gameState.players.length === 0) {
                            await GameState.deleteOne({ gameID: socket.gameID });
                        }
                    }
                } catch (error) {
                    console.error('Error on disconnect:', error);
                }
            }
        });
    });
};

module.exports = { handleSocket };
