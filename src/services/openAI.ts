import { apiRequest } from "@/utils/util";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Interviewer } from "@/types/interview";

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
}

interface GetQuestionsRequest {
  jobDescription: string;
  resume: string;
  interviewers: Interviewer;
  difficulty: string;
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
}

type GetInterviewReplyResponse = {text: string, audio: string};

type GetQuestionsResponse = {questions: string[]};

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
