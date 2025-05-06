"use client";
// Import necessary React and Material-UI components
import * as React from "react";
import {  useRef, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Webcam from "react-webcam";
import { useGetInterviewQuestions } from "@/services/openAI";
import VideoDisplay from "@/components/interview/VideoDisplay";
import Button from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import {  LinearProgress } from "@mui/material";
import { useInterviewStore } from "@/stores/interviewStore";
import { useInterview } from "@/hooks/useInterview";
import InterviewProgress from "@/components/interview/InterviewProgress";
import { brand } from "@/theme/themePrimitives";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import ReviewDialog from "@/components/interview/ReviewDialog";

export default function Interview(): React.ReactElement {
  const webcamRef = useRef<Webcam>(null);
  const [showEndCallDialog, setShowEndCallDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const {
    isMuted,
    setupData,
    isVideoOn,
    isScreenSharing,
    isChatOpen,
    isConnecting,
    isConnected,
    interviewStarted,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    toggleChat,
    endCall,
    startInterview,
    stopInterview,
    setIsConnecting,
    setIsConnected,
    setStage
  } = useInterviewStore();

  // Fetch interview questions using custom hook
  const { data: questions, isLoading: isLoadingQuestions } = useGetInterviewQuestions({
    jobDescription: setupData.jobDescription,
    interviewers: setupData.interviewer,
    resume: setupData.resume,
    difficulty: setupData.settings.difficulty,
    type: setupData.settings.type
  });

  // Use the combined interview hook
  const {
    questionAnswers,
    error,
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
    currentQuestionIndex
  } = useInterview({
    questions: questions?.questions || [],
    jobDescription: setupData.jobDescription,
    interviewer: setupData.interviewer,
    resume: setupData.resume,
    difficulty: setupData.settings.difficulty,
    type: setupData.settings.type,
    stopListening: isLoadingQuestions || isMuted,
    interviewStarted
  });

  // Effect to handle interview session initialization
  React.useEffect(() => {
    if (questions && interviewStarted && !isConnected && !isConnecting) {
      setIsConnecting(true);
      setIsConnected(true);
      setIsConnecting(false);
    }
  }, [questions, isConnecting, interviewStarted, isConnected, setIsConnecting, setIsConnected]);

  // Effect to show review dialog when interview finishes
  React.useEffect(() => {
    if (currentQuestionIndex >= (questions?.questions?.length || 999) && interviewStarted) {
      setShowReviewDialog(true);
    }
  }, [currentQuestionIndex, questions?.questions?.length, interviewStarted]);

  const handleStartInterview = () => {
    if (!isLoadingQuestions && questions?.questions?.length) {
      startInterview();
    }
  };

  const handleStopInterview = () => {
    stopInterview();
    stopAudio();
  };

  const handleEndCall = () => {
    setShowEndCallDialog(true);
  };

  const handleConfirmEndCall = () => {
    setShowEndCallDialog(false);
    endCall();
  };

  const handleCancelEndCall = () => {
    setShowEndCallDialog(false);
  };

  const handleCloseReview = () => {
    setShowReviewDialog(false);
    setStage("setup");
  };

  // Render the interview interface
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Header with title and back button */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Interview Progress
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentQuestionIndex} of {questions?.questions?.length || 0} questions
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={isLoadingQuestions ? 0 : (currentQuestionIndex) / (questions?.questions?.length || 0) * 100}
          sx={{
            width: "100%",
            height: 8,
            borderRadius: 4,
            backgroundColor: brand[100],
            "& .MuiLinearProgress-bar": {
              backgroundColor: brand[500],
              borderRadius: 4
            }
          }}
        />
      </Box>

      <ConfirmationDialog
        open={showEndCallDialog}
        title="End Interview"
        message="Are you sure you want to end this interview? This action cannot be undone."
        confirmLabel="End Interview"
        cancelLabel="Continue Interview"
        onConfirm={handleConfirmEndCall}
        onCancel={handleCancelEndCall}
        confirmColor="error"
      />

      {currentQuestionIndex >= (questions?.questions?.length || 999) && <ReviewDialog
        open={showReviewDialog}
        onClose={handleCloseReview}
        questionAnswers={questionAnswers}
        jobDescription={setupData.jobDescription}
        interviewers={setupData.interviewer}
        resume={setupData.resume}
        type={setupData.settings.type}
        difficulty={setupData.settings.difficulty}
      />}

      <Grid container spacing={3}>
        {/* Video display section */}
        <Grid size={{ xs: 12, md: 9 }}>
          <VideoDisplay
            isMuted={isAISpeaking || !isListening || isGettingReply || isScoring || isLoadingQuestions || !interviewStarted}
            isAISpeaking={isAISpeaking}
            isVideoOn={isVideoOn}
            isScreenSharing={isScreenSharing}
            isChatOpen={isChatOpen}
            isConnecting={isConnecting}
            isConnected={isConnected}
            participantName={setupData.interviewer.name}
            webcamRef={webcamRef as React.RefObject<Webcam>}
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
            onToggleScreenShare={toggleScreenShare}
            onToggleChat={toggleChat}
            onEndCall={handleEndCall}
            isGettingReply={isGettingReply || isLoadingQuestions}
            volumeLevel={volumeLevel}
          />

          {/* Interview control buttons */}
          <Box sx={{ mt: 2, textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
            <Button variant="outlined" size="large" onClick={() => setStage("setup")} startIcon={<ArrowBackIcon />} sx={{ ml: 2 }}>
              Back to Setup
            </Button>
            {!interviewStarted ? (
              <Button
              component="div"
                variant="contained"
                color="primary"
                onClick={handleStartInterview}
                disabled={isLoadingQuestions || !questions?.questions?.length}
                startIcon={<PlayArrowIcon />}
              >
                {isLoadingQuestions ? "Loading Questions..." : "Start Interview"}
              </Button>
            ) : (
              <>
                <Button variant="outlined" color="error" size="large" onClick={handleStopInterview} startIcon={<StopIcon />}>
                  Stop Interview
                </Button>
                <Button variant="outlined" size="large" onClick={skipQuestion} startIcon={<SkipNextIcon />}>
                  Skip Question
                </Button>
              </>
            )}
          </Box>
        </Grid>

        {/* Interview progress section */}
        {isChatOpen && (
          <Grid size={{ xs: 12, md: 3 }}>
            <InterviewProgress
              isGettingReply={isGettingReply || isLoadingQuestions}
              currentQuestion={currentQuestion}
              cleanedAnswer={cleanedAnswer}
              buildingAnswer={buildingAnswer}
              isScoring={isScoring}
              questionAnswers={questionAnswers}
              started={interviewStarted}
              finished={currentQuestionIndex >= (questions?.questions?.length || 999)}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
