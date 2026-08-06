import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { steps } from '../components/screener/questions';
import {
  submitSurveyReal,
  getRecommendationsReal,
  calculateRisk,
  calculateWellbeing,
} from '../utils/api';

// Must match `ScreenerData` in ../types exactly - all fields required there,
// so all fields are required here too (kept the previous version's drift
// from a hardcoded, unrelated old dataset from happening again).
const schema = z.object({
  gender: z.string().min(1, 'Required'),
  age: z.number({ invalid_type_error: 'Required' }).min(16).max(65),
  city: z.string().min(1, 'Required'),
  profession: z.string().min(1, 'Required'),
  degree: z.string().min(1, 'Required'),
  cgpa: z.number().min(0).max(10),
  academicPressure: z.number().min(0).max(5),
  studySatisfaction: z.number().min(0).max(5),
  workPressure: z.number().min(0).max(5),
  jobSatisfaction: z.number().min(0).max(5),
  sleepDuration: z.string().min(1, 'Required'),
  dietaryHabits: z.string().min(1, 'Required'),
  workStudyHours: z.number().min(0).max(24),
  financialStress: z.number().min(1).max(5),
  familyHistory: z.string().min(1, 'Required'),
  suicidalThoughts: z.string().min(1, 'Required'),
});

type FormData = z.infer<typeof schema>;

// Backend's real /survey/submit endpoint was built against the OLD field set
// (academicPressure 1-10, sleepHours as a number, socialSupport 1-10). Until
// the backend is updated to the new schema, this shim approximates the old
// shape from the new fields so submission doesn't silently break.
// TODO: confirm against server/src (survey route + validation) and update
// both sides together once the backend model is retrained/adjusted.
const sleepDurationToHours = (bucket: string): number => {
  const map: Record<string, number> = {
    'Less than 5 hours': 4,
    '5-6 hours': 5.5,
    '6-7 hours': 6.5,
    '7-8 hours': 7.5,
    'More than 8 hours': 9,
  };
  return map[bucket] ?? 7;
};

export const useScreener = () => {
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: '',
      city: '',
      profession: '',
      degree: '',
      cgpa: 7,
      academicPressure: 2.5,
      studySatisfaction: 2.5,
      workPressure: 0,
      jobSatisfaction: 0,
      sleepDuration: '6-7 hours',
      dietaryHabits: 'Moderate',
      workStudyHours: 6,
      financialStress: 3,
      familyHistory: 'No',
      suicidalThoughts: 'No',
    },
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const riskLevelLabel = (overallRisk: string) => {
    if (overallRisk === 'HIGH') return 'High';
    if (overallRisk === 'MEDIUM') return 'Moderate';
    return 'Low';
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setSubmitError(null);

    // Local (client-side) analysis - always computed so the results screen
    // has something to show even if the backend call fails.
    const localRisk = calculateRisk(data);
    const localWellbeing = calculateWellbeing(data);
    const localAnalysis = { ...localRisk, ...localWellbeing };

    try {
      await submitSurveyReal({
        academicPressure: data.academicPressure,
        sleepHours: sleepDurationToHours(data.sleepDuration),
        financialStress: data.financialStress,
        // No direct equivalent in the new schema - jobSatisfaction is the
        // closest available signal. Flagged above; confirm with backend.
        socialSupport: data.jobSatisfaction,
      });

      const rec = await getRecommendationsReal();
      const recommendations = rec.actionPlan.flatMap((item: any) => item.actionItems);

      setAnalysisData({
        ...localAnalysis,
        riskLevel: riskLevelLabel(rec.overallRisk),
        riskScore: Math.round(rec.riskScore),
        recommendations: recommendations.length > 0 ? recommendations : localAnalysis.recommendations,
        // Keep rootCause -> actionItems grouped (not just a flat list) so the
        // results screen can show WHY each recommendation was made, e.g.
        // "Poor Sleep" -> ["Establish a strict 11 PM sleep schedule", ...].
        actionPlan: rec.actionPlan,
        rootCauses: rec.actionPlan.map((item: any) => item.rootCause),
      });
      setShowResults(true);
    } catch (err: any) {
      // Backend/auth failure - fall back to the local estimate so the user still gets a result,
      // but surface the error so it's clear this wasn't saved to their account.
      console.error('Survey submission failed, using local estimate:', err);
      setSubmitError(
        err.response?.status === 401
          ? 'You need to be logged in for this to be saved to your account.'
          : 'Could not reach the server - showing a local estimate instead.'
      );
      setAnalysisData(localAnalysis);
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
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
    submitError,
  };
};