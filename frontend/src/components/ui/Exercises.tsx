import React from 'react';
import { motion } from 'framer-motion';

interface Exercise {
  id: number;
  title: string;
  desc: string;
  duration: string;
  emoji: string;
  level: string;
  color: string;
  steps: string[];
}

interface ExercisesProps {
  onSelectExercise: (exercise: Exercise) => void;
}

const exercisesData: Exercise[] = [
  { 
    id: 1,
    title: '4-7-8 Breathing', 
    desc: 'Calm your nervous system with deep breathing', 
    duration: '5 min', 
    emoji: '🌊',
    level: 'Beginner',
    color: 'from-blue-400 to-cyan-400',
    steps: [
      'Find a comfortable seated position',
      'Inhale quietly through your nose for 4 seconds',
      'Hold your breath for 7 seconds',
      'Exhale completely through your mouth for 8 seconds',
      'Repeat 4 times or until you feel calm'
    ]
  },
  { 
    id: 2,
    title: 'Body Scan Meditation', 
    desc: 'Release physical tension from head to toe', 
    duration: '10 min', 
    emoji: '🧘',
    level: 'Intermediate',
    color: 'from-purple-400 to-pink-400',
    steps: [
      'Lie down or sit comfortably',
      'Close your eyes and take 3 deep breaths',
      'Focus attention on your feet - notice any tension',
      'Slowly move attention up through legs, torso, arms, neck, and head',
      'Notice each sensation without judgment',
      'Take 3 deep breaths and slowly open your eyes'
    ]
  },
  { 
    id: 3,
    title: 'Gratitude Journal', 
    desc: 'Shift to a positive mindset in minutes', 
    duration: '3 min', 
    emoji: '📝',
    level: 'Beginner',
    color: 'from-amber-400 to-orange-400',
    steps: [
      'Find a quiet space with your journal or device',
      'Write down 3 things you\'re grateful for today',
      'For each item, write why it matters to you',
      'Notice how you feel after writing',
      'Read your entries aloud to yourself'
    ]
  },
  { 
    id: 4,
    title: 'Mindful Walking', 
    desc: 'Connect with your surroundings and breathe', 
    duration: '15 min', 
    emoji: '🚶',
    level: 'Advanced',
    color: 'from-green-400 to-emerald-400',
    steps: [
      'Find a safe path indoors or outdoors',
      'Walk slowly, focusing on each step',
      'Feel your feet connecting with the ground',
      'Notice the air, sounds, and colors around you',
      'Sync your breathing with your steps',
      'Continue for 10-15 minutes'
    ]
  },
];

export const Exercises: React.FC<ExercisesProps> = ({ onSelectExercise }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
        <h2 className="text-2xl font-bold text-gray-800">🧘 Wellness Exercises</h2>
        <p className="text-gray-600 mt-1">Practice mindfulness and relaxation techniques</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exercisesData.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={() => onSelectExercise(exercise)}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border-2 border-transparent hover:border-amber-300 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-3xl">{exercise.emoji}</span>
                <h4 className="font-semibold text-gray-800 mt-1 group-hover:text-amber-600 transition-colors">
                  {exercise.title}
                </h4>
                <p className="text-sm text-gray-500 mt-1">{exercise.desc}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${exercise.color} text-white`}>
                    {exercise.level}
                  </span>
                  <span className="text-xs text-gray-400">{exercise.duration}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="text-amber-500 hover:text-amber-600 transition-colors"
              >
                <i className="fas fa-arrow-right text-xl"></i>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-amber-100/30 to-orange-100/30 rounded-2xl p-6 border border-amber-100/50 text-center">
        <p className="text-sm text-gray-600">
          Complete all exercises to unlock the <span className="font-semibold text-amber-600">Wellness Warrior</span> badge! 🏆
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3 max-w-xs mx-auto">
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full" style={{ width: '25%' }} />
        </div>
        <p className="text-xs text-gray-400 mt-1">1 of 4 completed</p>
      </div>
    </motion.div>
  );
};

export default Exercises;