const prisma = require('../config/prisma');

// Default set of goals seeded for a user the first time they load their goals
const DEFAULT_GOALS = [
  { title: 'Sleep 8 Hours', target: 7, xp: 40 },
  { title: 'Meditation', target: 7, xp: 30 },
  { title: 'Exercise', target: 5, xp: 50 },
  { title: 'Study 2 Hours', target: 7, xp: 60 },
];

exports.getGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    let goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    // First time this user has ever loaded goals - seed defaults
    if (goals.length === 0) {
      await prisma.goal.createMany({
        data: DEFAULT_GOALS.map((g) => ({ ...g, userId })),
      });
      goals = await prisma.goal.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      });
    }

    const totalXP = Math.round(
      goals.reduce((sum, g) => {
      const earned = (g.completed / g.target) * g.xp;
      return sum + earned;
      }, 0)
    );

    res.json({ goals, totalXP });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch goals', details: error.message });
  }
};

exports.completeGoalStep = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const goal = await prisma.goal.findFirst({ where: { id, userId } });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const updated = await prisma.goal.update({
      where: { id },
      data: { completed: Math.min(goal.completed + 1, goal.target) },
    });

    res.json({ goal: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update goal', details: error.message });
  }
};
