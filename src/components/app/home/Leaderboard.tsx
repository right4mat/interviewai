"use client";
import React, { useState } from "react";
import { Box, Typography, Card, CardContent, Stack, CircularProgress } from "@mui/material";
import { EmojiEvents as TrophyIcon } from "@mui/icons-material";
import ScoreProgress from "@/components/app/shared/ScoreProgress";
import { DifficultyChip, type DifficultyLevel } from "@/components/app/shared/StyledChips";
import { motion, AnimatePresence } from "framer-motion";
import { useLeaders } from "@/services/appServices";

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
  const { data: leaderboardData, isLoading, error } = useLeaders();

  const difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', color: 'error.main' }}>
        <Typography>Failed to load leaderboard</Typography>
      </Box>
    );
  }

  // Filter by difficulty and sort by rank (already sorted from the server)
  const filteredData = leaderboardData
    ? leaderboardData.filter(entry => selectedDifficulty === 'all' || entry.difficulty === selectedDifficulty)
    : [];

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" flexWrap="wrap" justifyContent="center" spacing={1} sx={{ mb: 3 }}>
        <Box key="all" pt={1}>
          <DifficultyChip 
            label="All" 
          customSx={{ 
            mt: 1,
            background: selectedDifficulty === 'all' ? 'primary.main' : undefined,
            color: selectedDifficulty === 'all' ? 'white' : undefined
          }}
          onClick={() => setSelectedDifficulty('all')}
        />
        </Box>
        {difficulties.map((difficulty) => (
          <Box key={difficulty} pt={1}>
            <DifficultyChip
              label={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              customSx={{ 
              mt: 1,
              background: selectedDifficulty === difficulty ? 'primary.main' : undefined,
              color: selectedDifficulty === difficulty ? 'white' : undefined
            }}
            />
          </Box>
        ))}
      </Stack>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr',
          md: '1fr 1fr 1fr 1fr'
        },
        gap: 2
      }}>
        <AnimatePresence mode="popLayout">
          {filteredData.map((entry) => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="outlined" sx={{ height: '100%' }}>
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
                    <ScoreProgress score={entry.averageScore} size={40} thickness={4} />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Interviews: {entry.totalInterviews}
                    </Typography>
                    <DifficultyChip label={entry.difficulty} size="small" />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  );
}