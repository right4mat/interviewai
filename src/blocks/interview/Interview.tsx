"use client";
// Import necessary React and Material-UI components
import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Webcam from "react-webcam";
import { useGetInterviewQuestions } from "@/services/openAI";
import { useScoreAnswerHook } from "@/hooks/useScoreAnswerHook";
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
import { Interviewer } from "@/types/interview";
import { Card } from "@mui/material";
import { useReply } from "@/hooks/useReply";

// Interface defining props for the Interview component
interface InterviewProps {
  jobDescription: string;
  pdfFile?: File;
  interviewers: Interviewer;
  onBackToSetup: () => void;
}

export default function Interview({ jobDescription, pdfFile, interviewers, onBackToSetup }: InterviewProps): React.ReactElement {
  // State management for video/audio controls
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Refs and connection states
  const webcamRef = useRef<Webcam>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Interview progress states
  const [interviewStarted, setInterviewStarted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isAISpeaking, setIsAISpeaking] = useState<boolean>(false);
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState<boolean>(false);

  // Fetch interview questions using custom hook
  const { data: questions, isLoading: isLoadingQuestions } = useGetInterviewQuestions({
    jobDescription,
    interviewers,
    resume: "",
    difficulty: "intermediate"
  });

  // Memoize current question
  const currentQuestion = useMemo(() => {
    return questions?.questions?.[currentQuestionIndex] || "";
  }, [questions, currentQuestionIndex]);

  // Hook for scoring answers and managing current Q&A
  const { questionAnswers, error, isScoring, currentAnswer } = useScoreAnswerHook({
    question: currentQuestion,
    jobDescription,
    stopListening: isAISpeaking,
    onAnswerComplete: () => {
      setIsWaitingForAnswer(false);
      setCurrentQuestionIndex((prev) =>{ 
        console.log("currentQuestionIndex", prev);
        return prev + 1});
    }
  });

  // Hook for managing AI replies and audio
  const { stopAudio, replyText } = useReply({
    jobDescription,
    resume: "",
    interviewers,
    difficulty: "intermediate",
    nextQuestion: questions?.questions?.[currentQuestionIndex + 1] || "",
    isFirstQuestion: currentQuestionIndex === 0,
    isLastAnswer: currentQuestionIndex === (questions?.questions?.length || 0) - 1,
    currentAnswer: currentAnswer,
    currentQuestion: currentQuestion,
    onSpeakingChange: (speaking) => {
      setIsAISpeaking(speaking);
      
    }
  });

  // Effect to handle interview session initialization
  useEffect(() => {
    if (questions && interviewStarted && !isConnected && !isConnecting) {
      setIsConnecting(true);
      setIsConnected(true);
      setIsConnecting(false);
      console.log("Interview session started");
    }
  }, [questions, isConnecting, interviewStarted, isConnected]);

  // Effect to handle question transitions
  useEffect(() => {
    if (interviewStarted && currentQuestion) {
      setIsWaitingForAnswer(true);
    }
  }, [currentQuestionIndex, interviewStarted, currentQuestion]);

  // Video/audio control functions
  const toggleMute = (): void => {
    setIsMuted(!isMuted);
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
    setInterviewStarted(false);
  };

  const startInterview = (): void => {
    if (!isLoadingQuestions && questions?.questions?.length) {
      setInterviewStarted(true);
      setCurrentQuestionIndex(0);
      setIsWaitingForAnswer(true);
    }
  };

  const stopInterview = (): void => {
    setInterviewStarted(false);
    setCurrentQuestionIndex(0);
    setIsWaitingForAnswer(false);
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
        <Button variant="outlined" onClick={onBackToSetup} startIcon={<ArrowBackIcon />} sx={{ ml: 2 }}>
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
            isMuted={isMuted}
            isVideoOn={isVideoOn}
            isScreenSharing={isScreenSharing}
            isChatOpen={isChatOpen}
            isConnecting={false}
            isConnected={true}
            participantName={interviewers.name}
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
                onClick={startInterview}
                disabled={isLoadingQuestions || !questions?.questions?.length}
                startIcon={<PlayArrowIcon />}
                sx={{ mt: 2 }}
              >
                {isLoadingQuestions ? "Loading Questions..." : "Start Interview"}
              </Button>
            ) : (
              <Button 
                variant="outlined" 
                color="error" 
                size="large" 
                onClick={stopInterview} 
                startIcon={<StopIcon />} 
                sx={{ mt: 2 }}
              >
                Stop Interview
              </Button>
            )}
          </Box>
        </Grid>

        {/* Interview progress section */}
        <Grid size={{ xs: 12, md: 3 }}>
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

                    {/* Loading indicator while scoring */}
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
        </Grid>
      </Grid>
    </Box>
  );
}