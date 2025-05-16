export interface Interviewer {
  name: string;
  role: string;
}

export interface InterviewSettings {
  type: 'technical' | 'behavioral' | 'mixed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
} 