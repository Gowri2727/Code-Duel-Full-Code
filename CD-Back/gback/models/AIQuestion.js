const mongoose = require('mongoose');

const aiQuestionSchema = new mongoose.Schema({
  hash: { type: String, unique: true, required: true }, // Hash to avoid duplicate questions
  title: String,
  description: String,
  input: String,
  output: String,
  hint: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIQuestion', aiQuestionSchema);
