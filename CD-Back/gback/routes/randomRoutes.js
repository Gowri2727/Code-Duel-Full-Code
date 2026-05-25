const express = require('express');
const router = express.Router();

let randomWaitingUsers = [];

router.post('/random', (req, res) => {
  const { language, difficulty, questionType, languagePreference } = req.body;

  // Match same language or any depending on preference
  const matchedUsers = randomWaitingUsers.filter(user => {
    const languageMatch =
      languagePreference === 'same'
        ? user.language === language
        : true;

    return (
      languageMatch &&
      user.difficulty === difficulty &&
      user.questionType === questionType
    );
  });

  if (matchedUsers.length >= 1) {
    const opponent = matchedUsers[0];
    randomWaitingUsers = randomWaitingUsers.filter(u => u !== opponent);
    res.json({ matched: true, opponents: [opponent, req.body] });
  } else {
    randomWaitingUsers.push(req.body);
    res.json({ matched: false, message: 'Waiting for opponent...' });
  }
});

module.exports = router;
