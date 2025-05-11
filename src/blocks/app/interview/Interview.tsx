"use client";
// Import necessary React and Material-UI components
import * as React from "react";
import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Webcam from "react-webcam";
import { useGetInterviewQuestions, useSaveInterview } from "@/services/InterviewServices";
import VideoDisplay from "@/components/app/interview/VideoDisplay";
import Button from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { LinearProgress } from "@mui/material";
import { useInterviewStore } from "@/stores/interviewStore";
import { useInterview } from "@/hooks/useInterview";
import InterviewProgress from "@/components/app/interview/InterviewProgress";
import { brand } from "@/theme/themePrimitives";
import ReviewDialog from "@/components/app/interview/ReviewDialog";

export default function Interview(): React.ReactElement {
  const webcamRef = useRef<Webcam>(null);
  const [showEndCallDialog, setShowEndCallDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const { mutate: saveInterview, ConfirmDialog: SaveConfirmDialog } = useSaveInterview();
  const {
    isMuted,
    isVideoOn,
    isChatOpen,
    interviewState: { interviewStarted, questions, company, ...interviewState },
    toggleMute,
    toggleVideo,
    toggleChat,
    startInterview,
    stopInterview,
    setStage,
    updateInterviewState
  } = useInterviewStore();

  // Fetch interview questions using custom hook. If questions are already loaded from save state, they will be used.
  const { data: details, isLoading: isLoadingQuestions } = useGetInterviewQuestions({
    jobDescription: interviewState.jobDescription,
    interviewers: interviewState.interviewer,
    resume: interviewState.resume,
    difficulty: interviewState.settings.difficulty,
    type: interviewState.settings.type,
    questions: questions,
    company: company
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
    resume: interviewState.resume,
    difficulty: interviewState.settings.difficulty,
    type: interviewState.settings.type,
    stopListening: isLoadingQuestions || isMuted,
    startingIndex: interviewState.currentQuestionIndex,
    startingAnswers: interviewState.questionAnswers,
    interviewStarted
  });

  // Effect to show review dialog when interview finishes this is messy but it works can fix later
  React.useEffect(() => {
    if (currentQuestionIndex >= (details?.questions?.length || 999) && interviewStarted) {
      setShowReviewDialog(true);
    }
  }, [currentQuestionIndex, details?.questions?.length, interviewStarted]);

  const handleStartInterview = () => {
    if (!isLoadingQuestions && details?.questions?.length) {
      startInterview();
    }
  };

  const handleSaveSuccess = () => {
    stopInterview();
    stopAudio();
    setStage("setup");
  };

  const handleStopInterview = () => {
    saveInterview({
      company: details?.company || "",
      questions: details?.questions || [],
      currentQuestionIndex,
      interviewer: interviewState.interviewer,
      settings: interviewState.settings,
      jobDescription: interviewState.jobDescription,
      resume: interviewState.resume,
      questionAnswers
    }, {
      onSuccess: handleSaveSuccess
    });
  };

  const handleEndCall = () => {
    setShowEndCallDialog(true);
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
            {currentQuestionIndex} of {details?.questions?.length || 0} questions
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={isLoadingQuestions ? 0 : (currentQuestionIndex / (details?.questions?.length || 0)) * 100}
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

      {SaveConfirmDialog}



      {currentQuestionIndex >= (details?.questions?.length || 999) && (
        <ReviewDialog
          open={showReviewDialog}
          onClose={handleCloseReview}
          questionAnswers={questionAnswers}
          jobDescription={interviewState.jobDescription}
          interviewers={interviewState.interviewer}
          resume={interviewState.resume}
          type={interviewState.settings.type}
          difficulty={interviewState.settings.difficulty}
        />
      )}

      <Grid container spacing={3}>
        {/* Video display section */}
        <Grid size={{ xs: 12, md: 9 }}>
          <VideoDisplay
            isMuted={isAISpeaking || !isListening || isGettingReply || isScoring || isLoadingQuestions || !interviewStarted}
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
                disabled={isLoadingQuestions || !details?.questions?.length}
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
              answerWillCompleteIn={answerWillCompleteIn}
              isGettingReply={isGettingReply || isLoadingQuestions}
              currentQuestion={currentQuestion}
              cleanedAnswer={cleanedAnswer}
              buildingAnswer={buildingAnswer}
              isScoring={isScoring}
              questionAnswers={questionAnswers}
              started={interviewStarted}
              finished={currentQuestionIndex >= (details?.questions?.length || 999)}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
