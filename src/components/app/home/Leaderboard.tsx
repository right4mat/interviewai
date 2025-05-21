"use client";
import React, { useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Stack } from "@mui/material";
import { EmojiEvents as TrophyIcon } from "@mui/icons-material";
import ScoreProgress from "@/components/app/shared/ScoreProgress";
import { DifficultyChip, DifficultyLevel } from "@/components/app/shared/StyledChips";
import { motion, AnimatePresence } from "framer-motion";

interface LeaderboardEntry {
  id: number;
  rank: number;
  name: string;
  averageScore: number;
  totalInterviews: number;
  difficulty: DifficultyLevel;
}

export default function Leaderboard() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');

  // Dummy data for leaderboard entries
  const dummyData: LeaderboardEntry[] = [
    { id: 1, rank: 0, name: "Alice", averageScore: 85, totalInterviews: 10, difficulty: 'beginner' },
    { id: 2, rank: 0, name: "Bob", averageScore: 90, totalInterviews: 15, difficulty: 'intermediate' },
    { id: 3, rank: 0, name: "Charlie", averageScore: 95, totalInterviews: 20, difficulty: 'advanced' },
    { id: 4, rank: 0, name: "David", averageScore: 80, totalInterviews: 8, difficulty: 'beginner' },
    { id: 5, rank: 0, name: "Eve", averageScore: 88, totalInterviews: 12, difficulty: 'intermediate' },
    { id: 6, rank: 0, name: "Frank", averageScore: 92, totalInterviews: 18, difficulty: 'advanced' },
    { id: 7, rank: 0, name: "Grace", averageScore: 87, totalInterviews: 14, difficulty: 'beginner' },
    { id: 8, rank: 0, name: "Hannah", averageScore: 89, totalInterviews: 16, difficulty: 'intermediate' }
  ];

  // Filter by difficulty, sort by average score, and assign ranks
  const leaderboardData = dummyData
    .filter(entry => selectedDifficulty === 'all' || entry.difficulty === selectedDifficulty)
    .sort((a, b) => b.averageScore - a.averageScore)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

  const difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        <DifficultyChip 
          label="All" 
          customSx={{ 
            background: selectedDifficulty === 'all' ? 'primary.main' : undefined,
            color: selectedDifficulty === 'all' ? 'white' : undefined
          }}
          onClick={() => setSelectedDifficulty('all')}
        />
        {difficulties.map((difficulty) => (
          <DifficultyChip
            key={difficulty}
            label={difficulty}
            onClick={() => setSelectedDifficulty(difficulty)}
            customSx={{ 
              background: selectedDifficulty === difficulty ? 'primary.main' : undefined,
              color: selectedDifficulty === difficulty ? 'white' : undefined
            }}
          />
        ))}
      </Stack>

      <Grid container spacing={2}>
        <AnimatePresence mode="popLayout">
          {leaderboardData.map((entry) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={entry.id} component={motion.div}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <TrophyIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      #{entry.rank} {entry.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                      Average Score:
                    </Typography>
                    <ScoreProgress score={Math.round(entry.averageScore)} size={40} thickness={4} />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Interviews: {entry.totalInterviews}
                    </Typography>
                    <DifficultyChip label={entry.difficulty} size="small" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    </Box>
  );
}