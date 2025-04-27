import { useState, useEffect, useRef } from 'react';
import { useGetInterviewReply, GetInterviewReplyRequest } from '@/services/openAI';
import { Interviewer } from '@/types/interview';

interface UseReplyProps {
  jobDescription: string;
  resume: string;
  interviewers: Interviewer;
  difficulty: string;
  nextQuestion: string;
  isFirstQuestion: boolean;
  isLastAnswer: boolean;
  currentAnswer: string;
  currentQuestion: string;
  firstQuestion: string;
  onQuestionComplete?: () => void;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}

export const useReply = ({
  jobDescription,
  resume,
  interviewers,
  difficulty,
  nextQuestion,
  isFirstQuestion,
  isLastAnswer,
  currentAnswer,
  currentQuestion,
  firstQuestion,
  onQuestionComplete,
  onSpeakingChange
}: UseReplyProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedQuestion = useRef<string>('');

  const { data: interviewReply } = useGetInterviewReply({
    jobDescription,
    resume,
    interviewers,
    difficulty,
    nextQuestion,
    currentQuestion: currentQuestion || "",
    currentAnswer: currentAnswer || "",
    firstQuestion: firstQuestion || "",
    isFirstQuestion,
    isLastAnswer
  });

  // Handle audio playback
  useEffect(() => {
    if (interviewReply?.audio && currentQuestion) {
      onSpeakingChange?.(true);
      audioRef.current = new Audio(interviewReply.audio);
      lastPlayedQuestion.current = currentQuestion;
      
      audioRef.current.onended = () => {
        onSpeakingChange?.(false);
        onQuestionComplete?.();
      };

      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
        onSpeakingChange?.(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, [interviewReply, currentQuestion]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    onSpeakingChange?.(false);
  };

  return {
    stopAudio,
    replyText: interviewReply?.text || ''
  };
};
