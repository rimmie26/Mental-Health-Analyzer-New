const prisma = require('../config/prisma');
const { correlationMatrix } = require('../utils/stats');

const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH'];

// Shared optional filters so any admin view can be scoped down,
// e.g. GET /api/admin/correlation?department=CSE&year=2&gender=Female
function buildStudentFilter(query) {
  const where = { role: 'STUDENT' };
  if (query.department) where.department = query.department;
  if (query.year) where.year = Number(query.year);
  if (query.gender) where.gender = query.gender;
  return where;
}

// Most recent SurveyResponse per user, keyed by userId. A student may have
// taken the screener multiple times - breakdowns/exports should reflect where
// they stand *now*, not an average of every attempt.
async function getLatestSurveyByUser(userIds) {
  const surveys = await prisma.surveyResponse.findMany({
    where: { userId: { in: userIds } },
    orderBy: { createdAt: 'desc' },
  });
  const latestByUser = new Map();
  for (const s of surveys) {
    if (!latestByUser.has(s.userId)) latestByUser.set(s.userId, s); // first hit per user = most recent, since sorted desc
  }
  return latestByUser;
}

// GET /api/admin/breakdown?groupBy=department|year|gender
// Optional filters: department, year, gender (to drill into a subgroup before grouping again)
exports.getBreakdown = async (req, res) => {
  try {
    const groupBy = ['department', 'year', 'gender'].includes(req.query.groupBy)
      ? req.query.groupBy
      : 'department';

    const students = await prisma.user.findMany({
      where: buildStudentFilter(req.query),
      select: { id: true, department: true, year: true, gender: true },
    });

    const latestByUser = await getLatestSurveyByUser(students.map((s) => s.id));

    const groups = new Map();
    for (const student of students) {
      const key = student[groupBy] ?? 'Unspecified';
      if (!groups.has(key)) {
        groups.set(key, {
          group: key,
          studentCount: 0,
          studentsWithSurvey: 0,
          riskScoreSum: 0,
          riskDistribution: { LOW: 0, MEDIUM: 0, HIGH: 0, NO_DATA: 0 },
        });
      }
      const g = groups.get(key);
      g.studentCount += 1;

      const survey = latestByUser.get(student.id);
      if (survey) {
        g.studentsWithSurvey += 1;
        g.riskScoreSum += survey.riskScore;
        if (RISK_LEVELS.includes(survey.overallRisk)) {
          g.riskDistribution[survey.overallRisk] += 1;
        }
      } else {
        g.riskDistribution.NO_DATA += 1;
      }
    }

    const result = [...groups.values()]
      .map((g) => ({
        group: g.group,
        studentCount: g.studentCount,
        studentsWithSurvey: g.studentsWithSurvey,
        avgRiskScore: g.studentsWithSurvey
          ? Math.round((g.riskScoreSum / g.studentsWithSurvey) * 100) / 100
          : null,
        riskDistribution: g.riskDistribution,
      }))
      .sort((a, b) => String(a.group).localeCompare(String(b.group)));

    res.json({ groupBy, groups: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to compute breakdown', details: error.message });
  }
};

// GET /api/admin/correlation
// Pearson correlation across every recorded survey response (each response is one
// data point) so the relationship reflects variables reported together in the same
// screener attempt - not a per-student "latest" snapshot, which would throw away data.
// Optional filters: department, year, gender.
exports.getCorrelation = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: buildStudentFilter(req.query),
      select: { id: true },
    });

    const surveys = await prisma.surveyResponse.findMany({
      where: { userId: { in: students.map((s) => s.id) } },
      select: {
        academicPressure: true,
        sleepHours: true,
        financialStress: true,
        socialSupport: true,
        riskScore: true,
      },
    });

    const variables = [
      { name: 'academicPressure', label: 'Academic Pressure', values: surveys.map((s) => s.academicPressure) },
      { name: 'sleepHours', label: 'Sleep Hours', values: surveys.map((s) => s.sleepHours) },
      { name: 'financialStress', label: 'Financial Stress', values: surveys.map((s) => s.financialStress) },
      { name: 'socialSupport', label: 'Social Support', values: surveys.map((s) => s.socialSupport) },
      { name: 'riskScore', label: 'Risk Score', values: surveys.map((s) => s.riskScore) },
    ];

    res.json({
      sampleSize: surveys.length,
      variables: variables.map((v) => v.name),
      labels: variables.map((v) => v.label),
      matrix: correlationMatrix(variables), // matrix[i][j] = correlation(variables[i], variables[j]); null if not computable
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to compute correlation', details: error.message });
  }
};

function escapeCsvField(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsvRow(fields) {
  return fields.map(escapeCsvField).join(',');
}

// GET /api/admin/export/csv
// One row per student: demographics + latest survey snapshot + basic engagement counts.
// Optional filters: department, year, gender.
exports.exportCSV = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: buildStudentFilter(req.query),
      select: { id: true, name: true, email: true, department: true, year: true, gender: true },
    });
    const userIds = students.map((s) => s.id);

    const [latestByUser, exerciseStats, completedGoals] = await Promise.all([
      getLatestSurveyByUser(userIds),
      prisma.exerciseCompletion.groupBy({
        by: ['userId'],
        where: { userId: { in: userIds } },
        _count: { _all: true },
        _sum: { xp: true },
      }),
      prisma.goal.findMany({
        where: { userId: { in: userIds } },
        select: { userId: true, completed: true, target: true, xp: true },
      }),
    ]);

    const exerciseByUser = new Map(exerciseStats.map((e) => [e.userId, e]));

    // completed goals only (mirrors the totalXP fix in goalController - a goal
    // only counts once completed >= target, not just for existing)
    const goalXpByUser = new Map();
    const goalCountByUser = new Map();
    for (const g of completedGoals) {
      if (g.completed >= g.target) {
        goalXpByUser.set(g.userId, (goalXpByUser.get(g.userId) || 0) + g.xp);
        goalCountByUser.set(g.userId, (goalCountByUser.get(g.userId) || 0) + 1);
      }
    }

    const header = [
      'Name', 'Email', 'Department', 'Year', 'Gender',
      'LatestSurveyDate', 'OverallRisk', 'RiskScore',
      'AcademicPressure', 'SleepHours', 'FinancialStress', 'SocialSupport',
      'ExercisesCompleted', 'GoalsCompleted', 'TotalXP',
    ];
    const rows = [toCsvRow(header)];

    for (const student of students) {
      const survey = latestByUser.get(student.id);
      const exercise = exerciseByUser.get(student.id);
      const exercisesCompleted = exercise ? exercise._count._all : 0;
      const exerciseXp = exercise ? exercise._sum.xp || 0 : 0;
      const goalsCompleted = goalCountByUser.get(student.id) || 0;
      const goalXp = goalXpByUser.get(student.id) || 0;

      rows.push(toCsvRow([
        student.name,
        student.email,
        student.department ?? '',
        student.year ?? '',
        student.gender ?? '',
        survey ? survey.createdAt.toISOString().slice(0, 10) : '',
        survey ? survey.overallRisk : '',
        survey ? survey.riskScore : '',
        survey ? survey.academicPressure : '',
        survey ? survey.sleepHours : '',
        survey ? survey.financialStress : '',
        survey ? survey.socialSupport : '',
        exercisesCompleted,
        goalsCompleted,
        exerciseXp + goalXp,
      ]));
    }

    const csv = rows.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="mindwell-admin-export.csv"');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export CSV', details: error.message });
  }
};