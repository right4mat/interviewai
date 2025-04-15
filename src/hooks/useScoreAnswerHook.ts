import { useState, useEffect } from "react";
import { useScoreAnswer } from "@/services/openAI";

interface QuestionAnswer {
  question: string;
  answer: string;
  score?: number;
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

  const { mutate: scoreAnswer, isPending: isScoring } = useScoreAnswer();

  const handleScoreAnswer = (question: string, answer: string) => {
    scoreAnswer(
      { question, answer, jobDescription },
      {
        onSuccess: (data) => {
          setQuestionAnswers((prev) => [...prev, { question, answer, score: data.score }]);
          setError(null);
        },
        onError: (err) => {
          setError("Failed to score answer. Please try again.");
          console.error("Error scoring answer:", err);
        }
      }
    );
  };

  // Handle messages from the data channel
  useEffect(() => {
    if (rtcConnection?.dc) {
      const handleMessage = (event: MessageEvent) => {
        try {
          const parsed = JSON.parse(event.data);

          if (parsed.type !== "response.done") return;

          const outputItems = parsed.response?.output || [];

          outputItems.forEach((item: any) => {
            const role = item.role;
            const transcriptParts = (item.content || [])
              .filter((c: any) => c.type === "audio" && c.transcript)
              .map((c: any) => c.transcript);

            const transcript = transcriptParts.join(" ").trim();
            if (!transcript) return;

            if (role === "assistant") {
              setCurrentQuestion(transcript); // Store the AI question
              setCurrentAnswer(""); // Reset any previous answer
            }

            if (role === "user" && currentQuestion) {
              setCurrentAnswer(transcript);
              handleScoreAnswer(currentQuestion, transcript); // Score the user’s answer
            }
          });
        } catch (err) {
          console.error("Failed to parse message from data channel:", err);
        }
      };

      rtcConnection.dc.addEventListener("message", handleMessage);
      return () => {
        rtcConnection.dc.removeEventListener("message", handleMessage);
      };
    }
  }, [rtcConnection, currentQuestion, currentAnswer, handleScoreAnswer]);

  return {
    questionAnswers,
    error,
    isScoring,
    currentQuestion,
    currentAnswer,
    handleScoreAnswer,
    setError
  };
};
