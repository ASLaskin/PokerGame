const GameState = require('./models/gameState');

function handleSocket(io) {
    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
        // socket.on('createGame', (data) => {
        //     console.log('createGame', data);
        //     const gameState = new GameState({
        //         game: 'waiting',
        //         players: [data.player]
        //     });
        //     gameState.save().then(() => {
        //         console.log('Game state saved');
        //         socket.emit('gameCreated', gameState);
        //     }).catch(err => {
        //         console.log(err);
        //     });
        // });
    });
}

module.exports = { handleSocket };