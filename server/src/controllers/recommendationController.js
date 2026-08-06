const prisma = require('../config/prisma');

const ACTION_MAP = {
  'Poor Sleep': [
    'Establish a strict 11 PM sleep schedule',
    'Turn off screens 60 minutes before bed',
    'Limit caffeine intake after 4 PM'
  ],
  'Academic Pressure': [
    'Use the 25-minute Pomodoro study technique',
    'Break complex assignments into daily sub-tasks',
    'Schedule a guidance session during professor office hours'
  ],
  'Financial Stress': [
    'Explore campus work-study opportunities',
    'Use the MindWell student budget planner',
    'Check institutional financial aid and scholarship portals'
  ],
  'Loneliness': [
    'Join a campus club or interest group',
    'Attend weekly peer study sessions in the hostel lounge',
    'Participate in weekend campus sports or cultural activities'
  ]
};

exports.getRecommendations = async (req, res) => {
  try {
    const latestSurvey = await prisma.surveyResponse.findFirst({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    if (!latestSurvey) {
      return res.status(404).json({ error: 'No survey history found for user' });
    }

    const rootCauses = JSON.parse(latestSurvey.topRootCauses);
    
    const personalizedPlan = rootCauses.map(cause => ({
      rootCause: cause,
      actionItems: ACTION_MAP[cause] || ['Consult campus counseling resources']
    }));

    res.json({
      overallRisk: latestSurvey.overallRisk,
      riskScore: latestSurvey.riskScore,
      actionPlan: personalizedPlan
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
};