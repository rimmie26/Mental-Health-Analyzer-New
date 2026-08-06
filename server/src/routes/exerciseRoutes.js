const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { completeExercise, getExerciseHistory } = require('../controllers/exerciseController');

router.post('/complete', authenticateToken, completeExercise);
router.get('/history', authenticateToken, getExerciseHistory);

module.exports = router;
