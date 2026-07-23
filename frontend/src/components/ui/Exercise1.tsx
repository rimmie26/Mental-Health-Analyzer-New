import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Exercise1Props {
  onBack: () => void;
  onComplete?: () => void;
}

export const Exercise1: React.FC<Exercise1Props> = ({ onBack, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [phase, setPhase] = useState<'ready' | 'inhale' | 'hold' | 'exhale'>('ready');
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const steps = [
    'Find a comfortable seated position',
    'Close your eyes and relax your shoulders',
    'Take a deep breath in...',
    'Hold your breath...',
    'Exhale slowly...',
    'Repeat 4 times'
  ];

  // Voice synthesis
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    setTimeout(loadVoices, 100);

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const speakInstruction = (text: string, callback?: () => void) => {
    if (!('speechSynthesis' in window)) {
      if (callback) callback();
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      utterance.lang = 'en-US';

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.lang.startsWith('en') && 
        (v.name.includes('Google') || v.name.includes('Female') || v.name.includes('Samantha'))
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (callback) callback();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        if (callback) callback();
      };

      window.speechSynthesis.speak(utterance);
      speechRef.current = utterance;
    } catch (error) {
      console.error('Speech error:', error);
      if (callback) callback();
    }
  };

  const startBreathingCycle = () => {
    let step = 0;
    const phases = [
      { phase: 'inhale', duration: 4, text: 'Breathe in... 1, 2, 3, 4' },
      { phase: 'hold', duration: 7, text: 'Hold... 1, 2, 3, 4, 5, 6, 7' },
      { phase: 'exhale', duration: 8, text: 'Exhale... 1, 2, 3, 4, 5, 6, 7, 8' },
    ];

    let currentPhaseIndex = 0;
    let timeLeft = phases[0].duration;

    setPhase('inhale');
    setTimer(timeLeft);

    intervalRef.current = window.setInterval(() => {
      timeLeft -= 0.5;
      setTimer(Math.ceil(timeLeft));

      if (timeLeft <= 0) {
        currentPhaseIndex++;
        if (currentPhaseIndex >= phases.length) {
          // One cycle complete
          setBreathCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 4) {
              // Exercise complete
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              setIsCompleted(true);
              setIsActive(false);
              if (onComplete) onComplete();
              speakInstruction('Great job! Exercise complete.');
              return newCount;
            }
            // Start next cycle
            currentPhaseIndex = 0;
            timeLeft = phases[0].duration;
            setPhase('inhale');
            setTimer(timeLeft);
            speakInstruction(`Cycle ${newCount + 1} of 4. Breathe in...`);
            return newCount;
          });
          return;
        }

        // Move to next phase
        const nextPhase = phases[currentPhaseIndex];
        timeLeft = nextPhase.duration;
        setPhase(nextPhase.phase as 'inhale' | 'hold' | 'exhale');
        setTimer(timeLeft);
        speakInstruction(nextPhase.text);
      }
    }, 500);
  };

  const handleStart = () => {
    setIsActive(true);
    setBreathCount(0);
    setCurrentStep(0);
    speakInstruction('Starting 4-7-8 breathing exercise. Find a comfortable position.', () => {
      setTimeout(() => {
        startBreathingCycle();
      }, 2000);
    });
  };

  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsPaused(true);
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  };

  const handleResume = () => {
    if (isPaused && !intervalRef.current) {
      setIsPaused(false);
      // Resume breathing cycle
      startBreathingCycle();
    }
  };

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    setIsActive(false);
    setIsCompleted(false);
    setIsPaused(false);
    setBreathCount(0);
    setPhase('ready');
    setTimer(0);
    setCurrentStep(0);
  };

  const getPhaseEmoji = () => {
    switch(phase) {
      case 'inhale': return '⬆️';
      case 'hold': return '⏸️';
      case 'exhale': return '⬇️';
      default: return '🧘';
    }
  };

  const getPhaseColor = () => {
    switch(phase) {
      case 'inhale': return 'from-blue-400 to-cyan-400';
      case 'hold': return 'from-amber-400 to-orange-400';
      case 'exhale': return 'from-green-400 to-emerald-400';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getPhaseLabel = () => {
    switch(phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      default: return 'Ready';
    }
  };

  // Calculate progress
  const progress = (breathCount / 4) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-100/50 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 transition flex items-center gap-2 text-sm"
        >
          <i className="fas fa-arrow-left"></i>
          Back
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">🌊 4-7-8 Breathing</span>
        </div>
      </div>

      {!isActive && !isCompleted && (
        <>
          {/* Exercise Info */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-5xl shadow-lg shadow-blue-500/25">
                🌊
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">4-7-8 Breathing</h2>
            <p className="text-gray-500 mt-1">Calm your nervous system with deep breathing</p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">⏱️ 5 min</span>
              <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white">Beginner</span>
            </div>
          </div>

          {/* How to */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 mb-6 border border-blue-100">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-blue-500">📖</span> How to do this exercise:
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/60 rounded-xl p-3 text-center border border-blue-100">
                <div className="text-2xl mb-1">⬆️</div>
                <div className="text-sm font-medium text-gray-700">Inhale</div>
                <div className="text-xs text-gray-500">4 seconds</div>
              </div>
              <div className="bg-white/60 rounded-xl p-3 text-center border border-amber-100">
                <div className="text-2xl mb-1">⏸️</div>
                <div className="text-sm font-medium text-gray-700">Hold</div>
                <div className="text-xs text-gray-500">7 seconds</div>
              </div>
              <div className="bg-white/60 rounded-xl p-3 text-center border border-emerald-100">
                <div className="text-2xl mb-1">⬇️</div>
                <div className="text-sm font-medium text-gray-700">Exhale</div>
                <div className="text-xs text-gray-500">8 seconds</div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 text-lg"
          >
            <i className="fas fa-play"></i>
            Start Exercise
          </button>
        </>
      )}

      {isActive && !isCompleted && (
        <div className="space-y-6">
          {/* Progress */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Breath {breathCount + 1} of 4
            </span>
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {Math.round(progress)}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Breathing Circle */}
          <div className="flex flex-col items-center py-6">
            <div className="relative">
              <motion.div
                key={phase}
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{ 
                  scale: phase === 'inhale' ? 1.2 : phase === 'exhale' ? 1 : 1.1,
                  opacity: 1
                }}
                transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 7 }}
                className={`w-48 h-48 rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center shadow-2xl shadow-blue-500/20`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-2">{getPhaseEmoji()}</div>
                  <div className="text-4xl font-bold text-white">{timer}s</div>
                  <div className="text-sm text-white/90 font-medium">{getPhaseLabel()}</div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Phase Labels */}
          <div className="flex justify-center gap-3">
            <div className={`px-4 py-2 rounded-full text-xs font-medium border-2 transition-all ${phase === 'inhale' ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
              ⬆️ Inhale (4s)
            </div>
            <div className={`px-4 py-2 rounded-full text-xs font-medium border-2 transition-all ${phase === 'hold' ? 'bg-amber-100 border-amber-400 text-amber-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
              ⏸️ Hold (7s)
            </div>
            <div className={`px-4 py-2 rounded-full text-xs font-medium border-2 transition-all ${phase === 'exhale' ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
              ⬇️ Exhale (8s)
            </div>
          </div>

          {/* Voice Status */}
          <div className="text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
              {isSpeaking ? '🔊 Speaking...' : 'Follow the instructions'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {!isPaused ? (
              <button
                onClick={handlePause}
                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-yellow-500/25"
              >
                <i className="fas fa-pause"></i>
                Pause
              </button>
            ) : (
              <button
                onClick={handleResume}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-500/25"
              >
                <i className="fas fa-play"></i>
                Resume
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-red-500/25"
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
          className="text-center py-12"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="text-7xl mb-4"
          >
            🎉
          </motion.div>
          <h3 className="text-2xl font-bold text-green-600">Exercise Complete!</h3>
          <p className="text-gray-600 mt-2">Great job! You've completed the 4-7-8 Breathing exercise.</p>
          
          <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm flex items-center gap-2">
              <i className="fas fa-check-circle"></i>
              +25 XP Earned
            </div>
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm flex items-center gap-2">
              <i className="fas fa-fire"></i>
              Day Streak: 14
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={handleReset}
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
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

export default Exercise1;