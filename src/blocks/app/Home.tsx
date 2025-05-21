"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { Grid, Card, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useInterviewList } from "@/services/appServices";
import { StatsCard } from "@/components/app/home/StatsCard";
import { StartPracticeCard } from "@/components/app/home/StartPracticeCard";
import { AverageScoreCard } from "@/components/app/home/AverageScoreCard";
import { InterviewList } from "@/components/app/home/InterviewList";
import { TrendType } from "@/components/app/home/types";
import { UploadResumeCard } from "@/components/app/home/UploadResumeCard";
import Leaderboard from "@/components/app/home/Leaderboard";

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", {
    month: "short"
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

export default function Home(): React.ReactElement {
  const { data: interviews = [], isLoading, refetch } = useInterviewList();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const daysInWeek = getDaysInMonth(4, 2024);

  // Calculate statistics
  const totalInterviews = interviews.length;
  const averageScore = Math.round(interviews.reduce((acc, curr) => acc + (curr.avg || 0), 0) / totalInterviews);
  
  // Determine trend based on average score
  const scoreTrend: TrendType = averageScore >= 70 ? "up" : averageScore >= 50 ? "neutral" : "down";

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* Stats Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <UploadResumeCard />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <AverageScoreCard 
            score={averageScore || 0} 
            interval="All time" 
            trend={scoreTrend} 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StartPracticeCard isSmallScreen={isSmallScreen} />
        </Grid>
      </Grid>

      {/* Interview List */}
      <InterviewList interviews={interviews} isLoading={isLoading} />

      {/* Leaderboard */}
      <Box sx={{ mt: 4 }}>
        <Leaderboard />
      </Box>
    </Box>
  );
}
