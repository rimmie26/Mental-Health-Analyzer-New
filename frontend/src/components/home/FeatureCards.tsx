import React from 'react';
import { motion } from 'framer-motion';

const features = [
  { icon: 'fa-shield-alt', title: 'Safe & Secure', desc: 'Your data stays confidential with proven methods.' },
  { icon: 'fa-chart-line', title: 'Science-Backed', desc: 'Recognize patterns with research-backed prompts.' },
  { icon: 'fa-comments', title: '24/7 Support', desc: 'Talk through stress, anxiety, and relationships anytime.' },
];

export const FeatureCards: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {features.map((f, i) => (
        <motion.div
          key={i}
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 w-64 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -10, scale: 1.03 }}
        >
          <div className="w-12 h-12 rounded-full bg-pastel-yellow/30 flex items-center justify-center mb-4">
            <i className={`fas ${f.icon} text-2xl text-dark-yellow`}></i>
          </div>
          <h3 className="text-xl font-bold text-charcoal mb-2">{f.title}</h3>
          <p className="text-charcoal/70 text-sm">{f.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};