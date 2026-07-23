import { Step } from '../../types';

export const steps: Step[] = [
  {
    title: "About You",
    subtitle: "Let's get to know you better",
    questions: [
      { id: 'age', type: 'number', label: 'Age', placeholder: 'Enter your age', min: 16, max: 65 },
      { id: 'gender', type: 'select', label: 'Gender', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
      { id: 'city', type: 'text', label: 'City/State of Residence', placeholder: 'Enter your city' },
      { id: 'department', type: 'text', label: 'Department', placeholder: 'e.g., Computer Science' },
      { id: 'year', type: 'select', label: 'Current Year of Study', options: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'] },
    ]
  },
  {
    title: "Academics",
    subtitle: "Tell us about your academic life",
    questions: [
      { id: 'degree', type: 'text', label: 'Degree Program', placeholder: 'e.g., B.Tech, M.Sc' },
      { id: 'cgpa', type: 'number', label: 'Current CGPA', placeholder: 'e.g., 8.5', min: 0, max: 10, step: 0.1 },
      { id: 'academicPressure', type: 'range', label: 'Rate your academic pressure (1=Very Low, 10=Extremely High)', min: 1, max: 10, required: true },
      { id: 'studySatisfaction', type: 'range', label: 'How satisfied are you with your studies? (1=Very Dissatisfied, 10=Very Satisfied)', min: 1, max: 10, required: true },
      { id: 'studyHours', type: 'number', label: 'Average Study Hours per Day', placeholder: 'e.g., 6', min: 0, max: 24 },
    ]
  },
  {
    title: "Lifestyle",
    subtitle: "Your daily habits matter",
    questions: [
      { id: 'assignments', type: 'number', label: 'Number of assignments/deadlines per week', placeholder: 'e.g., 3', min: 0, max: 20 },
      { id: 'sleepHours', type: 'number', label: 'Average Sleep Duration (hours)', placeholder: 'e.g., 7', min: 0, max: 24, required: true },
      { id: 'diet', type: 'select', label: 'Dietary Habits', options: ['Healthy', 'Moderate', 'Unhealthy', 'Varies'] },
      { id: 'exercise', type: 'select', label: 'Physical Exercise', options: ['Regularly', 'Occasionally', 'Rarely', 'Never'] },
      { id: 'screenTime', type: 'number', label: 'Daily Recreational Screen Time (hours)', placeholder: 'e.g., 4', min: 0, max: 24 },
    ]
  },
  {
    title: "Personal & Financial",
    subtitle: "Understanding your support system",
    questions: [
      { id: 'financialStress', type: 'range', label: 'Financial Stress Level (1=Low, 10=High)', min: 1, max: 10, required: true },
      { id: 'familyHistory', type: 'select', label: 'Family History of Mental Illness', options: ['Yes', 'No', 'Unsure'] },
      { id: 'socialSupport', type: 'select', label: 'Do you have someone to talk to when stressed?', options: ['Yes', 'No', 'Sometimes'] },
      { id: 'supportLevel', type: 'range', label: 'Support from friends/family (1=Low, 10=High)', min: 1, max: 10, required: true },
      { id: 'stressFactors', type: 'select', label: 'Biggest Stress Factor', options: ['Academics', 'Financial', 'Relationships', 'Career', 'Health', 'Social Pressure', 'Sleep', 'Other'] },
    ]
  },
  {
    title: "Emotional Well-being",
    subtitle: "How are you feeling lately?",
    questions: [
      { id: 'topStressFactor', type: 'select', label: 'Which factor affects you the most?', options: ['Academics', 'Financial', 'Relationships', 'Career', 'Health', 'Social Pressure', 'Sleep', 'Other'] },
      { id: 'stressPeriod', type: 'select', label: 'When is your stress highest?', options: ['Exams', 'Assignments', 'Start of Semester', 'End of Semester', 'Always', 'Never'] },
      { id: 'emotionalExhaustion', type: 'range', label: 'Emotional Exhaustion (1=Never, 5=Always)', min: 1, max: 5, required: true },
      { id: 'anxietyLevel', type: 'range', label: 'Anxiety/Overwhelm (1=Never, 5=Always)', min: 1, max: 5, required: true },
      { id: 'mentalWellbeing', type: 'range', label: 'Overall Mental Well-being (1=Poor, 10=Excellent)', min: 1, max: 10, required: true },
    ]
  }
];