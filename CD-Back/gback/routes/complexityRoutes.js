
const express = require('express');
const router = express.Router();
const { analyzeComplexity } = require('../controllers/complexityController');
router.post('/', analyzeComplexity);
module.exports = router;