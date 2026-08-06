import axios from 'axios';
import type { ScreenerData } from '../types';  // ← Fixed: use 'type' keyword
import { getToken, clearAuth } from './auth';

// Use environment variable with fallback. Backend (server/src/index.js) listens on 8000.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Only use mock mode when explicitly enabled - was previously "always true" due to a `|| true` bug
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Attach the JWT (if we have one) to every outgoing request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('API Error:', error.response?.data || error.message);
    const status = error.response?.status;
    const message = error.response?.data?.error;
    // 401 = no token at all. 403 with this specific message = token invalid/expired.
    // A 403 from requireAdmin ("Admin access required") is a valid user lacking permission,
    // NOT an expired session - must not log them out for that.
    const isAuthFailure = status === 401 || (status === 403 && message === 'Invalid or expired token');
    if (isAuthFailure) {
      clearAuth();
      // Tell the React app immediately (it won't otherwise know local storage changed)
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    return Promise.reject(error);
  }
);

// ===== Auth =====
export const registerUser = async (data: {
  email: string;
  password: string;
  name: string;
  department?: string;
  year?: number;
  gender?: string;
}) => {
  const response = await api.post('/auth/register', data);
  return response.data; // { message, token, user }
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data; // { message, token, user }
};

// ===== Survey / Recommendations (real backend) =====
export const submitSurveyReal = async (data: {
  academicPressure: number;
  sleepHours: number;
  financialStress: number;
  socialSupport: number;
}) => {
  const response = await api.post('/survey/submit', data);
  return response.data; // { message, survey }
};

export const getRecommendationsReal = async () => {
  const response = await api.get('/recommendations');
  return response.data; // { overallRisk, riskScore, actionPlan }
};

export const fetchSurveyHistory = async () => {
  const response = await api.get('/survey/history');
  return response.data; // SurveyResponse[], newest first
};

// ===== Weekly Goals =====
export const fetchGoals = async () => {
  const response = await api.get('/goals');
  return response.data; // { goals, totalXP }
};

export const completeGoal = async (id: string) => {
  const response = await api.patch(`/goals/${id}/complete`);
  return response.data; // { goal }
};

// ===== Exercises =====
export const completeExercise = async (exerciseId: number, exerciseTitle: string) => {
  const response = await api.post('/exercises/complete', { exerciseId, exerciseTitle });
  return response.data; // { completion }
};

export const fetchExerciseHistory = async () => {
  const response = await api.get('/exercises/history');
  return response.data; // { completions, totalCompleted, totalXP }
};

// ===== Progress (real, backend-computed) =====
export const fetchProgress = async () => {
  const response = await api.get('/progress');
  return response.data; // { dayStreak, consistencyScore, exercisesDone, totalXP, weeklyActivity }
};

// ===== Mood Garden =====
export const fetchMoodHistory = async () => {
  const response = await api.get('/mood');
  return response.data; // MoodEntry[]
};

export const logMoodEntry = async (mood: string, date?: string) => {
  const response = await api.post('/mood', { mood, date });
  return response.data; // { entry }
};

// ===== Admin Analytics (Ritika's dashboard) =====
// Backend enforces role: 'ADMIN' on all of these - a non-admin token gets a 403.
export const fetchAdminBreakdown = async (groupBy: 'department' | 'year' | 'gender') => {
  const response = await api.get('/admin/breakdown', { params: { groupBy } });
  return response.data; // { groupBy, groups: [{ group, studentCount, studentsWithSurvey, avgRiskScore, riskDistribution }] }
};

export const fetchAdminCorrelation = async () => {
  const response = await api.get('/admin/correlation');
  return response.data; // { sampleSize, variables, labels, matrix }
};

// Returns a Blob - caller is responsible for turning it into a download
// (can't just link to the URL directly since the endpoint needs the auth header).
export const fetchAdminCSVBlob = async (): Promise<Blob> => {
  const response = await api.get('/admin/export/csv', { responseType: 'blob' });
  return response.data;
};

// Mock data for when backend is not available
const mockAnalysis = {
  riskLevel: 'Moderate',
  riskScore: 65,
  stressFactors: [
    { name: 'Academics', value: 85 },
    { name: 'Financial', value: 45 },
    { name: 'Relationships', value: 30 },
    { name: 'Sleep', value: 60 },
    { name: 'Career', value: 50 },
  ],
  recommendations: [
    'Consider establishing a consistent sleep schedule (7-9 hours recommended)',
    'Practice mindfulness or deep breathing exercises for 5-10 minutes daily',
    'Reach out to support networks - you\'re not alone in this journey',
    'Take regular breaks during study sessions to reduce academic pressure',
  ],
  riskDistribution: [
    { name: 'Low', value: 45, color: '#b5d6e0' },
    { name: 'Moderate', value: 35, color: '#f9e3b3' },
    { name: 'High', value: 20, color: '#d4a373' },
  ],
};

