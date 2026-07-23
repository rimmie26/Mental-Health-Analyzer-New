import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ScreenerData } from '../types';
import { steps } from '../components/screener/questions';

const schema = z.object({
  age: z.number().optional(),
  gender: z.string().optional(),
  city: z.string().optional(),
  department: z.string().optional(),
  year: z.string().optional(),
  degree: z.string().optional(),
  cgpa: z.number().optional(),
  academicPressure: z.number().min(1).max(10),
  studySatisfaction: z.number().min(1).max(10),
  studyHours: z.number().optional(),
  assignments: z.number().optional(),
  sleepHours: z.number().min(0).max(24),
  diet: z.string().optional(),
  exercise: z.string().optional(),
  screenTime: z.number().optional(),
  financialStress: z.number().min(1).max(10),
  familyHistory: z.string().optional(),
  socialSupport: z.string().optional(),
  supportLevel: z.number().min(1).max(10),
  stressFactors: z.array(z.string()).optional(),
  topStressFactor: z.string().optional(),
  stressPeriod: z.string().optional(),
  emotionalExhaustion: z.number().min(1).max(5),
  anxietyLevel: z.number().min(1).max(5),
  mentalWellbeing: z.number().min(1).max(10),
});

type FormData = z.infer<typeof schema>;

export const useScreener = () => {
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: '',
      academicPressure: 5,
      studySatisfaction: 5,
      financialStress: 5,
      supportLevel: 5,
      emotionalExhaustion: 3,
      anxietyLevel: 3,
      mentalWellbeing: 5,
      sleepHours: 7,
    }
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const calculateRisk = (data: any) => {
    let score = 0;
    if (data.academicPressure > 7) score += 15;
    if (data.studySatisfaction < 4) score += 15;
    if (data.sleepHours < 6) score += 10;
    if (data.financialStress > 7) score += 15;
    if (data.supportLevel < 4) score += 15;
    if (data.emotionalExhaustion > 3) score += 10;
    if (data.anxietyLevel > 3) score += 10;
    if (data.mentalWellbeing < 5) score += 10;
    
    score = Math.min(score, 100);
    let level = 'Low';
    if (score > 70) level = 'High';
    else if (score > 40) level = 'Moderate';

    return {
      riskLevel: level,
      riskScore: score,
      stressFactors: [
        { name: 'Academics', value: Math.min((data.academicPressure || 5) * 10, 95) },
        { name: 'Financial', value: Math.min((data.financialStress || 5) * 10, 95) },
        { name: 'Support', value: Math.min((10 - (data.supportLevel || 5)) * 10, 95) },
        { name: 'Sleep', value: Math.min((8 - Math.min(data.sleepHours || 7, 8)) * 12.5, 95) },
      ],
      recommendations: [
        data.sleepHours < 6 ? 'Try to get 7-9 hours of sleep' : 'Keep up your good sleep habits',
        data.academicPressure > 7 ? 'Take regular breaks during study' : 'Maintain your study routine',
        data.supportLevel < 5 ? 'Reach out to your support network' : 'Stay connected with loved ones',
        data.emotionalExhaustion > 3 ? 'Practice mindfulness daily' : 'Continue your wellness practices',
      ],
      riskDistribution: [
        { name: 'Low', value: Math.max(0, 100 - score - 10), color: '#b5d6e0' },
        { name: 'Moderate', value: Math.min(score + 5, 50), color: '#f9e3b3' },
        { name: 'High', value: Math.min(Math.max(score - 30, 5), 70), color: '#d4a373' },
      ],
    };
  };

  const onSubmit = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      const analysis = calculateRisk(data);
      setAnalysisData(analysis);
      setShowResults(true);
      setIsLoading(false);
    }, 1500);
  };

  return {
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
  };
};