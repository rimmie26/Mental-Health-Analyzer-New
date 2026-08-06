import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { steps } from '../components/screener/questions';
import {
  analyzeStudent,
  calculateRisk,
  calculateWellbeing,
  saveLatestAnalysis,
  toDashboardShape,
} from '../utils/api';

// Must match `ScreenerData` in ../types exactly - all fields required there,
// so all fields are required here too (kept the previous version's drift
// from a hardcoded, unrelated old dataset from happening again).
// Ranges mirror what the ML API (ml/src/app.py's StudentInput) actually
// accepts, so a validation error here means the API would 422 it too -
// catching it in the form beats a round trip to find out.
const schema = z.object({
  gender: z.string().min(1, 'Required'),
  age: z.number({ invalid_type_error: 'Required' }).min(16).max(65),
  city: z.string().min(1, 'Required'),
  profession: z.string().min(1, 'Required'),
  degree: z.string().min(1, 'Required'),
  cgpa: z.number().min(0).max(10),
  academicPressure: z.number().min(1).max(5),
  studySatisfaction: z.number().min(1).max(5),
  workPressure: z.number().min(1).max(5),
  jobSatisfaction: z.number().min(1).max(5),
  sleepDuration: z.string().min(1, 'Required'),
  dietaryHabits: z.string().min(1, 'Required'),
  workStudyHours: z.number().min(0).max(24),
  financialStress: z.number().min(1).max(5),
  familyHistory: z.string().min(1, 'Required'),
  suicidalThoughts: z.string().min(1, 'Required'),
});

type FormData = z.infer<typeof schema>;

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
      academicPressure: 3,
      studySatisfaction: 3,
      workPressure: 1,
      jobSatisfaction: 3,
      sleepDuration: '7-8 hours',
      dietaryHabits: 'Moderate',
      workStudyHours: 6,
      financialStress: 3,
      familyHistory: 'No',
      suicidalThoughts: 'No',
    },
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setSubmitError(null);

    // Local (client-side) estimate - always computed so the results screen
    // has something to show even if the ML service call fails.
    const localRisk = calculateRisk(data);
    const localWellbeing = calculateWellbeing(data);
    const localAnalysis = { ...localRisk, ...localWellbeing };

    try {
      const report = await analyzeStudent(data);
      // Only the real model output gets persisted for the dashboard - the
      // client-only fallback below is an estimate, not something we want
      // StressRadar quoting as if it were an actual result.
      saveLatestAnalysis(report);
      setAnalysisData(toDashboardShape(report));
      setShowResults(true);
    } catch (err: any) {
      // 422 = the ML API rejected the input itself (shouldn't normally
      // happen since the form's own validation mirrors its rules, but a
      // stale option list or manual field edit could still slip one
      // through). 502/network error = the ML service is down or
      // unreachable. Either way, fall back to the local estimate so the
      // user still gets a result instead of a blank page, but say why.
      console.error('Analysis request failed, using local estimate:', err);
      const status = err.response?.status;
      setSubmitError(
        status === 422
          ? (err.response?.data?.error || 'Some of your answers could not be validated - showing a local estimate instead.')
          : 'Could not reach the analysis service - showing a local estimate instead.'
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