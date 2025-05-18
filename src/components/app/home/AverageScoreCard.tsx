"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import BoltIcon from "@mui/icons-material/Bolt";
import { useTheme } from "@mui/material/styles";
import { Stack, Box, LinearProgress } from "@mui/material";
import { TrendType } from "./types";

interface AverageScoreCardProps {
  score: number;
  interval: string;
  trend: TrendType;
}

export function AverageScoreCard({ score, interval, trend }: AverageScoreCardProps) {
  const theme = useTheme();
  
  // Get color based on trend
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return theme.palette.success.main;
      case "down":
        return theme.palette.error.main;
      default:
        return theme.palette.warning.main;
    }
  };

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
            {score}%
          </Typography>
          
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(score, 100)} 
              sx={{ 
                height: 15, 
                borderRadius: 5,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                  backgroundColor: getTrendColor(),
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