"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Replay as ReplayIcon,
  History as HistoryIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  BarChart as BarChartIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  CalendarToday as CalendarTodayIcon,
} from "@mui/icons-material";
import moment from "moment";
import CustomizedDataGrid from "@/components/shared/CustomizedDataGrid";
import ActionButton from "@/components/shared/ActionButton";
import { InterviewListResponse } from "./types";
import { useLoadInterview, useDeleteInterview } from "@/services/appServices";
import { useInterviewStore } from "@/stores/interviewStore";
import { useRouter } from "next/navigation";
import AttemptsDialog from "./AttemptsDialog";
import ScoreProgress from "@/components/app/shared/ScoreProgress";
import { InterviewTypeChip, DifficultyChip } from "@/components/app/shared/StyledChips";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid";

interface InterviewListProps {
  interviews: InterviewListResponse[];
  isLoading: boolean;
}

export function InterviewList({ interviews, isLoading }: InterviewListProps) {
  const router = useRouter();
  const loadInterview = useLoadInterview();
  const deleteInterview = useDeleteInterview();
  const { loadInterview: loadInterviewState } = useInterviewStore();

  const [attemptsDialogOpen, setAttemptsDialogOpen] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState<number | null>(null);

  const handleTryAgain = async (interviewId: number) => {
    try {
      const loadedInterview = await loadInterview.mutateAsync({ interviewId });
      loadInterviewState({ ...loadedInterview, questionAnswers: [] });
      router.push("/app/interview");
    } catch (error) {
      console.error("Failed to load interview:", error);
    }
  };

  const handleViewAttempts = (interviewId: number) => {
    setSelectedInterviewId(interviewId);
    setAttemptsDialogOpen(true);
  };

  const handleDelete = async (interviewId: number) => {
    try {
      await deleteInterview.mutateAsync({ interviewId });
    } catch (error) {
      console.error("Failed to delete interview:", error);
    }
  };

  const columns: GridColDef<InterviewListResponse>[] = [
    {
      field: "company",
      headerName: "Company",
      flex: 1,
      minWidth: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
          <BusinessIcon sx={{ mr: 0.5 }} />
          <Typography variant="body2" sx={{ color: "text.secondary" }} fontWeight="bold">
            Company
          </Typography>
        </Box>
      ),
      renderCell: (params: GridRenderCellParams<InterviewListResponse>) => params.row?.company || "Not mentioned",
    },
    {
      field: "settings.type",
      headerName: "Type",
      flex: 1,
      minWidth: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
          <CategoryIcon sx={{ mr: 0.5 }} />
          <Typography variant="body2" sx={{ color: "text.secondary" }} fontWeight="bold">
            Type
          </Typography>
        </Box>
      ),
      renderCell: (params: GridRenderCellParams<InterviewListResponse>) => (
        <InterviewTypeChip label={params.row?.settings?.type || ""} />
      ),
    },
    {
      field: "settings.difficulty",
      headerName: "Difficulty",
      flex: 0.8,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
          <BarChartIcon sx={{ mr: 0.5 }} />
          <Typography variant="body2" fontWeight="bold">
            Difficulty
          </Typography>
        </Box>
      ),
      renderCell: (params: GridRenderCellParams<InterviewListResponse>) => (
        <DifficultyChip label={params.row?.settings?.difficulty || ""} />
      ),
    },
    {
      field: "count",
      headerName: "Attempts",
      flex: 1,
      type: "number",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "flex-start", color: "text.secondary", minWidth: "100%", mr: 4 }}>
          <TimelineIcon sx={{ mr: 0.5 }} />
          <Typography variant="body2" fontWeight="bold" align="left">
            Attempts
          </Typography>
        </Box>
      ),
    },
    {
      field: "avg",
      headerName: "Average Score",
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
          <StarIcon sx={{ mr: 0.5 }} />
          <Typography variant="body2" fontWeight="bold">
            Average Score
          </Typography>
        </Box>
      ),
      renderCell: (params: GridRenderCellParams<InterviewListResponse>) => (
        <Box sx={{ position: "relative", display: "flex", width: "100%", height: "100%", alignItems: "center", color: "text.secondary" }}>
          <ScoreProgress score={Number((params.row?.avg ?? 0).toFixed(0))} />
        </Box>
      ),
    },
    {
      field: "created_at",
      headerName: "Created At",
      flex: 1,
      minWidth: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
          <CalendarTodayIcon sx={{ mr: 0.5 }} />
          <Typography variant="body2" fontWeight="bold">
            Created At
          </Typography>
        </Box>
      ),
      renderCell: (params: GridRenderCellParams<InterviewListResponse>) => moment(params.row.created_at).format("MMM DD, YYYY"),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 200,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
          <Typography variant="body2" fontWeight="bold">
            Actions
          </Typography>
        </Box>
      ),
      renderCell: (params: GridRenderCellParams<InterviewListResponse>) => {
        const interviewId = params.row.id;
        return (
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ width: "100%", height: "100%" }}>
            <ActionButton
              label="Try Again"
              variant="contained"
              startIcon={<ReplayIcon />}
              actions={[
                {
                  label: "View Attempts",
                  icon: <VisibilityIcon color="primary" />,
                  onClick: () => handleViewAttempts(interviewId),
                  color: "primary",
                },
                {
                  label: "Delete",
                  icon: <DeleteIcon color="warning" />,
                  onClick: () => handleDelete(interviewId),
                  color: "warning",
                },
              ]}
              onClick={() => handleTryAgain(interviewId)}
            />
          </Stack>
        );
      },
    },
  ];

  return (
    <>
      {deleteInterview.ConfirmDialog}
      <AttemptsDialog
        open={attemptsDialogOpen}
        onClose={() => setAttemptsDialogOpen(false)}
        interviewId={selectedInterviewId}
      />
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <HistoryIcon />
        <Typography component="h2" variant="h6" sx={{ ml: 1 }}>
          Interview History
        </Typography>
      </Box>

      <CustomizedDataGrid
        loading={isLoading}
        rows={interviews || []}
        columns={columns}
        pageSize={10}
        checkboxSelection={false}
        disableColumnResize
        density="comfortable"
        onRowClick={(params) => handleViewAttempts(params.row.id)}
      />
    </>
  );
}
