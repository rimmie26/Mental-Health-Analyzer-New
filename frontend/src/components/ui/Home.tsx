import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Exercises } from './Exercises';
import { ExerciseDetail } from './ExerciseDetail';
import { Progress } from './Progress';
import { Profile } from './Profile';

interface HomeProps {
  onStartScreening: () => void;
  onLogin: () => void;
  onNavigate: (page: string) => void;
}

// Gamification System
const calculateLevel = (xp: number) => {
  const level = Math.floor(xp / 100) + 1;
  const nextLevelXP = level * 100;
  const currentLevelXP = (level - 1) * 100;
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return { level, xp, nextLevelXP, progress, currentLevelXP };
};

export const Home: React.FC<HomeProps> = ({ onStartScreening, onLogin, onNavigate }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<any | null>(null);
  
  // User progress data
  const userXP = 450;
  const { level, xp, nextLevelXP, progress } = calculateLevel(userXP);

  const navItems = [
    { id: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
    { id: 'exercises', icon: 'fa-spa', label: 'Exercises' },
    { id: 'progress', icon: 'fa-chart-line', label: 'Progress' },
    { id: 'profile', icon: 'fa-user', label: 'Profile' },
  ];

  const moods = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😤', label: 'Stressed' },
    { emoji: '😌', label: 'Calm' },
  ];

  // Daily wellness stats
  const wellnessStats = [
    { 
      label: 'Mood Score', 
      value: '8.5/10', 
      change: '+0.5', 
      icon: 'fa-smile',
      color: 'from-green-400 to-emerald-500',
      bg: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      label: 'Sleep Quality', 
      value: '7.2 hrs', 
      change: '+0.8', 
      icon: 'fa-moon',
      color: 'from-indigo-400 to-blue-500',
      bg: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      label: 'Stress Level', 
      value: '3.2/10', 
      change: '-1.5', 
      icon: 'fa-heart-pulse',
      color: 'from-rose-400 to-pink-500',
      bg: 'bg-rose-50',
      textColor: 'text-rose-600'
    },
    { 
      label: 'Focus Time', 
      value: '4.5 hrs', 
      change: '+1.2', 
      icon: 'fa-clock',
      color: 'from-purple-400 to-violet-500',
      bg: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
  ];

  // Weekly data for chart
  const weeklyData = [
    { day: 'Mon', value: 65, label: 'Good' },
    { day: 'Tue', value: 75, label: 'Great' },
    { day: 'Wed', value: 45, label: 'Okay' },
    { day: 'Thu', value: 85, label: 'Excellent' },
    { day: 'Fri', value: 70, label: 'Good' },
    { day: 'Sat', value: 55, label: 'Fair' },
    { day: 'Sun', value: 80, label: 'Great' },
  ];

  // Quick action buttons
  const quickActions = [
    { 
      icon: 'fa-brain', 
      label: 'Quick Screening', 
      color: 'from-amber-500 to-orange-500',
      desc: '5 min assessment',
      onClick: onStartScreening 
    },
    { 
      icon: 'fa-spa', 
      label: 'Guided Exercise', 
      color: 'from-blue-500 to-cyan-500',
      desc: '10 min session',
      onClick: () => setActiveSection('exercises') 
    },
    { 
      icon: 'fa-journal-whills', 
      label: 'Mood Journal', 
      color: 'from-purple-500 to-violet-500',
      desc: 'Quick check-in',
      onClick: () => console.log('Open journal') 
    },
    { 
      icon: 'fa-hand-holding-heart', 
      label: 'Daily Tip', 
      color: 'from-rose-500 to-pink-500',
      desc: 'Wellness insight',
      onClick: () => console.log('Show tip') 
    },
  ];

  // Achievements
  const achievements = [
    { icon: 'fa-fire', label: '7 Day Streak', color: 'text-orange-500', bg: 'bg-orange-50' },
    { icon: 'fa-star', label: 'Mindful Master', color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { icon: 'fa-moon', label: 'Deep Sleeper', color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { icon: 'fa-heart', label: 'Self-Care Hero', color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  const getMoodEmoji = (mood: string) => {
    const found = moods.find(m => m.label === mood);
    return found ? found.emoji : '😊';
  };

  // Dashboard Content
  const DashboardContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Welcome & Level Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Good Morning, Alex! 👋</h2>
              <p className="text-white/90 mt-1">You're making great progress today</p>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm flex items-center gap-2">
                  🏆 Level {level}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <span className="text-xs text-white/80">{xp} / {nextLevelXP} XP</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                  ✨ {nextLevelXP - xp} XP to next level
                </div>
              </div>
            </div>
            <div className="mt-3 md:mt-0">
              <div className="bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-sm flex items-center gap-2">
                <span className="text-green-300">●</span>
                All caught up
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wellness Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {wellnessStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
                <p className={`text-xs font-medium mt-0.5 ${stat.change.startsWith('+') ? 'text-green-500' : stat.change.startsWith('-') ? 'text-rose-500' : 'text-gray-400'}`}>
                  {stat.change} from yesterday
                </p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <i className={`fas ${stat.icon} ${stat.textColor}`}></i>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mood & Progress Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mood Check */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 text-sm">How are you feeling?</h3>
            {selectedMood && (
              <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full flex items-center gap-1">
                {getMoodEmoji(selectedMood)} {selectedMood}
              </span>
            )}
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(mood.label)}
                className={`py-2.5 rounded-lg text-center transition-all ${
                  selectedMood === mood.label
                    ? 'bg-amber-100 border-2 border-amber-400 shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <div className="text-xl">{mood.emoji}</div>
                <div className="text-[10px] text-gray-600 mt-0.5">{mood.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 text-sm">Weekly Progress</h3>
            <span className="text-xs text-gray-400">This week</span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {weeklyData.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative group">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${item.value}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className={`rounded-lg transition-all ${
                      item.value > 70 ? 'bg-emerald-400' : 
                      item.value > 50 ? 'bg-amber-400' : 'bg-gray-300'
                    }`}
                    style={{ height: `${item.value}%`, minHeight: '16px' }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
                      {item.value}%
                    </div>
                  </motion.div>
                </div>
                <span className="text-[10px] text-gray-400 font-medium">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white shadow-lg hover:shadow-xl transition-all text-left`}
          >
            <i className={`fas ${action.icon} text-lg`}></i>
            <p className="font-medium text-sm mt-1">{action.label}</p>
            <p className="text-xs text-white/70">{action.desc}</p>
          </motion.button>
        ))}
      </div>

      {/* Daily Quote */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
        <p className="text-sm text-gray-600 italic text-center">
          "Your mind is like a garden. To see it bloom, water it with patience and positivity."
        </p>
        <p className="text-xs text-gray-400 text-center mt-1">— Daily Wellness Insight</p>
      </div>
    </motion.div>
  );

  // Main Render
  const renderContent = () => {
    if (selectedExercise) {
      return (
        <ExerciseDetail
          exercise={selectedExercise}
          onBack={() => setSelectedExercise(null)}
          onComplete={() => console.log('Exercise completed!')}
        />
      );
    }

    switch(activeSection) {
      case 'dashboard': return <DashboardContent />;
      case 'progress': return <Progress onBack={() => setActiveSection('dashboard')} />;
      case 'profile': return <Profile onBack={() => setActiveSection('dashboard')} onLogout={onLogin} />;
      case 'exercises': return <Exercises onSelectExercise={setSelectedExercise} />;
      default: return <DashboardContent />;
    }
  };

  // Main Layout
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-amber-100/60 via-amber-50/80 to-orange-100/60">
      <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />

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