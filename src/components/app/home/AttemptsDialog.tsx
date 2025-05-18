"use client";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import CustomizedDataGrid from "../../shared/CustomizedDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import { brand } from "@/theme/themePrimitives";

// Interface for interview attempt data
interface AttemptData {
  id: string;
  date: string;
  score: number;
  questions: number;
  status: string;
  totalQuestions?: number; // Optional, will default to 10 if not provided
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogTitle-root': {
    padding: theme.spacing(2),
  },
}));

interface AttemptsDialogProps {
  open: boolean;
  onClose: () => void;
  attempts: AttemptData[];
}

export default function AttemptsDialog({ open, onClose, attempts = [] }: AttemptsDialogProps) {
  // Define columns for the data grid
  const columns: GridColDef[] = [
    { 
      field: 'date', 
      headerName: 'Attempt Date', 
      flex: 1,
      minWidth: 150,
    },
    { 
      field: 'score', 
      headerName: 'Score', 
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const score = params.value as number;
        // Determine color based on score
        const getScoreColor = (value: number) => {
          if (value >= 70) return 'success.main';
          if (value >= 50) return 'warning.main';
          return 'error.main';
        };
        
        return (
          <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', p:2 }}>
            <CircularProgress
              variant="determinate"
              value={score}
              size={40}
              thickness={4}
              sx={{ 
                color: getScoreColor(score),
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="caption"
                component="div"
                fontWeight="bold"
                sx={{ fontSize: '0.9rem' }}
              >
                {`${score}%`}
              </Typography>
            </Box>
          </Box>
        );
      }
    },
    { 
      field: 'questions', 
      headerName: 'Questions', 
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const answered = params.value as number;
        const total = (params.row as AttemptData).totalQuestions || 10; // Default to 10 if not provided
        const progressPercent = Math.round((answered / total) * 100);
        
        return (
          <Box sx={{ width: '100%', mr: 1, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress 

                variant="determinate" 
                value={progressPercent}
                sx={{
                  height: 20,
                  borderRadius: 4,
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: brand[500],
                  },
                }}
              />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">
                {`${answered}/${total}`}
              </Typography>
            </Box>
          </Box>
        );
      }
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => {
        const status = params.value as string;
        const color = status === 'Completed' ? 'success' : 
                     status === 'In Progress' ? 'info' : 'default';
        
        return (
          <Chip 
            label={status} 
            color={color}
            size="medium"
            sx={{ fontWeight: 'medium' }}
          />
        );
      }
    },
  ];

  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="customized-dialog-title">
        Interview Attempts History
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ height: 400 }}>
        <CustomizedDataGrid 
          rows={attempts}
          columns={columns}
          pageSize={5}
          checkboxSelection={false}
          disableColumnResize={false}
          density="standard"
          getRowId={(row) => row.id}
        />
      </DialogContent>
    </BootstrapDialog>
  );
} 