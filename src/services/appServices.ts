import { apiRequest } from "@/utils/util";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Interviewer, QuestionAnswer } from "@/types/interview";
import { convertPdfToImageArray } from "@/utils/util";
import { useConfirmMutation } from "@/hooks/useConfirmMutation";
import supabase from "@/utils/supabase";
import { client } from "@/utils/db";
import { useAuth } from "@/utils/auth";

interface ScoreAnswerRequest {
  question: string;
  answer: string;
  jobDescription: string;
  type: string;
  difficulty: string;
  resumeId?: number;
}

interface GetQuestionsRequest {
  jobDescription: string;
  resumeId?: number;
  interviewers: Interviewer;
  difficulty: string;
  type: string;
  questions?: string[];
  company?: string;
}

export interface GetInterviewReplyRequest {
  company: string;
  jobDescription: string;
  resumeId?: number;
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

type ExtractResumeResponse = { resumeId: number };

interface ReviewInterviewRequest {
  company: string;
  jobDescription: string;
  resumeId?: number;
  interviewers: Interviewer;
  difficulty: string;
  type: string;
  questionAnswers: QuestionAnswer[];
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
  resumeId?: number;
  questionAnswers: QuestionAnswer[];
}

interface LoadInterviewRequest {
  interviewId: number;
}

interface DeleteInterviewRequest {
  interviewId: number;
}

interface InterviewListResponse {
  id: number;
  company: string;
  job_description_id: number;
  resume_id: number | null;
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

interface InterviewAttemptsResponse {
  id: number;
  interview_id: number;
  question_answers: QuestionAnswer[];
  current_question_index: number;
  score: number;
  review: string;
  created_at: string;
  questions: string[];
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
  return useMutation<QuestionAnswer, Error, ScoreAnswerRequest>({
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
      params.resumeId,
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
      content: "Are you sure you want to stop this interview?",
      confirmLabel: "Stop",
      cancelLabel: "Cancel",
      confirmColor: "primary"
    }
  });
};

export const useLoadInterview = () => {
  const { user } = useAuth();
  return useMutation<SaveInterviewRequest, Error, LoadInterviewRequest>({
    mutationFn: async (variables: LoadInterviewRequest) => {
      if (!user) throw new Error("User not found");
      const { data: interview, error: interviewError } = await supabase
        .from("interviews")
        .select(
          `id,
          company,
          questions,
          settings,
          interviewer,
          resume_id,
          job_descriptions (
            job_description
          ),
          question_answers (
            question_answers,
            score,
            review,
            current_question_index
          )
        `
        )
        .eq("id", variables.interviewId)
        .eq("user_id", user?.id)
        .single();

      if (interviewError) throw interviewError;
      if (!interview) {
        throw new Error("Interview not found");
      }

      // Transform the data to match SaveInterviewRequest shape
      return {
        company: interview.company || "",
        questions: interview.questions || [],
        currentQuestionIndex: interview.question_answers?.[0]?.current_question_index || 0,
        interviewer: interview.interviewer || { name: "", role: "" },
        settings: interview.settings || { difficulty: "", type: "" },
        jobDescription: interview.job_descriptions?.job_description || "",
        resumeId: interview.resume_id,
        questionAnswers: (interview.question_answers?.[0]?.question_answers).map((qa: any) => ({
          question: qa.question || "",
          answer: qa.answer || "",
          score: qa.score,
          reasoning: qa.reasoning,
          cleanedAnswer: qa.cleaned_answer,
          questionSummary: qa.question_summary,
          modelAnswer: qa.model_answer
        }))
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
        .from("interviews")
        .select(
          `id,
          company,
          job_description_id,
          resume_id,
          settings,
          interviewer,
          question_answers(score.avg(),score.count()),
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
        avg: stat.question_answers?.[0]?.avg,
        count: stat.question_answers?.[0]?.count
      }));
    }
  });
};

export const useInterviewAttempts = (interviewId: number) => {
  const { user } = useAuth();
  return useQuery<InterviewAttemptsResponse[], Error>({
    queryKey: ["interviewAttempts", interviewId],
    queryFn: async () => {
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("question_answers")
        .select("*, interviews(questions)")
        .eq("interview_id", interviewId)

        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map(attempt => ({
        id: attempt.id,
        interview_id: attempt.interview_id,
        question_answers: attempt.question_answers || [],
        current_question_index: attempt.current_question_index || 0,
        score: attempt.score || 0,
        review: attempt.review || "",
        created_at: attempt.created_at,
        questions: attempt.interviews?.questions || []
      }));
    },
    enabled: !!interviewId && !!user
  });
};

export const useDeleteInterview = () => {
  const { user } = useAuth();
  return useConfirmMutation({
    mutationFn: async (variables: DeleteInterviewRequest) => {
      if (!user) throw new Error("User not found");
      const { error } = await supabase.from("interviews").delete().eq("id", variables.interviewId).eq("user_id", user.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["interviewList"] });
    },
    confirmConfig: {
      title: "Delete Interview",
      content: "Are you sure you want to delete this interview? This action cannot be undone.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      confirmColor: "error"
    }
  });
};
