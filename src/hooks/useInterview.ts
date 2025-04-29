import { useState, useEffect, useRef } from "react";
import { useGetInterviewReply, useScoreAnswer } from "@/services/openAI";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useDebounce } from "@/hooks/useDebounce";
import { Interviewer } from "@/types/interview";

// Interface representing a question and its corresponding answer in the interview
interface QuestionAnswer {
  question: string;
  answer: string;
  score?: number;
  reasoning?: string;
  cleanedAnswer?: string;
  modelAnswer?: string;
  questionSummary: string;
}

// Props for the useInterview hook
interface UseInterviewProps {
  questions: string[];
  jobDescription: string;
  interviewer: Interviewer;
  difficulty: string;
}

// Custom hook to manage the interview flow and state
export const useInterview = ({ questions, jobDescription, interviewer, difficulty }: UseInterviewProps) => {
  // State management
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [buildingAnswer, setBuildingAnswer] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isAISpeaking, setIsAISpeaking] = useState<boolean>(false);
  const [cleanedAnswer, setCleanedAnswer] = useState<string>("");
  const [isFirstQuestion, setIsFirstQuestion] = useState<boolean>(true);
  const [lastAnswerIndex, setLastAnswerIndex] = useState<number>(0);
  // Refs for managing audio and interview state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const firstReplyHasStarted = useRef<boolean>(false);
  const lastQuestionIndex = useRef<number>(-1);

  // Speech recognition setup
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // API mutation hooks
  const { mutateAsync: scoreAnswerAsync, isPending: isScoring } = useScoreAnswer();
  const { mutateAsync: getReplyAsync, isPending: isGettingReply } = useGetInterviewReply();

  // Derived state values
  const currentAnswer = useDebounce(buildingAnswer, 1000);

  useEffect(() => {
    setLastAnswerIndex((prev) => prev + 1);
  }, [currentAnswer]);

  const currentQuestion = questions[currentQuestionIndex] || "";
  const firstQuestion = questions[0] || "";
  const nextQuestion = questions[currentQuestionIndex + 1] || "";
  const isLastAnswer = currentQuestionIndex === questions.length - 1;

  // Handles successful scoring of an answer
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
      answer: currentAnswer || "", // Ensure answer is never undefined
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

  // Handles successful AI reply with audio
  const handleReplySuccess = (response: { audio?: string }) => {
    if (!response?.audio) return;

    setIsAISpeaking(true);
    audioRef.current = new Audio(response.audio);
    audioRef.current.onended = () => setIsAISpeaking(false);
    audioRef.current.play().catch((error) => {
      console.error("Error playing audio:", error);
      setIsAISpeaking(false);
    });
  };

  // Effect to handle scoring answers and read the next question
  useEffect(() => {
    if (!currentQuestion || !currentAnswer || isFirstQuestion) return; //this is to prevent the AI from scoring twice

    console.log("scoreAndReply rendering");

    const scoreAndReply = async () => {
      try {
        await Promise.all([
          scoreAnswerAsync({
            question: currentQuestion,
            answer: currentAnswer,
            jobDescription
          }).then(handleScoreSuccess).catch(() => setError("Failed to score answer")),

          getReplyAsync({
            jobDescription,
            resume: "",
            interviewers: interviewer,
            difficulty,
            nextQuestion,
            currentQuestion,
            currentAnswer: currentAnswer || "",
            firstQuestion: firstQuestion,
            isFirstQuestion: false,
            isLastAnswer
          }).then(handleReplySuccess).catch(() => setError("Failed to get reply"))
        ]);

        //only now should we move to the next question
        //lastQuestionIndex.current = currentQuestionIndex;
        setCurrentQuestionIndex((prev) => prev + 1);
        lastQuestionIndex.current = currentQuestionIndex;
        setBuildingAnswer("");
        setCleanedAnswer("");
      } catch (err) {
        console.error("Error in scoreAndReply:", err);
        setError("Failed to process answer and get reply");
      }
    };

    scoreAndReply();
  }, [lastAnswerIndex]);

  // Effect to handle first question / intro
  useEffect(() => {
    if (!firstQuestion || !isFirstQuestion || firstReplyHasStarted.current) return; //this is to prevent the AI from speaking twice
    console.log("isFirstQuestion rendering");
    firstReplyHasStarted.current = true;
    setIsFirstQuestion(false);
    
    const getFirstReply = async () => {
      try {
        await getReplyAsync({
          jobDescription,
          resume: "",
          interviewers: interviewer,
          difficulty,
          nextQuestion: "",
          currentQuestion: "",
          currentAnswer: "",
          firstQuestion: firstQuestion,
          isFirstQuestion,
          isLastAnswer: false
        }).then(handleReplySuccess);
      } catch (err) {
        setError("Failed to get reply");
      }
    };

    getFirstReply();
  }, [currentQuestion, isAISpeaking, jobDescription, interviewer, difficulty, nextQuestion, currentAnswer, questions, isFirstQuestion]);

  // Effect to update internal answer from transcript
  useEffect(() => {
    if (transcript) {
      setBuildingAnswer(transcript);
    }
  }, [transcript]);

  // Effect to reset transcript on question change
  useEffect(() => {
    resetTranscript();
    setBuildingAnswer("");
    setCleanedAnswer("");
  }, [currentQuestion, resetTranscript]);

  // Effect to manage speech recognition
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError("Your browser doesn't support speech recognition.");
      return;
    }

    if (isAISpeaking && listening) {
      SpeechRecognition.stopListening();
    } else if (!isAISpeaking && !listening && currentQuestion) {
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    }
  }, [browserSupportsSpeechRecognition, listening, isAISpeaking, currentQuestion]);

  // Stops the current audio playback
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
