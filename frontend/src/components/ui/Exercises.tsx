import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Exercise1 from './Exercise1';
import Exercise2 from './Exercise2';
import Exercise3 from './Exercise3';
import Exercise4 from './Exercise4';
import { completeExercise, fetchExerciseHistory } from '../../utils/api';

export interface Exercise {
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
  onBack?: () => void;
}

export const exercisesData: Exercise[] = [
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

export const Exercises: React.FC<ExercisesProps> = ({ 
  onBack 
}) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  // Previously this stayed empty on every visit - completions were only
  // ever kept in local component state and lost on navigation/reload.
  // Load what the user has actually finished, from the database.
  useEffect(() => {
    fetchExerciseHistory()
      .then((res) => {
        const doneIds = [...new Set(res.completions.map((c: { exerciseId: number }) => c.exerciseId))];
        setCompletedExercises(doneIds as number[]);
      })
      .catch((err) => console.warn('Could not load exercise history:', err));
  }, []);

  const handleExerciseComplete = (id: number) => {
    if (!completedExercises.includes(id)) {
      setCompletedExercises([...completedExercises, id]);
    }
    const exercise = exercisesData.find((e) => e.id === id);
    if (exercise) {
      // This is the write that was previously missing entirely - completing
      // an exercise here never reached the backend, so it never counted
      // toward Progress/Profile stats or XP.
      completeExercise(exercise.id, exercise.title).catch((err) =>
        console.warn('Could not save exercise completion:', err)
      );
    }
  };

  // If an exercise is selected, show its specific component
  if (selectedExerciseId === 1) {
    return <Exercise1 onBack={() => setSelectedExerciseId(null)} onComplete={() => handleExerciseComplete(1)} />;
  }
  if (selectedExerciseId === 2) {
    return <Exercise2 onBack={() => setSelectedExerciseId(null)} onComplete={() => handleExerciseComplete(2)} />;
  }
  if (selectedExerciseId === 3) {
    return <Exercise3 onBack={() => setSelectedExerciseId(null)} onComplete={() => handleExerciseComplete(3)} />;
  }
  if (selectedExerciseId === 4) {
    return <Exercise4 onBack={() => setSelectedExerciseId(null)} onComplete={() => handleExerciseComplete(4)} />;
  }

  // Otherwise show the exercise list
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🧘 Wellness Exercises</h2>
          <p className="text-gray-600 mt-1">Practice mindfulness and relaxation techniques</p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-700 transition flex items-center gap-2"
          >
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exercisesData.map((exercise, index) => {
          const isCompleted = completedExercises.includes(exercise.id);
          return (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => setSelectedExerciseId(exercise.id)}
              className={`bg-white/70 backdrop-blur-sm rounded-xl p-5 border-2 transition-all cursor-pointer group ${
                isCompleted 
                  ? 'border-green-400 bg-green-50/70' 
                  : 'border-transparent hover:border-amber-300 hover:shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-3xl">{exercise.emoji}</span>
                  <h4 className="font-semibold text-gray-800 mt-1 group-hover:text-amber-600 transition-colors">
                    {exercise.title}
                    {isCompleted && (
                      <span className="ml-2 text-xs text-green-600">
                        <i className="fas fa-check-circle"></i> Done
                      </span>
                    )}
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
                  className={`transition-colors ${
                    isCompleted ? 'text-green-500' : 'text-amber-500 hover:text-amber-600'
                  }`}
                >
                  <i className={`fas ${isCompleted ? 'fa-check-circle' : 'fa-arrow-right'} text-xl`}></i>
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Section */}
      <div className="bg-gradient-to-r from-amber-100/30 to-orange-100/30 rounded-2xl p-6 border border-amber-100/50 text-center">
        <p className="text-sm text-gray-600">
          Complete all exercises to unlock the <span className="font-semibold text-amber-600">Wellness Warrior</span> badge! 🏆
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3 max-w-xs mx-auto">
          <div 
            className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedExercises.length / exercisesData.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {completedExercises.length} of {exercisesData.length} completed
        </p>
      </div>
    </motion.div>
  );
};

export default Exercises;