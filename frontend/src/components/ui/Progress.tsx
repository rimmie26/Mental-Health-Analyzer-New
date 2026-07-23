import React from 'react';
import { motion } from 'framer-motion';

interface ProgressProps {
  onBack?: () => void;
}

export const Progress: React.FC<ProgressProps> = ({ onBack }) => {
  // Stats data
  const stats = [
    { 
      label: 'Day Streak', 
      value: '14', 
      sub: '2 more days to 16', 
      icon: 'fa-fire', 
      color: 'from-amber-400 to-orange-500',
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-500',
      progress: 70,
      badge: '🔥 Best'
    },
    { 
      label: 'Consistency Score', 
      value: '85%', 
      sub: '↑ 5% from last week', 
      icon: 'fa-chart-line', 
      color: 'from-blue-400 to-cyan-500',
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
      progress: 85,
      badge: '↑ 5%'
    },
    { 
      label: 'Exercises Done', 
      value: '12', 
      sub: '3 new this week', 
      icon: 'fa-check-circle', 
      color: 'from-purple-400 to-violet-500',
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
      progress: 75,
      badge: '✨ New'
    },
  ];

  // Weekly data
  const weeklyData = [
    { day: 'Mon', value: 65, label: 'Good' },
    { day: 'Tue', value: 75, label: 'Great' },
    { day: 'Wed', value: 45, label: 'Okay' },
    { day: 'Thu', value: 85, label: 'Excellent' },
    { day: 'Fri', value: 70, label: 'Good' },
    { day: 'Sat', value: 55, label: 'Fair' },
    { day: 'Sun', value: 80, label: 'Great' },
  ];

  // Milestones
  const milestones = [
    { icon: 'fa-fire', label: '7 Day Streak', date: '2 days ago', color: 'text-orange-500', bg: 'bg-orange-50' },
    { icon: 'fa-star', label: 'Mindful Master', date: '5 days ago', color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { icon: 'fa-moon', label: 'Deep Sleeper', date: '1 week ago', color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { icon: 'fa-heart', label: 'Self-Care Hero', date: '2 weeks ago', color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">📊 Your Progress</h2>
            <p className="text-white/80 mt-1">Track your wellness journey and celebrate your growth</p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm hover:bg-white/30 transition-all"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back
            </button>
          )}
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
            🏆 Level 12
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
            ⭐ 450 XP
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
            📅 30 days active
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className={`${stat.bg} rounded-2xl p-6 border border-gray-100/50 hover:shadow-lg transition-all`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                <i className={`fas ${stat.icon} ${stat.iconColor} text-xl`}></i>
              </div>
              <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">
                {stat.badge}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
              <div 
                className={`bg-gradient-to-r ${stat.color} h-1.5 rounded-full`} 
                style={{ width: `${stat.progress}%` }} 
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-semibold text-gray-700">📈 Weekly Activity</h4>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="text-xs text-gray-400">This week</span>
          </div>
        </div>
        <div className="flex items-end gap-3 h-40">
          {weeklyData.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${item.value}%` }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className={`w-full rounded-lg relative ${
                  item.value > 70 ? 'bg-gradient-to-t from-amber-400 to-orange-400' : 
                  item.value > 50 ? 'bg-gradient-to-t from-blue-400 to-cyan-400' : 
                  'bg-gray-300'
                }`}
                style={{ height: `${item.value}%`, minHeight: '16px' }}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap">
                  {item.value}% — {item.label}
                </div>
              </motion.div>
              <span className="text-[10px] text-gray-400 font-medium">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Milestones */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-700">🏅 Recent Milestones</h4>
          <span className="text-xs text-gray-400">Last 30 days</span>
        </div>
        <div className="space-y-3">
          {milestones.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center justify-between p-4 ${item.bg} rounded-xl hover:shadow-sm transition-all`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center`}>
                  <i className={`fas ${item.icon} ${item.color}`}></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-400">Achieved</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{item.date}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quote */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
        <p className="text-sm text-gray-600 italic text-center">
          "Small steps lead to big changes. Every day you show up, you grow stronger."
        </p>
        <p className="text-xs text-gray-400 text-center mt-1">— Daily Wellness Insight</p>
      </div>
    </motion.div>
  );
};

export default Progress;