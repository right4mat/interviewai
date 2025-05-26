import { useState, useEffect, useRef } from "react";
import { useGetInterviewReply, useScoreAnswer } from "@/services/appServices";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useDebounce } from "@/hooks/useDebounce";
import { type Interviewer, type QuestionAnswer } from "@/types/interview";
import { Howl } from "howler";



/**
 * Props required to initialize the interview hook
 */
interface UseInterviewProps {
  company: string;
  questions: string[];
  jobDescriptionId: number;
  interviewer: Interviewer;
  resumeId?: number;
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
  jobDescriptionId,
  interviewer,
  resumeId,
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
  const firstReplyHasStarted = useRef<boolean>(false);
  const lastQuestionIndex = useRef<number>(-1);

  // Speech recognition configuration
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // API hooks for AI interactions
  const { mutateAsync: scoreAnswerAsync, isPending: isScoring } = useScoreAnswer();
  const { mutateAsync: getReplyAsync, isPending: isGettingReply } = useGetInterviewReply();

  // Debounced answer to prevent rapid API calls
  const currentAnswer = useDebounce(buildingAnswer, 5000);

  // New refs for Howler
  const howlRef = useRef<Howl | null>(null);
  const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Add back answerTimeoutRef
  const answerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    // Stop any previous audio
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
      howlRef.current = null;
    }
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
    if (!response?.audio) return;
    SpeechRecognition.stopListening();
    setIsAISpeaking(true);
    // Howler expects a URL or base64 data URI
    howlRef.current = new Howl({
      src: [response.audio],
      html5: true,
      onend: () => {
        setIsAISpeaking(false);
        setVolumeLevel(0);
        if (volumeIntervalRef.current) {
          clearInterval(volumeIntervalRef.current);
          volumeIntervalRef.current = null;
        }
      },
      onplay: () => {
        setIsAISpeaking(true);
        // Simulate volume visualization (Howler does not provide direct volume data)
        // We'll just animate a fake volume for now, or you can integrate a waveform util if needed
        volumeIntervalRef.current = setInterval(() => {
          // Simulate volume: randomize for effect, or use a util for real waveform
          setVolumeLevel(Math.floor(Math.random() * 100));
        }, 300);
      },
      onstop: () => {
        setIsAISpeaking(false);
        setVolumeLevel(0);
        if (volumeIntervalRef.current) {
          clearInterval(volumeIntervalRef.current);
          volumeIntervalRef.current = null;
        }
      },
      onpause: () => {
        setIsAISpeaking(false);
        setVolumeLevel(0);
        if (volumeIntervalRef.current) {
          clearInterval(volumeIntervalRef.current);
          volumeIntervalRef.current = null;
        }
      },
      onloaderror: () => {
        setIsAISpeaking(false);
        setVolumeLevel(0);
        setError("Failed to load audio");
      },
      onplayerror: () => {
        setIsAISpeaking(false);
        setVolumeLevel(0);
        setError("Failed to play audio");
      }
    });
    howlRef.current.play();
  };

  // Main interview flow effect - handles scoring and AI replies
  useEffect(() => {
    if (!currentQuestion || !currentAnswer || isFirstQuestion || !interviewStarted) return;

    console.log("scoreAndReply rendering");

    Promise.all([
      scoreAnswerAsync({
        question: currentQuestion,
        answer: currentAnswer,
        jobDescriptionId,
        type,
        difficulty,
        resumeId
      }).then(handleScoreSuccess),

      getReplyAsync({
        company,
        jobDescriptionId,
        resumeId,
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
      jobDescriptionId,
      resumeId,
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
    jobDescriptionId,
    interviewer,
    difficulty,
    resumeId,
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (howlRef.current) {
        howlRef.current.stop();
        howlRef.current.unload();
        howlRef.current = null;
      }
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
        volumeIntervalRef.current = null;
      }
    };
  }, []);

  /**
   * Stops current audio playback and resets speaking state
   */
  const stopAudio = () => {
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
      howlRef.current = null;
    }
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
    setIsAISpeaking(false);
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
