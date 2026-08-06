const axios = require('axios');
const prisma = require('../config/prisma');

/**
 * Helper function to determine root causes if ML service is offline
 */
const calculateFallbackRootCauses = (academicPressure, sleepHours, financialStress, socialSupport) => {
  const causes = [];
  if (sleepHours < 6) causes.push('Poor Sleep');
  if (academicPressure >= 7) causes.push('Academic Pressure');
  if (financialStress >= 7) causes.push('Financial Stress');
  if (socialSupport <= 4) causes.push('Loneliness');
  return causes.length > 0 ? causes : ['General Academic Stress'];
};

exports.submitSurvey = async (req, res) => {
  try {
    const userId = req.user.id;
    const { academicPressure, sleepHours, financialStress, socialSupport } = req.body;

    // Validate inputs
    if (academicPressure === undefined || sleepHours === undefined) {
      return res.status(400).json({ error: 'Missing essential survey metrics' });
    }

    let overallRisk = 'LOW';
    let riskScore = 30.0;
    let topRootCauses = [];

    // Attempt to call Prajwal's ML Service API
    try {
      const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5000/predict';
      const response = await axios.post(mlServiceUrl, {
        academicPressure,
        sleepHours,
        financialStress,
        socialSupport
      }, { timeout: 3000 });

      overallRisk = response.data.overallRisk || 'MEDIUM';
      riskScore = response.data.riskScore || 50.0;
      topRootCauses = response.data.topRootCauses || [];
    } catch (mlError) {
      console.log('⚠️ ML Service unreachable. Falling back to internal rule engine.');
      
      // Fallback evaluation
      topRootCauses = calculateFallbackRootCauses(academicPressure, sleepHours, financialStress, socialSupport);
      
      if (sleepHours < 5 || academicPressure >= 8 || financialStress >= 8) {
        overallRisk = 'HIGH';
        riskScore = 82.5;
      } else if (sleepHours < 7 || academicPressure >= 6 || financialStress >= 6) {
        overallRisk = 'MEDIUM';
        riskScore = 58.0;
      } else {
        overallRisk = 'LOW';
        riskScore = 25.0;
      }
    }

    // Save survey result to SQLite Database
    const survey = await prisma.surveyResponse.create({
      data: {
        userId,
        academicPressure: Number(academicPressure),
        sleepHours: Number(sleepHours),
        financialStress: Number(financialStress),
        socialSupport: Number(socialSupport),
        overallRisk,
        riskScore,
        topRootCauses: JSON.stringify(topRootCauses)
      }
    });

    res.status(201).json({
      message: 'Survey processed successfully',
      survey: {
        ...survey,
        topRootCauses: JSON.parse(survey.topRootCauses)
      }
    });
  } catch (error) {
    console.error('Survey Submission Error:', error);
    res.status(500).json({ error: 'Failed to submit survey', details: error.message });
  }
};

exports.getUserSurveyHistory = async (req, res) => {
  try {
    const history = await prisma.surveyResponse.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    const parsedHistory = history.map(item => ({
      ...item,
      topRootCauses: JSON.parse(item.topRootCauses)
    }));

    res.json(parsedHistory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve survey history' });
  }
};