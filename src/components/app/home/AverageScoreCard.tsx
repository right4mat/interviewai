"use client";
import * as React from "react";
import { Card, CardContent, Typography, Stack, Box, LinearProgress, CircularProgress } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import { useTheme } from "@mui/material/styles";
import { TrendType } from "./types";
import { useAverageScore } from "@/services/appServices";

interface AverageScoreCardProps {
  interval: string;
  trend: TrendType;
}

export function AverageScoreCard({ interval, trend }: AverageScoreCardProps) {
  const theme = useTheme();
  const { data: score, isLoading, error } = useAverageScore();

  // Get color based on percentage score
  const getTrendColor = () => {
    const percentage = score ? (score / 1200) * 100 : 0;
    if (percentage >= 80) {
      return theme.palette.success.main;
    } else if (percentage >= 60) {
      return theme.palette.warning.main;
    } else {
      return theme.palette.error.main;
    }
  };

  if (isLoading) {
    return (
      <Card sx={{ height: "100%" }} variant="outlined">
        <CardContent>
          <Stack direction="column" alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
            <CircularProgress />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ height: "100%" }} variant="outlined">
        <CardContent>
          <Typography color="error">Failed to load average score</Typography>
        </CardContent>
      </Card>
    );
  }

  const displayScore = score ? (score / 1200) * 100 : 0;

  return (
    <Card sx={{ height: "100%" }} variant="outlined">
      <CardContent>
        <Stack direction="column" alignItems="flex-start" justifyContent="space-between" sx={{ height: "100%" }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <BoltIcon sx={{ color: theme.palette.primary.main, mb: 1 }} />
            <Typography component="h6" variant="h6" gutterBottom sx={{ fontWeight: "600" }}>
              Average Score
            </Typography>
          </Stack>
          <Typography sx={{ color: "text.secondary", mb: 1 }}>Your overall performance</Typography>
          <Typography
            variant="h3"
            component="div"
            sx={{
              fontWeight: "bold",
              color: getTrendColor(),
              mt: 1
            }}
          >
            {displayScore.toFixed(1)}%
          </Typography>

          <Box sx={{ width: "100%", mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(displayScore, 100)}
              sx={{
                height: 15,
                borderRadius: 5,
                backgroundColor: theme.palette.grey[200],
                "& .MuiLinearProgress-bar": {
                  borderRadius: 5,
                  backgroundColor: getTrendColor()
                }
              }}
            />
          </Box>

          <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
            {interval}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
