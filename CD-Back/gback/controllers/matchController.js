const decideWinner = require('../utils/decideWinner');

exports.evaluateMatch = (req, res) => {
  const { userA, userB } = req.body;

  if (!userA || !userB) {
    return res.status(400).json({ error: 'Missing player data' });
  }

  const result = decideWinner(userA, userB);
  res.json({ winner: result });
};
