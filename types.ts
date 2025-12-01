
export enum PersonaType {
  PROFESSIONAL = 'Busy Professional',
  RETIREE = 'Active Retiree',
  STUDENT = 'Student',
  CAREGIVER = 'Parent/Caregiver',
  NEURODIVERGENT = 'Neurodivergent',
  CHRONIC_ILLNESS = 'Managing Energy',
  TRANSITION = 'In Transition'
}

export enum EnergyLevel {
  LOW = 'Low - I need a break',
  MEDIUM = 'Medium - Ready for light focus',
  HIGH = 'High - Ready for a challenge'
}

export enum ActivityCategory {
  BRAIN = 'Brain & Cognition',
  BODY = 'Body & Mobility',
  SKILLS = 'Skills & Growth',
  CREATIVE = 'Hobbies & Creativity',
  REFLECTION = 'Emotional Reflection'
}

export type Language = 'en' | 'hi';

export interface UserProfile {
  name: string;
  persona: PersonaType;
  goals: string[];
  history: ActivityLog[];
  language: Language;
}

export type InteractiveType = 'QUIZ' | 'READING';

export interface InteractiveElement {
  type: InteractiveType;
  content?: string; // For READING type
  quizData?: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  durationMinutes: number;
  steps: string[];
  rationale: string; 
  sourceUrl?: string;
  interactive?: InteractiveElement; // New field for in-app content
}

export interface ActivityLog {
  activityId: string;
  activityTitle: string;
  timestamp: number;
  completed: boolean;
  feedback?: {
    difficulty: 'too_easy' | 'just_right' | 'too_hard';
    enjoyment: 'disliked' | 'neutral' | 'liked';
    notes?: string;
  };
}

export type ViewState = 
  | 'ONBOARDING'
  | 'CHECK_IN'
  | 'GENERATING'
  | 'SELECTION'
  | 'ACTIVE_SESSION'
  | 'FEEDBACK'
  | 'HISTORY'
  | 'PROFILE';
