import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { getToken } from '../../utils/auth';

interface MoodEntry {
  date: string;
  mood: string;
  emoji: string;
}

interface AIInsightsProps {
  moodHistory: MoodEntry[];
  onClose: () => void;
  screeningData?: any[];
}

// AI Insights Generation
const generateInsights = (history: MoodEntry[], screeningData?: any[]) => {
  if (history.length === 0 && (!screeningData || screeningData.length === 0)) {
    return {
      summary: "Start logging your mood to receive personalized insights! 🌟",
      patterns: [],
      recommendations: ["Log your mood daily to get started"],
      stats: { total: 0, unique: 0, bestMood: 'N/A', consistency: '0%' },
      radarData: getDefaultRadarData(),
      riskLevel: 'N/A',
      riskScore: 0,
      totalScreenings: 0
    };
  }

  // Process mood data
  const moods = history.map(m => m.mood);
  const moodCounts = moods.reduce((acc: any, mood) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});

  const mostCommon = Object.entries(moodCounts).sort((a: any, b: any) => b[1] - a[1])[0];
  const uniqueMoods = Object.keys(moodCounts).length;
  const totalEntries = history.length;

  // Calculate consistency streak
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

  // Mood distribution
  const distribution = Object.entries(moodCounts).map(([mood, count]) => ({
    mood,
    count,
    percentage: Math.round((count as number / totalEntries) * 100)
  }));

  // Process screening data for radar
  let radarData = getDefaultRadarData();
  let riskLevel = 'N/A';
  let riskScore = 0;
  let totalScreenings = screeningData?.length || 0;

  if (screeningData && screeningData.length > 0) {
    const latest = screeningData[screeningData.length - 1];
    
    // Calculate radar values from screening answers
    const academicStress = latest?.answers?.academicPressure || latest?.academicPressure || 5;
    const sleepHours = latest?.answers?.sleepHours || latest?.sleepHours || 6;
    const financialStress = latest?.answers?.financialStress || latest?.financialStress || 4;
    const socialSupport = latest?.answers?.socialSupport || latest?.socialSupport || 6;
    const emotionalExhaustion = latest?.answers?.emotionalExhaustion || latest?.emotionalExhaustion || 5;

    radarData = [
      { 
        dimension: 'Academics', 
        value: Math.min(Math.round((academicStress / 10) * 100), 100),
        fullMark: 100 
      },
      { 
        dimension: 'Sleep', 
        value: Math.min(Math.round((8 - Math.min(sleepHours, 8)) / 8 * 100), 100),
        fullMark: 100 
      },
      { 
        dimension: 'Financial', 
        value: Math.min(Math.round((financialStress / 10) * 100), 100),
        fullMark: 100 
      },
      { 
        dimension: 'Social Support', 
        value: Math.min(Math.round((10 - Math.min(socialSupport, 10)) / 10 * 100), 100),
        fullMark: 100 
      },
      { 
        dimension: 'Emotional', 
        value: Math.min(Math.round((emotionalExhaustion / 10) * 100), 100),
        fullMark: 100 
      },
    ];

    riskLevel = latest?.riskLevel || 'Moderate';
    riskScore = latest?.riskScore || 65;
  }

  // Generate pattern insights
  const patterns: string[] = [];
  if (maxStreak >= 7) patterns.push(`🔥 You've maintained a ${maxStreak}-day mood tracking streak!`);
  if (uniqueMoods >= 5) patterns.push(`🌈 You're experiencing a rich emotional palette with ${uniqueMoods} different moods.`);
  if (mostCommon && (mostCommon[0] === 'Happy' || mostCommon[0] === 'Calm')) {
    patterns.push(`😊 Your most common mood is ${mostCommon[0]} — that's wonderful!`);
  } else if (mostCommon && (mostCommon[0] === 'Stressed' || mostCommon[0] === 'Sad')) {
    patterns.push(`💪 You've been feeling ${mostCommon[0]} often. Consider trying our breathing exercises.`);
  }
  if (totalEntries >= 30) patterns.push(`📊 Consistent tracking for ${totalEntries} days — you're building a great habit!`);
  
  // Add screening insights
  if (totalScreenings > 0) {
    patterns.push(`📋 You've completed ${totalScreenings} mental health screenings.`);
    if (riskLevel === 'Low') patterns.push('✅ Your current risk level is Low — keep up the good work!');
    else if (riskLevel === 'Moderate') patterns.push('🌱 Your current risk level is Moderate — consider trying some wellness exercises.');
    else if (riskLevel === 'High') patterns.push('💚 Your current risk level is High — please reach out for support.');
  }
  
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
  if (totalScreenings === 0) {
    recommendations.push('📊 Complete a mental health screening to get detailed insights');
  }
  if (riskLevel === 'High') {
    recommendations.push('💚 Please reach out to a mental health professional for support');
    recommendations.push('📞 Contact your campus counseling center for immediate help');
  }
  if (recommendations.length === 0) {
    recommendations.push('🌟 Keep up the great work! You\'re doing amazing.');
    recommendations.push('🌸 Share your mood garden with a friend');
  }

  return {
    summary: `You've logged ${totalEntries} moods across ${uniqueMoods} different emotions. ${mostCommon ? `Your most common mood is ${mostCommon[0]}.` : ''} ${totalScreenings > 0 ? `You've completed ${totalScreenings} screenings.` : ''}`,
    patterns,
    recommendations,
    stats: {
      total: totalEntries,
      unique: uniqueMoods,
      bestMood: mostCommon ? mostCommon[0] : 'N/A',
      consistency: `${Math.round((maxStreak / Math.max(totalEntries, 30)) * 100)}%`
    },
    distribution,
    radarData,
    riskLevel,
    riskScore,
    totalScreenings
  };
};

