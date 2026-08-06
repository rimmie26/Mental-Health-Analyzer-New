const prisma = require('../config/prisma');
const { logActivity } = require('../utils/activity');

// XP awarded per exercise. Flat for now - matches how Goal XP works today.
const EXERCISE_XP = 20;

exports.completeExercise = async (req, res) => {
  try {
    const userId = req.user.id;
    const { exerciseId, exerciseTitle } = req.body;

    if (exerciseId === undefined || !exerciseTitle) {
      return res.status(400).json({ error: 'exerciseId and exerciseTitle are required' });
    }

    const completion = await prisma.exerciseCompletion.create({
      data: {
        userId,
        exerciseId: Number(exerciseId),
        exerciseTitle,
        xp: EXERCISE_XP,
      },
    });

    await logActivity(userId, 'EXERCISE');

    res.status(201).json({ completion });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record exercise completion', details: error.message });
  }
};

exports.getExerciseHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const completions = await prisma.exerciseCompletion.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });
    res.json({
      completions,
      totalCompleted: completions.length,
      totalXP: completions.reduce((sum, c) => sum + c.xp, 0),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercise history', details: error.message });
  }
};
