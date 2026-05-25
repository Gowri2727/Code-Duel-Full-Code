
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { getCodeComplexity } = require('../controllers/aiController');
router.post('/complexity', getCodeComplexity); // ✅ Must be defined

router.post('/question', aiController.generateAIQuestion);
router.post('/fail', (req, res) => {
  req.session.attempts = (req.session.attempts || 0) + 1;
  res.json({ attempts: req.session.attempts });
});

router.get('/attempts', (req, res) => {
  res.json({ attempts: req.session.attempts || 0 });
});

module.exports = router;
