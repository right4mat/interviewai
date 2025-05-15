"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";

export function UploadResumeCard() {
  return (
    <Card sx={{ p: 3, height: "100%" }} variant="outlined">
      <Typography variant="h6" gutterBottom>
        Upload Resume
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Add your resume to get more personalized interview questions
      </Typography>
      <Button variant="contained" color="primary">
        Upload Resume
      </Button>
    </Card>
  );
} 