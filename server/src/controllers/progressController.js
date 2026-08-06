const prisma = require('../config/prisma');
const { computeStreak, computeConsistency, computeDailyActivity } = require('../utils/activity');

exports.getProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const [activityLogs, exerciseCompletions, goals] = await Promise.all([
      prisma.activityLog.findMany({ where: { userId }, select: { date: true } }),
      prisma.exerciseCompletion.findMany({ where: { userId }, select: { xp: true } }),
      prisma.goal.findMany({ where: { userId } }),
    ]);
    const exerciseCount = exerciseCompletions.length;

    const distinctDates = [...new Set(activityLogs.map((a) => a.date))];

    const streak = computeStreak(distinctDates);
    const consistency = computeConsistency(distinctDates, 30);

    // Need the raw per-day log rows (not just distinct dates) for the chart
    const rawLogs = await prisma.activityLog.findMany({ where: { userId }, select: { date: true } });
    const weeklyActivity = computeDailyActivity(rawLogs, 7);

    const goalXP = goals
      .filter((g) => g.completed >= g.target)
      .reduce((sum, g) => sum + g.xp, 0);
    const exerciseXP = exerciseCompletions.reduce((sum, c) => sum + c.xp, 0);
    const totalXP = goalXP + exerciseXP;

    res.json({
      dayStreak: streak,
      consistencyScore: consistency,
      exercisesDone: exerciseCount,
      totalXP,
      weeklyActivity, // [{ date: 'YYYY-MM-DD', count: n }, ...] last 7 days
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to compute progress', details: error.message });
  }
};
