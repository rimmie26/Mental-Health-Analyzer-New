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
  timeout: 5000,
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
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token missing/expired - clear stale auth so the app knows to show login again
      clearAuth();
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

  // Academic pressure
  if (data.academicPressure && data.academicPressure > 7) riskScore += 15;
  if (data.academicPressure && data.academicPressure > 9) riskScore += 10;

  // Study satisfaction
  if (data.studySatisfaction && data.studySatisfaction < 4) riskScore += 15;
  if (data.studySatisfaction && data.studySatisfaction < 2) riskScore += 10;

  // Sleep
  if (data.sleepHours && data.sleepHours < 6) riskScore += 10;
  if (data.sleepHours && data.sleepHours < 4) riskScore += 10;

  // Financial stress
  if (data.financialStress && data.financialStress > 7) riskScore += 15;

  // Support level
  if (data.supportLevel && data.supportLevel < 4) riskScore += 15;

  // Emotional exhaustion
  if (data.emotionalExhaustion && data.emotionalExhaustion > 3) riskScore += 10;
  if (data.emotionalExhaustion && data.emotionalExhaustion > 4) riskScore += 5;

  // Anxiety
  if (data.anxietyLevel && data.anxietyLevel > 3) riskScore += 10;
  if (data.anxietyLevel && data.anxietyLevel > 4) riskScore += 5;

  // Mental wellbeing
  if (data.mentalWellbeing && data.mentalWellbeing < 5) riskScore += 10;
  if (data.mentalWellbeing && data.mentalWellbeing < 3) riskScore += 10;

  // Cap at 100
  riskScore = Math.min(riskScore, 100);

  // Determine risk level
  let riskLevel = 'Low';
  if (riskScore > 70) riskLevel = 'High';
  else if (riskScore > 40) riskLevel = 'Moderate';

  // Stress factors from data
  const stressMap: { [key: string]: number } = {
    'Academics': data.academicPressure ? Math.round((data.academicPressure / 10) * 100) : 50,
    'Financial': data.financialStress ? Math.round((data.financialStress / 10) * 100) : 40,
    'Relationships': data.supportLevel ? Math.round((10 - data.supportLevel) / 10 * 100) : 30,
    'Sleep': data.sleepHours ? Math.round((8 - Math.min(data.sleepHours, 8)) / 8 * 100) : 50,
  };

  const stressFactors = Object.entries(stressMap).map(([name, value]) => ({
    name,
    value: Math.min(Math.max(value, 10), 95),
  }));

  // Generate recommendations
  const recommendations = [];
  if (data.sleepHours && data.sleepHours < 6) {
    recommendations.push('Consider establishing a consistent sleep schedule (7-9 hours recommended)');
  }
  if (data.academicPressure && data.academicPressure > 7) {
    recommendations.push('Take regular breaks during study sessions to reduce academic pressure');
  }
  if (data.supportLevel && data.supportLevel < 5) {
    recommendations.push('Reach out to support networks - you\'re not alone in this journey');
  }
  if (data.emotionalExhaustion && data.emotionalExhaustion > 3) {
    recommendations.push('Practice mindfulness or deep breathing exercises for 5-10 minutes daily');
  }
  if (data.studySatisfaction && data.studySatisfaction < 4) {
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