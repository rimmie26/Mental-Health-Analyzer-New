import React from 'react';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep) / (totalSteps - 1)) * 100;

  return (
    <div className="mb-4">
      <div className="relative h-2 bg-pastel-blue/20 rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-pastel-yellow to-dark-yellow rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      <div className="flex justify-between mt-3">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <motion.div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i <= currentStep ? 'bg-dark-yellow shadow-lg shadow-dark-yellow/30' : 'bg-pastel-blue/30'
            }`}
            animate={i === currentStep ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>
    </div>
  );
};