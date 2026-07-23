import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Exercise3Props {
  onBack: () => void;
  onComplete?: () => void;
}

export const Exercise3: React.FC<Exercise3Props> = ({ onBack, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [entries, setEntries] = useState(['', '', '']);
  const [whyEntries, setWhyEntries] = useState(['', '', '']);
  const [moodBefore, setMoodBefore] = useState<string | null>(null);
  const [moodAfter, setMoodAfter] = useState<string | null>(null);
  const [currentMoodStep, setCurrentMoodStep] = useState(0);
  const [isJournaling, setIsJournaling] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const autoTimeoutRef = useRef<number | null>(null);

  const moods = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😤', label: 'Stressed' },
    { emoji: '😌', label: 'Calm' },
    { emoji: '🤗', label: 'Grateful' },
  ];

  const steps = [
    'Find a quiet space with your journal or device',
    'Write down 3 things you\'re grateful for today',
    'For each item, write why it matters to you',
    'Notice how you feel after writing',
    'Read your entries aloud to yourself'
  ];

  const journalPrompts = [
    'Something that made me smile today...',
    'A person I\'m grateful to have in my life...',
    'A small pleasure I enjoyed today...',
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
      if (autoTimeoutRef.current) {
        clearTimeout(autoTimeoutRef.current);
        autoTimeoutRef.current = null;
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
    } catch (error) {
      console.error('Speech error:', error);
      if (callback) callback();
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setCurrentStep(0);
    setIsJournaling(false);
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
      
      // Auto-start journaling when reaching step 1
      if (nextStep === 1) {
        setIsJournaling(true);
      }
      
      setTimeout(() => {
        speakInstruction(steps[nextStep]);
      }, 300);
    } else {
      // Complete exercise
      setShowConfetti(true);
      setTimeout(() => {
        setIsCompleted(true);
        setIsActive(false);
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
        if (onComplete) onComplete();
      }, 1500);
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
    setIsJournaling(false);
    setEntries(['', '', '']);
    setWhyEntries(['', '', '']);
    setMoodBefore(null);
    setMoodAfter(null);
    setCurrentMoodStep(0);
    setShowConfetti(false);
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
          }, 3000);
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

  const handleEntryChange = (index: number, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = value;
    setEntries(newEntries);
  };

  const handleWhyChange = (index: number, value: string) => {
    const newWhy = [...whyEntries];
    newWhy[index] = value;
    setWhyEntries(newWhy);
  };

  const handleMoodSelect = (mood: string, type: 'before' | 'after') => {
    if (type === 'before') {
      setMoodBefore(mood);
      setCurrentMoodStep(1);
    } else {
      setMoodAfter(mood);
    }
  };

  const getMoodEmoji = (mood: string) => {
    const found = moods.find(m => m.label === mood);
    return found ? found.emoji : '😊';
  };

  const isEntryComplete = entries.every(entry => entry.trim() !== '');
  const isWhyComplete = whyEntries.every(why => why.trim() !== '');
  const canProceed = (step: number) => {
    if (step === 1) return isEntryComplete;
    if (step === 2) return isWhyComplete;
    if (step === 3) return moodBefore !== null && moodAfter !== null;
    return true;
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  // Render journaling interface
  const renderJournaling = () => {
    if (!isJournaling) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {currentStep === 1 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span>📝 Write 3 things you're grateful for</span>
              <span className="text-xs text-gray-400">
                ({entries.filter(e => e.trim() !== '').length}/3)
              </span>
            </h4>
            {journalPrompts.map((prompt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/70 rounded-xl p-3 border border-amber-200 hover:border-amber-400 transition-all"
              >
                <p className="text-xs text-amber-600 mb-1">{prompt}</p>
                <input
                  type="text"
                  value={entries[i]}
                  onChange={(e) => handleEntryChange(i, e.target.value)}
                  placeholder="Write something you're grateful for..."
                  className="w-full px-3 py-2 bg-white/80 border border-amber-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                />
              </motion.div>
            ))}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span>💭 Why does each matter to you?</span>
              <span className="text-xs text-gray-400">
                ({whyEntries.filter(w => w.trim() !== '').length}/3)
              </span>
            </h4>
            {entries.map((entry, i) => (
              entry && (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/70 rounded-xl p-3 border border-amber-200"
                >
                  <p className="text-xs text-amber-600 mb-1">✨ {entry}</p>
                  <input
                    type="text"
                    value={whyEntries[i]}
                    onChange={(e) => handleWhyChange(i, e.target.value)}
                    placeholder="Why does this matter to you?"
                    className="w-full px-3 py-2 bg-white/80 border border-amber-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  />
                </motion.div>
              )
            ))}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 text-center">
              How do you feel right now?
            </h4>
            {currentMoodStep === 0 ? (
              <div>
                <p className="text-xs text-gray-500 text-center mb-3">Before writing your gratitude:</p>
                <div className="grid grid-cols-3 gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.label}
                      onClick={() => handleMoodSelect(mood.label, 'before')}
                      className={`p-3 rounded-xl text-center transition-all ${
                        moodBefore === mood.label
                          ? 'bg-amber-100 border-2 border-amber-400 shadow-md scale-105'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="text-2xl">{mood.emoji}</div>
                      <div className="text-xs text-gray-600">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-500 text-center mb-3">After writing your gratitude:</p>
                <div className="grid grid-cols-3 gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.label}
                      onClick={() => handleMoodSelect(mood.label, 'after')}
                      className={`p-3 rounded-xl text-center transition-all ${
                        moodAfter === mood.label
                          ? 'bg-emerald-100 border-2 border-emerald-400 shadow-md scale-105'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="text-2xl">{mood.emoji}</div>
                      <div className="text-xs text-gray-600">{mood.label}</div>
                    </button>
                  ))}
                </div>
                {moodBefore && moodAfter && (
                  <div className="mt-3 p-2 bg-emerald-50 rounded-lg text-center">
                    <p className="text-xs text-gray-600">
                      Mood changed from {getMoodEmoji(moodBefore)} {moodBefore} to {getMoodEmoji(moodAfter)} {moodAfter}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="text-center py-4">
            <div className="text-6xl mb-4">📖</div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Read your gratitude journal aloud</h4>
            <div className="bg-white/70 rounded-xl p-4 border border-amber-200 max-h-40 overflow-y-auto">
              {entries.map((entry, i) => (
                entry && (
                  <div key={i} className="text-left text-sm text-gray-700 py-1 border-b border-gray-100 last:border-0">
                    <span className="text-amber-500">•</span> {entry} {whyEntries[i] && <span className="text-gray-400 text-xs">— {whyEntries[i]}</span>}
                  </div>
                )
              ))}
            </div>
            <button
              onClick={() => {
                const fullText = `I am grateful for: ${entries.filter(e => e).join('. ')}. ${whyEntries.filter(w => w).join('. ')}`;
                speakInstruction(fullText);
              }}
              className="mt-3 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-sm transition-all flex items-center gap-2 mx-auto"
            >
              <i className="fas fa-volume-up"></i>
              Read Aloud
            </button>
          </div>
        )}
      </motion.div>
    );
  };

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
            <span className="text-6xl mb-4 block">📝</span>
            <h2 className="text-2xl font-bold text-gray-800">Gratitude Journal</h2>
            <p className="text-gray-500 mt-1">Shift to a positive mindset in minutes</p>
            <div className="flex items-center justify-center gap-4 mt-3">
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">3 min</span>
              <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white">Beginner</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">How to do this exercise:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {steps.map((step, i) => (
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
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
              {Math.round(progress)}% Complete
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-gray-800 font-medium">{steps[currentStep]}</p>
              <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
                {isSpeaking ? '🔊 Speaking...' : '👂 Follow the instruction'}
              </p>
            </div>

            {renderJournaling()}

            {/* Voice Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 border-t border-amber-200 pt-4">
              <button
                onClick={handleReadAloud}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  isSpeaking
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
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
              <p className="text-xs text-green-600 mt-2 text-center animate-pulse">
                🔄 Auto-advancing to next step...
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleNextStep}
              disabled={!canProceed(currentStep)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                canProceed(currentStep)
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
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

          {!canProceed(currentStep) && currentStep !== 3 && (
            <p className="text-xs text-amber-500 text-center">
              Please fill in all entries before continuing
            </p>
          )}
        </div>
      )}

      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          {showConfetti && (
            <div className="text-7xl mb-4 animate-bounce">🎉</div>
          )}
          <h3 className="text-2xl font-bold text-green-600">Exercise Complete!</h3>
          <p className="text-gray-600 mt-2">Great job! You've completed the Gratitude Journal.</p>
          
          {/* Show journal summary */}
          <div className="mt-4 p-4 bg-amber-50 rounded-xl max-w-sm mx-auto">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Your Gratitude Entry:</h4>
            {entries.map((entry, i) => (
              entry && (
                <div key={i} className="text-left text-sm text-gray-600 py-1 border-b border-amber-100 last:border-0">
                  ✨ {entry}
                  {whyEntries[i] && (
                    <span className="block text-xs text-gray-400 ml-4">— {whyEntries[i]}</span>
                  )}
                </div>
              )
            ))}
            {moodBefore && moodAfter && (
              <div className="mt-2 text-xs text-gray-500">
                Mood: {getMoodEmoji(moodBefore)} {moodBefore} → {getMoodEmoji(moodAfter)} {moodAfter}
              </div>
            )}
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

export default Exercise3;