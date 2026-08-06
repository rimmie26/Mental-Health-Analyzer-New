export interface ScreenerData {
  gender: string;
  age: number;
  city: string;
  profession: string;
  degree: string;
  cgpa: number;
  academicPressure: number;
  studySatisfaction: number;
  workPressure: number;
  jobSatisfaction: number;
  sleepDuration: string;
  dietaryHabits: string;
  workStudyHours: number;
  financialStress: number;
  familyHistory: string;
  suicidalThoughts: string;
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