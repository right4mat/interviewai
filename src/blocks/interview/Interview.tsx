"use client";
// Import necessary React and Material-UI components
import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Avatar from "@mui/material/Avatar";
import Fade from "@mui/material/Fade";
import { alpha, Card, LinearProgress } from "@mui/material";
import { useInterviewStore } from "@/stores/interviewStore";
import { useInterview } from "@/hooks/useInterview";
import InterviewProgress from "@/components/interview/InterviewProgress";
import { brand } from "@/theme/themePrimitives";

export default function Interview(): React.ReactElement {
  const webcamRef = useRef<Webcam>(null);
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

  const handleStartInterview = () => {
    if (!isLoadingQuestions && questions?.questions?.length) {
      startInterview();
    }
  };

  const handleStopInterview = () => {
    stopInterview();
    stopAudio();
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
          value={(currentQuestionIndex) / (questions?.questions?.length || 0) * 100}
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
            onEndCall={endCall}
            isGettingReply={isGettingReply}
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
              <Button variant="outlined" color="error" size="large" onClick={handleStopInterview} startIcon={<StopIcon />}>
                Stop Interview
              </Button>
            )}
          </Box>
        </Grid>

        {/* Interview progress section */}
        {isChatOpen && (
          <Grid size={{ xs: 12, md: 3 }}>
            <InterviewProgress
              isGettingReply={isGettingReply}
              currentQuestion={currentQuestion}
              cleanedAnswer={cleanedAnswer}
              buildingAnswer={buildingAnswer}
              isScoring={isScoring}
              questionAnswers={questionAnswers}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
