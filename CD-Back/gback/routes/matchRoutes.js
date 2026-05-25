// routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const { evaluateMatch } = require('../controllers/matchController');

let waitingUsers = [];

router.post('/match', (req, res) => {
  const { language, difficulty, questionType, players } = req.body;

  // Match users with the same settings
  const matchedUsers = waitingUsers.filter(
    user =>
      user.language === language &&
      user.difficulty === difficulty &&
      user.questionType === questionType
  );

  if (matchedUsers.length >= (players - 1)) {
    const group = matchedUsers.slice(0, players - 1);
    waitingUsers = waitingUsers.filter(u => !group.includes(u));
    res.json({ matched: true, group: [...group, req.body] });
  } else {
    waitingUsers.push(req.body);
    res.json({ matched: false, message: 'Waiting for more players...' });
  }
});
router.post('/decide-winner', evaluateMatch);
module.exports = router;
