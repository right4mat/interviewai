"use client";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Webcam from "react-webcam";
import { initOpenAIRealtime } from "@/services/openAI";
import { useScoreAnswerHook } from "@/hooks/useScoreAnswerHook";
import VideoDisplay from "@/components/interview/VideoDisplay";
import ParticipantsList from "@/components/interview/ParticipantsList";
import Button from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

interface InterviewProps {
  jobDescription: string;
  pdfFile?: File;
  interviewers: Array<{
    name: string;
    role: string;
  }>;
  onBackToSetup: () => void;
}

export default function Interview({ jobDescription, pdfFile, interviewers, onBackToSetup }: InterviewProps): React.ReactElement {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [participants, setParticipants] = useState<string[]>(interviewers.map((i) => i.name));
  const webcamRef = useRef<Webcam>(null);
  const [rtcConnection, setRtcConnection] = useState<{ pc: RTCPeerConnection; dc: RTCDataChannel; cleanup: () => void } | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [interviewStarted, setInterviewStarted] = useState<boolean>(false);

  const { 
    questionAnswers, 
    error, 
    isScoring, 
    currentQuestion, 
    currentAnswer 
  } = useScoreAnswerHook({ rtcConnection, jobDescription });

  useEffect(() => {
    // Only initialize connection when interview is started
    if (interviewStarted && !rtcConnection && !isConnecting) {
      setIsConnecting(true);
      initOpenAIRealtime(jobDescription, interviewers)
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
            participantName={participants[0]}
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

          {/* Question and Answer Display */}
          {currentQuestion && (
            <Box sx={{ mt: 4, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Current Question:
              </Typography>
              <Typography paragraph>{currentQuestion}</Typography>
              {currentAnswer && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Your Answer:
                  </Typography>
                  <Typography paragraph>{currentAnswer}</Typography>
                </>
              )}
            </Box>
          )}

          {/* Previous Questions and Scores */}
          {questionAnswers.length > 0 && (
            <Box sx={{ mt: 4, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Previous Questions and Scores:
              </Typography>
              {questionAnswers.map((qa, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">
                    {qa.questionSummary || qa.question}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your Answer: {qa.cleanedAnswer}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress
                        variant="determinate"
                        value={qa.score || 0}
                        size={40}
                        thickness={4}
                        sx={{ color: qa.score && qa.score > 70 ? 'success.main' : qa.score && qa.score > 40 ? 'warning.main' : 'error.main' }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="caption" component="div" color="text.secondary">
                          {qa.score}
                        </Typography>
                      </Box>
                    </Box>
                    {qa.reasoning && (
                      <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
                        Feedback: {qa.reasoning}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {isScoring && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: 'background.paper',
            borderRadius: 1,
            p: 2,
            overflow: 'auto'
          }}>
            <Typography variant="h6" gutterBottom>
              Interview Chat
            </Typography>
            <Box sx={{ 
              flex: 1, 
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              {questionAnswers.map((qa, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Question {index + 1}:
                  </Typography>
                  <Typography variant="body1">
                    {qa.questionSummary || qa.question}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your Answer: {qa.cleanedAnswer}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1,
                    mt: 1
                  }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex', mr: 1 }}>
                      <CircularProgress
                        variant="determinate"
                        value={qa.score || 0}
                        size={30}
                        thickness={4}
                        sx={{ color: qa.score && qa.score > 70 ? 'success.main' : qa.score && qa.score > 40 ? 'warning.main' : 'error.main' }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="caption" component="div" color="text.secondary">
                          {qa.score}
                        </Typography>
                      </Box>
                    </Box>
                    {qa.reasoning && (
                      <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                        {qa.reasoning}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
              {currentQuestion && (
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default',
                  borderRadius: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Current Question:
                  </Typography>
                  <Typography variant="body1">
                    {currentQuestion}
                  </Typography>
                  {currentAnswer && (
                    <Typography variant="body2" color="text.secondary">
                      Your Answer: {currentAnswer}
                    </Typography>
                  )}
                  {isScoring && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                      <CircularProgress size={20} />
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
