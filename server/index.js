const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

//might want to add cors 
const io = socketIo(server);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server is active on ${PORT}`));
