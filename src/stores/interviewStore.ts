import { create } from 'zustand';
import { Interviewer } from '@/types/interview';

interface InterviewData {
  jobDescription: string;
  pdfFile?: File;
  interviewers: Interviewer;
}

interface InterviewSettings {
  type: 'technical' | 'behavioral' | 'mixed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface InterviewStore {
  // Setup state
  setupData: {
    jobDescription: string;
    pdfFile?: File;
    interviewer: Interviewer;
    settings: InterviewSettings;
  };
  setJobDescription: (description: string) => void;
  setPdfFile: (file: File | undefined) => void;
  setInterviewer: (interviewer: Interviewer) => void;
  setSettings: (settings: InterviewSettings) => void;
  clearSetupData: () => void;
  
  // Interview state
  interviewData: InterviewData | null;
  setInterviewData: (data: InterviewData) => void;
  clearInterviewData: () => void;
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
    settings: DEFAULT_SETTINGS
  },
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
      settings: DEFAULT_SETTINGS
    }
  })),
  
  // Interview state
  interviewData: null,
  setInterviewData: (data) => set({ interviewData: data }),
  clearInterviewData: () => set({ interviewData: null }),
}));
