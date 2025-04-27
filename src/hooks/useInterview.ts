import { useState, useEffect, useRef } from "react";
import { useGetInterviewReply, useScoreAnswer } from "@/services/openAI";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useDebounce } from "@/hooks/useDebounce";
import { Interviewer } from "@/types/interview";

interface QuestionAnswer {
  question: string;
  answer: string;
  score?: number;
  reasoning?: string;
  cleanedAnswer?: string;
  modelAnswer?: string;
  questionSummary: string;
}

interface UseInterviewProps {
  questions: string[];
  jobDescription: string;
  interviewer: Interviewer;
  difficulty: string;
}

export const useInterview = ({
  questions,
  jobDescription,
  interviewer,
  difficulty,
}: UseInterviewProps) => {
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [internalAnswer, setInternalAnswer] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [step, setStep] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stepOfInterview = useRef<number>(-1);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  
  // Mutations for scoring and getting replies
  const { mutate: scoreAnswer, isPending: isScoring } = useScoreAnswer();
  const { mutate: getReply, isPending: isGettingReply } = useGetInterviewReply();

  // Use debounced value for currentAnswer
  const currentAnswer = useDebounce(internalAnswer, 1000);

  // Get current question and next question
  const currentQuestion = questions[currentQuestionIndex] || "";
  const nextQuestion = questions[currentQuestionIndex + 1] || "";
  const isLastAnswer = currentQuestionIndex === questions.length - 1;


  // Handle scoring the answer
  useEffect(() => {
    if (currentQuestion && currentAnswer && stepOfInterview.current === step) {
      scoreAnswer({
        question: currentQuestion,
        answer: currentAnswer,
        jobDescription
      }, {
        onSuccess: (response) => {
          if (response) {
            setQuestionAnswers((prev) => [
              ...prev,
              {
                question: currentQuestion,
                answer: currentAnswer,
                score: response.score,
                reasoning: response.reasoning,
                cleanedAnswer: response.cleanedAnswer,
                modelAnswer: response.modelAnswer,
                questionSummary: response.questionSummary
              }
            ]);
            setError(null);
            if (!isLastAnswer && !isFirstQuestion) {
              setCurrentQuestionIndex(prev => prev + 1);
            }
            setIsFirstQuestion(false);
            setStep(prev => prev + 1);
          }
        },
        onError: (error) => {
          setError("Failed to score answer");
        }
      });
    }
  }, [currentAnswer, currentQuestion, currentQuestionIndex]);

  // Handle getting AI reply
  useEffect(() => {
    if (currentQuestion && !isAISpeaking && stepOfInterview.current !== step) {

      stepOfInterview.current = step
      getReply({
        jobDescription,
        resume: "",
        interviewers: interviewer,
        difficulty,
        nextQuestion,
        currentQuestion,
        currentAnswer: currentAnswer || "",
        firstQuestion: questions[0] || "",
        isFirstQuestion,
        isLastAnswer
      }, {
        onSuccess: (response) => {
          if (response?.audio) {
            setIsAISpeaking(true);
            audioRef.current = new Audio(response.audio);
            
            
            audioRef.current.onended = () => {
              setIsAISpeaking(false);
            };

            audioRef.current.play().catch(error => {
              console.error("Error playing audio:", error);
              setIsAISpeaking(false);
            });
          }
        },
        onError: (error) => {
          setError("Failed to get reply");
        }
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, [
    currentQuestion,
    isAISpeaking,
    jobDescription,
    interviewer,
    difficulty,
    nextQuestion,
    currentAnswer,
    questions,
    isFirstQuestion,
    isLastAnswer,
  ]);

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
  }, [currentQuestion, resetTranscript]);

  // Manage speech recognition
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError("Your browser doesn't support speech recognition.");
      return;
    }

    if (isAISpeaking && listening) {
      SpeechRecognition.stopListening();
    } else if (!isAISpeaking && !listening && currentQuestion) {
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US"
      });
    }
  }, [browserSupportsSpeechRecognition, listening, isAISpeaking, currentQuestion]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsAISpeaking(false);
  };

  return {
    questionAnswers,
    error,
    isScoring,
    isGettingReply,
    currentQuestion:isFirstQuestion ? questions[0] : questions[step],
    currentAnswer,
    isListening: listening,
    stopAudio
  };
};
