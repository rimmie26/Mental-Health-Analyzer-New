import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Exercises, exercisesData } from './Exercises';
import { Profile } from './Profile';
import { AdminDashboard } from './AdminDashboard';
import MoodGarden from './MoodGarden';
import AIInsights from './AIInsights';
import WeeklyGoals from "../dashboard/WeeklyGoals";
import { fetchMoodHistory, logMoodEntry, fetchProgress, fetchSurveyHistory, fetchExerciseHistory } from '../../utils/api';
import { getUser } from '../../utils/auth';
import StressRadar from "../dashboard/StressRadar";


interface HomeProps {
  onStartScreening: () => void;
  onLogin: () => void;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

// Gamification System
const calculateLevel = (xp: number) => {
  const level = Math.floor(xp / 100) + 1;
  const nextLevelXP = level * 100;
  const currentLevelXP = (level - 1) * 100;
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return { level, xp, nextLevelXP, progress, currentLevelXP };
};

export const Home: React.FC<HomeProps> = ({ onStartScreening, onLogin, onNavigate, onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showMoodGarden, setShowMoodGarden] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [moodHistory, setMoodHistory] = useState<Array<{date: string; mood: string; emoji: string}>>([]);
  const [currentTip, setCurrentTip] = useState<{title: string, content: string, emoji: string} | null>(null);
  const [userXP, setUserXP] = useState(0);
  const [latestSurvey, setLatestSurvey] = useState<{ sleepHours: number; riskScore: number; createdAt: string } | null>(null);
  const [exercisesThisWeek, setExercisesThisWeek] = useState(0);
  const [completedExerciseIdsToday, setCompletedExerciseIdsToday] = useState<Set<number>>(new Set());
  const user = getUser(); // real logged-in user, was previously ignored ("Good Morning, Alex!" was hardcoded)

  // Load real mood history and XP total from the backend on mount
  useEffect(() => {
    fetchMoodHistory()
      .then((entries: Array<{ date: string; mood: string }>) => {
        setMoodHistory(entries.map((e) => ({ ...e, emoji: getMoodEmoji(e.mood) })));
      })
      .catch((err) => console.warn('Could not load mood history:', err));

    fetchProgress()
      .then((res) => setUserXP(res.totalXP))
      .catch((err) => console.warn('Could not load XP total:', err));

    // Latest screener check-in backs the Sleep Quality / Stress Level cards -
    // these used to be flat hardcoded numbers with fake "from yesterday" deltas.
    fetchSurveyHistory()
      .then((history: Array<{ sleepHours: number; riskScore: number; createdAt: string }>) => {
        if (history.length > 0) setLatestSurvey(history[0]);
      })
      .catch((err) => console.warn('Could not load survey history:', err));

    // Backs the "Exercises This Week" card (replaces the fabricated "Focus Time" -
    // nothing in this app has ever tracked focus time).
    fetchExerciseHistory()
      .then((res) => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recent = res.completions.filter(
          (c: { completedAt: string }) => new Date(c.completedAt) >= weekAgo
        );
        setExercisesThisWeek(recent.length);
      })
      .catch((err) => console.warn('Could not load exercise history:', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { level, xp, nextLevelXP, progress } = calculateLevel(userXP);

  const dailyTips = [
    { 
      title: 'Mindful Breathing', 
      content: 'Take 5 deep breaths. Inhale for 4, hold for 4, exhale for 6. Feel the calm wash over you.',
      emoji: '🌊'
    },
    { 
      title: 'Gratitude Practice', 
      content: 'Write down 3 things you\'re grateful for today. They can be small things - a warm cup of tea, a kind word, or a beautiful sunset.',
      emoji: '📝'
    },
    { 
      title: 'Body Awareness', 
      content: 'Do a quick body scan. Notice any tension in your shoulders, jaw, or neck. Breathe into those areas and release.',
      emoji: '🧘'
    },
    { 
      title: 'Positive Affirmation', 
      content: 'Say this to yourself: "I am enough. I am worthy. I am capable of handling whatever comes my way."',
      emoji: '💪'
    },
    { 
      title: 'Digital Detox', 
      content: 'Take a 10-minute break from screens. Look out the window, notice the colors and shapes around you.',
      emoji: '🌿'
    },
    { 
      title: 'Self-Compassion', 
      content: 'Treat yourself with the same kindness you would show a good friend. You\'re doing your best, and that\'s enough.',
      emoji: '💚'
    },
  ];

  const dailyQuotes = [
    { text: "Your mind is a garden. Water it with positivity.", author: "Serenoa" },
    { text: "Small steps lead to big changes. Keep going.", author: "Serenoa" },
    { text: "You are stronger than you think. Believe it.", author: "Serenoa" },
    { text: "Every day is a new chance to grow.", author: "Serenoa" },
  ];
  const todayQuote = dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)];

  const navItems = [
    { id: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
    { id: 'exercises', icon: 'fa-spa', label: 'Exercises' },
    { id: 'progress', icon: 'fa-chart-line', label: 'Progress' },
    { id: 'profile', icon: 'fa-user', label: 'Profile' },
    // Admin tab is UI-level convenience only - the backend independently enforces
    // role: 'ADMIN' on every /api/admin/* route, so this hiding isn't the real gate.
    ...(user?.role === 'ADMIN' ? [{ id: 'admin', icon: 'fa-user-shield', label: 'Admin' }] : []),
  ];

  // Maps mood labels to a rough 0-10 wellbeing score so we can show a real,
  // trend-aware Mood Score instead of a flat hardcoded "8.5".
  const moodValueMap: Record<string, number> = {
    Happy: 9, Calm: 8, Grateful: 9, Neutral: 6, Sad: 3, Stressed: 2,
  };

  const computeMoodScore = (history: Array<{ date: string; mood: string }>) => {
    if (history.length === 0) return null;
    const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));
    const scored = sorted.map((h) => moodValueMap[h.mood] ?? 6);
    const avg = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length;
    const last7 = scored.slice(-7);
    const prev7 = scored.slice(-14, -7);
    const current = Math.round(avg(last7) * 10) / 10;
    const delta = prev7.length > 0 ? Math.round((avg(last7) - avg(prev7)) * 10) / 10 : null;
    return { current, delta };
  };

  const moodScore = computeMoodScore(moodHistory);
  const sleepQuality = latestSurvey ? Math.round(Math.min(latestSurvey.sleepHours / 8, 1) * 100) / 10 : null;
  const stressLevel = latestSurvey ? Math.round((latestSurvey.riskScore / 10) * 10) / 10 : null;

  const fmtDelta = (d: number | null) => (d === null ? 'No trend yet' : `${d >= 0 ? '+' : ''}${d} from last week`);

  // Every value here is backed by real data - moodScore from logged moods,
  // sleep/stress from the last screener check-in, exercisesThisWeek from
  // ExerciseCompletion rows. Previously all four cards were flat hardcoded
  // numbers with fabricated "+0.5 from yesterday" style deltas.
  const wellnessStats = [
    {
      label: 'Mood Score',
      value: moodScore ? String(moodScore.current) : '—',
      change: moodScore ? fmtDelta(moodScore.delta) : 'Log a mood to start',
      positive: moodScore ? (moodScore.delta ?? 0) >= 0 : null,
      icon: 'fa-smile',
      bg: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      label: 'Sleep Quality',
      value: sleepQuality !== null ? String(sleepQuality) : '—',
      change: latestSurvey ? `From your last check-in` : 'Take the screener',
      positive: null,
      icon: 'fa-moon',
      bg: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      label: 'Stress Level',
      value: stressLevel !== null ? String(stressLevel) : '—',
      change: latestSurvey ? `From your last check-in` : 'Take the screener',
      positive: null,
      icon: 'fa-heart-pulse',
      bg: 'bg-rose-50',
      textColor: 'text-rose-600'
    },
    {
      label: 'Exercises This Week',
      value: String(exercisesThisWeek),
      change: 'Last 7 days',
      positive: null,
      icon: 'fa-dumbbell',
      bg: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
  ];

  // Real exercise catalog, not a disconnected fake list - "done" reflects
  // whether the user actually completed it today, and Start actually
  // navigates to the real guided exercise instead of doing nothing.
  const dailyChallenges = exercisesData.slice(0, 4).map((ex) => ({
    icon: ex.emoji,
    title: ex.title,
    xp: 20,
    done: completedExerciseIdsToday.has(ex.id),
  }));

  const quickActions = [
    { 
      icon: 'fa-brain', 
      label: 'Screening', 
      color: 'from-amber-500 to-orange-500',
      desc: 'Check your wellness',
      onClick: onStartScreening 
    },
    { 
      icon: 'fa-spa', 
      label: 'Exercise', 
      color: 'from-blue-500 to-cyan-500',
      desc: 'Guided session',
      onClick: () => setActiveSection('exercises') 
    },
    { 
      icon: 'fa-heart', 
      label: 'Mood Check', 
      color: 'from-rose-500 to-pink-500',
      desc: 'How are you?',
      onClick: () => setShowMoodModal(true) 
    },
    { 
      icon: 'fa-star', 
      label: 'Daily Tip', 
      color: 'from-purple-500 to-violet-500',
      desc: 'Wellness insight',
      onClick: () => {
        const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];
        setCurrentTip(randomTip);
        setShowTipModal(true);
      }
    },
    { 
      icon: 'fa-seedling', 
      label: 'Mood Garden', 
      color: 'from-emerald-500 to-green-500',
      desc: 'See your blooms',
      onClick: () => setShowMoodGarden(true) 
    },
    { 
      icon: 'fa-brain', 
      label: 'AI Insights', 
      color: 'from-violet-500 to-purple-500',
      desc: 'Smart analysis',
      onClick: () => setShowAIInsights(true) 
    },
  ];

  const achievements = [
    { icon: 'fa-fire', label: '7 Day Streak', color: 'text-orange-500', bg: 'bg-orange-50' },
    { icon: 'fa-star', label: 'Mindful Master', color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { icon: 'fa-moon', label: 'Deep Sleeper', color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { icon: 'fa-heart', label: 'Self-Care Hero', color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  const moods = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😤', label: 'Stressed' },
    { emoji: '😌', label: 'Calm' },
  ];

  const getMoodEmoji = (mood: string) => {
    const found = moods.find(m => m.label === mood);
    return found ? found.emoji : '😊';
  };

  // Add mood to history with date, persisted to the backend
  const addMoodToHistory = (mood: string) => {
    const today = new Date().toISOString().split('T')[0];
    const emoji = getMoodEmoji(mood);

    // Optimistic local update so the UI responds instantly
    setMoodHistory(prev => {
      const existing = prev.find(m => m.date === today);
      if (existing) {
        return prev.map(m => m.date === today ? { ...m, mood, emoji } : m);
      }
      return [...prev, { date: today, mood, emoji }];
    });

    logMoodEntry(mood, today).catch((err) => {
      console.warn('Could not save mood entry to your account:', err);
    });
  };

  // Mood Modal Component
  const MoodModal = () => {
    const moodOptions = [
      { emoji: '😊', label: 'Happy', color: 'text-green-500' },
      { emoji: '😐', label: 'Neutral', color: 'text-gray-500' },
      { emoji: '😔', label: 'Sad', color: 'text-blue-500' },
      { emoji: '😤', label: 'Stressed', color: 'text-red-500' },
      { emoji: '😌', label: 'Calm', color: 'text-teal-500' },
      { emoji: '🤗', label: 'Grateful', color: 'text-amber-500' },
    ];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={() => setShowMoodModal(false)}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-4">
            <span className="text-4xl mb-2 block">😊</span>
            <h3 className="text-lg font-bold text-gray-800">How are you feeling?</h3>
            <p className="text-sm text-gray-500">Select your mood right now</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {moodOptions.map((mood) => (
              <button
                key={mood.label}
                onClick={() => {
                  setSelectedMood(mood.label);
                  addMoodToHistory(mood.label);
                  setShowMoodModal(false);
                }}
                className="p-3 rounded-xl text-center transition-all hover:bg-gray-50 border-2 border-transparent hover:border-amber-200"
              >
                <div className="text-3xl">{mood.emoji}</div>
                <p className={`text-xs font-medium ${mood.color}`}>{mood.label}</p>
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowMoodModal(false)}
            className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-gray-600 transition"
          >
            Cancel
          </button>
        </motion.div>
      </motion.div>
    );
  };

  // Tip Modal Component
  const TipModal = () => {
    const getRandomTip = () => {
      const randomIndex = Math.floor(Math.random() * dailyTips.length);
      return dailyTips[randomIndex];
    };

    const handleNewTip = () => {
      setCurrentTip(getRandomTip());
    };

    if (!currentTip) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={() => setShowTipModal(false)}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-4">
            <span className="text-5xl mb-3 block">{currentTip.emoji}</span>
            <h3 className="text-lg font-bold text-gray-800">{currentTip.title}</h3>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-700 leading-relaxed">{currentTip.content}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleNewTip}
              className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:shadow-lg transition"
            >
              <i className="fas fa-random mr-2"></i>
              Another Tip
            </button>
            <button
              onClick={() => setShowTipModal(false)}
              className="py-2 px-4 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Dashboard Content
  const DashboardContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}
                {user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
              </h2>
              <p className="text-white/90 text-sm mt-1">{todayQuote.text}</p>
              <p className="text-white/70 text-xs mt-1">— {todayQuote.author}</p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm inline-block">
                🏆 Level {level}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <span className="text-xs text-white/80">{xp}/{nextLevelXP} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {wellnessStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            className={`${stat.bg} rounded-xl p-4 border border-gray-100/50 hover:shadow-md transition-all`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <i className={`fas ${stat.icon} ${stat.textColor} text-sm`}></i>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            <p className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-500' : stat.change.startsWith('-') ? 'text-rose-500' : 'text-gray-400'}`}>
              {stat.change} from yesterday
            </p>
          </motion.div>
        ))}
      </div>

      {/* Daily Challenges & Mood */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 text-sm">🎯 Daily Challenges</h3>
            <span className="text-xs text-gray-400">+80 XP available</span>
          </div>
          <div className="space-y-2">
            {dailyChallenges.map((challenge, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl transition-all ${challenge.done ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{challenge.icon}</span>
                  <div>
                    <p className={`text-sm font-medium ${challenge.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                      {challenge.title}
                    </p>
                    <p className="text-xs text-gray-400">+{challenge.xp} XP</p>
                  </div>
                </div>
                {challenge.done ? (
                  <span className="text-green-500 text-sm"><i className="fas fa-check-circle"></i> Done</span>
                ) : (
                  <button className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-full transition">
                    Start
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 text-sm">😊 How are you?</h3>
            {selectedMood && (
              <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                {getMoodEmoji(selectedMood)} {selectedMood}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => {
                  setSelectedMood(mood.label);
                  addMoodToHistory(mood.label);
                }}
                className={`py-2 rounded-lg text-center transition-all ${selectedMood === mood.label ? 'bg-amber-100 border-2 border-amber-400 shadow-md' : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'}`}
              >
                <div className="text-xl">{mood.emoji}</div>
                <div className="text-[10px] text-gray-600">{mood.label}</div>
              </button>
            ))}
          </div>
          <div className="mt-3 p-2 bg-amber-50 rounded-lg text-center">
            <p className="text-xs text-gray-500">✨ Mood logged: {selectedMood || 'Not yet'}</p>
          </div>
        </div>
      </div>

      {/* Weekly Goals */}
      <WeeklyGoals />

      {/* Motivational Message */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p className="text-center text-gray-600">
        🌱 Keep going! Every small step you take today builds a healthier tomorrow.
        </p>
      </div>

      {/* Stress Radar */}
      <StressRadar />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickActions.map((action, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className={`p-3 rounded-xl bg-gradient-to-r ${action.color} text-white shadow-md hover:shadow-lg transition-all text-center`}
          >
            <i className={`fas ${action.icon} text-lg`}></i>
            <p className="font-medium text-xs mt-1">{action.label}</p>
            <p className="text-[10px] text-white/70">{action.desc}</p>
          </motion.button>
        ))}
      </div>

      {/* Achievements */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {achievements.map((ach, i) => (
          <div key={i} className={`${ach.bg} rounded-xl p-3 text-center border border-gray-100`}>
            <i className={`fas ${ach.icon} text-xl ${ach.color}`}></i>
            <p className="text-xs font-medium text-gray-700 mt-1">{ach.label}</p>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100">
        <p className="text-xs text-gray-600 italic text-center">
          "Your mind is like a garden. To see it bloom, water it with patience and positivity."
        </p>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showMoodModal && <MoodModal />}
        {showTipModal && <TipModal />}
        {showMoodGarden && (
          <MoodGarden 
            moodHistory={moodHistory} 
            onClose={() => setShowMoodGarden(false)} 
          />
        )}
        {showAIInsights && (
          <AIInsights 
            moodHistory={moodHistory} 
            onClose={() => setShowAIInsights(false)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );

  // Progress Content - real numbers from GET /api/progress, no hardcoded stats
  const ProgressContent = () => {
    const [progress, setProgress] = useState<{
      dayStreak: number;
      consistencyScore: number;
      exercisesDone: number;
      totalXP: number;
      weeklyActivity: { date: string; count: number }[];
    } | null>(null);
    const [progressLoading, setProgressLoading] = useState(true);
    const [progressError, setProgressError] = useState<string | null>(null);

    useEffect(() => {
      let cancelled = false;
      fetchProgress()
        .then((res) => { if (!cancelled) setProgress(res); })
        .catch((err) => {
          if (cancelled) return;
          setProgressError(err.response?.status === 401 ? 'Log in to see your progress.' : 'Could not load progress.');
        })
        .finally(() => { if (!cancelled) setProgressLoading(false); });
      return () => { cancelled = true; };
    }, []);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">📊 Your Progress</h2>
          <p className="text-gray-500 text-sm">Track your wellness journey</p>
        </div>

        {progressLoading && <p className="text-sm text-gray-400">Loading your progress...</p>}
        {progressError && <p className="text-sm text-amber-600">{progressError}</p>}

        {progress && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <p className="text-3xl font-bold text-amber-500">{progress.dayStreak}</p>
                <p className="text-sm text-gray-500">Day Streak</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${Math.min(progress.dayStreak * 10, 100)}%` }} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <p className="text-3xl font-bold text-blue-500">{progress.consistencyScore}%</p>
                <p className="text-sm text-gray-500">Consistency Score</p>
                <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <p className="text-3xl font-bold text-purple-500">{progress.exercisesDone}</p>
                <p className="text-sm text-gray-500">Exercises Done</p>
                <p className="text-xs text-gray-400 mt-1">All time</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h4 className="font-semibold text-gray-700 mb-4">📈 Last 7 Days</h4>
              <div className="flex items-end gap-3 h-32">
                {progress.weeklyActivity.map((day) => {
                  const height = Math.min(day.count * 30, 100);
                  const label = new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' });
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-lg ${day.count > 0 ? 'bg-gradient-to-t from-amber-400 to-orange-400' : 'bg-gray-200'}`}
                        style={{ height: `${Math.max(height, 6)}%`, minHeight: '6px' }}
                      />
                      <span className="text-[10px] text-gray-400 font-medium">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </motion.div>
    );
  };

  // Settings Content
  const SettingsContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">⚙️ Settings</h2>
        <p className="text-gray-500 text-sm">Customize your experience</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {[
          { icon: 'fa-bell', label: 'Notifications', desc: 'Daily wellness reminders', color: 'text-blue-500' },
          { icon: 'fa-moon', label: 'Dark Mode', desc: 'Switch theme appearance', color: 'text-indigo-500' },
          { icon: 'fa-globe', label: 'Language', desc: 'Change your language', color: 'text-green-500' },
          { icon: 'fa-shield-alt', label: 'Privacy', desc: 'Manage your data', color: 'text-purple-500' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-${item.color.split('-')[1]}-50 flex items-center justify-center`}>
                <i className={`fas ${item.icon} ${item.color}`}></i>
              </div>
              <div>
                <p className="font-medium text-gray-800">{item.label}</p>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            </div>
            <div className="w-10 h-6 bg-gray-200 rounded-full cursor-pointer transition-colors hover:bg-amber-400">
              <div className="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform translate-x-0.5 mt-0.5" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // Main Render
  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard': return <DashboardContent />;
      case 'progress': return <ProgressContent />;
      case 'profile': return <Profile onBack={() => setActiveSection('dashboard')} onLogout={onLogout} />;
      case 'exercises': return <Exercises />;
      case 'admin':
        return user?.role === 'ADMIN'
          ? <AdminDashboard onBack={() => setActiveSection('dashboard')} />
          : <DashboardContent />;
      default: return <DashboardContent />;
    }
  };

  // Main Layout
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-amber-50/80 via-orange-50/80 to-rose-50/80">
      <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-20 md:w-64 bg-white/40 backdrop-blur-xl border-r border-white/30 flex flex-col p-4 md:p-6 min-h-screen sticky top-0"
        >
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <i className="fas fa-brain text-white text-lg"></i>
            </div>
            <span className="text-xl font-bold text-gray-800 hidden md:block">Serenoa</span>
          </div>

          <div className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-500/25'
                    : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                <i className={`fas ${item.icon} text-lg w-6 text-center`}></i>
                <span className="hidden md:block text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2 mt-4">
            <button
              onClick={() => onNavigate('hero')}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-white/50 transition-all border-t border-white/30 pt-4"
            >
              <i className="fas fa-arrow-left text-lg w-6 text-center"></i>
              <span className="hidden md:block text-sm font-medium">Back to Home</span>
            </button>

            <button
              onClick={onLogin}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25"
            >
              <i className="fas fa-user text-lg w-6 text-center"></i>
              <span className="hidden md:block text-sm font-medium">Login</span>
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 max-h-screen overflow-y-auto">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">© 2026 Serenoa — AI Mental Health Companion</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;