export interface Interviewer {
  name: string;
  role: string;
}

export interface InterviewSettings {
  type: 'technical' | 'behavioral' | 'mixed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface QuestionAnswer {
  question: string;
  answer: string;
  score: number;
  reasoning: string;
  cleanedAnswer: string;
  modelAnswer: string;
  questionSummary: string;
} 