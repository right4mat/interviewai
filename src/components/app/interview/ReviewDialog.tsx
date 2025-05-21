import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { brand } from "@/theme/themePrimitives";
import { useReviewInterview } from "@/services/appServices";
import { Interviewer, QuestionAnswer } from "@/types/interview";
import { Gauge } from "@mui/x-charts/Gauge";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

const getJobProbabilityMessage = (probability: number): { message: string; color: string } => {
  if (probability < 0.2) {
    return { message: "You likely didn't get the job. Keep practicing! \u{1F62D}", color: "error.main" };
  } else if (probability < 0.4) {
    return { message: "Your chances are low, but don't give up! \u{1F622}", color: "error.main" };
  } else if (probability < 0.6) {
    return { message: "It could go either way - good effort! \u{1F615}", color: "warning.main" };
  } else if (probability < 0.8) {
    return { message: "You have a good chance of getting the job! \u{1F642}", color: "success.main" };
  } else {
    return { message: "Excellent job! You're very likely to get an offer! \u{1F603}", color: "success.main" };
  }
};

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  questionAnswers: QuestionAnswer[];
  jobDescriptionId: number;
  interviewers: Interviewer;
  resumeId?: number;
  type: string;
  difficulty: string;
  company: string;
  isSaving?: boolean;
}

export default function ReviewDialog({
  open,
  onClose,
  questionAnswers,
  jobDescriptionId,
  interviewers,
  resumeId,
  type,
  difficulty,
  company,
  isSaving
}: ReviewDialogProps) {
  const { data, isLoading, error } = useReviewInterview({
    company: company,
    jobDescriptionId: jobDescriptionId,
    interviewers: interviewers,
    resumeId: resumeId,
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
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 12 }}>
              <Box width="100%">
                <Card variant="outlined" sx={{  p: 2, textAlign: 'center' }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: getJobProbabilityMessage(data?.gotJobProb || 0).color,
                      fontWeight: 'bold'
                    }}
                  >
                    {getJobProbabilityMessage(data?.gotJobProb || 0).message}
                  </Typography>
                </Card>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 12 }}>
                  <Card variant="outlined" sx={{ height: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <Gauge
                      value={data?.totalScore ? (data.totalScore / 1200) * 100 : 0}
                      text={({ value }) => `${value?.toFixed(0)}%`}
                      sx={{
                        "& .MuiGauge-valueText": {
                          fontSize: "2rem",
                          fill: getScoreColor(score)
                        },
                        "& .MuiGauge-track, & .MuiGauge-progress": {
                          strokeLinecap: "round"
                        }
                      }}
                    />
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                  <Card variant="outlined" sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="h6" gutterBottom>
                      Scores
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Total Score: {data?.totalScore || 0} points
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Average Score: {score}%
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
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
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
