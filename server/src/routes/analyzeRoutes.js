const express = require('express');
const router = express.Router();
const { analyze } = require('../controllers/analyzeController');

// No auth required - this just forwards the questionnaire to the ML
// service and returns its report. Add `authenticateToken` here if you
// later want to require a logged-in user before running an analysis.
router.post('/', analyze);

module.exports = router;
