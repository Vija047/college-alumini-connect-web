const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  date: Date,
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);
