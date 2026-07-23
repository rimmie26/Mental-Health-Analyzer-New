import React from 'react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onStartScreening: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartScreening }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-12"
    >
      <h1 className="text-5xl md:text-6xl font-bold text-warm-white mb-4">
        Your AI Mental Health Companion
      </h1>
      <p className="text-xl text-warm-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
        Thoughtful AI chatbot to help you navigate stress, anxiety, and everyday challenges.
        Anonymous, science-based guidance available 24/7.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={onStartScreening}
          className="px-8 py-3 bg-white text-dark-yellow font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
        >
          <i className="fas fa-heart text-pastel-yellow"></i>
          Start Screening
        </button>
        <button className="px-8 py-3 bg-white/20 backdrop-blur-sm text-warm-white font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-all flex items-center gap-2">
          <i className="fas fa-robot"></i>
          Talk to Serenoa
        </button>
      </div>

      {/* Trust stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-warm-white">75K</div>
          <div className="text-sm text-warm-white/70">Users trust us</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-warm-white">65%</div>
          <div className="text-sm text-warm-white/70">Return rate</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-warm-white">82%</div>
          <div className="text-sm text-warm-white/70">Feel calmer</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-warm-white">5M</div>
          <div className="text-sm text-warm-white/70">Conversations</div>
        </div>
      </div>
    </motion.div>
  );
};