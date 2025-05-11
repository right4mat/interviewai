"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";

interface StartPracticeCardProps {
  isSmallScreen: boolean;
}

export function StartPracticeCard({ isSmallScreen }: StartPracticeCardProps) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <PlayArrowRoundedIcon sx={{ color: theme.palette.primary.main, mb: 1 }} />
        <Typography component="h2" variant="subtitle2" gutterBottom sx={{ fontWeight: "600" }}>
          Start Practicing Now!
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: "8px" }}>
          Practice with our AI interviewer and improve your skills.
        </Typography>
        <Button 
          variant="contained" 
          size="small" 
          startIcon={<AddIcon />} 
          fullWidth={isSmallScreen}
          onClick={() => router.push('/app/interview')}
        >
          Start New Interview
        </Button>
      </CardContent>
    </Card>
  );
} 