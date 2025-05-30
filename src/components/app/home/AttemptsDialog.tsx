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
import { type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
// Import icons for status chips
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
// Import icons and components for actions
import VisibilityIcon from "@mui/icons-material/Visibility";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ActionButton from "@/components/shared/ActionButton";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useLoadInterview, useDeleteInterview, useInterviewAttempts, useLoadAttempt, useDeleteAttempt } from "@/services/appServices";
import { useInterviewStore } from "@/stores/interviewStore";
// Import shared progress components
import ScoreProgress from "@/components/app/shared/ScoreProgress";
import QuestionsProgress from "@/components/app/shared/QuestionsProgress";
// Confirmation dialog imports
import type { QuestionAnswer } from "@/types/interview";
import type { TransitionProps } from "@mui/material/transitions";
import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import AttemptDetailsView from "./AttemptDetailsView";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { SmallScreenActionButton } from "@/components/shared/ActionButton";

// Transition for fullscreen dialog
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Interface for interview attempt data
export interface AttemptData {
  id: string | number;
  date: string;
  score: number;
  questions: number;
  status: string;
  totalQuestions?: number; // Optional, will default to 10 if not provided
  questionAnswers: QuestionAnswer[];
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2)
  },
  "& .MuiDialogTitle-root": {
    padding: theme.spacing(2)
  }
}));

interface AttemptsDialogProps {
  open: boolean;
  onClose: () => void;
  interviewId: number | null;
}

