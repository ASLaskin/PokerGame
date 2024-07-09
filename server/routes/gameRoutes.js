const express = require('express');
const { createGame,joinGame} = require('../controllers/gameController');

const router = express.Router();

router.post('/game/create', createGame);
router.post('/game/join', joinGame);




module.exports = router;