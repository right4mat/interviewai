import { useState, useEffect, useRef } from "react";
import { useGetInterviewReply, useScoreAnswer } from "@/services/appServices";
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
  company: string;
  questions: string[];
  jobDescription: string;
  interviewer: Interviewer;
  resume: string;
  difficulty: string;
  type: "technical" | "behavioral" | "mixed";
  stopListening: boolean;
  interviewStarted: boolean;
  startingIndex: number;
  startingAnswers: QuestionAnswer[];
}

/**
 * Custom hook to manage the interview flow and state
 * Handles speech recognition, audio playback, and interaction with AI services
 */
export const useInterview = ({
  company,
  questions,
  jobDescription,
  interviewer,
  resume,
  difficulty,
  type,
  stopListening,
  startingIndex,
  startingAnswers,
  interviewStarted
}: UseInterviewProps) => {
  // Core interview state
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>(startingAnswers);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(startingIndex);
  const [isFirstQuestion, setIsFirstQuestion] = useState<boolean>(startingIndex === 0);
  const [lastAnswerIndex, setLastAnswerIndex] = useState<number>(0);

  // Answer handling state
  const [buildingAnswer, setBuildingAnswer] = useState<string>("");
  const [cleanedAnswer, setCleanedAnswer] = useState<string>("");
  const [answerWillCompleteIn, setAnswerWillCompleteIn] = useState<number>(5);

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [isAISpeaking, setIsAISpeaking] = useState<boolean>(false);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);

  // Persistent refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const firstReplyHasStarted = useRef<boolean>(false);
  const lastQuestionIndex = useRef<number>(-1);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const answerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const volumeLevelRef = useRef<number>(0);
  const lastVolumeUpdateRef = useRef<number>(0);

  // Speech recognition configuration
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // API hooks for AI interactions
  const { mutateAsync: scoreAnswerAsync, isPending: isScoring } = useScoreAnswer();
  const { mutateAsync: getReplyAsync, isPending: isGettingReply } = useGetInterviewReply();

  // Debounced answer to prevent rapid API calls
  const currentAnswer = useDebounce(buildingAnswer, 5000);

  // Reset countdown timer when building answer changes
  useEffect(() => {
    if (!buildingAnswer) return;
    if (answerTimeoutRef.current) {
      clearInterval(answerTimeoutRef.current);
    }

    setAnswerWillCompleteIn(5);

    answerTimeoutRef.current = setInterval(() => {
      setAnswerWillCompleteIn((prev) => {
        if (prev <= 0) {
          if (answerTimeoutRef.current) {
            clearInterval(answerTimeoutRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (answerTimeoutRef.current) {
        clearInterval(answerTimeoutRef.current);
      }
    };
  }, [buildingAnswer]);

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
    //if use skips to next question the past audio should be stopped if its still playing
    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (!response?.audio) return;

    // Ensure speech recognition is stopped before AI starts speaking
    SpeechRecognition.stopListening();
    setIsAISpeaking(true);

    audioRef.current = new Audio(response.audio);
    audioRef.current.onended = () => {
      audioRef.current = null;
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      volumeLevelRef.current = 0;
      setVolumeLevel(0);
      setIsAISpeaking(false);
    };

    // Set up audio analysis
    audioContextRef.current = new window.AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;

    const source = audioContextRef.current.createMediaElementSource(audioRef.current);
    source.connect(analyserRef.current);
    analyserRef.current.connect(audioContextRef.current.destination);

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const updateVolume = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        volumeLevelRef.current = avg;
        
        const now = Date.now();
        if (now - lastVolumeUpdateRef.current >= 300) { // Only update every 300ms
          setVolumeLevel(volumeLevelRef.current);
          lastVolumeUpdateRef.current = now;
        }
        
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      }
    };

    audioContextRef.current.resume().then(() => {
      setIsAISpeaking(true);
      audioRef.current?.play().catch((error) => {
        console.error("Error playing audio:", error);
        setIsAISpeaking(false);
        audioRef.current = null;
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        volumeLevelRef.current = 0;
        setVolumeLevel(0);
      });
      updateVolume();
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
        company,
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
      company,
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
    if (transcript && !isAISpeaking) { // Only update transcript if AI is not speaking
      setBuildingAnswer(transcript);
    }
  }, [transcript, isAISpeaking]);

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

    // Always stop listening if AI is speaking
    if (isAISpeaking) {
      console.log("AI speaking - stopping listening");
      SpeechRecognition.stopListening();
      return;
    }

    // Only start listening if interview is active and AI is not speaking
    if (!isAISpeaking && currentQuestion && interviewStarted && !stopListening) {
      console.log("starting listening");
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    } else {
      console.log("stopping listening");
      SpeechRecognition.stopListening();
    }
  }, [browserSupportsSpeechRecognition, isAISpeaking, currentQuestion, interviewStarted, stopListening]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  /**
   * Stops current audio playback and resets speaking state
   */
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsAISpeaking(false);
    volumeLevelRef.current = 0;
    setVolumeLevel(0);
  };

  /**
   * Skips the current question and moves to the next one
   */
  const skipQuestion = () => {
    SpeechRecognition.stopListening();
    setBuildingAnswer("I would like to skip this question");
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
    stopAudio,
    volumeLevel,
    currentQuestionIndex,
    skipQuestion,
    answerWillCompleteIn
  };
};
