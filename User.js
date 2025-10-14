const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // New profile fields
  phone: { type: String },
  country: { type: String },
  bio: { type: String },
  profilePicture: { type: String }, // URL to a profile picture
  createdAt: { type: Date, default: Date.now },
  learningPreferences: {
    domain: String,
    level: String,
    learningStyle: String
  },
  enrolledCourses: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false }
  }],
  
  wishlistedCourses: {
    type: [String],
    default: []
  }, // <-- THE FIX IS HERE
  
  savedRoadmaps: {
    type: [String], // An array of roadmap IDs
    default: []
  }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);