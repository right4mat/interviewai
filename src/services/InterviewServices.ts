import { apiRequest } from "@/utils/util";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Interviewer } from "@/types/interview";
import { convertPdfToImageArray } from "@/utils/util";
import { useConfirmMutation } from "@/hooks/useConfirmMutation";

interface ScoreAnswerResponse {
  score: number;
  reasoning: string;
  cleanedAnswer: string;
  questionSummary: string;
  modelAnswer: string;
}

interface ScoreAnswerRequest {
  question: string;
  answer: string;
  jobDescription: string;
  type: string;
  difficulty: string;
  resume: string;
}

interface GetQuestionsRequest {
  jobDescription: string;
  resume: string;
  interviewers: Interviewer;
  difficulty: string;
  type: string;
}

export interface GetInterviewReplyRequest {
  jobDescription: string;
  resume: string;
  interviewers: Interviewer;
  difficulty: string;
  nextQuestion: string;
  currentQuestion: string;
  currentAnswer: string;
  firstQuestion: string;
  isFirstQuestion: boolean;
  isLastAnswer: boolean;
  type: string;
}

type GetInterviewReplyResponse = { text: string; audio: string };

type GetQuestionsResponse = { questions: string[] };

type ExtractResumeResponse = string;

interface ReviewInterviewRequest {
  jobDescription: string;
  resume?: string;
  interviewers: Interviewer;
  difficulty?: string;
  type?: string;
  questionAnswers: Array<{
    question: string;
    score?: number;
    reasoning?: string;
    cleanedAnswer?: string;
  }>;
}

interface ReviewInterviewResponse {
  review: string;
  averageScore: number;
  totalScore: number;
}

interface SaveInterviewRequest {
  questions: string[];
  currentQuestionIndex: number;
  interviewer: {
    name: string;
    role: string;
  };
  settings: {
    difficulty: string;
    type: string;
  };
  jobDescription: string;
  resume?: string;
  questionAnswers: Array<{
    question: string;
    score?: number;
    reasoning?: string;
    cleanedAnswer?: string;
  }>;
}

export const useExtractResume = () => {
  return useMutation<ExtractResumeResponse, Error, File>({
    mutationFn: async (pdfFile: File) => {
      // Convert PDF to array of images
      const images = await convertPdfToImageArray(pdfFile);

      // Send images to resume extraction API
      const response = await apiRequest("interview/resume-extraction", "POST", {
        resumeImageArray: images
      });

      return response;
    }
  });
};

export const useScoreAnswer = () => {
  return useMutation<ScoreAnswerResponse, Error, ScoreAnswerRequest>({
    mutationFn: async (variables: ScoreAnswerRequest) => {
      const response = await apiRequest("interview/score-answer", "POST", variables);
      return response;
    }
  });
};

export const useGetInterviewQuestions = (params: GetQuestionsRequest) => {
  return useQuery<GetQuestionsResponse, Error>({
    queryKey: ["interviewQuestions", params],
    queryFn: async () => {
      const response = await apiRequest("interview/get-questions", "POST", params);
      return response;
    },
    enabled: !!params.jobDescription && !!params.interviewers && !!params.difficulty
  });
};

export const useGetInterviewReply = () => {
  return useMutation<GetInterviewReplyResponse, Error, GetInterviewReplyRequest>({
    mutationFn: async (variables: GetInterviewReplyRequest) => {
      const response = await apiRequest("interview/reply", "POST", variables);
      return response;
    }
  });
};

export const useReviewInterview = (params: ReviewInterviewRequest) => {
  return useQuery<ReviewInterviewResponse, Error>({
    queryKey: ["interviewReview", params],
    queryFn: async () => {
      const response = await apiRequest("interview/review-interview", "POST", params);
      return response;
    },
    enabled: !!params.jobDescription && !!params.interviewers && !!params.questionAnswers.length
  });
};

export const useSaveInterview = () => {
  return useConfirmMutation({
    mutationFn: async (variables: SaveInterviewRequest) => {
      const response = await apiRequest("interview/save", "POST", variables);
      return response;
    },
    confirmConfig: {
      title: "Stop Interview",
      content: "Are you sure you want to stop and save this interview?",
      confirmLabel: "Stop and Save",
      cancelLabel: "Cancel",
      confirmColor: "primary"
    }
  });
};
