import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import { useDeleteResume, useExtractResume, useGetResume } from "@/services/appServices";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Card from "@mui/material/Card";

interface FileUploadProps {
  resumeId?: number;
  setResumeId: (id: number | undefined) => void;
  selectedFile?: File;
  setSelectedFile: (file: File | undefined) => void;
}

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

const UploadArea = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: "center",
  cursor: "pointer",
  backgroundColor: "white",
  transition: "border-color 0.2s ease-in-out",
  "&:hover": {
    borderColor: theme.palette.primary.main
  }
}));

const FileUpload: React.FC<FileUploadProps> = ({ resumeId, setResumeId, selectedFile, setSelectedFile }) => {
  const [dragActive, setDragActive] = useState(false);
  const [useResume, setUseResume] = useState(true);
  const { data: existingResume, isLoading: resumeLoading } = useGetResume();
  const { mutate: deleteResume, isPending: deletePending, ConfirmDialog } = useDeleteResume();
  const { mutate: extractResume, isPending: extractPending } = useExtractResume();

  // Set resume ID from existing resume if available
  useEffect(() => {
    if (existingResume && useResume) {
      setResumeId(existingResume.id);
    } else if (!useResume) {
      setResumeId(undefined);
    }
  }, [existingResume, useResume]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      extractResume(
        { file, filename: file.name },
        {
          onSuccess: () => {
            setSelectedFile(file);
            if (!useResume) {
              setResumeId(undefined);
            }
          },
          onError: () => {
            alert("Failed to upload the PDF file");
            setSelectedFile(undefined);
          }
        }
      );
    } else if (file) {
      alert("Please upload a PDF file");
      setSelectedFile(undefined);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(undefined);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        extractResume(
          { file, filename: file.name },
          {
            onSuccess: () => {
              setSelectedFile(file);
              if (!useResume) {
                setResumeId(undefined);
              }
            },
            onError: () => {
              alert("Failed to upload the PDF file");
            }
          }
        );
      } else {
        alert("Please upload a PDF file");
      }
    }
  };

  const handleDeleteResume = async () => {
    try {
      if (existingResume?.id) {
        deleteResume(existingResume.id, {
          onSuccess: () => {
            setResumeId(undefined);
            setSelectedFile(undefined);
          }
        });
      }
    } catch (error) {
      console.error("Failed to delete resume:", error);
    }
  };

  const handleToggleUseResume = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setUseResume(checked);
  };

  const isPending = extractPending || deletePending || resumeLoading;

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="subtitle2" component="label">Resume (Optional)</Typography>
        {(selectedFile || existingResume) && (
          <FormControlLabel
            control={<Switch checked={useResume} onChange={handleToggleUseResume} disabled={isPending} />}
            label={<Typography variant="caption">Use for interview</Typography>}
            labelPlacement="start"
            sx={{ ml: 0 }}
          />
        )}
      </Stack>

      {existingResume && !selectedFile ? (
        <Card variant="outlined" sx={{ p: 2, borderRadius: 1, mb: 2, opacity: !useResume || isPending ? 0.5 : 1 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <PictureAsPdfIcon color="error" />
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" noWrap>
                  {existingResume.filename}
                </Typography>
                <Chip size="small" label="Saved resume" color="primary" />
              </Stack>
            </Box>
            <IconButton
              size="small"
              onClick={handleDeleteResume}
              aria-label="delete resume"
              disabled={!useResume || isPending}
              title="Delete resume completely"
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>

          {ConfirmDialog}
        </Card>
      ) : !selectedFile && !existingResume ? (
        <UploadArea
          sx={{
            borderColor: dragActive ? "primary.main" : "divider",
            mb: 2
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <UploadFileIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="body1" gutterBottom>
            {dragActive ? "Drop the PDF here" : "Drag & drop a PDF file here"}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            or
          </Typography>
          <Button component="label" variant="outlined" startIcon={<UploadFileIcon />} size="small" sx={{ mt: 1 }}>
            Choose PDF
            <VisuallyHiddenInput type="file" accept=".pdf" onChange={handleFileChange} />
          </Button>
        </UploadArea>
      ) : selectedFile ? (
        <Card variant="outlined" sx={{ p: 2, borderRadius: 1, mb: 2, opacity: isPending || !useResume ? 0.5 : 1 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <PictureAsPdfIcon color="error" />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" noWrap>
                {selectedFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleRemoveFile} aria-label="remove file" disabled={isPending || !useResume} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Card>
      ) : null}

      {isPending && (
        <Box sx={{ width: "100%", mt: 1 }}>
          <LinearProgress />
          {extractPending && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, textAlign: "center" }}>
              AI interviewer is reading your resume...
            </Typography>
          )}
          {resumeLoading && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, textAlign: "center" }}>
              Loading your saved resume...
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
