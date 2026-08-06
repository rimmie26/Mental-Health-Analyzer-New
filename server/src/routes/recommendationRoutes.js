const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { getRecommendations } = require('../controllers/recommendationController');

router.get('/', authenticateToken, getRecommendations);

module.exports = router;