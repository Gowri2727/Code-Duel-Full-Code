const express = require('express');
const router = express.Router();
const { findOpponent } = require('../controllers/matchmakingController');

router.post('/find-opponent', findOpponent); // ✅ This is the route your frontend is calling

module.exports = router;