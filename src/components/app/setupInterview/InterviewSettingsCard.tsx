import React from "react";
import { Box, Card, FormControl, FormLabel, Grid, Typography } from "@mui/material";
import { type InterviewSettings } from "@/types/interview";
import { InterviewTypeChip, DifficultyChip } from "@/components/app/shared/StyledChips";

interface InterviewSettingsCardProps {
  settings: InterviewSettings;
  setSettings: (settings: InterviewSettings) => void;
}

const InterviewSettingsCard: React.FC<InterviewSettingsCardProps> = ({ settings, setSettings }) => {
  const handleDifficultyChange = (newDifficulty: InterviewSettings["difficulty"]) => {
    setSettings({ ...settings, difficulty: newDifficulty });
  };

  const handleTypeChange = (newType: InterviewSettings["type"]) => {
    setSettings({ ...settings, type: newType });
  };

  return (
    <Card
      variant="outlined"
      sx={{
        p: 3.5,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)"
        }
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 500, mb: 3, color: "text.primary" }}>
        Interview Settings
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}>Interview Type</FormLabel>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
              {["technical", "behavioral", "mixed"].map((type) => (
                <Box
                  key={type}
                  onClick={() => handleTypeChange(type as InterviewSettings["type"])}
                  sx={{
                    cursor: "pointer",
                    opacity: settings.type === type ? 1 : 0.5,
                    transition: "all 0.2s ease-in-out",
                    transform: settings.type === type ? "scale(1.1)" : "scale(1)",
                    "&:hover": {
                      transform: settings.type === type ? "scale(1.1)" : "scale(1.05)"
                    },
                    mb: 1
                  }}
                >
                  <InterviewTypeChip label={type} />
                </Box>
              ))}
            </Box>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}>Difficulty Level</FormLabel>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
              {["beginner", "intermediate", "advanced"].map((difficulty) => (
                <Box
                  key={difficulty}
                  onClick={() => handleDifficultyChange(difficulty as InterviewSettings["difficulty"])}
                  sx={{
                    cursor: "pointer",
                    opacity: settings.difficulty === difficulty ? 1 : 0.5,
                    transition: "all 0.2s ease-in-out",
                    transform: settings.difficulty === difficulty ? "scale(1.1)" : "scale(1)",
                    "&:hover": {
                      transform: settings.difficulty === difficulty ? "scale(1.1)" : "scale(1.05)"
                    },
                    mb: 1
                  }}
                >
                  <DifficultyChip label={difficulty} />
                </Box>
              ))}
            </Box>
          </FormControl>
        </Grid>
      </Grid>
    </Card>
  );
};

export default InterviewSettingsCard;
