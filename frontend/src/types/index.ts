export interface ScreenerData {
  age?: number;
  gender?: string;
  city?: string;
  department?: string;
  year?: string;
  degree?: string;
  cgpa?: number;
  academicPressure: number;
  studySatisfaction: number;
  studyHours?: number;
  assignments?: number;
  sleepHours: number;
  diet?: string;
  exercise?: string;
  screenTime?: number;
  financialStress: number;
  familyHistory?: string;
  socialSupport?: string;
  supportLevel: number;
  stressFactors?: string[];
  topStressFactor?: string;
  stressPeriod?: string;
  emotionalExhaustion: number;
  anxietyLevel: number;
  mentalWellbeing: number;
}

export interface Question {
  id: keyof ScreenerData;
  type: 'number' | 'text' | 'select' | 'range' | 'checkbox';
  label: string;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

export interface Step {
  title: string;
  subtitle: string;
  questions: Question[];
}