const express = require('express');
const { createGame,joinGame, matchMake} = require('../controllers/gameController');

const router = express.Router();

router.post('/game/create', createGame);
router.post('/game/join', joinGame);
router.post('/game/matchmake', matchMake);




module.exports = router;