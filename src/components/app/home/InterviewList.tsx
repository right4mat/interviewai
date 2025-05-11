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
import { InterviewListResponse } from "./types";
import Stack from "@mui/material/Stack";
import { Gauge } from "@mui/x-charts/Gauge";

interface InterviewListProps {
  interviews: InterviewListResponse[];
  isLoading: boolean;
}

export function InterviewList({ interviews, isLoading }: InterviewListProps) {
  const handleTryAgain = (interviewId: number) => {
    // TODO: Implement try again logic
    console.log("Try again for interview:", interviewId);
  };

  const handleViewAttempts = (interviewId: number) => {
    // TODO: Implement view attempts logic
    console.log("View attempts for interview:", interviewId);
  };

  const handleDelete = (interviewId: number) => {
    // TODO: Implement delete logic
    console.log("Delete interview:", interviewId);
  };

  const columns: GridColDef<InterviewListResponse>[] = [
    {
      field: "company",
      headerName: "Company",
      flex: 1,
      minWidth: 150
    },
    {
      field: "settings.type",
      headerName: "Type",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<InterviewListResponse>) => {
        return params.row?.settings?.type || "";
      }
    },
    {
      field: "settings.difficulty",
      headerName: "Difficulty",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<InterviewListResponse>) => {
        const difficulty = params.row?.settings?.difficulty;
        const color = difficulty === "advanced" ? "error" : difficulty === "intermediate" ? "default" : "success";
        return <Chip label={difficulty || ""} color={color} sx={{ textTransform: "capitalize" }} />;
      }
    },
    {
      field: "count",
      headerName: "Attempts",
      flex: 0.5,
      minWidth: 100,
      type: "number"
    },
    {
      field: "avg",
      headerName: "Average Score",
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<InterviewListResponse>) => {
        const value = params.row?.avg ?? 0;
        return (
          <Box sx={{ position: "relative", display: "flex", width: "100%", height: "100%", alignItems: "center" }}>
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
      headerName: "Last Attempt",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<InterviewListResponse>) => {
        return moment(params.row.created_at).format("MMM DD, YYYY");
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams<InterviewListResponse>) => {
        const interviewId = params.row.job_description_id;
        return (
      
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
       
        );
      }
    }
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Interview History
      </Typography>
      <Card sx={{ p: 2 }} variant="outlined">
        <CustomizedDataGrid
          rows={interviews?.map((interview, index) => ({ ...interview, id: index })) || []}
          columns={columns}
          pageSize={10}
          checkboxSelection={false}
          disableColumnResize={true}
          density="standard"
        />
      </Card>
    </>
  );
}
