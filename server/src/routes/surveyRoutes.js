const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { submitSurvey, getUserSurveyHistory } = require('../controllers/surveyController');

router.post('/submit', authenticateToken, submitSurvey);
router.get('/history', authenticateToken, getUserSurveyHistory);

module.exports = router;