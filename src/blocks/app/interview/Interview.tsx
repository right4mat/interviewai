"use client";
// Import necessary React and Material-UI components
import * as React from "react";
import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Webcam from "react-webcam";
import { useGetInterviewQuestions, useSaveInterview } from "@/services/appServices";
import VideoDisplay from "@/components/app/interview/VideoDisplay";
import InterviewControls from "@/components/app/interview/InterviewControls";
import InterviewProgressBar from "@/components/app/interview/InterviewProgressBar";
import { useInterviewStore } from "@/stores/interviewStore";
import { useInterview } from "@/hooks/useInterview";
import InterviewProgress from "@/components/app/interview/InterviewProgress";
import ReviewDialog from "@/components/app/interview/ReviewDialog";
import { useRouter } from "next/navigation";
import { PAGE_PATH } from "@/path";

export default function Interview(): React.ReactElement {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const [showEndCallDialog, setShowEndCallDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [isSavingInterview, setIsSavingInterview] = useState(false);
  const { mutate: saveInterview, ConfirmDialog: SaveConfirmDialog } = useSaveInterview();
  const {
    isMuted,
    isVideoOn,
    isChatOpen,
    interviewState,
    toggleMute,
    toggleVideo,
    toggleChat,
    startInterview,
    stopInterview,
    setStage,
    clearinterviewState,
    updateInterviewState
  } = useInterviewStore();

  console.log(interviewState);

  // Fetch interview questions using custom hook. If questions are already loaded from save state, they will be used.
  const { data: details, isLoading: isLoadingQuestions } = useGetInterviewQuestions({
    jobDescription: interviewState.jobDescription,
    interviewers: interviewState.interviewer,
    resumeId: interviewState?.resumeId,
    difficulty: interviewState.settings.difficulty,
    type: interviewState.settings.type,
    questions: interviewState.questions,
    company: interviewState.company
  });

  // Use the combined interview hook
  const {
    questionAnswers,
    isScoring,
    isGettingReply,
    currentQuestion,
    cleanedAnswer,
    buildingAnswer,
    isAISpeaking,
    isListening,
    stopAudio,
    skipQuestion,
    volumeLevel,
    currentQuestionIndex,
    answerWillCompleteIn
  } = useInterview({
    company: details?.company || "",
    questions: details?.questions || [],
    jobDescription: interviewState.jobDescription,
    interviewer: interviewState.interviewer,
    resumeId: interviewState?.resumeId,
    difficulty: interviewState.settings.difficulty,
    type: interviewState.settings.type,
    stopListening: isLoadingQuestions || isMuted,
    startingIndex: interviewState.currentQuestionIndex,
    startingAnswers: interviewState.questionAnswers,
    interviewStarted: !!interviewState.interviewStarted
  });

  // Effect to show review dialog when interview finishes this is messy but it works can fix later
  React.useEffect(() => {
    if (currentQuestionIndex >= (details?.questions?.length || 999) && !!interviewState.interviewStarted && !isAISpeaking) {
      // finished so lets save the interview
      saveInterview({
        company: details?.company || "",
        questions: details?.questions || [],
        currentQuestionIndex,
        interviewer: interviewState.interviewer,
        settings: interviewState.settings,
        jobDescription: interviewState.jobDescription,
        resumeId: interviewState.resumeId,
        questionAnswers
      });

      setShowReviewDialog(true);
    }
  }, [isAISpeaking, currentQuestionIndex, details?.questions?.length, !!interviewState.interviewStarted]);

  const handleStartInterview = () => {
    if (!isLoadingQuestions && details?.questions?.length) {
      startInterview();
    }
  };

  const handleSaveSuccess = () => {
    stopInterview();
    stopAudio();
    clearinterviewState();
    router.push(PAGE_PATH.appRoot);
  };

  const handleStopInterview = () => {
    saveInterview(
      {
        company: details?.company || "",
        questions: details?.questions || [],
        currentQuestionIndex,
        interviewer: interviewState.interviewer,
        settings: interviewState.settings,
        jobDescription: interviewState.jobDescription,
        resumeId: interviewState.resumeId,
        questionAnswers
      },
      {
        onSuccess: handleSaveSuccess
      }
    );
  };

  const handleEndCall = () => {
    setShowEndCallDialog(true);
    clearinterviewState();
 
  };

  const handleCloseReview = () => {
    setIsSavingInterview(true);
    saveInterview(
      {
        company: details?.company || "",
        questions: details?.questions || [],
        currentQuestionIndex,
        interviewer: interviewState.interviewer,
        settings: interviewState.settings,
        jobDescription: interviewState.jobDescription,
        resumeId: interviewState.resumeId,
        questionAnswers
      },
      {
        skipConfirm: true,
        onSuccess: () => {
          handleSaveSuccess();
          setShowReviewDialog(false);
          clearinterviewState();
          setIsSavingInterview(false);
          router.push(PAGE_PATH.appRoot);
        },
        onError: () => {
          setIsSavingInterview(false);
        }
      }
    );
  };

  // Render the interview interface
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <InterviewProgressBar
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={details?.questions?.length || 0}
        isLoadingQuestions={isLoadingQuestions}
      />

      {SaveConfirmDialog}

      {currentQuestionIndex >= (details?.questions?.length || 999) && (
        <ReviewDialog
          company={details?.company || ""}
          open={showReviewDialog}
          onClose={handleCloseReview}
          questionAnswers={questionAnswers}
          jobDescription={interviewState.jobDescription}
          interviewers={interviewState.interviewer}
          resumeId={interviewState?.resumeId}
          type={interviewState.settings.type}
          difficulty={interviewState.settings.difficulty}
          isSaving={isSavingInterview}
        />
      )}

      <Grid container spacing={3}>
        {/* Video display section */}
        <Grid size={{ xs: 12, md: 9 }}>
          <VideoDisplay
            isMuted={isAISpeaking || !isListening || isGettingReply || isLoadingQuestions || !interviewState.interviewStarted}
            isAISpeaking={isAISpeaking}
            isVideoOn={isVideoOn}
            isChatOpen={isChatOpen}
            isConnecting={isLoadingQuestions}
            isConnected={!!details}
            participantName={interviewState.interviewer.name}
            webcamRef={webcamRef as React.RefObject<Webcam>}
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
            onToggleChat={toggleChat}
            onEndCall={handleEndCall}
            isGettingReply={isGettingReply || isLoadingQuestions}
            volumeLevel={volumeLevel}
          />

          <InterviewControls
            isLoadingQuestions={isLoadingQuestions}
            interviewStarted={!!interviewState.interviewStarted}
            hasQuestions={!!details?.questions?.length}
            onStartInterview={handleStartInterview}
            onStopInterview={handleStopInterview}
            onBackToSetup={() => setStage("setup")}
            onSkipQuestion={skipQuestion}
          />
        </Grid>

        {/* Interview progress section */}
        {isChatOpen && (
          <Grid size={{ xs: 12, md: 3 }}>
            <InterviewProgress
              answerWillCompleteIn={answerWillCompleteIn}
              isGettingReply={isGettingReply || isLoadingQuestions}
              currentQuestion={currentQuestion}
              cleanedAnswer={cleanedAnswer}
              buildingAnswer={buildingAnswer}
              isScoring={isScoring}
              questionAnswers={questionAnswers}
              started={interviewState.interviewStarted}
              finished={currentQuestionIndex >= (details?.questions?.length || 999)}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
