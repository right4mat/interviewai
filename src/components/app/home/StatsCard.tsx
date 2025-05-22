"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { type StatCardProps } from "./types";

export function StatsCard({ title, value, interval, trend, color }: StatCardProps) {
  // Calculate the progress value from the data
  // Assuming value is in format like "75%"
  const progressValue = parseInt(value, 10) || 0;

  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle1" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="p" gutterBottom>
          {value}
        </Typography>
        <Box sx={{ width: "100%", mt: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 6,
                backgroundColor: color,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
} 