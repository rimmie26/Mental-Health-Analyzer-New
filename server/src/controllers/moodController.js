const prisma = require('../config/prisma');
const { logActivity } = require('../utils/activity');

exports.getMoodHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const entries = await prisma.moodEntry.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mood history', details: error.message });
  }
};

exports.logMood = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mood, date } = req.body;

    if (!mood) {
      return res.status(400).json({ error: 'mood is required' });
    }

    const entryDate = date || new Date().toISOString().split('T')[0];

    // One entry per user per date - update if today's mood was already logged
    const entry = await prisma.moodEntry.upsert({
      where: { userId_date: { userId, date: entryDate } },
      update: { mood },
      create: { userId, date: entryDate, mood },
    });

    await logActivity(userId, 'MOOD', entryDate);

    res.status(201).json({ entry });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log mood', details: error.message });
  }
};
