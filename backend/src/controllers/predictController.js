const axios = require('axios');
const Prediction = require('../models/Prediction');

const predict = async (req, res) => {
  try {
    const { attendance, marks, studyHours, previousPerformance } = req.body;

    // Validate inputs
    if (
      attendance === undefined || marks === undefined ||
      studyHours === undefined || previousPerformance === undefined
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Call ML service
    const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, {
      attendance: Number(attendance),
      marks: Number(marks),
      study_hours: Number(studyHours),
      previous_performance: Number(previousPerformance),
    });

    const { result, probability, suggestions } = mlResponse.data;

    // Save to MongoDB
    const prediction = await Prediction.create({
      userId: req.user._id,
      attendance: Number(attendance),
      marks: Number(marks),
      studyHours: Number(studyHours),
      previousPerformance: Number(previousPerformance),
      result,
      probability,
      suggestions,
    });

    res.status(201).json({ prediction });
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ message: 'ML service is unavailable. Please start the Python service.' });
    }
    res.status(500).json({ message: error.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ predictions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { predict, getHistory };
