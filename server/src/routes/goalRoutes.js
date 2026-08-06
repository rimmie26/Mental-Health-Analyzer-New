const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { getGoals, completeGoalStep } = require('../controllers/goalController');

router.get('/', authenticateToken, getGoals);
router.patch('/:id/complete', authenticateToken, completeGoalStep);

module.exports = router;
