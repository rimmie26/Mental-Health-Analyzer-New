import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Exercise4Props {
  onBack: () => void;
  onComplete?: () => void;
}

export const Exercise4: React.FC<Exercise4Props> = ({ onBack, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [walkingTime, setWalkingTime] = useState(0);
  const [isVoiceSupported, setIsVoiceSupported] = useState(true);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const autoTimeoutRef = useRef<number | null>(null);
  const walkIntervalRef = useRef<number | null>(null);
  const timeIntervalRef = useRef<number | null>(null);

  const steps = [
    'Find a safe path indoors or outdoors',
    'Walk slowly, focusing on each step',
    'Feel your feet connecting with the ground',
    'Notice the air, sounds, and colors around you',
    'Sync your breathing with your steps',
    'Continue for 10-15 minutes'
  ];

  // Voice synthesis setup
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsVoiceSupported(false);
      return;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    setTimeout(loadVoices, 100);

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      if (autoTimeoutRef.current) {
        clearTimeout(autoTimeoutRef.current);
        autoTimeoutRef.current = null;
      }
      if (walkIntervalRef.current) {
        clearInterval(walkIntervalRef.current);
        walkIntervalRef.current = null;
      }
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }
    };
  }, []);

  const speakInstruction = (text: string, callback?: () => void) => {
    if (!isVoiceSupported || !('speechSynthesis' in window)) {
      if (callback) callback();
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    if (!voicesLoaded) {
      setTimeout(() => {
        speakInstruction(text, callback);
      }, 300);
      return;
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

  const handleStart = () => {
    setIsActive(true);
    setCurrentStep(0);
    setStepCount(0);
    setWalkingTime(0);
    setTimeout(() => {
      speakInstruction(steps[0]);
    }, 500);
  };

  const handleNextStep = () => {
    if (autoTimeoutRef.current) {
      clearTimeout(autoTimeoutRef.current);
      autoTimeoutRef.current = null;
    }

    // Stop walking if currently walking
    if (isWalking) {
      toggleWalking();
    }

    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Auto-start walking when reaching step 1
      if (nextStep === 1) {
        setTimeout(() => {
          toggleWalking();
        }, 1000);
      }
      
      setTimeout(() => {
        speakInstruction(steps[nextStep]);
      }, 300);
    } else {
      // Complete exercise
      if (isWalking) {
        toggleWalking();
      }
      setIsCompleted(true);
      setIsActive(false);
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      if (onComplete) onComplete();
    }
  };

  const handleReset = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    if (autoTimeoutRef.current) {
      clearTimeout(autoTimeoutRef.current);
      autoTimeoutRef.current = null;
    }
    if (walkIntervalRef.current) {
      clearInterval(walkIntervalRef.current);
      walkIntervalRef.current = null;
    }
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
      timeIntervalRef.current = null;
    }
    setIsActive(false);
    setCurrentStep(0);
    setIsCompleted(false);
    setIsSpeaking(false);
    setIsAutoMode(false);
    setIsWalking(false);
    setStepCount(0);
    setWalkingTime(0);
  };

  const toggleWalking = () => {
    setIsWalking(!isWalking);
    
    if (!isWalking) {
      // Start walking
      walkIntervalRef.current = window.setInterval(() => {
        setStepCount(prev => prev + 1);
      }, 800);

      timeIntervalRef.current = window.setInterval(() => {
        setWalkingTime(prev => prev + 1);
      }, 1000);
    } else {
      // Stop walking
      if (walkIntervalRef.current) {
        clearInterval(walkIntervalRef.current);
        walkIntervalRef.current = null;
      }
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }
    }
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setTimeout(() => {
        speakInstruction(steps[currentStep]);
      }, 300);
    } else {
      speakInstruction(steps[currentStep]);
    }
  };

  const handleAutoMode = () => {
    setIsAutoMode(!isAutoMode);
    if (!isAutoMode) {
      speakInstruction(steps[currentStep], () => {
        if (isAutoMode) {
          autoTimeoutRef.current = window.setTimeout(() => {
            if (currentStep < steps.length - 1) {
              handleNextStep();
            }
          }, 3500);
        }
      });
    } else {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      if (autoTimeoutRef.current) {
        clearTimeout(autoTimeoutRef.current);
        autoTimeoutRef.current = null;
      }
      setIsSpeaking(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

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
            <span className="text-6xl mb-4 block">🚶</span>
            <h2 className="text-2xl font-bold text-gray-800">Mindful Walking</h2>
            <p className="text-gray-500 mt-1">Connect with your surroundings and breathe</p>
            <div className="flex items-center justify-center gap-4 mt-3">
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">15 min</span>
              <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 text-white">Advanced</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">How to do this exercise:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleStart}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
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
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              {Math.round(progress)}% Complete
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">🚶</div>
            <p className="text-gray-800 text-lg font-medium">{steps[currentStep]}</p>
            <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
              {isSpeaking ? '🔊 Speaking...' : '👂 Follow the instruction'}
            </p>

            {/* Walking Tracker */}
            {currentStep >= 1 && currentStep <= 4 && (
              <div className="mt-4">
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={toggleWalking}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                      isWalking
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    <i className={`fas ${isWalking ? 'fa-stop' : 'fa-play'}`}></i>
                    {isWalking ? 'Stop Walking' : 'Start Walking'}
                  </button>
                </div>
                
                {isWalking && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 grid grid-cols-2 gap-4 max-w-xs mx-auto"
                  >
                    <div className="bg-white/70 rounded-xl p-3">
                      <p className="text-xs text-gray-500">Steps</p>
                      <p className="text-2xl font-bold text-green-600">{stepCount}</p>
                    </div>
                    <div className="bg-white/70 rounded-xl p-3">
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="text-2xl font-bold text-blue-600">{formatTime(walkingTime)}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Voice Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 border-t border-green-200 pt-4">
              <button
                onClick={handleReadAloud}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  isSpeaking
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                <i className={`fas ${isSpeaking ? 'fa-volume-up animate-pulse' : 'fa-volume-up'}`}></i>
                {isSpeaking ? 'Re-read' : '🔊 Read Aloud'}
              </button>

              <button
                onClick={handleAutoMode}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  isAutoMode
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <i className={`fas ${isAutoMode ? 'fa-pause' : 'fa-play-circle'}`}></i>
                {isAutoMode ? 'Auto: On' : 'Auto: Off'}
              </button>

              {isSpeaking && (
                <button
                  onClick={() => {
                    if (window.speechSynthesis.speaking) {
                      window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-all flex items-center gap-2"
                >
                  <i className="fas fa-stop"></i>
                  Stop
                </button>
              )}
            </div>

            {isAutoMode && (
              <p className="text-xs text-green-600 mt-2 animate-pulse">
                🔄 Auto-advancing to next step...
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleNextStep}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
            >
              {currentStep < steps.length - 1 ? (
                <>Next Step <i className="fas fa-arrow-right"></i></>
              ) : (
                <>Complete <i className="fas fa-check"></i></>
              )}
            </button>
            <button
              onClick={handleReset}
              className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300"
            >
              Cancel
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
          <p className="text-gray-600 mt-2">Great job! You've completed the Mindful Walking exercise.</p>
          
          {/* Walking Summary */}
          <div className="mt-4 p-4 bg-green-50 rounded-xl max-w-sm mx-auto">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Your Walking Summary:</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/70 rounded-lg p-2">
                <p className="text-xs text-gray-500">Steps Taken</p>
                <p className="text-xl font-bold text-green-600">{stepCount}</p>
              </div>
              <div className="bg-white/70 rounded-lg p-2">
                <p className="text-xs text-gray-500">Time Walking</p>
                <p className="text-xl font-bold text-blue-600">{formatTime(walkingTime)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm flex items-center gap-2">
              <i className="fas fa-check-circle"></i>
              +30 XP Earned
            </div>
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm flex items-center gap-2">
              <i className="fas fa-fire"></i>
              Day Streak: 14
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleReset}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
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

export default Exercise4;