const GameState = require('./models/gameState');
const GameManager = require('./logic/gameManager');

const handleSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('joinGame', async (gameID) => {
            console.log('trying to join game:', gameID); 
            try {
                const gameState = await GameState.findOne({ gameID });

                if (gameState) {
                    console.log('Game found:');
                    console.log('game has players:', gameState.players);
                    if (gameState.players < 2) {
                        socket.join(gameID);
                        socket.gameID = gameID;
                        socket.counter = 0; 

                        console.log(`Socket ${socket.id} joined game ${gameID}`);
                        console.log('socket room has players:', io.sockets.adapter.rooms.get(gameID).size);

                        socket.emit('counterUpdated', socket.counter);
                    } else {
                        console.log('Game is full');
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

        socket.on('incrementCounter', () => {
            console.log('Incrementing counter:', socket.counter); // Add logging here
            socket.counter += 1;
            console.log('New counter value:', socket.counter); // Add logging here
            io.to(socket.gameID).emit('counterUpdated', socket.counter);
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
