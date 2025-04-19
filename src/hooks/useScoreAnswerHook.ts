import { useState, useEffect, useCallback } from "react";
import { useScoreAnswer } from "@/services/openAI";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

interface QuestionAnswer {
  question: string;
  answer: string;
  score?: number;
  reasoning?: string;
  cleanedAnswer?: string;
  modelAnswer?: string;
}

interface UseScoreAnswerHookProps {
  rtcConnection: { dc: RTCDataChannel } | null;
  jobDescription: string;
}

export const useScoreAnswerHook = ({ rtcConnection, jobDescription }: UseScoreAnswerHookProps) => {
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [isAISpeaking, setIsAISpeaking] = useState<boolean>(false);

  const { mutate: scoreAnswer, isPending: isScoring } = useScoreAnswer();
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Update current answer when transcript changes
  useEffect(() => {
    if (transcript) {
      setCurrentAnswer(transcript);
    }
  }, [transcript]);

  // Manage speech recognition based on AI speaking status
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError("Your browser doesn't support speech recognition.");
      return;
    }

    if (isAISpeaking && listening) {
      // Stop listening when AI is speaking
      SpeechRecognition.stopListening();
    } else if (!isAISpeaking && currentQuestion && !listening) {
      // Start listening when AI stops speaking and we have a question
     
      SpeechRecognition.startListening({ 
        continuous: true,
        language: 'en-US'
      });
    }
  }, [isAISpeaking, currentQuestion, browserSupportsSpeechRecognition, listening]);

  const handleScoreAnswer = useCallback(
    (question: string, answer: string) => {
      if (!question || !answer) return;
      
      scoreAnswer(
        { question, answer, jobDescription },
        {
          onSuccess: (data) => {
            setQuestionAnswers((prev) => [...prev, { 
              question, 
              answer, 
              score: data.score, 
              reasoning: data.reasoning,
              cleanedAnswer: data.cleanedAnswer,
              questionSummary: data.questionSummary,
              modelAnswer: data.modelAnswer
            }]);
            setError(null);
          },
          onError: (err) => {
            setError("Failed to score answer. Please try again.");
            console.error("Error scoring answer:", err);
          }
        }
      );
    },
    [scoreAnswer, jobDescription]
  );

  // Process messages from the data channel
  useEffect(() => {
    if (!rtcConnection?.dc) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data);

        if (parsed.type === "response.done") {
          const outputItems = parsed.response?.output || [];
          
          for (const item of outputItems) {
            const { role } = item;
            const transcriptParts = (item.content || [])
              .filter((c: any) => c.type === "audio" && c.transcript)
              .map((c: any) => c.transcript);

            const transcript = transcriptParts.join(" ").trim();
            if (!transcript) continue;

            if (role === "assistant") {
              // Score previous Q&A before setting new question
              if (currentQuestion && currentAnswer) {
                handleScoreAnswer(currentQuestion, currentAnswer);
              }
              
              setCurrentQuestion(transcript);
              setCurrentAnswer("");
              resetTranscript();
            }
          }
        } else if (parsed.type === "output_audio_buffer.stopped") {
          setIsAISpeaking(false);
        } else if (parsed.type === "output_audio_buffer.started") {
          setIsAISpeaking(true);
        }
      } catch (err) {
        console.error("Failed to parse message from data channel:", err);
      }
    };

    rtcConnection.dc.addEventListener("message", handleMessage);
    return () => {
      rtcConnection.dc.removeEventListener("message", handleMessage);
    };
  }, [rtcConnection, currentQuestion, currentAnswer, handleScoreAnswer, resetTranscript]);

  return {
    questionAnswers,
    error,
    isScoring,
    currentQuestion,
    currentAnswer,
    handleScoreAnswer,
    setError,
    isListening: listening,
    isAISpeaking
  };
};
