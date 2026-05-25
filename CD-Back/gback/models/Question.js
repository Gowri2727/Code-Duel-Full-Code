
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: String,
  description: String,
  input: mongoose.Schema.Types.Mixed,     // Sample Input
  output: mongoose.Schema.Types.Mixed,    // Sample Output
  hint: String,
  hidden: mongoose.Schema.Types.Mixed,    // Hidden Test Case
  hash: { type: String, unique: true },   // MD5 hash to prevent duplicates
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);
