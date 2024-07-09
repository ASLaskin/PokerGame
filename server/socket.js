const GameState = require('./models/gameState');
const GameManager = require('./logic/gameManager');

const handleSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('joinGame', async ({ gameID, playerName }) => {
            const gameState = await GameState.findOne({ gameID });

            if (gameState) {
                socket.join(gameID);
                socket.gameID = gameID;
                socket.playerName = playerName;

                console.log(`Socket ${socket.id} joined game ${gameID} as ${playerName}`);

                // socket.to(gameID).emit('playerJoined', { playerName });
            } else {
                socket.emit('error', { message: 'Game not found' });
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            if (socket.gameID) {
             
                // socket.to(socket.gameID).emit('playerLeft', { playerName: socket.playerName });
            }
        });
    });
};

module.exports = { handleSocket };