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
import { Gauge } from "@mui/x-charts/Gauge";
import Grid from "@mui/material/Grid";

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

  const score = Math.round(data?.averageScore || 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h4" component="div" align="center" gutterBottom>
          Interview Review
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }} component="div" container>
            <Grid size={{ xs: 12, md: 12 }}>
              <Box sx={{ height: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Gauge
                  value={data?.totalScore ? (data.totalScore / 1200) * 100 : 0}
                  text={({ value }) => `${value?.toFixed(0)}%`}
                  sx={{
                    "& .MuiGauge-valueText": {
                      fontSize: "2rem",
                      fill: getScoreColor(score)
                    }
                  }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="h6" gutterBottom>
                  Scores
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Total Score: {data?.totalScore || 0} points
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Average Score: {score}%
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
              {data?.review && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Overall Review
                  </Typography>
                  <Box sx={{ overflowY: "scroll", }}>
                    <Typography variant="body1">{data.review}</Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
