const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  attendance: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  marks: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  studyHours: {
    type: Number,
    required: true,
    min: 0,
    max: 24,
  },
  previousPerformance: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  result: {
    type: String,
    enum: ['PASS', 'FAIL'],
    required: true,
  },
  probability: {
    type: Number,
    required: true,
  },
  suggestions: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('Prediction', predictionSchema);
