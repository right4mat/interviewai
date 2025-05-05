import { useState, useEffect, useRef } from "react";
import { useGetInterviewReply, useScoreAnswer } from "@/services/openAI";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useDebounce } from "@/hooks/useDebounce";
import { Interviewer } from "@/types/interview";

/**
 * Interface representing a question and its corresponding answer in the interview
 * Includes the original question/answer pair along with AI-generated analysis
 */
interface QuestionAnswer {
  question: string;
  answer: string;
  score?: number;
  reasoning?: string;
  cleanedAnswer?: string;
  modelAnswer?: string;
  questionSummary: string;
}

/**
 * Props required to initialize the interview hook
 */
interface UseInterviewProps {
  questions: string[];
  jobDescription: string;
  interviewer: Interviewer;
  resume: string;
  difficulty: string;
  type: "technical" | "behavioral" | "mixed";
  stopListening: boolean;
  interviewStarted: boolean;
}

/**
 * Custom hook to manage the interview flow and state
 * Handles speech recognition, audio playback, and interaction with AI services
 */
export const useInterview = ({
  questions,
  jobDescription,
  interviewer,
  resume,
  difficulty,
  type,
  stopListening,
  interviewStarted
}: UseInterviewProps) => {
  // Core interview state
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isFirstQuestion, setIsFirstQuestion] = useState<boolean>(true);
  const [lastAnswerIndex, setLastAnswerIndex] = useState<number>(0);

  // Answer handling state
  const [buildingAnswer, setBuildingAnswer] = useState<string>("");
  const [cleanedAnswer, setCleanedAnswer] = useState<string>("");

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [isAISpeaking, setIsAISpeaking] = useState<boolean>(false);

  // Persistent refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const firstReplyHasStarted = useRef<boolean>(false);
  const lastQuestionIndex = useRef<number>(-1);

  // Speech recognition configuration
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // API hooks for AI interactions
  const { mutateAsync: scoreAnswerAsync, isPending: isScoring } = useScoreAnswer();
  const { mutateAsync: getReplyAsync, isPending: isGettingReply } = useGetInterviewReply();

  // Debounced answer to prevent rapid API calls
  const currentAnswer = useDebounce(buildingAnswer, 2000);

  // Update answer index when the debounced answer changes
  useEffect(() => {
    setLastAnswerIndex((prev) => prev + 1);
  }, [currentAnswer]);

  // Derived question state
  const currentQuestion = questions[currentQuestionIndex] || "";
  const firstQuestion = questions[0] || "";
  const nextQuestion = questions[currentQuestionIndex + 1] || "";
  const isLastAnswer = currentQuestionIndex === questions.length - 1;

  /**
   * Processes the AI's scoring response and updates the interview state
   */
  const handleScoreSuccess = (response: {
    score: number;
    reasoning: string;
    cleanedAnswer: string;
    modelAnswer: string;
    questionSummary: string;
  }) => {
    if (!response) return;

    const newAnswer: QuestionAnswer = {
      question: currentQuestion,
      answer: currentAnswer || "",
      score: response.score,
      reasoning: response.reasoning,
      cleanedAnswer: response.cleanedAnswer,
      modelAnswer: response.modelAnswer,
      questionSummary: response.questionSummary
    };

    setCleanedAnswer(response.cleanedAnswer);
    setQuestionAnswers((prev) => [...prev, newAnswer]);
    setError(null);
  };

  /**
   * Handles audio playback of AI responses
   */
  const handleReplySuccess = async (response: { audio?: string }) => {
    if (!response?.audio) return;

    setIsAISpeaking(true);

    audioRef.current = new Audio(response.audio);
    audioRef.current.onended = () => {
      setIsAISpeaking(false);
      audioRef.current = null;
    };
    audioRef.current.play().catch((error) => {
      console.error("Error playing audio:", error);
      setIsAISpeaking(false);
      audioRef.current = null;
    });
  };

  // Main interview flow effect - handles scoring and AI replies
  useEffect(() => {
    if (!currentQuestion || !currentAnswer || isFirstQuestion || !interviewStarted) return;

    console.log("scoreAndReply rendering");

    Promise.all([
      scoreAnswerAsync({
        question: currentQuestion,
        answer: currentAnswer,
        jobDescription,
        type,
        difficulty,
        resume
      }).then(handleScoreSuccess),

      getReplyAsync({
        jobDescription,
        resume,
        interviewers: interviewer,
        difficulty,
        nextQuestion,
        currentQuestion,
        currentAnswer: currentAnswer || "",
        firstQuestion: firstQuestion,
        isFirstQuestion: false,
        isLastAnswer,
        type
      }).then(handleReplySuccess)
    ])
      .then(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        lastQuestionIndex.current = currentQuestionIndex;
        setBuildingAnswer("");
        setCleanedAnswer("");
      })
      .catch((err) => {
        console.error("Error in scoreAndReply:", err);
        setError("Failed to process answer and get reply");
      });
  }, [lastAnswerIndex, interviewStarted]);

  // Initial interview setup and first question handling
  useEffect(() => {
    if (!firstQuestion || !isFirstQuestion || firstReplyHasStarted.current || !interviewStarted) return;

    firstReplyHasStarted.current = true;
    setIsFirstQuestion(false);

    getReplyAsync({
      jobDescription,
      resume,
      interviewers: interviewer,
      difficulty,
      nextQuestion: "",
      currentQuestion: "",
      currentAnswer: "",
      firstQuestion: firstQuestion,
      isFirstQuestion,
      isLastAnswer: false,
      type
    })
      .then(handleReplySuccess)
      .catch(() => setError("Failed to get reply"));
  }, [
    currentQuestion,
    isAISpeaking,
    jobDescription,
    interviewer,
    difficulty,
    resume,
    nextQuestion,
    currentAnswer,
    questions,
    isFirstQuestion,
    interviewStarted
  ]);

  // Speech-to-text conversion
  useEffect(() => {
    if (transcript) {
      setBuildingAnswer(transcript);
    }
  }, [transcript]);

  // Reset speech recognition on question change
  useEffect(() => {
    resetTranscript();
    setBuildingAnswer("");
    setCleanedAnswer("");
  }, [currentQuestion, resetTranscript]);

  // Speech recognition management
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError("Your browser doesn't support speech recognition.");
      return;
    }

    if ((isAISpeaking && listening) || stopListening || !interviewStarted) {
      SpeechRecognition.stopListening();
    } else if (!isAISpeaking && !listening && currentQuestion && !stopListening && interviewStarted) {
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    }
  }, [browserSupportsSpeechRecognition, listening, isAISpeaking, currentQuestion, stopListening]);

  /**
   * Stops current audio playback and resets speaking state
   */
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
    currentQuestion: isFirstQuestion ? questions[0] : questions[currentQuestionIndex],
    cleanedAnswer,
    isListening: listening,
    isAISpeaking,
    buildingAnswer,
    stopAudio
  };
};