// Default radar data
const getDefaultRadarData = () => [
  { dimension: 'Academics', value: 0, fullMark: 100 },
  { dimension: 'Sleep', value: 0, fullMark: 100 },
  { dimension: 'Financial', value: 0, fullMark: 100 },
  { dimension: 'Social Support', value: 0, fullMark: 100 },
  { dimension: 'Emotional', value: 0, fullMark: 100 },
];

export const AIInsights: React.FC<AIInsightsProps> = ({ moodHistory, onClose, screeningData }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'recommendations' | 'radar'>('overview');
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate AI processing
    setIsLoading(true);
    setTimeout(() => {
      const generated = generateInsights(moodHistory, screeningData);
      setInsights(generated);
      setIsLoading(false);
    }, 800);
  }, [moodHistory, screeningData]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-800">Analyzing your wellness data...</h3>
          <p className="text-sm text-gray-500">AI is learning about your emotional wellness</p>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  const hasRadarData = insights.radarData.some((d: any) => d.value > 0);

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
        <div className="flex flex-wrap gap-2 mb-4">
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
            onClick={() => setActiveTab('radar')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'radar'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-chart-radar mr-2"></i>
            Stress Radar
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
              {insights.distribution.length > 0 ? (
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
              ) : (
                <p className="text-gray-500 text-sm">Log your mood to see distribution here.</p>
              )}
            </motion.div>
          )}

          {activeTab === 'radar' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-700">📡 Stress Radar</h4>
                {insights.totalScreenings > 0 && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {insights.totalScreenings} screenings
                  </span>
                )}
              </div>
              
              {hasRadarData ? (
                <>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={insights.radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis 
                          dataKey="dimension" 
                          tick={{ fill: '#4a5568', fontSize: 11 }}
                        />
                        <PolarRadiusAxis 
                          angle={30} 
                          domain={[0, 100]} 
                          tick={{ fill: '#4a5568', fontSize: 9 }}
                        />
                        <Radar
                          name="Stress Level"
                          dataKey="value"
                          stroke="#f59e0b"
                          fill="#f59e0b"
                          fillOpacity={0.3}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Risk Level</p>
                      <p className={`text-sm font-bold ${
                        insights.riskLevel === 'High' ? 'text-red-500' : 
                        insights.riskLevel === 'Moderate' ? 'text-amber-500' : 
                        insights.riskLevel === 'Low' ? 'text-green-500' :
                        'text-gray-500'
                      }`}>
                        {insights.riskLevel || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Risk Score</p>
                      <p className="text-sm font-bold text-gray-800">{insights.riskScore || 0}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Screenings</p>
                      <p className="text-sm font-bold text-gray-800">{insights.totalScreenings}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Status</p>
                      <p className={`text-sm font-bold ${
                        insights.totalScreenings > 0 ? 'text-green-500' : 'text-gray-400'
                      }`}>
                        {insights.totalScreenings > 0 ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">📊</div>
                  <h4 className="text-lg font-semibold text-gray-600">No Data Available</h4>
                  <p className="text-gray-500 text-sm">Complete a screening to see your wellness radar here.</p>
                  <button
                    onClick={() => window.location.href = '/screener'}
                    className="mt-3 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm hover:shadow-lg transition"
                  >
                    Start Screening
                  </button>
                </div>
              )}
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