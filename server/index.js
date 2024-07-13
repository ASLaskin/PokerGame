const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const socketIo = require('socket.io');
const gameRoutes = require('./routes/gameRoutes');
const { handleSocket } = require('./socket');
const cors = require('cors');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', // Replace with your front-end URL in production
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }
});

mongoose.connect(process.env.MONGODB_URI, {
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collection: 'sessions'
});

const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your front-end URL in production
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(session({
  name: 'pokerup.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(express.json());
app.use('/api', gameRoutes);

handleSocket(io);


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server is active on ${PORT}`));