export default function AttemptsDialog({ open, onClose, interviewId }: AttemptsDialogProps) {
  const router = useRouter();
  const loadInterview = useLoadInterview();
  const loadAttempt = useLoadAttempt();
  const { loadInterview: loadInterviewState } = useInterviewStore();
  const [viewingAttempt, setViewingAttempt] = React.useState<AttemptData | null>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Use the useInterviewAttempts hook with proper null handling
  const { data: interviewAttempts, isLoading } = useInterviewAttempts(interviewId);

  const { mutate: deleteAttempt, ConfirmDialog, isPending: isDeleteAttemptPending } = useDeleteAttempt();

  // Use useMemo to transform the data from the hook to match our component format
  const attempts = React.useMemo(() => {
    if (interviewAttempts) {
      return interviewAttempts.map((attempt) => ({
        id: attempt.id,
        date: moment(attempt.created_at).format("MMM DD, YYYY"),
        score: attempt.score,
        questions: attempt.question_answers.length,
        totalQuestions: attempt.questions.length,
        questionAnswers: attempt.question_answers,
        status: attempt.question_answers.length >= attempt.questions.length ? "Completed" : "In Progress"
      }));
    }
    return [];
  }, [interviewAttempts]);

  const handleViewAttempt = async (attemptId: string) => {
    const attempt = attempts.find((a) => a.id.toString() === attemptId.toString());
    if (attempt) {
      setViewingAttempt(attempt);
      setIsFullscreen(true);
    }
  };

  const handleBackToList = () => {
    setIsFullscreen(false);
    // Wait for transition to complete before resetting attempt data
    setTimeout(() => {
      setViewingAttempt(null);
    }, 300);
  };

  const handleContinueAttempt = async (questionAnswers: QuestionAnswer[], attemptId: string) => {
    if (!interviewId) return;

    try {
      const loadedAttempt = await loadAttempt.mutateAsync({ attemptId: Number(attemptId) });

      // Use the new store method to load the interview state
      loadInterviewState(loadedAttempt);

      onClose(); // Close the dialog first
      router.push("/app/interview");
    } catch (error) {
      console.error("Failed to load attempt:", error);
      // TODO: Add error handling UI feedback
    }
  };

  // Define columns for the data grid
  const columns: GridColDef[] = React.useMemo(() => {
    const baseColumns = [
      {
        field: "date",
        headerName: "Attempt Date",
        flex: 1,
        minWidth: 150
      },
      {
        field: "status",
        headerName: "Status",
        flex: 0.8,
        minWidth: 120,
        renderCell: (params: GridRenderCellParams<AttemptData>) => {
          const status = params.value as string;
          const color = status === "Completed" ? "success" : status === "In Progress" ? "info" : "default";

          // Select icon based on status
          const getStatusIcon = (status: string) => {
            switch (status) {
              case "Completed":
                return <CheckCircleIcon fontSize="small" />;
              case "In Progress":
                return <HourglassEmptyIcon fontSize="small" />;
              case "Incomplete":
                return <CancelIcon fontSize="small" />;
              default:
                return <PendingIcon fontSize="small" />;
            }
          };

          return <Chip icon={getStatusIcon(status)} label={status} color={color} size="medium" sx={{ fontWeight: "medium" }} />;
        }
      }
    ];

    if (!isSmallScreen) {
      baseColumns.push(
        {
          field: "score",
          headerName: "Score",
          flex: 1,
          minWidth: 120,
          renderCell: (params) => {
            const score = params.value as number;

            return (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", height: "100%" }}>
                <ScoreProgress score={Number(((score / 1200) * 100).toFixed(0))} />
              </Box>
            );
          }
        },
        {
          field: "questions",
          headerName: "Questions",
          flex: 1,
          minWidth: 150,
          renderCell: (params) => {
            const answered = params.value as number;
            const total = (params.row as AttemptData).totalQuestions || 10;

            return <QuestionsProgress answered={answered} total={total} />;
          }
        }
      );
    }

    baseColumns.push({
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: isSmallScreen ? 100 : 180,
      renderCell: (params: GridRenderCellParams<AttemptData>) => {
        const status = params.row.status;
        const attemptId = params.row.id;
        const questionAnswers = params.row.questionAnswers;

        const actions = [
          {
            label: "View Attempt Details",
            icon: <VisibilityIcon />,
            onClick: () => handleViewAttempt(attemptId.toString()),
            color: "primary" as const
          },
          {
            label: "Delete Attempt",
            icon: <DeleteIcon />,
            onClick: () => deleteAttempt({ attemptId: Number(attemptId) }),
            color: "error" as const
          }
        ];

        if (status !== "Completed") {
          actions.unshift({
            label: "Continue",
            icon: <PlayArrowIcon />,
            onClick: () => handleContinueAttempt(questionAnswers, attemptId.toString()),
            color: "primary" as const
          });
        }

        if (isSmallScreen) {
          return <SmallScreenActionButton actions={actions} />;
        }

        return (
          <ActionButton
            label={status === "Completed" ? "View" : "Continue"}
            variant="contained"
            color="primary"
            size="medium"
            startIcon={status === "Completed" ? <VisibilityIcon /> : <PlayArrowIcon />}
            onClick={status === "Completed" ? () => handleViewAttempt(attemptId.toString()) : () => handleContinueAttempt(questionAnswers, attemptId.toString())}
            actions={actions.filter((_, index) => index !== 0)}
          />
        );
      }
    });

    return baseColumns;
  }, [isSmallScreen]);

  return (
    <>
      <BootstrapDialog
        onClose={!isFullscreen ? onClose : undefined}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth={isSmallScreen || isFullscreen ? "xl" : "md"}
        fullWidth
        fullScreen={isFullscreen || isSmallScreen}
        TransitionComponent={isFullscreen ? Transition : undefined}
      >
        <DialogTitle id="customized-dialog-title">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isFullscreen && (
              <IconButton onClick={handleBackToList} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
            )}
            {!isFullscreen ? (
              <>
                <HistoryIcon color="primary" />
                <Typography variant="h6" component="span">
                  Interview Attempts History
                </Typography>
              </>
            ) : (
              <Typography variant="h6" component="span">
                Attempt Details
              </Typography>
            )}
          </Box>
          <IconButton
            aria-label="close"
            onClick={isFullscreen ? handleBackToList : onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            height: isFullscreen ? "calc(100vh - 100px)" : 400,
            p: isFullscreen ? 3 : 2
          }}
        >
          {!isFullscreen ? (
            <CustomizedDataGrid
              loading={isLoading || loadInterview.isPending || isDeleteAttemptPending}
              rows={attempts}
              columns={columns}
              pageSize={5}
              checkboxSelection={false}
              disableColumnResize={false}
              density="comfortable"
              getRowId={(row) => row.id}
            />
          ) : (
            <AttemptDetailsView viewingAttempt={viewingAttempt} />
          )}
        </DialogContent>
        {ConfirmDialog}
      </BootstrapDialog>
    </>
  );
}
