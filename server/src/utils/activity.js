const prisma = require('../config/prisma');

const todayStr = () => new Date().toISOString().split('T')[0];

/**
 * Records that a user did something today (or on a given date).
 * Upserts so calling this twice for the same user/type/date is a no-op,
 * not a duplicate row.
 */
const logActivity = async (userId, type, date = todayStr()) => {
  return prisma.activityLog.upsert({
    where: { userId_type_date: { userId, type, date } },
    update: {},
    create: { userId, type, date },
  });
};

/**
 * Current day streak: consecutive days (ending today or yesterday) where
 * the user logged at least one activity of any type.
 */
const computeStreak = (distinctDates) => {
  if (distinctDates.length === 0) return 0;

  const dateSet = new Set(distinctDates);
  const cursor = new Date();
  // If nothing logged today yet, the streak can still count from yesterday
  if (!dateSet.has(todayStr())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (dateSet.has(cursor.toISOString().split('T')[0])) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

/**
 * % of the last `windowDays` days that had at least one logged activity.
 */
const computeConsistency = (distinctDates, windowDays = 30) => {
  if (distinctDates.length === 0) return 0;
  const dateSet = new Set(distinctDates);
  const cursor = new Date();
  let activeDays = 0;
  for (let i = 0; i < windowDays; i++) {
    if (dateSet.has(cursor.toISOString().split('T')[0])) activeDays += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return Math.round((activeDays / windowDays) * 100);
};

/**
 * Activity count per day for the last `days` days, oldest first -
 * shape the frontend weekly chart can render directly.
 */
const computeDailyActivity = (allLogs, days = 7) => {
  const counts = {};
  for (const log of allLogs) {
    counts[log.date] = (counts[log.date] || 0) + 1;
  }
  const result = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() - (days - 1));
  for (let i = 0; i < days; i++) {
    const dateStr = cursor.toISOString().split('T')[0];
    result.push({ date: dateStr, count: counts[dateStr] || 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
};

module.exports = { todayStr, logActivity, computeStreak, computeConsistency, computeDailyActivity };
