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
import CodeIcon from '@mui/icons-material/Code';
import PsychologyIcon from '@mui/icons-material/Psychology';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
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
import AttemptsDialog from "./AttemptsDialog";
import ScoreProgress from "@/components/app/shared/ScoreProgress";

interface InterviewListProps {
  interviews: InterviewListResponse[];
  isLoading: boolean;
}

// Mock data for the attempts - replace with actual API call when available
interface AttemptData {
  id: string;
  date: string;
  score: number;
  questions: number;
  status: string;
  totalQuestions?: number;
}

export function InterviewList({ interviews, isLoading }: InterviewListProps) {
  const router = useRouter();
  const loadInterview = useLoadInterview();
  const deleteInterview = useDeleteInterview();
  const { updateInterviewState, setStage, loadInterview: loadInterviewState } = useInterviewStore();
  
  // State for dialog
  const [attemptsDialogOpen, setAttemptsDialogOpen] = React.useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = React.useState<number | null>(null);
  const [attemptData, setAttemptData] = React.useState<AttemptData[]>([]);

  const handleTryAgain = async (interviewId: number) => {
    try {
      const loadedInterview = await loadInterview.mutateAsync({ interviewId: interviewId });

      // Use the store's loadInterview method
      loadInterviewState({...loadedInterview, questionAnswers: []});
      
      router.push("/app/interview");
    } catch (error) {
      console.error("Failed to load interview:", error);
      // TODO: Add error handling UI feedback
    }
  };

  const handleViewAttempts = (interviewId: number) => {
    setSelectedInterviewId(interviewId);
    setAttemptsDialogOpen(true);
  };

  const handleViewAttemptDetails = (attemptId: string) => {
    console.log("View attempt details:", attemptId);
    // Here you would navigate to the attempt details page or open a details dialog
    // For now, we'll just log it
  };

  const handleContinueAttempt = (attemptId: string) => {
    console.log("Continue attempt:", attemptId);
    // Here you would load the attempt and navigate to the interview page
    // For now, we'll just log it
    
    // Extract the interview ID from the attempt ID
    const interviewId = parseInt(attemptId.split('-')[0]);
    handleTryAgain(interviewId);
  };

  const handleRowClick = (params: any) => {
    handleViewAttempts(params.row.id);
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
        const type = params.row?.settings?.type;
        
        // Define styles for each interview type
        let chipStyle: any = {
          background: '#f0f0f0',
          color: '#444',
          border: '1px solid #ddd',
          fontWeight: 'bold'
        };
        
        let iconStyle = { color: '#444' };
        
        switch(type) {
          case "technical":
            chipStyle = {
              background: 'linear-gradient(135deg, #6b9fed 0%, #a1c4ff 50%, #6b9fed 100%)',
              color: '#0a2e5c',
              border: '1px solid #5a8ae3',
              fontWeight: 'bold',
              textShadow: '0px 1px 1px rgba(255, 255, 255, 0.5)'
            };
            iconStyle = { color: '#0a2e5c' };
            break;
          case "behavioral":
            chipStyle = {
              background: 'linear-gradient(135deg, #a073e6 0%, #c7b0f7 50%, #a073e6 100%)',
              color: '#3a1e66',
              border: '1px solid #8a5ad9',
              fontWeight: 'bold',
              textShadow: '0px 1px 1px rgba(255, 255, 255, 0.5)'
            };
            iconStyle = { color: '#3a1e66' };
            break;
          case "mixed":
            chipStyle = {
              background: 'linear-gradient(135deg, #5cc489 0%, #9fe3c0 50%, #5cc489 100%)',
              color: '#1e4e35',
              border: '1px solid #4aaa76',
              fontWeight: 'bold',
              textShadow: '0px 1px 1px rgba(255, 255, 255, 0.5)'
            };
            iconStyle = { color: '#1e4e35' };
            break;
          default:
            // Default styling already defined above
        }
        
        let icon;
        switch(type) {
          case "technical":
            icon = <CodeIcon sx={iconStyle} />;
            break;
          case "behavioral":
            icon = <PsychologyIcon sx={iconStyle} />;
            break;
          case "mixed":
            icon = <IntegrationInstructionsIcon sx={iconStyle} />;
            break;
          default:
            icon = <CategoryIcon sx={iconStyle} />;
        }
        
        return (
          <Chip
            label={type || ""}
            icon={icon}
            sx={{ 
              textTransform: "capitalize",
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
              ...chipStyle
            }}
            size="medium"
          />
        );
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
        
        // Default (beginner) - Bronze
        let chipStyle = {
          background: 'linear-gradient(135deg, #CD7F32 0%, #E6B980 50%, #CD7F32 100%)',
          color: '#553311',
          border: '1px solid #8B5A2B',
          fontWeight: 'bold',
          textShadow: '0px 1px 1px rgba(255, 255, 255, 0.5)'
        };
        
        if (difficulty === "intermediate") {
          // Silver
          chipStyle = {
            background: 'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 50%, #C0C0C0 100%)',
            color: '#444444',
            border: '1px solid #7D7D7D',
            fontWeight: 'bold',
            textShadow: '0px 1px 1px rgba(255, 255, 255, 0.5)'
          };
        } else if (difficulty === "advanced") {
          // Gold
          chipStyle = {
            background: 'linear-gradient(135deg, #FFD700 0%, #FFF089 50%, #FFD700 100%)',
            color: '#5D4B00',
            border: '1px solid #B29600',
            fontWeight: 'bold',
            textShadow: '0px 1px 1px rgba(255, 255, 255, 0.5)'
          };
        }
        
        let icon;
        switch(difficulty) {
          case "beginner":
            icon = <SportsEsportsIcon sx={{ color: '#553311' }} />;
            break;
          case "intermediate":
            icon = <FitnessCenterIcon sx={{ color: '#444444' }} />;
            break;
          case "advanced":
            icon = <EmojiEventsIcon sx={{ color: '#5D4B00' }} />;
            break;
          default:
            icon = <BarChartIcon />;
        }
        
        return (
          <Chip
            label={difficulty || ""}
            icon={icon}
            sx={{ 
              textTransform: "capitalize",
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
              ...chipStyle
            }}
            size="medium"
          />
        );
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
          <Box sx={{ position: "relative", display: "flex", width: "100%", height: "100%", alignItems: "center", color: "text.secondary" }}>
            <ScoreProgress score={Number(value.toFixed(0))} />
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
              variant="contained"
              startIcon={<ReplayIcon />}
              actions={[
                {
                  label: "View Attempts",
                  icon: <VisibilityIcon color="primary"/>,
                  onClick: () => handleViewAttempts(interviewId),
                  color: "primary"
                },
                {
                  label: "Delete",
                  icon: <DeleteIcon color="warning" />,
                  onClick: () => handleDelete(interviewId),
                  color: "warning"
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
        disableColumnResize={true}
        density="comfortable"
        onRowClick={handleRowClick}
      />
    </>
  );
}
