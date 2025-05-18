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
import { useLoadInterview, useDeleteInterview } from "@/services/appServices";
import { useInterviewStore } from "@/stores/interviewStore";
// Confirmation dialog imports
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";

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

// Reusable score progress component
interface ScoreProgressProps {
  score: number;
  size?: number;
  thickness?: number;
}

function ScoreProgress({ score, size = 50, thickness = 8 }: ScoreProgressProps) {
  // Determine color based on score
  const getScoreColor = (value: number) => {
    if (value >= 70) return 'success.main';
    if (value >= 50) return 'warning.main';
    return 'error.main';
  };
  
  return (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress
        variant="determinate"
        value={score}
        size={size}
        thickness={thickness}
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
          {`${score}`}
        </Typography>
      </Box>
    </Box>
  );
}

// Reusable questions progress component
interface QuestionsProgressProps {
  answered: number;
  total?: number;
  height?: number;
  color?: string;
}

function QuestionsProgress({ answered, total = 10, height = 20, color = brand[500] }: QuestionsProgressProps) {
  const progressPercent = Math.round((answered / total) * 100);
  
  return (
    <Box sx={{ width: '100%', height: '100%', mr: 1, display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1, position: 'relative' }}>
        <LinearProgress 
          variant="determinate" 
          value={progressPercent}
          sx={{
            height: height,
            borderRadius: height / 2,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: height / 2,
              backgroundColor: color,
            },
          }}
        />
        
      </Box>
      <Box sx={{ minWidth: 60 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 'bold',
            color: 'text.primary',
          }}
        >
          {`${progressPercent}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export default function AttemptsDialog({ 
  open, 
  onClose, 
  interviewId
}: AttemptsDialogProps) {
  const router = useRouter();
  const loadInterview = useLoadInterview();
  const deleteInterview = useDeleteInterview();
  const { updateInterviewState } = useInterviewStore();
  const [attempts, setAttempts] = React.useState<AttemptData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [attemptToDelete, setAttemptToDelete] = React.useState<string | null>(null);

  // Load attempts data when dialog opens and interviewId changes
  React.useEffect(() => {
    if (open && interviewId) {
      loadAttempts(interviewId);
    }
  }, [open, interviewId]);

  const loadAttempts = (id: number) => {
    setLoading(true);
    // In a real app, you would fetch the attempts from an API here
    // For now, we'll use mock data based on the interview ID
    const mockAttempts: AttemptData[] = [
      {
        id: `${id}-1`,
        date: moment().subtract(2, 'days').format('MMM DD, YYYY'),
        score: 78,
        questions: 8,
        totalQuestions: 10,
        status: 'Completed'
      },
      {
        id: `${id}-2`,
        date: moment().subtract(7, 'days').format('MMM DD, YYYY'),
        score: 65,
        questions: 7,
        totalQuestions: 10,
        status: 'Completed'
      },
      {
        id: `${id}-3`,
        date: moment().subtract(14, 'days').format('MMM DD, YYYY'),
        score: 45,
        questions: 4,
        totalQuestions: 10,
        status: 'In Progress'
      }
    ];
    
    // Simulate API delay
    setTimeout(() => {
      setAttempts(mockAttempts);
      setLoading(false);
    }, 500);
  };

  const handleViewAttempt = async (attemptId: string) => {
    // Here you would navigate to the attempt details page
    console.log("View attempt details:", attemptId);
  };

  const handleContinueAttempt = async (attemptId: string) => {
    if (!interviewId) return;
    
    try {
      setLoading(true);
      const loadedInterview = await loadInterview.mutateAsync({ interviewId });

      // Update the interview store with the loaded interview data
      const newState = {
        questions: loadedInterview.questions,
        company: loadedInterview.company,
        jobDescription: loadedInterview.jobDescription,
        interviewer: loadedInterview.interviewer,
        settings: {
          type: loadedInterview.settings.type as "technical" | "behavioral" | "mixed",
          difficulty: loadedInterview.settings.difficulty as "beginner" | "intermediate" | "advanced"
        },
        resumeId: loadedInterview?.resumeId,
        currentQuestionIndex: 0,
        questionAnswers: [],
        stage: "interview" as "interview" | "setup",
        interviewStarted: false
      };

      updateInterviewState(newState);
      onClose(); // Close the dialog first
      router.push("/app/interview");
    } catch (error) {
      console.error("Failed to load interview:", error);
      // TODO: Add error handling UI feedback
    } finally {
      setLoading(false);
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
    setLoading(true);
    
    // In a real app, you would call an API to delete the attempt
    console.log("Deleting attempt:", attemptToDelete);
    
    // Simulate API call and update the UI
    setTimeout(() => {
      setAttempts(prev => prev.filter(attempt => attempt.id !== attemptToDelete));
      setAttemptToDelete(null);
      setLoading(false);
    }, 500);
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
              sx={{ fontWeight: 'bold' }}
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
              onClick={() => handleContinueAttempt(attemptId)}
              actions={[
                {
                  label: "Delete Attempt",
                  icon: <DeleteIcon />,
                  onClick: () => openDeleteConfirm(attemptId),
                  color: "error"
                }
              ]}
              sx={{ fontWeight: 'bold' }}
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
            loading={loading}
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