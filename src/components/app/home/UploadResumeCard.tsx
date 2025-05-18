"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Box, LinearProgress, Paper, Stack } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { convertPdfToImageArray } from "@/utils/util";
import { useState, useEffect } from "react";
import { useGetResume, useExtractResume, useDeleteResume } from "@/services/appServices";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1
});

export function UploadResumeCard() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [existingFilename, setExistingFilename] = useState<string | undefined>(undefined);
  const [resumeId, setResumeId] = useState<number | undefined>(undefined);

  // Fetch existing resume if available
  const { data: resumeData, isLoading: isLoadingResume, refetch: refetchResume } = useGetResume();

  // Use the mutation hook for resume extraction
  const { mutate: extractResume, isPending: isExtracting } = useExtractResume();

  // Use the mutation hook for resume deletion
  const { mutate: deleteResume, isPending: isDeleting, ConfirmDialog } = useDeleteResume();

  useEffect(() => {
    if (resumeData) {
      setExistingFilename(resumeData.filename);
      setResumeId(resumeData.id);
    }
  }, [resumeData]);

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

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      handleFileUpload(file);
    } else if (file) {
      alert("Please upload a PDF file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      handleFileUpload(file);
    } else if (file) {
      alert("Please upload a PDF file");
    }
  };

  const handleRemoveFile = () => {
    // Use the confirmation mutation to delete the resume
    deleteResume(undefined);
  };

  const handleFileUpload = (file: File) => {
    setSelectedFile(file);
    
    // Use the useExtractResume mutation with file and filename
    extractResume(
      {
        file,
        filename: file.name
      },
      {
        onSuccess: (data) => {
          setResumeId(data.resumeId);
          setExistingFilename(file.name);
          console.log("Resume uploaded successfully:", data);
        },
        onError: (error) => {
          console.error("Error uploading resume:", error);
          setSelectedFile(undefined);
          alert("Failed to upload resume. Please try again.");
        }
      }
    );
  };

  if (selectedFile || existingFilename) {
    return (
      <Card
        sx={{
          p: 3,
          height: "100%"
        }}
        variant="outlined"
      >
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
          <UploadIcon sx={{ mr: 0.5, color: "primary.main" }} />
          Resume
        </Typography>

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 1, mb: 2, opacity: isExtracting || isDeleting ? 0.5 : 1 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <PictureAsPdfIcon color="error" />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" noWrap>
                {selectedFile ? selectedFile.name : existingFilename}
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleRemoveFile} aria-label="remove file" disabled={isExtracting || isDeleting}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Paper>

        {isExtracting && (
          <Box sx={{ width: "100%", mt: 1 }}>
            <LinearProgress />
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, textAlign: "center" }}>
              AI interviewer is reading your resume...
            </Typography>
          </Box>
        )}

        {isDeleting && (
          <Box sx={{ width: "100%", mt: 1 }}>
            <LinearProgress />
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, textAlign: "center" }}>
              Deleting resume...
            </Typography>
          </Box>
        )}
        {ConfirmDialog}
      </Card>
    );
  }

  if (isLoadingResume) {
    return (
      <Card
        sx={{
          p: 3,
          height: "100%"
        }}
        variant="outlined"
      >
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
          <UploadIcon sx={{ mr: 0.5, color: "primary.main" }} />
          Loading Resume...
        </Typography>
        <LinearProgress />
      </Card>
    );
  }

  return (
    <Card
      sx={{
        p: 3,
        height: "100%",
        border: "2px dashed",
        borderColor: isDragging ? "primary.main" : "divider",
        transition: "border-color 0.3s"
      }}
      variant="outlined"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
        <UploadIcon sx={{ mr: 0.5, color: "primary.main" }} />
        Upload Resume
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Add your resume to get more personalized interview questions
      </Typography>

      <Button component="label" variant="contained" color="primary" startIcon={<UploadIcon />}>
        Upload Resume
        <VisuallyHiddenInput type="file" accept=".pdf" onChange={handleFileChange} />
      </Button>
    </Card>
  );
}
