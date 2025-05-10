import { create } from 'zustand';
import { Interviewer } from '@/types/interview';


interface InterviewSettings {
  type: 'technical' | 'behavioral' | 'mixed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface QuestionAnswer {
  question: string;
  answer: string;
  score?: number;
  reasoning?: string;
  cleanedAnswer?: string;
  modelAnswer?: string;
  questionSummary: string;
  currentQuestionIndex: number;
}

interface InterviewStore {
  // Setup state
  interviewState: {
    jobDescription: string;
    pdfFile?: File;
    interviewer: Interviewer;
    settings: InterviewSettings;
    resume: string;    
  };

    // Interview session state
    isMuted: boolean;
    isVideoOn: boolean;
    isChatOpen: boolean;
    interviewStarted: boolean;
    questionAnswers: QuestionAnswer[];
    stage: 'setup' | 'interview';

  setJobDescription: (description: string) => void;
  setPdfFile: (file: File | undefined) => void;
  setResume: (text: string) => void;
  setInterviewer: (interviewer: Interviewer) => void;
  setSettings: (settings: InterviewSettings) => void;
  clearinterviewState: () => void;
  setStage: (stage: 'setup' | 'interview') => void;

  // Interview actions
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleChat: () => void;
  endCall: () => void;
  startInterview: () => void;
  stopInterview: () => void;
  addQuestionAnswer: (qa: QuestionAnswer) => void;
}

const DEFAULT_INTERVIEWER: Interviewer = {
  name: 'AI Interviewer',
  role: 'Senior Technical Recruiter'
};

const DEFAULT_SETTINGS: InterviewSettings = {
  type: 'mixed',
  difficulty: 'intermediate'
};

export const useInterviewStore = create<InterviewStore>((set) => ({
  // Setup state
  interviewState: {
    jobDescription: '',
    pdfFile: undefined,
    interviewer: DEFAULT_INTERVIEWER,
    settings: DEFAULT_SETTINGS,
    resume: ''
  },
  setResume: (text) => set((state) => ({
    interviewState: { ...state.interviewState, resume: text }
  })),
  setJobDescription: (description) => set((state) => ({
    interviewState: { ...state.interviewState, jobDescription: description }
  })),
  setPdfFile: (file) => set((state) => ({
    interviewState: { ...state.interviewState, pdfFile: file }
  })),
  setInterviewer: (interviewer) => set((state) => ({
    interviewState: { ...state.interviewState, interviewer }
  })),
  setSettings: (settings) => set((state) => ({
    interviewState: { ...state.interviewState, settings }
  })),
  clearinterviewState: () => set((state) => ({
    interviewState: {
      jobDescription: '',
      pdfFile: undefined,
      interviewer: DEFAULT_INTERVIEWER,
      settings: DEFAULT_SETTINGS,
      resume: ''
    }
  })),
  setStage: (stage) => set({ stage }),
  

  // Interview session state
  stage: 'setup',
  isMuted: false,
  isVideoOn: true,
  isChatOpen: true,
  interviewStarted: false,
  currentQuestionIndex: 0,
  questionAnswers: [],

  // Interview actions
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleVideo: () => set((state) => ({ isVideoOn: !state.isVideoOn })),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  endCall: () => set({ interviewStarted: false }),
  startInterview: () => set({ interviewStarted: true }),
  stopInterview: () => set({ interviewStarted: false }),
  addQuestionAnswer: (qa) => set((state) => ({ 
    questionAnswers: [...state.questionAnswers, qa] 
  })),
}));
