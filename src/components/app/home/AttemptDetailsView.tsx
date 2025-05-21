"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ScoreProgress from "@/components/app/shared/ScoreProgress";
import { AttemptData } from "./AttemptsDialog";

interface AttemptDetailsViewProps {
  viewingAttempt: AttemptData | null;
}

export default function AttemptDetailsView({ viewingAttempt }: AttemptDetailsViewProps) {
  if (!viewingAttempt) return null;
  
  return (
    <Fade in={!!viewingAttempt}>
      <Box sx={{ height: '100%', overflow: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Attempt from {viewingAttempt.date}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip 
              icon={viewingAttempt.status === 'Completed' ? <CheckCircleIcon /> : <HourglassEmptyIcon />}
              label={viewingAttempt.status} 
              color={viewingAttempt.status === 'Completed' ? 'success' : 'info'}
              sx={{ fontWeight: 'medium' }}
            />
            <ScoreProgress score={viewingAttempt.score} showLabel />
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
          Question Responses ({viewingAttempt.questions}/{viewingAttempt.totalQuestions || 10})
        </Typography>
        
        {viewingAttempt.questionAnswers.map((qa, index) => (
          <Card key={index} sx={{ mb: 3, boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Question {index + 1}
                </Typography>
                <Chip 
                  label={`Score: ${qa.score}/10`}
                  color={qa.score >= 8 ? 'success' : qa.score >= 5 ? 'warning' : 'error'}
                  size="small"
                />
              </Box>
              
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 'medium' }}>
                {qa.question}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Your Answer:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                {qa.answer}
              </Typography>
              
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Feedback:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                {qa.reasoning}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Model Answer:
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {qa.modelAnswer}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Fade>
  );
} 