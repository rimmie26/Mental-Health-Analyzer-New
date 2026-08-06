const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const { getBreakdown, getCorrelation, exportCSV } = require('../controllers/adminController');

router.use(authenticateToken, requireAdmin);

router.get('/breakdown', getBreakdown);       // ?groupBy=department|year|gender
router.get('/correlation', getCorrelation);   // Pearson correlation heatmap across survey variables
router.get('/export/csv', exportCSV);         // downloadable per-student CSV

module.exports = router;