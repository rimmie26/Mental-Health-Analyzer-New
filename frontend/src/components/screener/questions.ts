import { Step } from '../../types';

export const steps: Step[] = [
  {
    title: "About You",
    subtitle: "Let's get to know you better",
    questions: [
      // The ML model was only trained on 'Male'/'Female' (see preprocessing.py's
      // GENDER_MAP) - an 'Other' selection here would 422 at the API.
      { id: 'gender', type: 'select', label: 'Gender', options: ['Male', 'Female'] },
      { id: 'age', type: 'number', label: 'Age', placeholder: 'Enter your age', min: 16, max: 65 },
      { id: 'city', type: 'text', label: 'City', placeholder: 'Enter your city' },
      { id: 'profession', type: 'select', label: 'Profession', options: ['Student', 'Working Professional', 'Other'] },
      // Must be one of the exact Degree values the model was trained on
      // (see ml/src/preprocessing.py DEGREE_COLUMNS / GET /options) - free
      // text here silently produced a 422 from the ML service.
      {
        id: 'degree', type: 'select', label: 'Degree', options: [
          'B.Arch', 'B.Com', 'B.Ed', 'B.Pharm', 'B.Tech', 'BA', 'BBA', 'BCA', 'BE',
          'BHM', 'BSc', 'LLB', 'LLM', 'M.Com', 'M.Ed', 'M.Pharm', 'M.Tech', 'MA',
          'MBA', 'MBBS', 'MCA', 'MD', 'ME', 'MHM', 'MSc', 'Others', 'PhD',
        ],
      },
    ]
  },
  {
    title: "Academics",
    subtitle: "Tell us about your academic/work life",
    questions: [
      { id: 'cgpa', type: 'number', label: 'CGPA', placeholder: 'e.g., 8.2', min: 0, max: 10, step: 0.01 },
      // ML API enforces 1-5 (conint ge=1 le=5) on these four - 0 was a valid
      // slider value here but got rejected as a 422 at the API.
      { id: 'academicPressure', type: 'range', label: 'Academic Pressure (1=None, 5=Extremely High)', min: 1, max: 5, required: true },
      { id: 'studySatisfaction', type: 'range', label: 'Study Satisfaction (1=Very Dissatisfied, 5=Very Satisfied)', min: 1, max: 5, required: true },
      { id: 'workPressure', type: 'range', label: 'Work Pressure (1=None, 5=Extremely High)', min: 1, max: 5 },
      { id: 'jobSatisfaction', type: 'range', label: 'Job Satisfaction (1=Very Dissatisfied, 5=Very Satisfied)', min: 1, max: 5 },
    ]
  },
  {
    title: "Lifestyle",
    subtitle: "Your daily habits matter",
    questions: [
      // '6-7 hours' isn't one of the four buckets the model was trained on
      // (see preprocessing.py SLEEP_MAP) - removed so every option is valid.
      { id: 'sleepDuration', type: 'select', label: 'Sleep Duration', options: ['Less than 5 hours', '5-6 hours', '7-8 hours', 'More than 8 hours'] },
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