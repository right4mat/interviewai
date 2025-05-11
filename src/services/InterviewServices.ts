import { apiRequest } from "@/utils/util";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Interviewer } from "@/types/interview";
import { convertPdfToImageArray } from "@/utils/util";
import { useConfirmMutation } from "@/hooks/useConfirmMutation";
import supabase from "@/utils/supabase";

import { useAuth } from "@/utils/auth";
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
  questions?: string[];
  company?: string;
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

type GetQuestionsResponse = { questions: string[]; company: string };

type ExtractResumeResponse = string;

interface ReviewInterviewRequest {
  company: string;
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
  company: string;
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

interface LoadInterviewRequest {
  interviewId: string;
}

interface InterviewListResponse {
  company: string;
  job_description_id: number;
  resume_id: number;
  settings: {
    type: "technical" | "behavioral" | "mixed";
    difficulty: "beginner" | "intermediate" | "advanced";
  };
  interviewer: {
    name: string;
    role: string;
  };
  count: number;
  avg: number;
  created_at: string;
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
    queryKey: [
      "interviewQuestions",
      params.difficulty,
      params.type,
      params.jobDescription,
      params.resume,
      params.interviewers.name,
      params.interviewers.role
    ],
    queryFn: async () => {
      if (params.questions) {
        // if questions are already loaded from save state return them
        return { questions: params.questions, company: params.company || "" };
      }
      const response = await apiRequest("interview/get-questions", "POST", params);
      return response;
    },
    enabled: !!params.jobDescription && !!params.interviewers && !!params.difficulty && !params.questions
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

export const useLoadInterview = () => {
  return useMutation<SaveInterviewRequest, Error, LoadInterviewRequest>({
    mutationFn: async (variables: LoadInterviewRequest) => {
      const { data: interview, error: interviewError } = await supabase
        .from("interviews")
        .select(
          `
          id,
          questions,
          settings,
          interviewer,
          job_descriptions (
            job_description
          ),
          resumes (
            resume
          ),
          question_answers (
            current_question_index,
            question_answers,
            company
        )
        `
        )
        .eq("id", variables.interviewId)
        .single();

      if (interviewError) throw interviewError;
      if (!interview) {
        throw new Error("Interview not found");
      }

      // Transform the data to match SaveInterviewRequest shape
      return {
        questions: interview.questions,
        currentQuestionIndex: interview.question_answers.current_question_index,
        interviewer: interview.interviewer,
        settings: interview.settings,
        jobDescription: interview.job_descriptions.job_description,
        resume: interview.resumes?.resume,
        questionAnswers: interview.question_answers,
        company: interview.question_answers.company
      };
    }
  });
};

export const useInterviewList = () => {
  const { user } = useAuth();
  return useQuery<InterviewListResponse[], Error>({
    queryKey: ["interviewList"],
    queryFn: async () => {
      if (!user) throw new Error("User not found");

      const { data: stats, error: statsError } = await supabase
        .from("interviews ")
        .select(
          `id,
          company,
          job_description_id,
          resume_id,
          settings,
          interviewer,
          question_answers(score.avg()),
          created_at,
          count()
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (statsError) throw statsError;

      // Transform the data to match InterviewListResponse shape
      return stats.map((stat) => ({
        ...stat,
        avg: stat.question_answers?.[0]?.avg
      }));
    }
  });
};
