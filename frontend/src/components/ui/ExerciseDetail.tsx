import React, { useState, useEffect, useRef } from 'react';
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

interface ExerciseDetailProps {
  exercise: Exercise;
  onBack: () => void;
  onComplete?: () => void;
}

export const ExerciseDetail: React.FC<ExerciseDetailProps> = ({ 
  exercise, 
  onBack,
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathTimer, setBreathTimer] = useState(0);
  const [breathProgress, setBreathProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalCycles] = useState(4);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const phaseRef = useRef<'inhale' | 'hold' | 'exhale'>('inhale');

  // Breath timing configuration
  const breathTimings = {
    inhale: 4,
    hold: 7,
    exhale: 8
  };

  const getPhaseDuration = (phase: string): number => {
    switch(phase) {
      case 'inhale': return breathTimings.inhale;
      case 'hold': return breathTimings.hold;
      case 'exhale': return breathTimings.exhale;
      default: return 4;
    }
  };

  const getPhaseInstruction = (phase: string): string => {
    switch(phase) {
      case 'inhale': return 'Breathe in slowly through your nose';
      case 'hold': return 'Hold your breath';
      case 'exhale': return 'Exhale slowly through your mouth';
      default: return '';
    }
  };

  const getPhaseEmoji = (phase: string): string => {
    switch(phase) {
      case 'inhale': return '⬆️';
      case 'hold': return '⏸️';
      case 'exhale': return '⬇️';
      default: return '';
    }
  };

  const getPhaseBgColor = (phase: string): string => {
    switch(phase) {
      case 'inhale': return 'bg-blue-100 border-blue-400 text-blue-700';
      case 'hold': return 'bg-amber-100 border-amber-400 text-amber-700';
      case 'exhale': return 'bg-green-100 border-green-400 text-green-700';
      default: return 'bg-gray-100 border-gray-400 text-gray-700';
    }
  };

  // Clean up interval
  const cleanupInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Move to next phase - FIXED
  const moveToNextPhase = () => {
    const currentPhase = phaseRef.current;
    
    if (currentPhase === 'inhale') {
      phaseRef.current = 'hold';
      setBreathPhase('hold');
      setBreathTimer(0);
      setBreathProgress(0);
    } else if (currentPhase === 'hold') {
      phaseRef.current = 'exhale';
      setBreathPhase('exhale');
      setBreathTimer(0);
      setBreathProgress(0);
    } else if (currentPhase === 'exhale') {
      // Complete one full cycle
      const newCycleCount = cycleCount + 1;
      if (newCycleCount >= totalCycles) {
        // Exercise complete
        cleanupInterval();
        setIsCompleted(true);
        setIsActive(false);
        if (onComplete) onComplete();
        return;
      }
      setCycleCount(newCycleCount);
      phaseRef.current = 'inhale';
      setBreathPhase('inhale');
      setBreathTimer(0);
      setBreathProgress(0);
    }
  };

  // Start the breath cycle
  const startBreathCycle = () => {
    cleanupInterval();
    phaseRef.current = 'inhale';
    setBreathPhase('inhale');
    setBreathTimer(0);
    setBreathProgress(0);
    setCycleCount(0);
    setIsPaused(false);

    intervalRef.current = window.setInterval(() => {
      setBreathTimer(prev => {
        const duration = getPhaseDuration(phaseRef.current);
        const newTime = prev + 0.1;
        
        // Calculate progress
        let progress = (newTime / duration) * 100;
        if (progress > 100) progress = 100;
        setBreathProgress(progress);

        // Check if phase is complete
        if (newTime >= duration) {
          moveToNextPhase();
          return 0;
        }
        return newTime;
      });
    }, 100);
  };

  // Handle Start
  const handleStart = () => {
    setIsActive(true);
    startBreathCycle();
  };

  // Handle Pause
  const handlePause = () => {
    if (intervalRef.current) {
      cleanupInterval();
      setIsPaused(true);
    }
  };

  // Handle Resume
  const handleResume = () => {
    if (isPaused && !intervalRef.current) {
      setIsPaused(false);
      intervalRef.current = window.setInterval(() => {
        setBreathTimer(prev => {
          const duration = getPhaseDuration(phaseRef.current);
          const newTime = prev + 0.1;
          
          let progress = (newTime / duration) * 100;
          if (progress > 100) progress = 100;
          setBreathProgress(progress);

          if (newTime >= duration) {
            moveToNextPhase();
            return 0;
          }
          return newTime;
        });
      }, 100);
    }
  };

  // Handle Reset
  const handleReset = () => {
    cleanupInterval();
    setIsActive(false);
    setIsCompleted(false);
    setIsPaused(false);
    phaseRef.current = 'inhale';
    setBreathPhase('inhale');
    setBreathTimer(0);
    setBreathProgress(0);
    setCycleCount(0);
    setCurrentStep(0);
  };

  // Handle Next Step
  const handleNextStep = () => {
    if (currentStep < exercise.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleReset();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupInterval();
    };
  }, []);

  // Calculate circular progress
  const circleRadius = 90;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (breathProgress / 100) * circumference;

  const currentPhaseEmoji = getPhaseEmoji(breathPhase);
  const currentPhaseInstruction = getPhaseInstruction(breathPhase);
  const currentPhaseBgColor = getPhaseBgColor(breathPhase);
  const currentTimeLeft = Math.ceil(getPhaseDuration(breathPhase) - breathTimer);

  // Get gradient colors for SVG
  const getGradientColors = () => {
    switch(breathPhase) {
      case 'inhale': return { start: '#60a5fa', end: '#22d3ee' };
      case 'hold': return { start: '#fbbf24', end: '#fb923c' };
      case 'exhale': return { start: '#34d399', end: '#10b981' };
      default: return { start: '#9ca3af', end: '#6b7280' };
    }
  };

  const gradientColors = getGradientColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50"
    >
      <button
        onClick={onBack}
        className="mb-4 text-gray-500 hover:text-gray-700 transition flex items-center gap-2 text-sm"
      >
        <i className="fas fa-arrow-left"></i>
        Back to Exercises
      </button>

      {!isActive && !isCompleted && (
        <>
          <div className="text-center mb-6">
            <span className="text-6xl mb-4 block">{exercise.emoji}</span>
            <h2 className="text-2xl font-bold text-gray-800">{exercise.title}</h2>
            <p className="text-gray-500 mt-1">{exercise.desc}</p>
            <div className="flex items-center justify-center gap-4 mt-3">
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{exercise.duration}</span>
              <span className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${exercise.color} text-white`}>
                {exercise.level}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">How to do this exercise:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {exercise.steps.map((step: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleStart}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <i className="fas fa-play"></i>
              Start Exercise
            </button>
            <button
              onClick={onBack}
              className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300"
            >
              Close
            </button>
          </div>
        </>
      )}

      {isActive && !isCompleted && (
        <div className="space-y-6">
          {/* Phase & Cycle Info */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Cycle {cycleCount + 1} of {totalCycles}
            </span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {Math.round((cycleCount / totalCycles) * 100)}% Complete
            </span>
          </div>

          {/* Circular Breath Timer */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <svg className="w-56 h-56 transform -rotate-90">
                <circle
                  cx="112"
                  cy="112"
                  r={circleRadius}
                  stroke="#e5e7eb"
                  strokeWidth="10"
                  fill="none"
                />
                <motion.circle
                  cx="112"
                  cy="112"
                  r={circleRadius}
                  stroke="url(#breathGradient)"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.1 }}
                />
                <defs>
                  <linearGradient id="breathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={gradientColors.start} />
                    <stop offset="100%" stopColor={gradientColors.end} />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl mb-1">{currentPhaseEmoji}</span>
                <span className="text-4xl font-bold text-gray-800">
                  {currentTimeLeft}s
                </span>
                <span className="text-sm font-medium text-gray-600 mt-1">
                  {breathPhase.charAt(0).toUpperCase() + breathPhase.slice(1)}
                </span>
                <span className="text-xs text-gray-400 mt-0.5 text-center px-2">
                  {currentPhaseInstruction}
                </span>
              </div>
            </div>
          </div>

          {/* Breath Phase Indicators */}
          <div className="flex justify-center gap-2 flex-wrap">
            {(['inhale', 'hold', 'exhale'] as const).map((phase) => {
              const isActive = breathPhase === phase;
              const duration = getPhaseDuration(phase);
              const label = phase.charAt(0).toUpperCase() + phase.slice(1);
              const emoji = getPhaseEmoji(phase);
              const bgClass = getPhaseBgColor(phase);
              
              return (
                <div
                  key={phase}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                    isActive ? bgClass : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {emoji} {label} ({duration}s)
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {intervalRef.current ? (
              <button
                onClick={handlePause}
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <i className="fas fa-pause"></i>
                Pause
              </button>
            ) : (
              <button
                onClick={handleResume}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <i className="fas fa-play"></i>
                Resume
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2"
            >
              <i className="fas fa-redo"></i>
              Reset
            </button>
          </div>
        </div>
      )}

      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="text-7xl mb-4"
          >
            🎉
          </motion.div>
          <h3 className="text-2xl font-bold text-green-600">Exercise Complete!</h3>
          <p className="text-gray-600 mt-2">Great job! You've completed the {exercise.title} exercise.</p>
          
          <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm flex items-center gap-2">
              <i className="fas fa-check-circle"></i>
              +25 XP Earned
            </div>
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm flex items-center gap-2">
              <i className="fas fa-fire"></i>
              Day Streak: 14
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleReset}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
            >
              <i className="fas fa-redo mr-2"></i>
              Do Again
            </button>
            <button
              onClick={onBack}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExerciseDetail;