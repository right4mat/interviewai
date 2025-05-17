"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import CustomizedDataGrid from "@/components/shared/CustomizedDataGrid";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { brand } from "@/theme/themePrimitives";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import moment from "moment";
import ActionButton from "@/components/shared/ActionButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplayIcon from "@mui/icons-material/Replay";
import HistoryIcon from "@mui/icons-material/History";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import BarChartIcon from "@mui/icons-material/BarChart";
import StarIcon from "@mui/icons-material/Star"; // New icon for Average Score
import TimelineIcon from "@mui/icons-material/Timeline"; // Changed icon for Attempts
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { InterviewListResponse } from "./types";
import Stack from "@mui/material/Stack";
import { Gauge } from "@mui/x-charts/Gauge";
import { useLoadInterview, useDeleteInterview } from "@/services/appServices";
import { useInterviewStore } from "@/stores/interviewStore";
import { useRouter } from "next/navigation";

interface InterviewListProps {
  interviews: InterviewListResponse[];
  isLoading: boolean;
}

export function InterviewList({ interviews, isLoading }: InterviewListProps) {
  const router = useRouter();
  const loadInterview = useLoadInterview();
  const deleteInterview = useDeleteInterview();
  const { updateInterviewState, setStage } = useInterviewStore();

  const handleTryAgain = async (interviewId: number) => {
    try {
      const loadedInterview = await loadInterview.mutateAsync({ interviewId: interviewId });

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
      router.push("/app/interview");
    } catch (error) {
      console.error("Failed to load interview:", error);
      // TODO: Add error handling UI feedback
    }
  };

  const handleViewAttempts = (interviewId: number) => {
    // TODO: Implement view attempts logic
    console.log("View attempts for interview:", interviewId);
  };

  const handleDelete = async (interviewId: number) => {
    try {
      await deleteInterview.mutateAsync({ interviewId });
      // The page will automatically refresh due to react-query cache invalidation
    } catch (error) {
      console.error("Failed to delete interview:", error);
      // TODO: Add error handling UI feedback
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
          <Typography variant="body2" sx={{ color: "text.secondary" }} fontWeight={"bold"}>
            Company
          </Typography>
        </Box>
      ),
      renderCell: (params: GridRenderCellParams<InterviewListResponse>) => {
        return params.row?.company || "Not mentioned";
      }
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
          <Typography variant="body2" sx={{ color: "text.secondary" }} fontWeight={"bold"}>
            Type
          </Typography>
        </Box>
      ),
      renderCell: (params: GridRenderCellParams<InterviewListResponse>) => {
        return params.row?.settings?.type || "";
      }
    },
    {
      field: "settings.difficulty",
      headerName: "Difficulty",
      flex: .8,
      sortable: false,
      filterable: false,
      disableColumnMenu: true, 

      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
          <BarChartIcon sx={{ mr: 0.5 }} />
          <Typography variant="body2" fontWeight={"bold"}>
            Difficulty
          </Typography>
        </Box>
      ),
      renderCell: (params: GridRenderCellParams<InterviewListResponse>) => {
        const difficulty = params.row?.settings?.difficulty;
        const color = difficulty === "advanced" ? "error" : difficulty === "intermediate" ? "default" : "success";
        return <Chip label={difficulty || ""} color={color} sx={{ textTransform: "capitalize" }} size="large" />;
      }
    },
    {
      field: "count",
      headerName: "Attempts",
      flex: 1,
      type: "number",
      sortable: false,
      filterable: false,
      disableColumnMenu: true, 
      align:"center",
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "flex-start", color: "text.secondary", minWidth: "100%", mr:4 }}>
          <TimelineIcon sx={{ mr: 0.5 }} />
          <Typography variant="body2"  fontWeight={"bold"} align="left">
                Attempts
          </Typography>
        </Box>
      )
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
          <Typography variant="body2" fontWeight={"bold"}>
            Average Score
          </Typography>
        </Box>
      ),
      renderCell: (params: GridRenderCellParams<InterviewListResponse>) => {
        const value = params.row?.avg ?? 0;
        return (
          <Box sx={{ position: "relative", display: "flex", width: "100%", height: "100%", alignItems: "center",  color: "text.secondary" }}>
            <Gauge
              value={value}
              sx={{
                width: 55,
                height: 55,
                "& .MuiGauge-root": {
                  color: brand[500]
                }
              }}
            />
          </Box>
        );
      }
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
          <Typography variant="body2" fontWeight={"bold"}>
            Created At
          </Typography>
        </Box>
      ),
      renderCell: (params: GridRenderCellParams<InterviewListResponse>) => {
        return moment(params.row.created_at).format("MMM DD, YYYY");
      }
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
          <Typography variant="body2"  fontWeight={"bold"}>
            Actions
          </Typography>
        </Box>
      ),
      renderCell: (params: GridRenderCellParams<InterviewListResponse>) => {
        const interviewId = params.row.id;
        return (
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ width: "100%" , height: "100%" }}>
            <ActionButton
              label="Try Again"
              variant="outlined"
              startIcon={<ReplayIcon />}
              actions={[
                {
                  label: "View Attempts",
                  icon: <VisibilityIcon />,
                  onClick: () => handleViewAttempts(interviewId),
                  color: "primary"
                },
                {
                  label: "Delete",
                  icon: <DeleteIcon />,
                  onClick: () => handleDelete(interviewId),
                  color: "error"
                }
              ]}
              onClick={() => handleTryAgain(interviewId)}
            />
          </Stack>
        );
      }
    }
  ];

  return (
    <>
      {deleteInterview.ConfirmDialog}
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
        disableColumnResize={true}
        density="standard"
      />
    </>
  );
}
