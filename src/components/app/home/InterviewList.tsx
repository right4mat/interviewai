"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  useMediaQuery,
  useTheme,
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
  Bolt as ElectricBoltIcon,
  FormatListNumbered as FormatListNumberedIcon,
} from "@mui/icons-material";
import moment from "moment";
import CustomizedDataGrid from "@/components/shared/CustomizedDataGrid";
import ActionButton, { SmallScreenActionButton } from "@/components/shared/ActionButton";
import { type InterviewListResponse } from "./types";
import { useLoadInterview, useDeleteInterview } from "@/services/appServices";
import { useInterviewStore } from "@/stores/interviewStore";
import { useRouter } from "next/navigation";
import AttemptsDialog from "./AttemptsDialog";
import ScoreProgress from "@/components/app/shared/ScoreProgress";
import { InterviewTypeChip, DifficultyChip } from "@/components/app/shared/StyledChips";
import { type GridRenderCellParams } from "@mui/x-data-grid";
import { type GridColDef } from "@mui/x-data-grid";

interface InterviewListProps {
  interviews: InterviewListResponse[];
  isLoading: boolean;
}

export function InterviewList({ interviews, isLoading }: InterviewListProps) {
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
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

  const getColumns = (): GridColDef<InterviewListResponse>[] => {
    const baseColumns = [
      {
        field: "company",
        headerName: "Company",
        flex: 1,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderHeader: () => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <BusinessIcon sx={{ mr: 0.5 }} color="primary" />
            <Typography variant="body2" color="text.secondary" fontWeight="bold">
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
          <Box sx={{ display: "flex", alignItems: "center"}}>
            <CategoryIcon sx={{ mr: 0.5 }} color="primary" />
            <Typography variant="body2" color="text.secondary" fontWeight="bold">
              Type
            </Typography>
          </Box>
        ),
        renderCell: (params: GridRenderCellParams<InterviewListResponse>) => (
          <InterviewTypeChip label={params.row?.settings?.type || ""} />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: .8,
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
          const actions = [
            {
              label: "View Attempts",
              icon: <VisibilityIcon color="primary" />,
              onClick: () => handleViewAttempts(interviewId),
              color: "primary" as const,
            },
            {
              label: "Try Again",
              icon: <ReplayIcon color="primary" />,
              onClick: () => handleTryAgain(interviewId),
              color: "primary" as const,
            },
            {
              label: "Delete",
              icon: <DeleteIcon color="warning" />,
              onClick: () => handleDelete(interviewId),
              color: "warning" as const,
            },
          ];

          return (
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ width: "100%", height: "100%" }}>
              {isSmallScreen ? (
                <SmallScreenActionButton actions={actions} />
              ) : (
                <ActionButton
                  label="Try Again"
                  variant="contained"
                  startIcon={<ReplayIcon />}
                  actions={[actions[0], actions[2]].filter((a): a is typeof actions[0] => a !== undefined)}
                  onClick={() => handleTryAgain(interviewId)}
                />
              )}
            </Stack>
          );
        },
      },
    ];

    if (!isSmallScreen) {
      baseColumns.splice(2, 0, ...[
        {
          field: "settings.difficulty",
          headerName: "Difficulty",
          flex: 0.8,
          sortable: false,
          filterable: false,
          disableColumnMenu: true,
          renderHeader: () => (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <BarChartIcon sx={{ mr: 0.5 }} color="primary" />
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
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
          sortable: false,
          filterable: false,
          disableColumnMenu: true,
          renderHeader: () => (
            <Box sx={{ display: "flex", alignItems: "flex-start",  minWidth: "100%", mr: 4 }}>
              <FormatListNumberedIcon sx={{ mr: 0.5 }} color="primary" />
              <Typography variant="body2" color="text.secondary" fontWeight="bold" align="left">
                Attempts
              </Typography>
            </Box>
          ),
          renderCell: (params: GridRenderCellParams<InterviewListResponse>) => (
            <Box sx={{ position: "relative", display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", color: "text.secondary" }}>
              <Typography variant="body2" fontWeight="bold" align="center">
                {params.row?.count}
              </Typography>
            </Box>
          ),
        },
        {
          field: "avg",
          headerName: "Average Score",
          flex: 1,
          minWidth: 120,
          sortable: false,
          filterable: false,
          disableColumnMenu: true,
          renderHeader: () => (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ElectricBoltIcon sx={{ mr: 0.5 }} color="primary" />
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                Average Score
              </Typography>
            </Box>
          ),
          renderCell: (params: GridRenderCellParams<InterviewListResponse>) => (
            <Box sx={{ position: "relative", display: "flex", width: "100%", height: "100%", alignItems: "center", color: "text.secondary" }}>
              <ScoreProgress score={Number((params.row?.avg/1200*100).toFixed(0))} />
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
            <Box sx={{ display: "flex", alignItems: "center"}}>
              <CalendarTodayIcon sx={{ mr: 0.5 }} color="primary" />
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                Created At
              </Typography>
            </Box>
          ),
          renderCell: (params: GridRenderCellParams<InterviewListResponse>) => moment(params.row.created_at).format("MMM DD, YYYY"),
        },
      ]);
    }

    return baseColumns;
  };

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
        columns={getColumns()}
        pageSize={10}
        checkboxSelection={false}
        disableColumnResize
        density="comfortable"
        onRowClick={(params) => handleViewAttempts(params.row.id)}
      />
    </>
  );
}
