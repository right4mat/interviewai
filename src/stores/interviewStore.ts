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
}

interface InterviewStore {
  // Setup state
  setupData: {
    jobDescription: string;
    pdfFile?: File;
    interviewer: Interviewer;
    settings: InterviewSettings;
    resume: string;    
  };
  setJobDescription: (description: string) => void;
  setPdfFile: (file: File | undefined) => void;
  setResume: (text: string) => void;
  setInterviewer: (interviewer: Interviewer) => void;
  setSettings: (settings: InterviewSettings) => void;
  clearSetupData: () => void;
  setStage: (stage: 'setup' | 'interview') => void;
  


  // Interview session state
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  isChatOpen: boolean;
  isConnecting: boolean;
  isConnected: boolean;
  interviewStarted: boolean;
  currentQuestionIndex: number;
  isAISpeaking: boolean;
  isWaitingForAnswer: boolean;
  questionAnswers: QuestionAnswer[];
  error: string | null;
  isScoring: boolean;
  currentAnswer: string;
  stage: 'setup' | 'interview';

  // Interview actions
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  toggleChat: () => void;
  endCall: () => void;
  startInterview: () => void;
  stopInterview: () => void;
  setCurrentQuestionIndex: (index: number) => void;
  setIsAISpeaking: (speaking: boolean) => void;
  setIsWaitingForAnswer: (waiting: boolean) => void;
  addQuestionAnswer: (qa: QuestionAnswer) => void;
  setError: (error: string | null) => void;
  setIsScoring: (scoring: boolean) => void;
  setCurrentAnswer: (answer: string) => void;
  setIsConnecting: (connecting: boolean) => void;
  setIsConnected: (connected: boolean) => void;
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
  setupData: {
    jobDescription: '',
    pdfFile: undefined,
    interviewer: DEFAULT_INTERVIEWER,
    settings: DEFAULT_SETTINGS,
    resume: ''
  },
  setResume: (text) => set((state) => ({
    setupData: { ...state.setupData, resume: text }
  })),
  setJobDescription: (description) => set((state) => ({
    setupData: { ...state.setupData, jobDescription: description }
  })),
  setPdfFile: (file) => set((state) => ({
    setupData: { ...state.setupData, pdfFile: file }
  })),
  setInterviewer: (interviewer) => set((state) => ({
    setupData: { ...state.setupData, interviewer }
  })),
  setSettings: (settings) => set((state) => ({
    setupData: { ...state.setupData, settings }
  })),
  clearSetupData: () => set((state) => ({
    setupData: {
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
  isScreenSharing: false,
  isChatOpen: false,
  isConnecting: false,
  isConnected: false,
  interviewStarted: false,
  currentQuestionIndex: 0,
  isAISpeaking: false,
  isWaitingForAnswer: false,
  questionAnswers: [],
  error: null,
  isScoring: false,
  currentAnswer: '',

  // Interview actions
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleVideo: () => set((state) => ({ isVideoOn: !state.isVideoOn })),
  toggleScreenShare: () => set((state) => ({ isScreenSharing: !state.isScreenSharing })),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  endCall: () => set({ interviewStarted: false }),
  startInterview: () => set({ interviewStarted: true }),
  stopInterview: () => set({ interviewStarted: false }),
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  setIsAISpeaking: (speaking) => set({ isAISpeaking: speaking }),
  setIsWaitingForAnswer: (waiting) => set({ isWaitingForAnswer: waiting }),
  addQuestionAnswer: (qa) => set((state) => ({ 
    questionAnswers: [...state.questionAnswers, qa] 
  })),
  setError: (error) => set({ error }),
  setIsScoring: (scoring) => set({ isScoring: scoring }),
  setCurrentAnswer: (answer) => set({ currentAnswer: answer }),
  setIsConnecting: (connecting) => set({ isConnecting: connecting }),
  setIsConnected: (connected) => set({ isConnected: connected })
}));
