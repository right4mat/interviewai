import { create } from "zustand";
import { Interviewer } from "@/types/interview";

interface InterviewSettings {
  type: "technical" | "behavioral" | "mixed";
  difficulty: "beginner" | "intermediate" | "advanced";
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
    interviewStarted: boolean;
    currentQuestionIndex: number;
    questionAnswers: QuestionAnswer[];
    stage: "setup" | "interview";
  };

  // Interview session state
  isMuted: boolean;
  isVideoOn: boolean;
  isChatOpen: boolean;

  setJobDescription: (description: string) => void;
  setPdfFile: (file: File | undefined) => void;
  setResume: (text: string) => void;
  setInterviewer: (interviewer: Interviewer) => void;
  setSettings: (settings: InterviewSettings) => void;
  clearinterviewState: () => void;
  setStage: (stage: "setup" | "interview") => void;
  updateInterviewState: (state: Partial<InterviewState>) => void;

  // Interview actions
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleChat: () => void;
  startInterview: () => void;
  stopInterview: () => void;
  addQuestionAnswer: (qa: QuestionAnswer) => void;
}

const DEFAULT_INTERVIEWER: Interviewer = {
  name: "AI Interviewer",
  role: "Senior Technical Recruiter"
};

const DEFAULT_SETTINGS: InterviewSettings = {
  type: "mixed",
  difficulty: "intermediate"
};

export const useInterviewStore = create<InterviewStore>((set) => ({
  // Setup state
  interviewState: {
    jobDescription: "",
    pdfFile: undefined,
    interviewer: DEFAULT_INTERVIEWER,
    settings: DEFAULT_SETTINGS,
    resume: "",
    interviewStarted: false,
    currentQuestionIndex: 0,
    questionAnswers: [],
    stage: "setup"
  },

  isMuted: false,
  isVideoOn: true,
  isChatOpen: true,

  setResume: (text) =>
    set((state) => ({
      interviewState: { ...state.interviewState, resume: text }
    })),
  setJobDescription: (description) =>
    set((state) => ({
      interviewState: { ...state.interviewState, jobDescription: description }
    })),
  setPdfFile: (file) =>
    set((state) => ({
      interviewState: { ...state.interviewState, pdfFile: file }
    })),
  setInterviewer: (interviewer) =>
    set((state) => ({
      interviewState: { ...state.interviewState, interviewer }
    })),
  setSettings: (settings) =>
    set((state) => ({
      interviewState: { ...state.interviewState, settings }
    })),
  clearinterviewState: () =>
    set((state) => ({
      interviewState: {
        jobDescription: "",
        pdfFile: undefined,
        interviewer: DEFAULT_INTERVIEWER,
        settings: DEFAULT_SETTINGS,
        resume: "",
        interviewStarted: false,
        currentQuestionIndex: 0,
        questionAnswers: [],
        stage: "setup"
      }
    })),
  updateInterviewState: (state) => set((state) => ({ interviewState: { ...state.interviewState, ...state } })),
  setStage: (stage) => set((state) => ({ interviewState: { ...state.interviewState, stage } })),

  // Interview actions
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleVideo: () => set((state) => ({ isVideoOn: !state.isVideoOn })),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  startInterview: () => set((state) => ({ interviewState: { ...state.interviewState, interviewStarted: true } })),
  stopInterview: () => set((state) => ({ interviewState: { ...state.interviewState, interviewStarted: false } })),
  addQuestionAnswer: (qa) =>
    set((state) => ({
      interviewState: { ...state.interviewState, questionAnswers: [...state.interviewState.questionAnswers, qa] }
    }))
}));
