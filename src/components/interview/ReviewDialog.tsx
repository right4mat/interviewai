import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { brand } from "@/theme/themePrimitives";
import { useReviewInterview } from "@/services/openAI";
import { Interviewer } from "@/types/interview";

interface QuestionAnswer {
  question: string;
  answer: string;
  score?: number;
  reasoning?: string;
  cleanedAnswer?: string;
  modelAnswer?: string;
  questionSummary: string;
}

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  questionAnswers: QuestionAnswer[];
  jobDescription: string;
  interviewers: Interviewer;
  resume: string;
  type: string;
  difficulty: string;

}

export default function ReviewDialog({
  open,
  onClose,
  questionAnswers,
  jobDescription,
  interviewers,
  resume,
  type,
  difficulty
}: ReviewDialogProps) {
  const { data, isLoading, error } = useReviewInterview({
    jobDescription: jobDescription,
    interviewers: interviewers,
    resume: resume,
    questionAnswers: questionAnswers,
    type: type,
    difficulty: difficulty
  });

  const getScoreColor = (score: number) => {
    if (score < 33) return "error.main";
    if (score < 66) return "warning.main";
    return "success.main";
  };

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Typography>Loading review...</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Typography color="error">Error loading review. Please try again.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h4" component="div" align="center" gutterBottom>
          Interview Review
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h2" component="div" sx={{ color: getScoreColor(data?.data?.averageScore || 0), mb: 1 }}>
            {Math.round(data?.data?.averageScore || 0)}%
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {data?.data?.totalScore} points total
          </Typography>
        </Box>

        {data?.data?.review && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Overall Review
            </Typography>
            <Typography variant="body1">
              {data.data.review}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
