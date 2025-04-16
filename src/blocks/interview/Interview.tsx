"use client";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Webcam from "react-webcam";
import { initOpenAIRealtime, useGetInterviewQuestions } from "@/services/openAI";
import { useScoreAnswerHook } from "@/hooks/useScoreAnswerHook";
import VideoDisplay from "@/components/interview/VideoDisplay";
import ParticipantsList from "@/components/interview/ParticipantsList";
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
import { Interviewer } from "@/types/interview";
interface InterviewProps {
  jobDescription: string;
  pdfFile?: File;
  interviewers: Interviewer;
  onBackToSetup: () => void;
}



export default function Interview({ jobDescription, pdfFile, interviewers, onBackToSetup }: InterviewProps): React.ReactElement {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const [rtcConnection, setRtcConnection] = useState<{ pc: RTCPeerConnection; dc: RTCDataChannel; cleanup: () => void } | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [interviewStarted, setInterviewStarted] = useState<boolean>(false);

  const { questionAnswers, error, isScoring, currentQuestion, currentAnswer } = useScoreAnswerHook({ rtcConnection, jobDescription });
  const {
    data: questionList,
  } = useGetInterviewQuestions({ jobDescription, interviewers, pdfFile });

  useEffect(() => {
    // Only initialize connection when interview is started
    if (interviewStarted && !rtcConnection && !isConnecting) {
      setIsConnecting(true);
      initOpenAIRealtime({questionList, jobDescription, interviewers})
        .then((connection) => {
          setRtcConnection(connection);
          setIsConnected(true);
          setIsConnecting(false);
          console.log("OpenAI Realtime connection established");
        })
        .catch((error) => {
          console.error("Failed to connect to OpenAI Realtime:", error);
          setIsConnecting(false);
        });
    }

    // Cleanup function to close connection when component unmounts
    return () => {
      if (rtcConnection) {
        rtcConnection.cleanup();
        console.log("OpenAI Realtime connection closed");
      }
    };
  }, [rtcConnection, isConnecting, interviewStarted, jobDescription, interviewers]);

  const startInterview = (): void => {
    setInterviewStarted(true);
  };

  const stopInterview = (): void => {
    if (rtcConnection) {
      rtcConnection.cleanup();
      setRtcConnection(null);
      setIsConnected(false);
    }
    setIsConnecting(false);
    setInterviewStarted(false);
  };

  const toggleMute = (): void => {
    setIsMuted(!isMuted);
    if (rtcConnection) {
      // Update audio track enabled state
      rtcConnection.pc.getSenders().forEach((sender) => {
        if (sender.track && sender.track.kind === "audio") {
          sender.track.enabled = isMuted; // Toggle from current state
        }
      });
    }
  };

  const toggleVideo = (): void => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleScreenShare = (): void => {
    setIsScreenSharing(!isScreenSharing);
  };

  const toggleChat = (): void => {
    setIsChatOpen(!isChatOpen);
  };

  const endCall = (): void => {
    if (rtcConnection) {
      rtcConnection.cleanup();
      setRtcConnection(null);
      setIsConnected(false);
      setIsConnecting(false);
      setInterviewStarted(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography component="h2" variant="h5">
          {isConnected ? "AI Interview Session" : "Interview Setup"}
        </Typography>
        <Button variant="outlined" onClick={onBackToSetup} startIcon={<ArrowBackIcon />} sx={{ ml: 2 }}>
          Back to Setup
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 9 }}>
          <VideoDisplay
            isMuted={isMuted}
            isVideoOn={isVideoOn}
            isScreenSharing={isScreenSharing}
            isChatOpen={isChatOpen}
            isConnecting={isConnecting}
            isConnected={isConnected}
            participantName={interviewers}
            webcamRef={webcamRef as React.RefObject<Webcam>}
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
            onToggleScreenShare={toggleScreenShare}
            onToggleChat={toggleChat}
            onEndCall={endCall}
          />

          <Box sx={{ mt: 2, textAlign: "center", display: "flex", justifyContent: "center", gap: 2 }}>
            {!interviewStarted ? (
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={startInterview}
                disabled={isConnecting}
                startIcon={<PlayArrowIcon />}
                sx={{ mt: 2 }}
              >
                Start Interview
              </Button>
            ) : (
              <Button variant="outlined" color="error" size="large" onClick={stopInterview} startIcon={<StopIcon />} sx={{ mt: 2 }}>
                Stop Interview
              </Button>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={2}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              overflow: "hidden"
            }}
          >
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

                    {currentAnswer && (
                      <>
                        <Divider sx={{ my: 1.5 }}>
                          <Chip label="Your Response" size="small" variant="outlined" />
                        </Divider>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ pl: 1, borderLeft: "2px solid", borderColor: "divider", py: 0.5 }}
                        >
                          {currentAnswer}
                        </Typography>
                      </>
                    )}

                    {isScoring && (
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
                        borderBottomRightRadius: 0
                      }
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 500, flex: 1, mr: 1 }}>
                        {qa.questionSummary || qa.question}
                      </Typography>
                      <Box sx={{ position: "relative", display: "inline-flex" }}>
                        <CircularProgress
                          variant="determinate"
                          value={qa.score || 0}
                          size={50}
                          thickness={4}
                          sx={{
                            color: qa.score && qa.score > 70 ? "success.main" : qa.score && qa.score > 40 ? "warning.main" : "error.main",
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
                      {qa.cleanedAnswer}
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
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
