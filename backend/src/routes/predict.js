const express = require('express');
const { predict, getHistory } = require('../controllers/predictController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, predict);
router.get('/history', protect, getHistory);

module.exports = router;
