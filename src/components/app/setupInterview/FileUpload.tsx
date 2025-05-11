import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';

interface FileUploadProps {
  isPending: boolean;
  onFileSelect: (file: File | undefined) => void;
  selectedFile?: File;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UploadArea = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.01)' : 'rgba(255, 255, 255, 0.01)',
  transition: 'border-color 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile, isPending }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setIsUploading(true);
      // Simulate upload progress
      setTimeout(() => {
        onFileSelect(file);
        setIsUploading(false);
      }, 1000);
    } else if (file) {
      alert('Please upload a PDF file');
      onFileSelect(undefined);
    }
  };

  const handleRemoveFile = () => {
    onFileSelect(undefined);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setIsUploading(true);
        // Simulate upload progress
        setTimeout(() => {
          onFileSelect(file);
          setIsUploading(false);
        }, 1000);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" component="label" sx={{ display: 'block', mb: 1 }}>
        Upload PDF (Optional)
      </Typography>
      
      {!selectedFile ? (
        <UploadArea
          sx={{
            borderColor: dragActive ? 'primary.main' : 'divider',
            mb: 2
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <UploadFileIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="body1" gutterBottom>
            {dragActive ? 'Drop the PDF here' : 'Drag & drop a PDF file here'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            or
          </Typography>
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFileIcon />}
            size="small"
            sx={{ mt: 1 }}
          >
            Choose PDF
            <VisuallyHiddenInput 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange} 
            />
          </Button>
        </UploadArea>
      ) : (
        <Paper
          variant="outlined"
          sx={{ p: 2, borderRadius: 1, mb: 2 , opacity: isPending ? 0.5 : 1}}
        >
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
            <IconButton 
              size="small" 
              onClick={handleRemoveFile}
              aria-label="remove file"
              disabled={isPending}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Paper>
      )}
      
      {(isUploading || isPending) && (
        <Box sx={{ width: '100%', mt: 1 }}>
          <LinearProgress />
          {isPending && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
              AI interviewer is reading your resume...
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;