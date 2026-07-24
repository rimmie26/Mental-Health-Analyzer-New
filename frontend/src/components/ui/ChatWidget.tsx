import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'joke' | 'affirmation' | 'sympathy' | 'exercise' | 'quote' | 'normal';
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Hi there! I'm Serenoa, your AI mental health companion. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'normal'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Quick suggestions based on user input
  const getSuggestions = (input: string) => {
    const allSuggestions = [
      'I feel stressed 😰',
      'I feel sad 😔',
      'I feel anxious 😥',
      'I feel happy 😊',
      'Tell me a joke 😄',
      'Give me an affirmation 💪',
      'I need some comfort 🤗',
      'I feel overwhelmed 😫',
      'Help me relax 😌',
      'I feel lonely 😢',
      'Motivate me 🔥',
      'Give me a quote 📖',
      'I want to meditate 🧘',
      'I need a break 🌿',
      'I feel grateful 🙏'
    ];
    const filtered = allSuggestions.filter(s => 
      s.toLowerCase().includes(input.toLowerCase()) || 
      input.length === 0
    );
    return filtered.slice(0, 4);
  };

  useEffect(() => {
    if (input.length > 0) {
      setSuggestions(getSuggestions(input));
    } else {
      setSuggestions([]);
    }
  }, [input]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Collections
  const jokes = [
    "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾",
    "What do you call a fake noodle? An impasta! 🍝",
    "Why don't scientists trust atoms? Because they make up everything! ⚛️",
    "What do you call a bear with no teeth? A gummy bear! 🐻",
    "Why did the math book look so sad? Because it had too many problems! 📚",
    "What's the best thing about Switzerland? I don't know, but the flag is a big plus! 🇨🇭",
    "Why don't eggs tell jokes? They'd crack each other up! 🥚",
    "What do you call a fish wearing a bowtie? Sofishticated! 🐟",
  ];

  const affirmations = [
    "You are stronger than you think, braver than you feel, and more loved than you know. 💪",
    "You deserve all the good things coming your way. You've earned them. ✨",
    "Your presence on this earth makes it a better place. Don't ever forget that. 🌍",
    "You are not your thoughts. You are the observer of your thoughts. 🧠",
    "Every day may not be good, but there is something good in every day. 🌅",
    "You are enough. You have always been enough. You will always be enough. 💫",
    "The world needs your unique light. Don't dim it for anyone. 🌟",
    "You are braver than you believe, stronger than you seem, and smarter than you think. 🦋",
  ];

  const sympathyMessages = [
    "I hear you, and I'm here for you. It's okay to feel this way. 🤗",
    "That sounds really tough. You're not alone in this. I'm right here with you. 💚",
    "I understand why you'd feel that way. Your feelings are completely valid. 🫂",
    "You're going through a lot right now. Please be gentle with yourself. 🌸",
    "I'm so sorry you're feeling this way. Remember, this feeling will pass. 🌈",
    "You're so strong for facing this. I'm proud of you for reaching out. 💪",
    "Your feelings matter. Thank you for trusting me with them. 🙏",
    "Sometimes the bravest thing you can do is just keep going. You're doing that right now. 🌟",
  ];

  const motivationalQuotes = [
    "🌟 'The only way out is through.' — Robert Frost",
    "💪 'You have survived 100% of your worst days. You're a warrior.'",
    "🌱 'Growth is painful. Change is painful. But nothing is as painful as staying stuck somewhere you don't belong.'",
    "🌈 'After every storm, there is a rainbow. Sometimes you just have to wait for it.'",
    "🔥 'Your current situation is not your final destination. The best is yet to come.'",
    "✨ 'You didn't come this far to only come this far. Keep going.'",
  ];

  const mindfulnessExercises = [
    "🧘 Let's do a quick 3-minute breathing exercise:\n\n1. Close your eyes\n2. Breathe in slowly for 4 seconds\n3. Hold for 4 seconds\n4. Exhale slowly for 6 seconds\nRepeat this 3 times. You're doing great! 💚",
    
    "🌿 Try this grounding exercise:\n\n1. Notice 5 things you can see\n2. Notice 4 things you can touch\n3. Notice 3 things you can hear\n4. Notice 2 things you can smell\n5. Notice 1 thing you can taste\n\nHow do you feel now? 🌸",
    
    "🌊 Let's try a quick body scan meditation:\n\n1. Take a deep breath\n2. Notice any tension in your body\n3. Starting from your toes, imagine breathing into each part\n4. Work your way up to your head\n5. Take a final deep breath\n\nYou're doing amazing! 💪",
  ];

  const comfortMessages = [
    "You're safe here. Take a deep breath. I'm not going anywhere. 💚",
    "It's okay to not be okay. You don't have to have it all figured out right now. 🫂",
    "I want you to know that you're worthy of love, exactly as you are. ❤️",
    "You've been through so much, and you're still here. That takes real strength. 🌟",
    "I'm so glad you're here. The world is better with you in it. 🌍",
  ];

  const getBotResponse = (userMessage: string): { text: string; type: Message['type'] } => {
    const msg = userMessage.toLowerCase();
    
    // Check for specific requests
    if (msg.includes('joke') || msg.includes('funny')) {
      return { text: jokes[Math.floor(Math.random() * jokes.length)], type: 'joke' };
    }
    
    if (msg.includes('affirmation') || msg.includes('encourage') || msg.includes('motivate')) {
      return { text: affirmations[Math.floor(Math.random() * affirmations.length)], type: 'affirmation' };
    }
    
    if (msg.includes('sympathy') || msg.includes('comfort') || msg.includes('hug') || msg.includes('sorry')) {
      return { text: sympathyMessages[Math.floor(Math.random() * sympathyMessages.length)], type: 'sympathy' };
    }
    
    if (msg.includes('quote')) {
      return { text: motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)], type: 'quote' };
    }
    
    if (msg.includes('meditate') || msg.includes('breathe') || msg.includes('relax') || msg.includes('exercise')) {
      return { text: mindfulnessExercises[Math.floor(Math.random() * mindfulnessExercises.length)], type: 'exercise' };
    }
    
    if (msg.includes('sad') || msg.includes('depressed') || msg.includes('down') || msg.includes('lonely')) {
      const responses = [
        "I'm so sorry you're feeling this way. 🌸 You are not alone. Would you like me to share an affirmation or a mindfulness exercise to help you feel a little better?",
        "It's okay to feel sad sometimes. Your feelings are valid. 🫂 Would you like me to tell you a joke to lighten the mood or share a comforting message?",
        "I hear you. Life can be really hard sometimes. 💚 I'm here with you. Would you like to try a breathing exercise together?",
        "Thank you for sharing this with me. You're so brave for speaking up. 🌟 I can share an affirmation with you if you'd like."
      ];
      return { text: responses[Math.floor(Math.random() * responses.length)], type: 'sympathy' };
    }
    
    if (msg.includes('stress') || msg.includes('anxious') || msg.includes('anxiety') || msg.includes('overwhelm')) {
      const responses = [
        "I understand you're feeling stressed. 😰 Let's take a moment to breathe together:\n\n🌊 Inhale deeply for 4 seconds...\n⏸️ Hold for 7 seconds...\n🌿 Exhale slowly for 8 seconds...\n\nRepeat this 4 times. How do you feel now?",
        "Stress is tough, but you're tougher. 💪 Would you like to hear a joke to lighten the mood or try a quick meditation?",
        "I'm here with you. 🫂 Let's try the 5-4-3-2-1 grounding technique together. It helps bring you back to the present moment."
      ];
      return { text: responses[Math.floor(Math.random() * responses.length)], type: 'exercise' };
    }
    
    if (msg.includes('gratitude') || msg.includes('thankful')) {
      return { 
        text: "Gratitude is one of the most powerful tools for happiness. 🌟 Let's practice together:\n\n📝 Write down 3 things you're grateful for today. They can be small things - a warm cup of tea, a kind word, or a beautiful sunset.\n\nTake a moment to really feel the gratitude. How does it make you feel? 💚", 
        type: 'exercise' 
      };
    }
    
    if (msg.includes('sleep') || msg.includes('tired')) {
      return { 
        text: "Good sleep is essential for your mental wellness. 😴 Here are some tips:\n\n🛌 Maintain a consistent sleep schedule\n📱 Avoid screens 30 minutes before bed\n📖 Try reading or listening to calm music\n🕯️ Dim the lights in the evening\n\nWould you like a bedtime meditation? 🌙", 
        type: 'normal' 
      };
    }
    
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return { 
        text: "Hi there! 👋 It's so good to see you. How can I support you today? You can share anything - your feelings, your worries, or even just chat. I'm here to listen! 💚", 
        type: 'normal' 
      };
    }
    
    if (msg.includes('thank')) {
      return { 
        text: "You're welcome! 🌸 Remember, I'm always here for you. If you ever feel down, stressed, or just need a friend, I'm just a message away. Take care of yourself! 💚", 
        type: 'normal' 
      };
    }
    
    // Default response with options
    return { 
      text: "Thank you for sharing that with me. 🌸 How can I support you right now?\n\n💬 I can:\n• Share a joke 😄\n• Give an affirmation 💪\n• Offer comfort 🤗\n• Guide a meditation 🧘\n• Share a quote 📖\n\nJust let me know what you need! 💚", 
      type: 'normal' 
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'normal'
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSuggestions([]);
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(input);
      const botMessage: Message = {
        id: messages.length + 2,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 800);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageEmoji = (type?: string) => {
    switch(type) {
      case 'joke': return '😄';
      case 'affirmation': return '💪';
      case 'sympathy': return '🤗';
      case 'exercise': return '🧘';
      case 'quote': return '📖';
      default: return '💬';
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-2 group"
      >
        {isOpen ? (
          <i className="fas fa-times text-xl"></i>
        ) : (
          <>
            <i className="fas fa-comment-dots text-xl group-hover:animate-pulse"></i>
            <span className="hidden md:inline text-sm font-medium">Talk to Serenoa</span>
          </>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-4 md:right-8 z-50 w-[90vw] md:w-96 h-[550px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-amber-200/30 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <i className="fas fa-brain text-white text-lg"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Serenoa</h3>
                  <p className="text-xs text-white/80">🟢 Online • Here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 p-2 bg-amber-50/30 border-b border-amber-100/30 overflow-x-auto">
              <button 
                onClick={() => handleSuggestionClick('Tell me a joke 😄')}
                className="px-2 py-1 text-xs bg-white rounded-full shadow-sm hover:shadow-md transition whitespace-nowrap text-amber-700"
              >
                😄 Joke
              </button>
              <button 
                onClick={() => handleSuggestionClick('Give me an affirmation 💪')}
                className="px-2 py-1 text-xs bg-white rounded-full shadow-sm hover:shadow-md transition whitespace-nowrap text-amber-700"
              >
                💪 Affirmation
              </button>
              <button 
                onClick={() => handleSuggestionClick('I need some comfort 🤗')}
                className="px-2 py-1 text-xs bg-white rounded-full shadow-sm hover:shadow-md transition whitespace-nowrap text-amber-700"
              >
                🤗 Comfort
              </button>
              <button 
                onClick={() => handleSuggestionClick('Help me relax 🧘')}
                className="px-2 py-1 text-xs bg-white rounded-full shadow-sm hover:shadow-md transition whitespace-nowrap text-amber-700"
              >
                🧘 Meditate
              </button>
              <button 
                onClick={() => handleSuggestionClick('Give me a quote 📖')}
                className="px-2 py-1 text-xs bg-white rounded-full shadow-sm hover:shadow-md transition whitespace-nowrap text-amber-700"
              >
                📖 Quote
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-amber-50/30">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                        : 'bg-white shadow-sm border border-amber-100'
                    }`}
                  >
                    {message.sender === 'bot' && message.type && (
                      <div className="text-xs mb-1 text-amber-500 flex items-center gap-1">
                        {getMessageEmoji(message.type)}
                        <span className="capitalize">{message.type}</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p className={`text-[10px] mt-1 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-amber-400'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white shadow-sm border border-amber-100 rounded-2xl p-3 flex items-center gap-1">
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2 flex flex-wrap gap-1 border-t border-amber-100/30 bg-white/80">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-2 py-1 text-xs bg-amber-50 hover:bg-amber-100 rounded-full transition text-amber-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-amber-100/50 bg-white/80 backdrop-blur-sm">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-amber-50/50 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 border border-amber-100/50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`px-4 py-2 rounded-xl text-white font-medium transition-all ${
                    input.trim()
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:shadow-lg'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
              <p className="text-[10px] text-amber-400/60 text-center mt-1">
                💚 Serenoa is here to listen, support, and uplift you
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;