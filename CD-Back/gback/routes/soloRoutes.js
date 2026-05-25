const express = require('express');
const router = express.Router();

// Static sample questions
const questions = [
  {
    question: "Find the factorial of a number",
    difficulty: "Easy",
    type: "DSA"
  },
  {
    question: "Implement binary search",
    difficulty: "Medium",
    type: "DSA"
  },
  {
    question: "Create a to-do list in JavaScript",
    difficulty: "Easy",
    type: "Normal"
  },
  {
    question: "Build a basic calculator",
    difficulty: "Medium",
    type: "Normal"
  }
];

router.post('/solo', (req, res) => {
  const { difficulty, questionType } = req.body;

  const match = questions.find(
    q => q.difficulty === difficulty && q.type === questionType
  );

  if (match) {
    res.json({ question: match.question });
  } else {
    res.status(404).json({ error: 'No question found for the selection' });
  }
});

module.exports = router;
