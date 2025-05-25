"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { Grid, Card, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useInterviewList } from "@/services/appServices";
import { StartPracticeCard } from "@/components/app/home/StartPracticeCard";
import { AverageScoreCard } from "@/components/app/home/AverageScoreCard";
import { InterviewList } from "@/components/app/home/InterviewList";
import { UploadResumeCard } from "@/components/app/home/UploadResumeCard";
import Leaderboard from "@/components/app/home/Leaderboard";
import type { InterviewListResponse } from "@/components/app/home/types";


export default function Home(): React.ReactElement {
  const { data: interviews = [], isLoading, refetch } = useInterviewList();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" }, pt: {xs: 4, md: 0} }}>
      {/* Stats Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <UploadResumeCard />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <AverageScoreCard 
            interval="All time" 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StartPracticeCard isSmallScreen={isSmallScreen} />
        </Grid>
      </Grid>

      {/* Interview List */}
      <InterviewList interviews={interviews as InterviewListResponse[]} isLoading={isLoading} />

      {/* Leaderboard */}
      {/* <Box sx={{ mt: 4 }}>
        <Leaderboard />
      </Box> */}
    </Box>
  );
}
