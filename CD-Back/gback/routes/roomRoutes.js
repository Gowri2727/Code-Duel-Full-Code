// backend/routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.post('/create', roomController.createRoom);
router.post('/join', roomController.joinRoom);
router.post('/status', roomController.updateStatus);
router.get('/users/:roomCode', roomController.getRoomUsers);
router.post('/leave', roomController.leaveRoom);
router.post('/start', roomController.startMatch);

module.exports = router;
