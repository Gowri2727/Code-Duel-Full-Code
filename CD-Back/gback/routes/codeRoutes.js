
const express = require('express');
const router = express.Router();
const { runUserCode, submitCode } = require('../controllers/codeController');

router.post('/run', runUserCode);
router.post('/submit', submitCode);

module.exports = router;