export const submitScreener = async (data: ScreenerData) => {
  try {
    if (USE_MOCK) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('✅ Mock submission successful:', data);
      return { success: true, id: 'mock-' + Date.now(), data };
    }
    
    const response = await api.post('/screener/submit', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting screener:', error);
    // Return mock data on error
    return { success: true, id: 'mock-fallback-' + Date.now(), data };
  }
};

export const getAnalysis = async (id: string) => {
  try {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Mock analysis for ID:', id);
      return { 
        success: true, 
        analysis: {
          ...mockAnalysis,
          id,
          timestamp: new Date().toISOString(),
        }
      };
    }
    
    const response = await api.get(`/screener/analysis/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return { 
      success: true, 
      analysis: {
        ...mockAnalysis,
        id: id || 'mock-id',
        timestamp: new Date().toISOString(),
      }
    };
  }
};

// Calculate risk based on responses (simple algorithm)
export const calculateRisk = (data: ScreenerData) => {
  let riskScore = 0;

  // Academic pressure (0-5 scale)
  if (data.academicPressure && data.academicPressure > 3) riskScore += 15;
  if (data.academicPressure && data.academicPressure >= 5) riskScore += 10;

  // Study satisfaction (0-5 scale, lower = worse)
  if (data.studySatisfaction && data.studySatisfaction < 2) riskScore += 15;
  if (data.studySatisfaction && data.studySatisfaction < 1) riskScore += 10;

  // Work pressure (0-5 scale)
  if (data.workPressure && data.workPressure > 3) riskScore += 10;

  // Job satisfaction (0-5 scale, lower = worse)
  if (data.jobSatisfaction && data.jobSatisfaction < 2) riskScore += 10;

  // Sleep duration (now a string bucket, not a number)
  if (data.sleepDuration === 'Less than 5 hours') riskScore += 20;
  else if (data.sleepDuration === '5-6 hours') riskScore += 10;

  // Financial stress (1-5 scale)
  if (data.financialStress && data.financialStress > 3) riskScore += 15;
  if (data.financialStress && data.financialStress >= 5) riskScore += 10;

  // Family history of mental illness
  if (data.familyHistory === 'Yes') riskScore += 5;

  // Suicidal thoughts - strongest single signal
  if (data.suicidalThoughts === 'Yes') riskScore += 25;

  // Cap at 100
  riskScore = Math.min(riskScore, 100);

  // Determine risk level
  let riskLevel = 'Low';
  if (riskScore > 70) riskLevel = 'High';
  else if (riskScore > 40) riskLevel = 'Moderate';

  // Sleep duration mapped to a rough 0-100 "poor sleep" score for the stress chart
  const sleepStressValue = (() => {
    switch (data.sleepDuration) {
      case 'Less than 5 hours': return 90;
      case '5-6 hours': return 65;
      case '6-7 hours': return 40;
      case '7-8 hours': return 20;
      case 'More than 8 hours': return 10;
      default: return 50;
    }
  })();

  // Stress factors from data
  const stressMap: { [key: string]: number } = {
    'Academics': data.academicPressure ? Math.round((data.academicPressure / 5) * 100) : 50,
    'Financial': data.financialStress ? Math.round((data.financialStress / 5) * 100) : 40,
    'Work': data.workPressure ? Math.round((data.workPressure / 5) * 100) : 30,
    'Sleep': sleepStressValue,
  };

  const stressFactors = Object.entries(stressMap).map(([name, value]) => ({
    name,
    value: Math.min(Math.max(value, 10), 95),
  }));

  // Generate recommendations
  const recommendations = [];
  if (data.sleepDuration === 'Less than 5 hours' || data.sleepDuration === '5-6 hours') {
    recommendations.push('Consider establishing a consistent sleep schedule (7-9 hours recommended)');
  }
  if (data.academicPressure && data.academicPressure > 3) {
    recommendations.push('Take regular breaks during study sessions to reduce academic pressure');
  }
  if (data.financialStress && data.financialStress > 3) {
    recommendations.push('Reach out to a financial aid office or counselor about financial stress');
  }
  if (data.workPressure && data.workPressure > 3) {
    recommendations.push('Practice mindfulness or deep breathing exercises for 5-10 minutes daily');
  }
  if (data.studySatisfaction && data.studySatisfaction < 2) {
    recommendations.push('Connect with academic advisors or mentors to improve study satisfaction');
  }

  if (recommendations.length === 0) {
    recommendations.push('Continue maintaining your healthy habits!');
    recommendations.push('Stay connected with your support network');
    recommendations.push('Keep up the good work on your mental wellbeing!');
  }

  return {
    riskLevel,
    riskScore,
    stressFactors,
    recommendations: recommendations.slice(0, 4),
    riskDistribution: [
      { name: 'Low', value: Math.max(0, 100 - riskScore - 10), color: '#b5d6e0' },
      { name: 'Moderate', value: Math.min(riskScore + 5, 50), color: '#f9e3b3' },
      { name: 'High', value: Math.min(Math.max(riskScore - 30, 5), 70), color: '#d4a373' },
    ],
  };
};