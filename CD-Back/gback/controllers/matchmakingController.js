let matchQueue = {}; // basic in-memory queue

exports.findOpponent = (req, res) => {
  const { difficulty, questionType } = req.body;
  const key = `${difficulty}-${questionType}`;
  const userId = Date.now();
  
  if (!matchQueue[key]) matchQueue[key] = [];

  matchQueue[key].push({ userId });

  // If match found immediately
  if (matchQueue[key].length >= 2) {
    const player1 = matchQueue[key].shift();
    const player2 = matchQueue[key].shift();
    const roomId = `${key}-${Date.now()}`;
    return res.json({ matchFound: true, roomId });
  }

  // No match yet — wait 10 seconds then timeout
  setTimeout(() => {
    const stillWaiting = matchQueue[key].find(u => u.userId === userId);

    if (stillWaiting) {
      // Remove from queue after timeout
      matchQueue[key] = matchQueue[key].filter(u => u.userId !== userId);
      return res.json({ matchFound: false });
    }
  }, 20000); // 10 seconds max wait
};
