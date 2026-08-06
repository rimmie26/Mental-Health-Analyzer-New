import { UseFormReturn, Path } from 'react-hook-form';
import { motion } from 'framer-motion';
import type { ScreenerData, Step } from '../../types';

interface QuestionStepProps {
  step: Step;
  stepIndex: number;
  form: UseFormReturn<ScreenerData>;
}

export const QuestionStep = ({ step, stepIndex, form }: QuestionStepProps) => {
  const { register, formState: { errors }, watch } = form;

  const getEmoji = (index: number) => {
    const emojis = ['👤', '📚', '🌙', '💰', '🧠'];
    return emojis[index] || '📝';
  };

  // Important questions marked with *
  const importantQuestions = ['gender', 'age', 'academicPressure', 'studySatisfaction', 'sleepDuration', 'financialStress', 'suicidalThoughts'];
  const renderInput = (question: any) => {
    const baseClasses = "w-full px-4 py-3 rounded-xl border-2 bg-white/90 backdrop-blur-sm transition-all duration-300 focus:outline-none";
    const errorClasses = errors[question.id as keyof ScreenerData] 
      ? 'border-red-400 ring-2 ring-red-400/20' 
      : 'border-pastel-blue/30 focus:border-dark-yellow focus:ring-2 focus:ring-dark-yellow/20';
    
    switch (question.type) {
      case 'number':
        return (
          <input
            {...register(question.id as Path<ScreenerData>, {
              setValueAs: (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
            })}
            type="number"
            placeholder={question.placeholder}
            min={question.min}
            max={question.max}
            step={question.step || 1}
            className={`${baseClasses} ${errorClasses}`}
          />
        );
      
      case 'text':
        return (
          <input
            {...register(question.id as Path<ScreenerData>)}
            type="text"
            placeholder={question.placeholder}
            className={`${baseClasses} ${errorClasses}`}
          />
        );
      
      case 'select':
        return (
          <select
            {...register(question.id as Path<ScreenerData>)}
            className={`${baseClasses} ${errorClasses} appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23d4a373%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat`}
          >
            <option value="">Select...</option>
            {question.options?.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      
      case 'range':
        const currentValue = watch(question.id as Path<ScreenerData>) || question.min;
        return (
          <div className="space-y-2">
            <input
              {...register(question.id as Path<ScreenerData>, { valueAsNumber: true })}
              type="range"
              min={question.min}
              max={question.max}
              className="w-full h-2 bg-pastel-blue/30 rounded-lg appearance-none cursor-pointer accent-dark-yellow transition-all"
            />
            <div className="flex justify-between text-xs text-charcoal/60">
              <span>{question.min}</span>
              <span className="text-dark-yellow font-medium">
                {typeof currentValue === 'number' ? currentValue : question.min}
              </span>
              <span>{question.max}</span>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pastel-yellow to-dark-yellow flex items-center justify-center text-white font-bold text-sm shadow-lg">
          {stepIndex + 1}
        </div>
        <div>
          <h3 className="text-xl font-bold text-charcoal">{step.title}</h3>
          <p className="text-charcoal/50 text-sm flex items-center gap-1">
            {getEmoji(stepIndex)} {step.subtitle}
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-5">
        {step.questions.map((question, qIndex) => {
          const fieldId = question.id as keyof ScreenerData;
          const isImportant = importantQuestions.includes(question.id as string);
          
          return (
            <motion.div
              key={question.id as string}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIndex * 0.05 }}
              className={`space-y-1.5 p-4 rounded-xl transition-all duration-300 ${
                isImportant ? 'bg-amber-50/50 border-l-4 border-amber-400' : ''
              }`}
            >
              <label className="flex items-start gap-2 text-sm font-medium text-charcoal/80">
                <span className="text-dark-yellow font-bold">{qIndex + 1}.</span>
                <span>{question.label}</span>
                {isImportant && (
                  <span className="text-red-500 text-xs font-bold ml-1" title="Important question">
                    * 
                    <span className="text-[10px] font-normal text-amber-600 ml-0.5">Important</span>
                  </span>
                )}
              </label>
              {renderInput(question)}
              {errors[fieldId] && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-400 text-xs mt-1 flex items-center gap-1"
                >
                  <i className="fas fa-exclamation-circle"></i>
                  This field is required
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};