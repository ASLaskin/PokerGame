const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const socketIo = require('socket.io');
const gameRoutes = require('./routes/gameRoutes');
const { handleSocket } = require('./socket');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collection: 'sessions'
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use(express.json());
app.use('/api', gameRoutes);

//handleSocket(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server is active on ${PORT}`));
