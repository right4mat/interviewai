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
import { Card } from "@mui/material";
import { useInterviewStore } from "@/stores/interviewStore";
import { useInterview } from "@/hooks/useInterview";

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
  const { questionAnswers, error, isScoring, isGettingReply, currentQuestion, cleanedAnswer, buildingAnswer, isAISpeaking, isListening, stopAudio,  } =
    useInterview({
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography component="h2" variant="h5">
          {"AI Interview Session"}
        </Typography>
        <Button variant="outlined" onClick={() => setStage('setup')} startIcon={<ArrowBackIcon />} sx={{ ml: 2 }}>
          Back to Setup
        </Button>
      </Box>

      {/* Error display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Video display section */}
        <Grid size={{ xs: 12, md: 9 }}>
          <VideoDisplay
            isMuted={isAISpeaking || !isListening || isGettingReply || isScoring || isLoadingQuestions}
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
          />

          {/* Interview control buttons */}
          <Box sx={{ mt: 2, textAlign: "center", display: "flex", justifyContent: "center", gap: 2 }}>
            {!interviewStarted ? (
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={handleStartInterview}
                disabled={isLoadingQuestions || !questions?.questions?.length}
                startIcon={<PlayArrowIcon />}
                sx={{ mt: 2 }}
              >
                {isLoadingQuestions ? "Loading Questions..." : "Start Interview"}
              </Button>
            ) : (
              <Button variant="outlined" color="error" size="large" onClick={handleStopInterview} startIcon={<StopIcon />} sx={{ mt: 2 }}>
                Stop Interview
              </Button>
            )}
          </Box>
        </Grid>

        {/* Interview progress section */}
        {isChatOpen && <Grid size={{ xs: 12, md: 3 }}>
          <Card
            variant="outlined"
            sx={{
              bgcolor: "background.paper",
              padding: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              overflow: "hidden"
            }}
          >
            {/* Progress header */}
            <Box
              sx={{
                p: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              <QuestionAnswerIcon />
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Interview Progress
              </Typography>
            </Box>

            {/* Questions and answers display */}
            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
                p: 2,
                gap: 2
              }}
            >
              {/* Current question display */}
              {currentQuestion && (
                <Fade in={!!currentQuestion}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "primary.light",
                      borderLeft: "4px solid",
                      borderLeftColor: "primary.main",
                      bgcolor: "background.paper",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1.5, gap: 1 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: "primary.main", fontSize: "0.875rem" }}>AI</Avatar>
                      <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 600 }}>
                        Current Question:
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                      {currentQuestion}
                    </Typography>

                    {/* Current answer display */}
                    {(cleanedAnswer || buildingAnswer) && (
                      <>
                        <Divider sx={{ my: 1.5 }}>
                          <Chip label="Your Response" size="small" variant="outlined" />
                        </Divider>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ pl: 1, borderLeft: "2px solid", borderColor: "divider", py: 0.5 }}
                        >
                          {cleanedAnswer || buildingAnswer}
                        </Typography>
                      </>
                    )}

                    {/* Loading indicator while scoring */}
                    {(isScoring) && (
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2, gap: 1 }}>
                        <CircularProgress size={16} thickness={6} />
                        <Typography variant="caption" color="text.secondary">
                          Analyzing your response...
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Fade>
              )}

              {/* Previous questions and answers history */}
              <Box sx={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column-reverse", maxHeight: "60vh" }}>
                {questionAnswers.map((qa, index) => (
                  <Accordion
                    key={index}
                    sx={{
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      borderRadius: "8px !important",
                      "&:before": { display: "none" },
                      mb: 1.5
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`chat-panel${index}-content`}
                      id={`chat-panel${index}-header`}
                      sx={{
                        borderRadius: "8px",
                        "&.Mui-expanded": {
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                          display: "flex",
                          flexDirection: "column"
                        }
                      }}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, flex: 1, mr: 1 }}>
                          Question
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500, flex: 1, mr: 1 }}>
                            {qa.questionSummary}
                          </Typography>
                          <Box sx={{ position: "relative", display: "inline-flex" }}>
                            <CircularProgress
                              variant="determinate"
                              value={qa.score || 0}
                              size={50}
                              thickness={4}
                              sx={{
                                color:
                                  qa.score && qa.score > 70 ? "success.main" : qa.score && qa.score > 40 ? "warning.main" : "error.main",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                              }}
                            />
                            <Box
                              sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: "absolute",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <Typography variant="caption" component="div" sx={{ fontWeight: "bold" }}>
                                {qa.score}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{ px: 2, py: 1.5, bgcolor: "background.default", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                        Your Answer:
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, pl: 1, borderLeft: "2px solid", borderColor: "divider", py: 0.5 }}
                      >
                        {qa.answer}
                      </Typography>

                      {qa.reasoning && (
                        <>
                          <Divider sx={{ my: 1.5 }}>
                            <Chip
                              icon={<AssessmentIcon fontSize="small" />}
                              label="Feedback"
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Divider>
                          <Typography variant="body2" sx={{ fontStyle: "italic", color: "text.secondary", pl: 1 }}>
                            {qa.reasoning}
                          </Typography>
                        </>
                      )}

                      {qa.modelAnswer && (
                        <>
                          <Divider sx={{ my: 1.5 }}>
                            <Chip
                              icon={<QuestionAnswerIcon fontSize="small" />}
                              label="Model Answer"
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          </Divider>
                          <Typography
                            variant="body2"
                            sx={{ color: "success.light", pl: 1, borderLeft: "2px solid", borderColor: "success.light", py: 0.5 }}
                          >
                            {qa.modelAnswer}
                          </Typography>
                        </>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Box>
          </Card>
        </Grid>}
      </Grid>
    </Box>
  );
}
