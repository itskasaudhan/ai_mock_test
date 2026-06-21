const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mode: {
    type: String,
    enum: ['interview', 'test'],
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  timeTaken: {
    type: Number,
    default: 0
  },
  conversation: [
    {
      role: {
        type: String,
        enum: ['ai', 'user']
      },
      content: String
    }
  ],
  testAnswers: [
    {
      question: { type: String },
      options: [String],
      correctAnswer: String,
      explanation: String,
      selected: String
    }
  ],
  feedback: {
    type: String,
    default: ''
  },
  weakAreas: [String]
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);