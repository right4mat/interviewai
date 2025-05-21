import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { brand } from "@/theme/themePrimitives";

interface InterviewControlsProps {
  isLoadingQuestions: boolean;
  interviewStarted: boolean;
  hasQuestions: boolean;
  onStartInterview: () => void;
  onStopInterview: () => void;
  onBackToSetup: () => void;
  onSkipQuestion: () => void;
}

export default function InterviewControls({
  isLoadingQuestions,
  interviewStarted,
  hasQuestions,
  onStartInterview,
  onStopInterview,
  onBackToSetup,
  onSkipQuestion,
}: InterviewControlsProps): React.ReactElement {
  return (
    <Box sx={{ mt: 2, textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
      {isLoadingQuestions ? (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Fetching interview questions...
          </Typography>
          <LinearProgress 
            sx={{ 
              width: '100%', 
              height: 40, 
              borderRadius: 2,
              backgroundColor: brand[100],
              '& .MuiLinearProgress-bar': {
                backgroundColor: brand[500],
                borderRadius: 2,
                transition: 'transform 0.4s linear',
              },
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              border: `1px solid ${brand[200]}`,
            }} 
          />
        </Box>
      ) : (
        <>
          <Button variant="outlined" size="large" onClick={onBackToSetup} startIcon={<ArrowBackIcon />} sx={{ ml: 2 }}>
            Back to Setup
          </Button>
          {!interviewStarted ? (
            <Button
              component="div"
              variant="contained"
              color="primary"
              onClick={onStartInterview}
              disabled={!hasQuestions}
              startIcon={<PlayArrowIcon />}
            >
              Start Interview
            </Button>
          ) : (
            <>
              <Button variant="outlined" color="error" size="large" onClick={onStopInterview} startIcon={<StopIcon />}>
                Stop Interview
              </Button>
              <Button variant="outlined" size="large" onClick={onSkipQuestion} startIcon={<SkipNextIcon />}>
                Skip Question
              </Button>
            </>
          )}
        </>
      )}
    </Box>
  );
} 