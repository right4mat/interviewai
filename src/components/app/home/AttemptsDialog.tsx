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
// Import icons for status chips
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
// Import icons and components for actions
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import ActionButton from "@/components/shared/ActionButton";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useLoadInterview, useDeleteInterview, useInterviewAttempts } from "@/services/appServices";
import { useInterviewStore } from "@/stores/interviewStore";
// Import shared progress components
import ScoreProgress from "@/components/app/shared/ScoreProgress";
import QuestionsProgress from "@/components/app/shared/QuestionsProgress";
// Confirmation dialog imports
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import { QuestionAnswer } from "@/types/interview";

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
  interviewId: number | null;
}

export default function AttemptsDialog({ 
  open, 
  onClose, 
  interviewId
}: AttemptsDialogProps) {
  const router = useRouter();
  const loadInterview = useLoadInterview();
  const deleteInterview = useDeleteInterview();
  const { updateInterviewState, loadInterview: loadInterviewState } = useInterviewStore();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [attemptToDelete, setAttemptToDelete] = React.useState<string | null>(null);
  
  // Use the useInterviewAttempts hook with proper null handling
  const { data: interviewAttempts, isLoading } = useInterviewAttempts(interviewId ?? 0);

  // Use useMemo to transform the data from the hook to match our component format
  const attempts = React.useMemo(() => {
    if (interviewAttempts) {
      return interviewAttempts.map(attempt => ({
        id: attempt.id,
        date: moment(attempt.created_at).format('MMM DD, YYYY'),
        score: attempt.score,
        questions: attempt.question_answers.length,
        totalQuestions: attempt.questions.length,
        questionAnswers: attempt.question_answers,
        status: attempt.question_answers.length >= attempt.questions.length ? 'Completed' : 'In Progress'
      }));
    }
    return [];
  }, [interviewAttempts]);

  const handleViewAttempt = async (attemptId: string) => {
    // Here you would navigate to the attempt details page
    console.log("View attempt details:", attemptId);
  };

  const handleContinueAttempt = async (questionAnswers: QuestionAnswer[]) => {
    if (!interviewId) return;
    
    try {
      const loadedInterview = await loadInterview.mutateAsync({ interviewId });

      // Use the new store method instead of directly constructing the state
      loadInterviewState({...loadedInterview, questionAnswers: questionAnswers});
      
      onClose(); // Close the dialog first
      router.push("/app/interview");
    } catch (error) {
      console.error("Failed to load interview:", error);
      // TODO: Add error handling UI feedback
    }
  };

  const openDeleteConfirm = (attemptId: string) => {
    setAttemptToDelete(attemptId);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteCancel = () => {
    setConfirmDeleteOpen(false);
    setAttemptToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!attemptToDelete) return;
    
    setConfirmDeleteOpen(false);
    
    // In a real app, you would call an API to delete the attempt
    console.log("Deleting attempt:", attemptToDelete);
    
    // Instead of using setTimeout, you would call an API to delete the attempt
    // and then invalidate the useInterviewAttempts query
    try {
      // Mock deletion for now
      setTimeout(() => {
        setAttemptToDelete(null);
      }, 500);
    } catch (error) {
      console.error("Failed to delete attempt:", error);
    }
  };

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
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', height: '100%' }}>
            <ScoreProgress score={score} />
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
        const total = (params.row as AttemptData).totalQuestions || 10;
        
        return <QuestionsProgress answered={answered} total={total} />;
      }
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => {
        const status = params.value as string;
        const color = status === 'Completed' ? 'success' : 
                      status === 'In Progress' ? 'info' : 'default';
        
        // Select icon based on status
        const getStatusIcon = (status: string) => {
          switch(status) {
            case 'Completed':
              return <CheckCircleIcon fontSize="small" />;
            case 'In Progress':
              return <HourglassEmptyIcon fontSize="small" />;
            case 'Incomplete':
              return <CancelIcon fontSize="small" />;
            default:
              return <PendingIcon fontSize="small" />;
          }
        };
        
        return (
          <Chip 
            icon={getStatusIcon(status)}
            label={status} 
            color={color}
            size="medium"
            sx={{ fontWeight: 'medium' }}
          />
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 180,
      sortable: false,
      renderCell: (params) => {
        const status = params.row.status;
        const attemptId = params.row.id;
        const questionAnswers = params.row.questionAnswers;
        
        if (status === 'Completed') {
          return (
            <ActionButton
              label="View"
              variant="contained"
              color="primary"
              size="medium"
              startIcon={<VisibilityIcon />}
              onClick={() => handleViewAttempt(attemptId)}
              actions={[
                {
                  label: "Delete Attempt",
                  icon: <DeleteIcon />,
                  onClick: () => openDeleteConfirm(attemptId),
                  color: "error"
                }
              ]}
            />
          );
        } else {
          return (
            <ActionButton
              label="Continue"
              variant="contained"
              color="primary"
              size="medium"
              startIcon={<PlayArrowIcon />}
              onClick={() => handleContinueAttempt(questionAnswers)}
              actions={[
                {
                  label: "Delete Attempt",
                  icon: <DeleteIcon />,
                  onClick: () => openDeleteConfirm(attemptId),
                  color: "error"
                }
              ]}
            />
          );
        }
      }
    }
  ];

  return (
    <>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="customized-dialog-title">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon color="primary" />
            <Typography variant="h6" component="span">
              Interview Attempts History
            </Typography>
          </Box>
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
            loading={isLoading || loadInterview.isPending}
            rows={attempts}
            columns={columns}
            pageSize={5}
            checkboxSelection={false}
            disableColumnResize={false}
            density="comfortable"
            getRowId={(row) => row.id}
          />
        </DialogContent>
      </BootstrapDialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Attempt
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this attempt? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 