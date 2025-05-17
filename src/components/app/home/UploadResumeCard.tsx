"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload"; // Import the upload icon

export function UploadResumeCard() {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop logic here
  };

  return (
    <Card
      sx={{
        p: 3,
        height: "100%",
        border: "2px dashed",
        borderColor: isDragging ? "primary.main" : "divider",
        transition: "border-color 0.3s",
      }}
      variant="outlined"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
        <UploadIcon sx={{ mr: 0.5, color: "primary.main" }} /> {/* Add icon to title */}
        Upload Resume
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Add your resume to get more personalized interview questions
      </Typography>
      <Button variant="contained" color="primary" startIcon={<UploadIcon />}>
        Upload Resume
      </Button>
    </Card>
  );
} 