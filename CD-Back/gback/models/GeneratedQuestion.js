const mongoose = require('mongoose');

const GeneratedQuestionSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: String,
  input: String,
  output: String,
  hint: String,
  difficulty: String,
  questionType: String,
  language: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GeneratedQuestion', GeneratedQuestionSchema);
