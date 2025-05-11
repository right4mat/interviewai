"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import CustomizedDataGrid from "@/components/shared/CustomizedDataGrid";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { brand } from "@/theme/themePrimitives";
import { createClient } from "@supabase/supabase-js";

interface InterviewStats {
  id: string;
  company: string;
  jobDescription: string;
  attempts: number;
  averageScore: number;
  type: "technical" | "behavioral" | "mixed";
  difficulty: "beginner" | "intermediate" | "advanced";
  lastAttempt: string;
}

interface Interview {
  job_description: string;
  settings: {
    type: "technical" | "behavioral" | "mixed";
    difficulty: "beginner" | "intermediate" | "advanced";
  };
  question_answers: Array<{
    score?: number;
  }>;
  created_at: string;
}

export default function InterviewsByJob(): React.ReactElement {
  const [interviews, setInterviews] = useState<InterviewStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: interviews, error } = await supabase
          .from("interviews")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Group interviews by job description and calculate stats
        const stats = (interviews as Interview[]).reduce((acc: { [key: string]: InterviewStats }, interview) => {
          const key = interview.job_description;
          if (!acc[key]) {
            acc[key] = {
              id: key,
              company: extractCompanyName(interview.job_description),
              jobDescription: interview.job_description,
              attempts: 0,
              averageScore: 0,
              type: interview.settings.type,
              difficulty: interview.settings.difficulty,
              lastAttempt: new Date(interview.created_at).toLocaleDateString(),
            };
          }

          // Calculate average score from question answers
          const scores = interview.question_answers
            .filter((qa) => qa.score !== undefined)
            .map((qa) => qa.score!);
          
          const avgScore = scores.length > 0 
            ? scores.reduce((a, b) => a + b, 0) / scores.length 
            : 0;

          acc[key].attempts += 1;
          acc[key].averageScore = (acc[key].averageScore * (acc[key].attempts - 1) + avgScore) / acc[key].attempts;
          
          return acc;
        }, {});

        setInterviews(Object.values(stats));
      } catch (error) {
        console.error("Error fetching interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const extractCompanyName = (jobDescription: string): string => {
    const match = jobDescription.match(
      /(?:at|for|with)\s+([A-Z][A-Za-z0-9\s]+?)(?:\.|\,|\s+is|\s+are|\s+we|\s+I|\s+in|\s+to|\s+and|\s+seeking|\s+looking|\s+hiring|$)/
    );
    return match ? match[1].trim() : "Unknown Company";
  };

  const columns: GridColDef[] = [
    {
      field: "company",
      headerName: "Company",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "type",
      headerName: "Type",
      width: 120,
      valueFormatter: (params) => 
        params.value ? (params.value as string).charAt(0).toUpperCase() + (params.value as string).slice(1) : "",
    },
    {
      field: "difficulty",
      headerName: "Difficulty",
      width: 120,
      valueFormatter: (params) => 
        params.value ? (params.value as string).charAt(0).toUpperCase() + (params.value as string).slice(1) : "",
    },
    {
      field: "attempts",
      headerName: "Attempts",
      width: 100,
      type: "number",
    },
    {
      field: "averageScore",
      headerName: "Average Score",
      width: 150,
      renderCell: (params: GridRenderCellParams<InterviewStats, number>) => {
        const value = params.value ?? 0;
        return (
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
              variant="determinate"
              value={value}
              size={40}
              thickness={4}
              sx={{
                color: brand[500],
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                },
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="caption" component="div" color="text.secondary">
                {`${Math.round(value)}%`}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "lastAttempt",
      headerName: "Last Attempt",
      width: 120,
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Interview History by Job
      </Typography>
      <CustomizedDataGrid
        rows={interviews}
        columns={columns}
        pageSize={10}
        checkboxSelection={false}
        disableColumnResize={true}
        density="standard"
      />
    </Box>
  );
}
