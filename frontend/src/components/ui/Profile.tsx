import React from 'react';
import { motion } from 'framer-motion';

interface ProfileProps {
  onBack?: () => void;
  onLogout?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onBack, onLogout }) => {
  const userStats = [
    { label: 'Total XP', value: '450', icon: 'fa-star', color: 'text-yellow-500' },
    { label: 'Level', value: '12', icon: 'fa-trophy', color: 'text-amber-500' },
    { label: 'Exercises', value: '12', icon: 'fa-check-circle', color: 'text-green-500' },
    { label: 'Streak', value: '14', icon: 'fa-fire', color: 'text-orange-500' },
  ];

  const profileMenu = [
    { icon: 'fa-user', label: 'Edit Profile', desc: 'Update your personal information' },
    { icon: 'fa-bell', label: 'Notifications', desc: 'Manage your notification settings' },
    { icon: 'fa-shield-alt', label: 'Privacy', desc: 'Control your privacy settings' },
    { icon: 'fa-moon', label: 'Dark Mode', desc: 'Switch theme appearance' },
    { icon: 'fa-language', label: 'Language', desc: 'Change your preferred language' },
    { icon: 'fa-download', label: 'Export Data', desc: 'Download your wellness report' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-3xl">
              😊
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Alex Johnson</h2>
            <p className="text-white/80 text-sm">alex@serenoa.ai</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs flex items-center gap-1">
                🏆 Level 12
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs flex items-center gap-1">
                ⭐ 450 XP
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs flex items-center gap-1">
                🔥 14 Day Streak
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {userStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-all"
          >
            <i className={`fas ${stat.icon} text-2xl ${stat.color}`}></i>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Profile Menu */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {profileMenu.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            whileHover={{ backgroundColor: 'rgba(251, 191, 36, 0.05)' }}
            className="flex items-center justify-between p-4 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center`}>
                <i className={`fas ${item.icon} text-amber-500`}></i>
              </div>
              <div>
                <p className="font-medium text-gray-800">{item.label}</p>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            </div>
            <i className="fas fa-chevron-right text-gray-300"></i>
          </motion.div>
        ))}
      </div>

      {/* Logout Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onLogout}
        className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
      >
        <i className="fas fa-sign-out-alt"></i>
        Logout
      </motion.button>
    </motion.div>
  );
};

export default Profile;