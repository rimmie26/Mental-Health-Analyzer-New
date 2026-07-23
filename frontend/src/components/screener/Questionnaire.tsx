import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScreener } from '../../hooks/useScreener';
import { StepIndicator } from './StepIndicator';
import { QuestionStep } from './QuestionStep';
import { ResultsDashboard } from '../results/ResultDashboard';

interface QuestionnaireProps {
  onBack?: () => void;
}

export const Questionnaire = ({ onBack }: QuestionnaireProps) => {
  const {
    step,
    steps,
    form,
    nextStep,
    prevStep,
    onSubmit,
    showResults,
    setShowResults,
    analysisData,
    isLoading,
  } = useScreener();

  if (isLoading) {
    return (
      <div className="bg-cream rounded-3xl p-12 shadow-2xl max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="relative">
            <div className="w-20 h-20 border-4 border-pastel-blue/30 border-t-dark-yellow rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="fas fa-brain text-2xl text-dark-yellow animate-pulse"></i>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-charcoal mt-6">Analyzing Your Responses...</h3>
          <p className="text-charcoal/60 mt-2 text-sm">Please wait while we process your screening</p>
          <div className="mt-4 flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-dark-yellow rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (showResults && analysisData) {
    return <ResultsDashboard data={analysisData} onReset={() => {
      setShowResults(false);
      form.reset();
    }} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-cream rounded-3xl p-6 md:p-8 shadow-2xl max-w-3xl mx-auto"
    >
      {/* Back Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="text-charcoal/50 hover:text-charcoal transition flex items-center gap-2 text-sm"
        >
          <i className="fas fa-arrow-left"></i>
          Back to Home
        </button>
        <span className="text-xs text-charcoal/30">
          <i className="fas fa-lock mr-1"></i>
          Secure & Private
        </span>
      </div>

      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-dark-yellow">
            <i className="fas fa-clipboard-list mr-2"></i>
            Screening Assessment
          </span>
          <span className="text-sm text-charcoal/60">
            {step + 1} of {steps.length}
          </span>
        </div>
        <StepIndicator currentStep={step} totalSteps={steps.length} />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <QuestionStep
              step={steps[step]}
              stepIndex={step}
              form={form}
            />
          </motion.div>
        </AnimatePresence>

        {/* Important Note */}
        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2">
          <i className="fas fa-info-circle text-amber-500 mt-0.5"></i>
          <p className="text-xs text-amber-700">
            <span className="font-semibold">Important:</span> All questions marked with <span className="text-red-500">*</span> are required for accurate assessment.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 pt-6 border-t border-pastel-blue/20">
          <motion.button
            type="button"
            onClick={prevStep}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
              step === 0
                ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-400'
                : 'bg-white hover:bg-pastel-yellow/30 text-charcoal hover:shadow-md'
            }`}
            disabled={step === 0}
          >
            <i className="fas fa-arrow-left text-sm"></i>
            Previous
          </motion.button>

          {step < steps.length - 1 ? (
            <motion.button
              type="button"
              onClick={nextStep}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-dark-yellow hover:bg-dark-yellow-dark text-white rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              Next
              <i className="fas fa-arrow-right text-sm"></i>
            </motion.button>
          ) : (
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-2.5 bg-gradient-to-r from-pastel-yellow to-dark-yellow hover:from-dark-yellow hover:to-dark-yellow-dark text-white rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <i className="fas fa-heart mr-1"></i>
              Submit Screening
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default Questionnaire;