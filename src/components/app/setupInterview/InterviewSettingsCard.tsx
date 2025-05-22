import React from 'react';
import { Box, Card, FormControl, FormLabel, Grid, Typography } from '@mui/material';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CodeIcon from '@mui/icons-material/Code';
import PsychologyIcon from '@mui/icons-material/Psychology';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import { type InterviewSettings } from '@/types/interview';

interface InterviewSettingsCardProps {
  settings: InterviewSettings;
  setSettings: (settings: InterviewSettings) => void;
}

const InterviewSettingsCard: React.FC<InterviewSettingsCardProps> = ({
  settings,
  setSettings,
}) => {
  const handleDifficultyChange = (
    _event: React.MouseEvent<HTMLElement>,
    newDifficulty: InterviewSettings['difficulty'],
  ) => {
    if (newDifficulty !== null) {
      setSettings({ ...settings, difficulty: newDifficulty });
    }
  };

  const handleTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newType: InterviewSettings['type'],
  ) => {
    if (newType !== null) {
      setSettings({ ...settings, type: newType });
    }
  };

  return (
    <Card 
      variant="outlined"
      sx={{ 
        p: 3.5, 
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        }
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 500, mb: 3, color: 'text.primary' }}>
        Interview Settings
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}>Interview Type</FormLabel>
            <ToggleButtonGroup
              value={settings.type}
              exclusive
              onChange={handleTypeChange}
              aria-label="interview type"
              fullWidth
              sx={{
                '& .MuiToggleButtonGroup-grouped': {
                  fontWeight: 400,
                  fontSize: '0.875rem',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }
              }}
            >
              <ToggleButton 
                value="technical"
                aria-label="technical interview"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <CodeIcon fontSize="small" />
                  <span>Technical</span>
                </Box>
              </ToggleButton>
              <ToggleButton 
                value="behavioral"
                aria-label="behavioral interview"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <PsychologyIcon fontSize="small" />
                  <span>Behavioral</span>
                </Box>
              </ToggleButton>
              <ToggleButton 
                value="mixed"
                aria-label="mixed interview"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <IntegrationInstructionsIcon fontSize="small" />
                  <span>Mixed</span>
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}>Difficulty Level</FormLabel>
            <ToggleButtonGroup
              value={settings.difficulty}
              exclusive
              onChange={handleDifficultyChange}
              aria-label="difficulty level"
              fullWidth
              sx={{
                '& .MuiToggleButtonGroup-grouped': {
                  fontWeight: 400,
                  fontSize: '0.875rem',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }
              }}
            >
              <ToggleButton 
                value="beginner"
                aria-label="beginner difficulty"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <SportsEsportsIcon fontSize="small" />
                  <span>Beginner</span>
                </Box>
              </ToggleButton>
              <ToggleButton 
                value="intermediate"
                aria-label="intermediate difficulty"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <FitnessCenterIcon fontSize="small" />
                  <span>Intermediate</span>
                </Box>
              </ToggleButton>
              <ToggleButton 
                value="advanced"
                aria-label="advanced difficulty"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <EmojiEventsIcon fontSize="small" />
                  <span>Advanced</span>
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        </Grid>
      </Grid>
    </Card>
  );
};

export default InterviewSettingsCard; 