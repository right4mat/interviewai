import { create } from "zustand";
import { type Interviewer, type QuestionAnswer } from "@/types/interview";

interface InterviewSettings {
  type: "technical" | "behavioral" | "mixed";
  difficulty: "beginner" | "intermediate" | "advanced";
}

// Add interface for loaded interview data
interface LoadedInterview {
  questions: string[];
  company: string;
  jobDescriptionId: number;
  interviewer: {
    name: string;
    role: string;
  };
  settings: {
    type: string;
    difficulty: string;
  };
  resumeId?: number;
  questionAnswers: QuestionAnswer[];
}

interface InterviewStore {
  // Setup state
  interviewState: {
    questions?: string[]; // questions for the interview if new interview this will be undefined and will be loaded once in the interview
    company: string;
    jobDescription: string;
    jobDescriptionId?: number;
    pdfFile?: File;
    interviewer: Interviewer;
    settings: InterviewSettings;
    resumeId?: number;
    interviewStarted: boolean;
    currentQuestionIndex: number;
    questionAnswers: QuestionAnswer[];
    stage: "setup" | "interview";
  };

  // Interview session state
  isMuted: boolean;
  isVideoOn: boolean;
  isChatOpen: boolean;

  //need for appbar in mobile
  isGettingReply: boolean;
  answerWillCompleteIn: number;
  buildingAnswer: string;
  setIsGettingReply: (isGettingReply: boolean) => void;
  setAnswerWillCompleteIn: (answerWillCompleteIn: number) => void;
  setBuildingAnswer: (buildingAnswer: string) => void;

  setJobDescription: (description: string) => void;
  setPdfFile: (file: File | undefined) => void;
  setResume: (id: number | undefined) => void;
  setInterviewer: (interviewer: Interviewer) => void;
  setSettings: (settings: InterviewSettings) => void;
  clearinterviewState: () => void;
  setStage: (stage: "setup" | "interview") => void;
  updateInterviewState: (state: Partial<InterviewStore["interviewState"]>) => void;
  
  // New method to load an interview
  loadInterview: (loadedInterview: LoadedInterview) => void;

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

const DEFAULT_INTERVIEW_STATE = {
  company: "",
  jobDescription: "",
  pdfFile: undefined,
  interviewer: DEFAULT_INTERVIEWER,
  settings: DEFAULT_SETTINGS,
  resumeId: undefined,
  interviewStarted: false,
  currentQuestionIndex: 0,
  questionAnswers: [],
  stage: "setup" as const
};

export const useInterviewStore = create<InterviewStore>((set) => ({
  // Setup state
  interviewState: DEFAULT_INTERVIEW_STATE,

  isMuted: false,
  isVideoOn: true,
  isChatOpen: true,

  isGettingReply: false,
  answerWillCompleteIn: 0,
  buildingAnswer: '',

  setIsGettingReply: (isGettingReply: boolean) => set((state) => ({ isGettingReply })),
  setAnswerWillCompleteIn: (answerWillCompleteIn: number) => set((state) => ({ answerWillCompleteIn })),
  setBuildingAnswer: (buildingAnswer: string) => set((state) => ({ buildingAnswer })),

  setResume: (id: number | undefined) =>
    set((state) => ({
      interviewState: { ...state.interviewState, resumeId: id }
    })),
  setJobDescription: (description: string) =>
    set((state) => ({
      interviewState: { ...state.interviewState, jobDescription: description }
    })),
  setPdfFile: (file: File | undefined) =>
    set((state) => ({
      interviewState: { ...state.interviewState, pdfFile: file }
    })),
  setInterviewer: (interviewer: Interviewer) =>
    set((state) => ({
      interviewState: { ...state.interviewState, interviewer }
    })),
  setSettings: (settings: InterviewSettings) =>
    set((state) => ({
      interviewState: { ...state.interviewState, settings }
    })),
  clearinterviewState: () =>
    set((state) => ({
      interviewState: {
        company: "",
        jobDescription: "",
        jobDescriptionId: undefined,
        pdfFile: undefined,
        interviewer: DEFAULT_INTERVIEWER,
        settings: DEFAULT_SETTINGS,
        resumeId: undefined,
        interviewStarted: false,
        currentQuestionIndex: 0,
        questionAnswers: [],
        stage: "setup"
      }
    })),
  updateInterviewState: (newState) => set((state) => ({ interviewState: { ...state.interviewState, ...newState } })),
  setStage: (stage) => set((state) => ({ interviewState: { ...state.interviewState, stage } })),
  
  // New method to load an interview
  loadInterview: (loadedInterview: LoadedInterview) => 
    set((state) => ({
      interviewState: {
        ...state.interviewState,
        questions: loadedInterview.questions,
        company: loadedInterview.company,
        jobDescriptionId: loadedInterview.jobDescriptionId,
        interviewer: {
          name: loadedInterview.interviewer.name,
          role: loadedInterview.interviewer.role
        },
        settings: {
          type: loadedInterview.settings.type as "technical" | "behavioral" | "mixed",
          difficulty: loadedInterview.settings.difficulty as "beginner" | "intermediate" | "advanced"
        },
        resumeId: loadedInterview.resumeId,
        currentQuestionIndex: loadedInterview.questionAnswers.length,
        questionAnswers: loadedInterview.questionAnswers,
        stage: "interview",
        interviewStarted: false
      }
    })),

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
