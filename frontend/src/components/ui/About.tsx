import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../common/Navbar';

interface AboutProps {
  onNavigate: (page: string) => void;
  onLogin: () => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate, onLogin }) => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-[#1a1008] via-dark-yellow-dark to-[#1a1008]">
      {/* Enhanced Animated Background Blobs - Darker */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-pastel-yellow/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pastel-blue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      <div className="absolute top-40 right-40 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-40 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />

      {/* Navbar */}
      <div className="relative z-20 px-6 py-4">
        <Navbar onLogin={onLogin} onNavigate={onNavigate} currentPage="about" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-0.5 rounded-2xl">
              <div className="bg-black/40 backdrop-blur-sm px-6 py-2 rounded-2xl">
                <span className="text-sm font-medium text-warm-white/80">🧠 About Us</span>
              </div>
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-warm-white mb-6">
            About <span className="bg-gradient-to-r from-pastel-yellow to-warm-white bg-clip-text text-transparent">Serenoa</span>
          </h1>
          
          <div className="space-y-6 text-warm-white/80">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl leading-relaxed bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10"
            >
              Serenoa is your AI-powered mental health companion designed to help you navigate 
              stress, anxiety, and everyday challenges with ease.
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[
                { emoji: '🧠', title: 'AI-Powered', desc: 'Intelligent conversations tailored to your needs', delay: 0.4 },
                { emoji: '🔒', title: 'Private & Secure', desc: 'Your data stays confidential and protected', delay: 0.5 },
                { emoji: '💚', title: '24/7 Support', desc: 'Available anytime, anywhere you need it', delay: 0.6 }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item.delay }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-pastel-yellow/30 transition-all duration-300"
                >
                  <div className="text-4xl mb-3">{item.emoji}</div>
                  <h3 className="text-lg font-semibold text-warm-white">{item.title}</h3>
                  <p className="text-sm text-warm-white/60 mt-2">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 p-6 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-2xl border border-orange-500/20"
            >
              <p className="text-sm text-warm-white/80">
                <span className="text-warm-white font-medium text-base">🌟 Our Mission:</span> To make mental wellness 
                accessible to everyone through innovative AI technology and compassionate support.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-6">
        <p className="text-xs text-warm-white/20">© 2026 Serenoa — AI Mental Health Companion</p>
      </div>
    </div>
  );
};

export default About;