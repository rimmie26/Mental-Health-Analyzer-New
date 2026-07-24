import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MoodEntry {
  date: string;
  mood: string;
  emoji: string;
}

interface MoodGardenProps {
  moodHistory: MoodEntry[];
  onClose: () => void;
}

// Flower mapping - Fixed duplicate 'Happy' key
const moodFlowers: { [key: string]: { emoji: string; color: string; bg: string } } = {
  'Happy': { emoji: '🌻', color: 'text-yellow-500', bg: 'bg-yellow-50' },
  'Calm': { emoji: '🌸', color: 'text-pink-400', bg: 'bg-pink-50' },
  'Neutral': { emoji: '🌿', color: 'text-green-500', bg: 'bg-green-50' },
  'Sad': { emoji: '💧', color: 'text-blue-400', bg: 'bg-blue-50' },
  'Stressed': { emoji: '🌵', color: 'text-orange-500', bg: 'bg-orange-50' },
  'Grateful': { emoji: '🌺', color: 'text-rose-500', bg: 'bg-rose-50' },
};

const getFlowerForMood = (mood: string): { emoji: string; color: string; bg: string } => {
  return moodFlowers[mood] || { emoji: '🌸', color: 'text-pink-400', bg: 'bg-pink-50' };
};

export const MoodGarden: React.FC<MoodGardenProps> = ({ moodHistory, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [gardenView, setGardenView] = useState<'grid' | 'list'>('grid');
  const [expandedFlower, setExpandedFlower] = useState<MoodEntry | null>(null);

  // Generate last 30 days
  const getLast30Days = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const entry = moodHistory.find(m => m.date === dateStr);
      days.push({
        date: dateStr,
        day: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' }),
        isToday: i === 0,
        entry: entry || null
      });
    }
    return days;
  };

  const days = getLast30Days();

  // Stats
  const totalEntries = moodHistory.length;
  
  // Get unique moods - Fixed: properly extract mood strings
  const moodStrings = moodHistory.map(m => m.mood);
  const uniqueMoods = [...new Set(moodStrings)];
  
  // Find most common mood - Fixed comparison
  let mostCommonMood = 'No data';
  if (uniqueMoods.length > 0) {
    let maxCount = 0;
    uniqueMoods.forEach(mood => {
      const count = moodHistory.filter(m => m.mood === mood).length;
      if (count > maxCount) {
        maxCount = count;
        mostCommonMood = mood;
      }
    });
  }

  const getMoodEmoji = (mood: string) => {
    const flower = getFlowerForMood(mood);
    return flower.emoji;
  };

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
            <h2 className="text-2xl font-bold text-gray-800">🌸 Your Mood Garden</h2>
            <p className="text-sm text-gray-500">Watch your emotional wellness bloom</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-100">
            <p className="text-2xl font-bold text-amber-600">{totalEntries}</p>
            <p className="text-xs text-gray-500">Total Entries</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 text-center border border-green-100">
            <p className="text-2xl font-bold text-green-600">{uniqueMoods.length}</p>
            <p className="text-xs text-gray-500">Unique Moods</p>
          </div>
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-3 text-center border border-pink-100">
            <p className="text-2xl font-bold text-rose-600">{getMoodEmoji(mostCommonMood)}</p>
            <p className="text-xs text-gray-500">Most Common</p>
          </div>
        </div>

        {/* Garden Grid */}
        <div className="bg-gradient-to-b from-amber-50/30 to-green-50/30 rounded-2xl p-4 border border-amber-100/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">🌱 Last 30 Days</h3>
            <div className="flex gap-1">
              <button
                onClick={() => setGardenView('grid')}
                className={`px-2 py-1 rounded text-xs transition ${gardenView === 'grid' ? 'bg-amber-100 text-amber-700' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setGardenView('list')}
                className={`px-2 py-1 rounded text-xs transition ${gardenView === 'list' ? 'bg-amber-100 text-amber-700' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                List
              </button>
            </div>
          </div>

          {gardenView === 'grid' ? (
            <div className="grid grid-cols-7 gap-2">
              {days.map((day) => {
                const flower = day.entry ? getFlowerForMood(day.entry.mood) : null;
                const isToday = day.isToday;
                
                return (
                  <motion.div
                    key={day.date}
                    whileHover={{ scale: 1.1 }}
                    className="relative flex flex-col items-center"
                  >
                    {day.entry ? (
                      <div
                        className={`w-12 h-12 rounded-full ${flower?.bg || 'bg-gray-50'} flex items-center justify-center text-2xl cursor-pointer border-2 ${isToday ? 'border-amber-400 shadow-md' : 'border-transparent'} hover:border-amber-300 transition-all`}
                        onClick={() => setExpandedFlower(day.entry!)}
                      >
                        {flower?.emoji || '🌸'}
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-xs text-gray-300 border-2 border-dashed border-gray-200">
                        🌱
                      </div>
                    )}
                    <span className={`text-[8px] mt-1 ${isToday ? 'font-bold text-amber-600' : 'text-gray-400'}`}>
                      {day.day}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {days.filter(d => d.entry).map((day) => (
                <div key={day.date} className="flex items-center justify-between p-2 hover:bg-white/50 rounded-lg transition">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFlowerForMood(day.entry!.mood).emoji}</span>
                    <span className="text-sm text-gray-600">{day.entry!.mood}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {day.month} {day.day}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {Object.entries(moodFlowers).map(([mood, flower]) => (
            <div key={mood} className="flex items-center gap-1">
              <span className="text-lg">{flower.emoji}</span>
              <span className="text-xs text-gray-500">{mood}</span>
            </div>
          ))}
        </div>

        {/* Expanded Flower Detail */}
        <AnimatePresence>
          {expandedFlower && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setExpandedFlower(null)}
            >
              <div
                className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-6xl mb-3">{getFlowerForMood(expandedFlower.mood).emoji}</div>
                <h3 className="text-xl font-bold text-gray-800">{expandedFlower.mood}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(expandedFlower.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <div className="mt-4 p-3 bg-amber-50 rounded-xl">
                  <p className="text-xs text-gray-600">✨ A beautiful flower for your emotional garden</p>
                </div>
                <button
                  onClick={() => setExpandedFlower(null)}
                  className="mt-4 w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:shadow-lg transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition"
        >
          Close Garden
        </button>
      </motion.div>
    </motion.div>
  );
};

export default MoodGarden;