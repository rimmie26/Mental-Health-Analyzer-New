const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { getMoodHistory, logMood } = require('../controllers/moodController');

router.get('/', authenticateToken, getMoodHistory);
router.post('/', authenticateToken, logMood);

module.exports = router;
