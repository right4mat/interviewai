import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { brand } from "@/theme/themePrimitives";

interface InterviewProgressBarProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  isLoadingQuestions: boolean;
}

export default function InterviewProgressBar({
  currentQuestionIndex,
  totalQuestions,
  isLoadingQuestions,
}: InterviewProgressBarProps): React.ReactElement {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Interview Progress
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {currentQuestionIndex} of {totalQuestions} questions
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={isLoadingQuestions ? 0 : (currentQuestionIndex / totalQuestions) * 100}
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
  );
} 