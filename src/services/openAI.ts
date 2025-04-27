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

export const useScoreAnswer = (params: ScoreAnswerRequest) => {
  return useQuery<ScoreAnswerResponse, Error>({
    queryKey: ["scoreAnswer", params.question, params.answer, params.jobDescription],
    queryFn: async () => {
      const response = await apiRequest("interview/score-answer", "POST", params);
      return response;
    },
    enabled: !!params.question && !!params.answer && !!params.jobDescription
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

export const useGetInterviewReply = (params: GetInterviewReplyRequest) => {
  return useQuery<GetInterviewReplyResponse, Error>({
    queryKey: ["interviewReply", params.currentQuestion, params.currentAnswer],
    queryFn: async () => {
      
      const response = await apiRequest("interview/reply", "POST", params);


      return response;
    },
    enabled: !!params.currentQuestion
  });
};
