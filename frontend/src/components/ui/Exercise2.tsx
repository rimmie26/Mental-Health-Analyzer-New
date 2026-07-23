import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Exercise2Props {
  onBack: () => void;
  onComplete?: () => void;
}

export const Exercise2: React.FC<Exercise2Props> = ({ onBack, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(true);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const autoTimeoutRef = useRef<number | null>(null);

  const steps = [
    'Lie down or sit comfortably',
    'Close your eyes and take 3 deep breaths',
    'Focus attention on your feet - notice any tension',
    'Slowly move attention up through legs, torso, and arms',
    'Notice sensations in your neck and head',
    'Take 3 deep breaths and slowly open your eyes'
  ];

  // Check if speech synthesis is supported
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsVoiceSupported(false);
      console.warn('Speech synthesis not supported in this browser');
      return;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    // Try to load immediately
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
    };
  }, []);

  const speakInstruction = (text: string, callback?: () => void) => {
    // Check if speech synthesis is available
    if (!isVoiceSupported || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not available');
      if (callback) callback();
      return;
    }

    // Cancel any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    // Wait for voices to load if needed
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

      // Try to find a good voice
      const voices = window.speechSynthesis.getVoices();
      
      if (voices.length > 0) {
        // Prefer female voices
        const preferredVoices = voices.filter(v => 
          v.lang.startsWith('en') && 
          (v.name.includes('Google') || v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria'))
        );
        
        if (preferredVoices.length > 0) {
          utterance.voice = preferredVoices[0];
        } else {
          utterance.voice = voices[0];
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        console.log('🔊 Speaking:', text);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        console.log('🔇 Finished speaking');
        if (callback) callback();
      };

      utterance.onerror = (event) => {
        console.warn('Speech error:', event);
        setIsSpeaking(false);
        if (callback) callback();
      };

      window.speechSynthesis.speak(utterance);
      speechRef.current = utterance;
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
      if (callback) callback();
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setCurrentStep(0);
    // User interaction triggers speech
    setTimeout(() => {
      speakInstruction(steps[0]);
    }, 500);
  };

  const handleNextStep = () => {
    if (autoTimeoutRef.current) {
      clearTimeout(autoTimeoutRef.current);
      autoTimeoutRef.current = null;
    }

    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Speak the next instruction
      setTimeout(() => {
        speakInstruction(steps[nextStep]);
      }, 300);
    } else {
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
    setIsActive(false);
    setCurrentStep(0);
    setIsCompleted(false);
    setIsSpeaking(false);
    setIsAutoMode(false);
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
      // Start auto-mode
      speakInstruction(steps[currentStep], () => {
        if (isAutoMode) {
          autoTimeoutRef.current = window.setTimeout(() => {
            if (currentStep < steps.length - 1) {
              handleNextStep();
            }
          }, 2500);
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

  const handleStopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    if (autoTimeoutRef.current) {
      clearTimeout(autoTimeoutRef.current);
      autoTimeoutRef.current = null;
    }
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
            <span className="text-6xl mb-4 block">🧘</span>
            <h2 className="text-2xl font-bold text-gray-800">Body Scan Meditation</h2>
            <p className="text-gray-500 mt-1">Release physical tension from head to toe</p>
            <div className="flex items-center justify-center gap-4 mt-3">
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">10 min</span>
              <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white">Intermediate</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">How to do this exercise:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleStart}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
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
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              {Math.round(progress)}% Complete
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🧘</div>
            <p className="text-gray-800 text-lg font-medium">{steps[currentStep]}</p>
            <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
              {isSpeaking ? '🔊 Speaking...' : '👂 Close your eyes and listen'}
            </p>

            {/* Voice Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={handleReadAloud}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  isSpeaking
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
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
                  onClick={handleStopSpeaking}
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

            {!voicesLoaded && (
              <p className="text-xs text-amber-600 mt-2">
                ⏳ Loading voice...
              </p>
            )}

            {!isVoiceSupported && (
              <p className="text-xs text-red-500 mt-2">
                ⚠️ Voice not supported in this browser
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleNextStep}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
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
          <p className="text-gray-600 mt-2">Great job! You've completed the Body Scan Meditation.</p>
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
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
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

export default Exercise2;