import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MoodEntry {
  date: string;
  mood: string;
  emoji: string;
}

interface AIInsightsProps {
  moodHistory: MoodEntry[];
  onClose: () => void;
}

// AI Insights Generation
const generateInsights = (history: MoodEntry[]) => {
  if (history.length === 0) {
    return {
      summary: "Start logging your mood to receive personalized insights! 🌟",
      patterns: [],
      recommendations: ["Log your mood daily to get started"],
      stats: { total: 0, unique: 0, bestMood: 'N/A', consistency: '0%' }
    };
  }

  const moods = history.map(m => m.mood);
  const moodCounts = moods.reduce((acc: any, mood) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});

  const mostCommon = Object.entries(moodCounts).sort((a: any, b: any) => b[1] - a[1])[0];
  const uniqueMoods = Object.keys(moodCounts).length;
  const totalEntries = history.length;

  // Calculate consistency (how many days in a row)
  let streak = 0;
  let maxStreak = 0;
  const sortedDates = history.map(m => new Date(m.date)).sort((a, b) => a.getTime() - b.getTime());
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      streak = 1;
    } else {
      const diff = (sortedDates[i].getTime() - sortedDates[i-1].getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 1) {
        streak++;
      } else {
        streak = 1;
      }
    }
    maxStreak = Math.max(maxStreak, streak);
  }

  // Mood distribution for chart
  const distribution = Object.entries(moodCounts).map(([mood, count]) => ({
    mood,
    count,
    percentage: Math.round((count as number / totalEntries) * 100)
  }));

  // Generate pattern insights
  const patterns: string[] = [];
  if (maxStreak >= 7) patterns.push(`🔥 You've maintained a ${maxStreak}-day mood tracking streak!`);
  if (uniqueMoods >= 5) patterns.push(`🌈 You're experiencing a rich emotional palette with ${uniqueMoods} different moods.`);
  if (mostCommon && mostCommon[0] === 'Happy' || mostCommon[0] === 'Calm') {
    patterns.push(`😊 Your most common mood is ${mostCommon[0]} — that's wonderful!`);
  } else if (mostCommon && mostCommon[0] === 'Stressed' || mostCommon[0] === 'Sad') {
    patterns.push(`💪 You've been feeling ${mostCommon[0]} often. Consider trying our breathing exercises.`);
  }
  if (totalEntries >= 30) patterns.push(`📊 Consistent tracking for ${totalEntries} days — you're building a great habit!`);
  if (patterns.length === 0) patterns.push("🌱 Keep tracking your mood to unlock more insights!");

  // Recommendations
  const recommendations: string[] = [];
  if (mostCommon && (mostCommon[0] === 'Stressed' || mostCommon[0] === 'Sad')) {
    recommendations.push('🧘 Try our 4-7-8 breathing exercise to reduce stress');
    recommendations.push('📝 Practice gratitude journaling to shift your perspective');
  }
  if (totalEntries < 7) {
    recommendations.push('📅 Aim to log your mood daily for 7 days to see patterns');
  }
  if (uniqueMoods < 3) {
    recommendations.push('🌈 Try to notice and log a wider range of emotions');
  }
  if (recommendations.length === 0) {
    recommendations.push('🌟 Keep up the great work! You\'re doing amazing.');
    recommendations.push('🌸 Share your mood garden with a friend');
  }

  return {
    summary: `You've logged ${totalEntries} moods across ${uniqueMoods} different emotions. ${mostCommon ? `Your most common mood is ${mostCommon[0]}.` : ''}`,
    patterns,
    recommendations,
    stats: {
      total: totalEntries,
      unique: uniqueMoods,
      bestMood: mostCommon ? mostCommon[0] : 'N/A',
      consistency: `${Math.round((maxStreak / Math.max(totalEntries, 30)) * 100)}%`
    },
    distribution
  };
};

export const AIInsights: React.FC<AIInsightsProps> = ({ moodHistory, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'recommendations'>('overview');
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate AI processing
    setIsLoading(true);
    setTimeout(() => {
      const generated = generateInsights(moodHistory);
      setInsights(generated);
      setIsLoading(false);
    }, 800);
  }, [moodHistory]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-800">Analyzing your mood patterns...</h3>
          <p className="text-sm text-gray-500">AI is learning about your emotional wellness</p>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">🧠 AI Insights</h2>
            <p className="text-sm text-gray-500">Your personalized wellness analysis</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-6 border border-amber-100">
          <p className="text-sm text-gray-700 leading-relaxed">{insights.summary}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-xl font-bold text-amber-600">{insights.stats.total}</p>
            <p className="text-xs text-gray-500">Total Entries</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-xl font-bold text-blue-600">{insights.stats.unique}</p>
            <p className="text-xs text-gray-500">Unique Moods</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-xl font-bold text-green-600">{insights.stats.bestMood}</p>
            <p className="text-xs text-gray-500">Most Common</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-xl font-bold text-purple-600">{insights.stats.consistency}</p>
            <p className="text-xs text-gray-500">Consistency</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-chart-pie mr-2"></i>
            Overview
          </button>
          <button
            onClick={() => setActiveTab('patterns')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'patterns'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-lightbulb mr-2"></i>
            Patterns
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'recommendations'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-heart mr-2"></i>
            Recommendations
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h4 className="font-semibold text-gray-700">📊 Mood Distribution</h4>
              <div className="space-y-2">
                {insights.distribution.map((item: any) => (
                  <div key={item.mood} className="flex items-center gap-3">
                    <span className="text-sm w-20 text-gray-600">{item.mood}</span>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-full bg-gradient-to-r ${
                          item.mood === 'Happy' ? 'from-yellow-400 to-yellow-500' :
                          item.mood === 'Calm' ? 'from-green-400 to-green-500' :
                          item.mood === 'Neutral' ? 'from-gray-400 to-gray-500' :
                          item.mood === 'Sad' ? 'from-blue-400 to-blue-500' :
                          item.mood === 'Stressed' ? 'from-red-400 to-red-500' :
                          'from-amber-400 to-orange-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-12">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'patterns' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {insights.patterns.map((pattern: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-xl border border-amber-100">
                  <span className="text-xl mt-0.5">✨</span>
                  <p className="text-sm text-gray-700">{pattern}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'recommendations' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {insights.recommendations.map((rec: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl border border-green-100">
                  <span className="text-xl mt-0.5">💡</span>
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-xl transition hover:shadow-lg"
        >
          Close Insights
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AIInsights;