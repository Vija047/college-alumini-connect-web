const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  batch: String,
  branch: String,
  jobTitle: String,
  graduationYear: Number,
  location: String,
  tags: [String],
  achievements: [achievementSchema],
  isVerified: { type: Boolean, default: false } ,
  linkedinUrl: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
