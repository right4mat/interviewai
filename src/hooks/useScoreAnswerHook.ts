import { useState, useEffect, useRef } from "react";
import { useScoreAnswer } from "@/services/openAI";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useDebounce } from "@/hooks/useDebounce";

interface QuestionAnswer {
  question: string;
  answer: string;
  score?: number;
  reasoning?: string;
  cleanedAnswer?: string;
  modelAnswer?: string;
  questionSummary: string;
}

interface UseScoreAnswerHookProps {
  question: string;
  jobDescription: string;
  stopListening: boolean;
  onAnswerComplete: () => void;
}

export const useScoreAnswerHook = ({ question, jobDescription, stopListening, onAnswerComplete }: UseScoreAnswerHookProps) => {
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [internalAnswer, setInternalAnswer] = useState<string>("");

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Use debounced value for currentAnswer
  const currentAnswer = useDebounce(internalAnswer, 1000);

  useEffect(() => {
    if (currentAnswer) {
      onAnswerComplete();
      setInternalAnswer("");
    }
  }, [currentAnswer]);

  // Update internal answer when transcript changes
  useEffect(() => {
    if (transcript) {
      setInternalAnswer(transcript);
    }
  }, [transcript]);

  // Reset answer when question changes
  useEffect(() => {
    resetTranscript();
    setInternalAnswer("");
  }, [question, resetTranscript]);

  // Manage speech recognition based on stopListening prop
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError("Your browser doesn't support speech recognition.");
      return;
    }

    if (stopListening && listening) {
      SpeechRecognition.stopListening();
    } else if (!stopListening && question && !listening) {
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US"
      });
    }
  }, [question, browserSupportsSpeechRecognition, listening, stopListening]);

  // Query for scoring the answer
  const { data: scoreData, isPending: isScoring } = useScoreAnswer({
    question,
    answer: currentAnswer || "",
    jobDescription
  });

  // Update questionAnswers when we get a score
  useEffect(() => {
    if (scoreData && question && currentAnswer) {
      setQuestionAnswers((prev) => [
        ...prev,
        {
          question,
          answer: currentAnswer,
          score: scoreData.score,
          reasoning: scoreData.reasoning,
          cleanedAnswer: scoreData.cleanedAnswer,
          modelAnswer: scoreData.modelAnswer,
          questionSummary: scoreData.questionSummary
        }
      ]);
      setError(null);
    }
  }, [scoreData, question, currentAnswer]);

  return {
    questionAnswers,
    error,
    isScoring,
    currentQuestion: question,
    currentAnswer,
    isListening: listening
  };
};
