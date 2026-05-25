
const express = require('express');
const router = express.Router();
const { generateAIQuestion } = require('../controllers/aiController');

// Route to get AI-generated question
router.post('/question', generateAIQuestion);
// router.post('/submit-code', submitUserCode);

module.exports = router;