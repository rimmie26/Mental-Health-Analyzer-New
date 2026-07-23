import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Exercises } from './Exercises';
import { ExerciseDetail } from './ExerciseDetail';

interface HomeProps {
  onStartScreening: () => void;
  onLogin: () => void;
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onStartScreening, onLogin, onNavigate }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<any | null>(null);

  const navItems = [
    { id: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
    { id: 'exercises', icon: 'fa-spa', label: 'Exercises' },
    { id: 'progress', icon: 'fa-chart-line', label: 'Progress' },
    { id: 'settings', icon: 'fa-cog', label: 'Settings' },
  ];

  const moods = [
    { emoji: '😊', label: 'Happy', color: 'bg-green-100 text-green-700 border-green-200' },
    { emoji: '😐', label: 'Neutral', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    { emoji: '😔', label: 'Sad', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { emoji: '😤', label: 'Stressed', color: 'bg-red-100 text-red-700 border-red-200' },
    { emoji: '😌', label: 'Calm', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  ];

  const achievements = [
    { icon: 'fa-fire', label: '7 Day Streak', color: 'text-orange-500', bg: 'bg-orange-100' },
    { icon: 'fa-star', label: 'Mindful Master', color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { icon: 'fa-moon', label: 'Deep Sleeper', color: 'text-indigo-500', bg: 'bg-indigo-100' },
    { icon: 'fa-heart', label: 'Self-Care Hero', color: 'text-red-500', bg: 'bg-red-100' },
  ];

  const weeklyData = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 75 },
    { day: 'Wed', value: 45 },
    { day: 'Thu', value: 85 },
    { day: 'Fri', value: 70 },
    { day: 'Sat', value: 55 },
    { day: 'Sun', value: 80 },
  ];

  const renderContent = () => {
    // If an exercise is selected, show detail view
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
      case 'dashboard':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Hello, Alex! 🎉</h2>
                  <p className="text-gray-600 mt-1">You're doing great. Today is a perfect day to focus on your inner calm.</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-400 px-3 py-1 rounded-full">
                      <span className="text-xs font-semibold text-white">Level 12</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full" style={{ width: '65%' }} />
                      </div>
                      <span className="text-xs text-gray-500">120 XP to next level</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-2">
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    <i className="fas fa-check-circle"></i>
                    All caught up
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Wellness Score', value: '75', sub: 'Optimum', color: 'from-emerald-400 to-green-500', icon: 'fa-heart' },
                { label: 'Burnout Risk', value: '32%', sub: '↓ 4% vs last week', color: 'from-blue-400 to-cyan-500', icon: 'fa-shield-alt' },
                { label: 'Day Streak', value: '14', sub: '🔥 Top 5% this month', color: 'from-amber-400 to-orange-500', icon: 'fa-fire' },
                { label: 'XP Earned', value: '450', sub: '✨ This week', color: 'from-purple-400 to-pink-500', icon: 'fa-star' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100/50 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <i className={`fas ${stat.icon} text-gray-400 text-xs`}></i>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                  <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">{stat.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick Mood Check */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">Quick Mood Check</h3>
                {selectedMood && (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    Logged: {selectedMood}
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {moods.map((mood) => (
                  <motion.button
                    key={mood.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMood(mood.label)}
                    className={`px-4 py-2 rounded-xl border-2 transition-all ${
                      selectedMood === mood.label 
                        ? 'border-amber-400 bg-amber-50 shadow-md' 
                        : mood.color + ' border-transparent hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm">{mood.emoji} {mood.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">Weekly Wellness Progress</h3>
                <span className="text-xs text-gray-400">This week</span>
              </div>
              <div className="flex items-end gap-2 h-32">
                {weeklyData.map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${item.value}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                      className={`w-full rounded-lg relative group ${
                        item.value > 70 
                          ? 'bg-gradient-to-t from-amber-400 to-orange-400' 
                          : item.value > 50 
                          ? 'bg-gradient-to-t from-blue-400 to-cyan-400'
                          : 'bg-gray-300'
                      }`}
                      style={{ height: `${item.value}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-0.5 rounded">
                        {item.value}%
                      </div>
                    </motion.div>
                    <span className="text-[10px] text-gray-400">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {achievements.map((ach, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`${ach.bg} rounded-xl p-4 text-center border border-gray-100/50`}
                >
                  <i className={`fas ${ach.icon} text-2xl ${ach.color}`}></i>
                  <p className="text-xs font-medium text-gray-700 mt-2">{ach.label}</p>
                  <p className="text-[10px] text-gray-400">Achieved</p>
                </motion.div>
              ))}
            </div>

            {/* Start Screening Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStartScreening}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <i className="fas fa-play-circle"></i>
              Start Wellness Screening
            </motion.button>

            {/* Daily Quote */}
            <div className="bg-gradient-to-r from-amber-100/30 to-orange-100/30 rounded-2xl p-4 border border-amber-100/50">
              <p className="text-sm text-gray-600 italic text-center">
                "Your mind is like a garden. To see it bloom, you must first clear the weeds of worry."
              </p>
              <p className="text-xs text-gray-400 text-center mt-1">— Zen Proverb</p>
            </div>
          </motion.div>
        );

      case 'exercises':
        return <Exercises onSelectExercise={setSelectedExercise} />;

      case 'progress':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <h2 className="text-2xl font-bold text-gray-800">📊 Your Progress</h2>
              <p className="text-gray-600 mt-1">Track your wellness journey over time</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50 text-center">
                <div className="text-3xl font-bold text-amber-500">14</div>
                <p className="text-sm text-gray-500">Day Streak</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-400 h-1.5 rounded-full" style={{ width: '70%' }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">70% to 20 days</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50 text-center">
                <div className="text-3xl font-bold text-blue-500">85%</div>
                <p className="text-sm text-gray-500">Consistency Score</p>
                <p className="text-xs text-gray-400 mt-1">↑ 5% from last week</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50 text-center">
                <div className="text-3xl font-bold text-purple-500">12</div>
                <p className="text-sm text-gray-500">Exercises Completed</p>
                <p className="text-xs text-gray-400 mt-1">⭐ 3 new this week</p>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50">
              <h4 className="font-semibold text-gray-700 mb-3">Recent Milestones</h4>
              <div className="space-y-3">
                {[
                  { icon: 'fa-fire', label: '7 Day Streak', date: '2 days ago', color: 'text-orange-500' },
                  { icon: 'fa-star', label: 'Mindful Master', date: '5 days ago', color: 'text-yellow-500' },
                  { icon: 'fa-moon', label: 'Deep Sleeper', date: '1 week ago', color: 'text-indigo-500' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <i className={`fas ${item.icon} ${item.color}`}></i>
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </div>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <h2 className="text-2xl font-bold text-gray-800">⚙️ Settings</h2>
              <p className="text-gray-600 mt-1">Customize your wellness experience</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100/50 divide-y divide-gray-100">
              {[
                { icon: 'fa-bell', label: 'Notifications', desc: 'Daily reminders and wellness tips', color: 'text-blue-500' },
                { icon: 'fa-moon', label: 'Dark Mode', desc: 'Switch to dark theme appearance', color: 'text-indigo-500' },
                { icon: 'fa-globe', label: 'Language', desc: 'Change your preferred language', color: 'text-green-500' },
                { icon: 'fa-shield-alt', label: 'Privacy', desc: 'Manage your data and privacy settings', color: 'text-purple-500' },
                { icon: 'fa-bell-slash', label: 'Do Not Disturb', desc: 'Pause notifications during focus time', color: 'text-red-500' },
                { icon: 'fa-download', label: 'Export Data', desc: 'Download your wellness report', color: 'text-gray-500' },
              ].map((setting, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(251, 191, 36, 0.05)' }}
                  className="flex items-center justify-between p-4 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-${setting.color.split('-')[1]}-100 flex items-center justify-center`}>
                      <i className={`fas ${setting.icon} ${setting.color}`}></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{setting.label}</p>
                      <p className="text-sm text-gray-500">{setting.desc}</p>
                    </div>
                  </div>
                  <motion.div whileHover={{ x: 5 }} className="flex items-center gap-2">
                    <div className="w-10 h-6 bg-gray-300 rounded-full cursor-pointer transition-colors hover:bg-amber-400">
                      <div className="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform translate-x-0.5 mt-0.5" />
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-4 border border-red-200/50 text-center">
              <p className="text-xs text-gray-500">
                <i className="fas fa-info-circle text-amber-500 mr-1"></i>
                All your data is encrypted and stored securely.
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-amber-100/60 via-amber-50/80 to-orange-100/60">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />

      <div className="relative z-10 flex min-h-screen">
        {/* Vertical Navigation - Left Side */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-20 md:w-64 bg-white/40 backdrop-blur-xl border-r border-white/30 flex flex-col p-4 md:p-6 min-h-screen sticky top-0"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <i className="fas fa-brain text-white text-lg"></i>
            </div>
            <span className="text-xl font-bold text-gray-800 hidden md:block">Serenoa</span>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 space-y-2">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-500/25'
                    : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                <i className={`fas ${item.icon} text-lg w-6 text-center`}></i>
                <span className="hidden md:block text-sm font-medium">{item.label}</span>
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeDot"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white hidden md:block"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="space-y-2 mt-4">
            <motion.button
              whileHover={{ x: 4 }}
              onClick={() => onNavigate('hero')}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-white/50 transition-all duration-300 border-t border-white/30 pt-4"
            >
              <i className="fas fa-arrow-left text-lg w-6 text-center"></i>
              <span className="hidden md:block text-sm font-medium">Back to Home</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogin}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-amber-500/25"
            >
              <i className="fas fa-user text-lg w-6 text-center"></i>
              <span className="hidden md:block text-sm font-medium">Login</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content - Right Side */}
        <div className="flex-1 p-4 md:p-8 max-h-screen overflow-y-auto">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">© 2026 Serenoa — AI Mental Health Companion</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;