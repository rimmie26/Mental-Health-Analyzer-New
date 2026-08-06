import { Step } from '../../types';

export const steps: Step[] = [
  {
    title: "About You",
    subtitle: "Let's get to know you better",
    questions: [
      { id: 'gender', type: 'select', label: 'Gender', options: ['Male', 'Female', 'Other'] },
      { id: 'age', type: 'number', label: 'Age', placeholder: 'Enter your age', min: 16, max: 65 },
      { id: 'city', type: 'text', label: 'City', placeholder: 'Enter your city' },
      { id: 'profession', type: 'select', label: 'Profession', options: ['Student', 'Working Professional', 'Other'] },
      { id: 'degree', type: 'text', label: 'Degree', placeholder: 'e.g., B.Tech, M.Sc' },
    ]
  },
  {
    title: "Academics",
    subtitle: "Tell us about your academic/work life",
    questions: [
      { id: 'cgpa', type: 'number', label: 'CGPA', placeholder: 'e.g., 8.2', min: 0, max: 10, step: 0.01 },
      { id: 'academicPressure', type: 'range', label: 'Academic Pressure (0=None, 5=Extremely High)', min: 0, max: 5, required: true },
      { id: 'studySatisfaction', type: 'range', label: 'Study Satisfaction (0=Very Dissatisfied, 5=Very Satisfied)', min: 0, max: 5, required: true },
      { id: 'workPressure', type: 'range', label: 'Work Pressure (0=None, 5=Extremely High)', min: 0, max: 5 },
      { id: 'jobSatisfaction', type: 'range', label: 'Job Satisfaction (0=Very Dissatisfied, 5=Very Satisfied)', min: 0, max: 5 },
    ]
  },
  {
    title: "Lifestyle",
    subtitle: "Your daily habits matter",
    questions: [
      { id: 'sleepDuration', type: 'select', label: 'Sleep Duration', options: ['Less than 5 hours', '5-6 hours', '6-7 hours', '7-8 hours', 'More than 8 hours'] },
      { id: 'dietaryHabits', type: 'select', label: 'Dietary Habits', options: ['Healthy', 'Moderate', 'Unhealthy'] },
      { id: 'workStudyHours', type: 'number', label: 'Work/Study Hours per day', placeholder: 'e.g., 10', min: 0, max: 24 },
    ]
  },
  {
    title: "Personal & Financial",
    subtitle: "Understanding your support system",
    questions: [
      { id: 'financialStress', type: 'range', label: 'Financial Stress (1=Low, 5=High)', min: 1, max: 5, required: true },
      { id: 'familyHistory', type: 'select', label: 'Family History of Mental Illness', options: ['Yes', 'No'] },
    ]
  },
  {
    title: "Emotional Well-being",
    subtitle: "How are you feeling lately?",
    questions: [
      { id: 'suicidalThoughts', type: 'select', label: 'Have you ever had suicidal thoughts?', options: ['Yes', 'No'] },
    ]
  }
];