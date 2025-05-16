import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import CustomInput from '@/components/shared/CustomizedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Interviewer } from '@/types/interview';
import FormLabel from '@mui/material/FormLabel';


interface InterviewSettings {
  type: 'technical' | 'behavioral' | 'mixed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface InterviewerSetupProps {
  interviewer: Interviewer;
  setInterviewer: (interviewer: Interviewer) => void;
  settings: InterviewSettings;
  setSettings: (settings: InterviewSettings) => void;
}

const DEFAULT_INTERVIEWER: Interviewer = {
  name: 'AI Interviewer',
  role: 'Senior Technical Recruiter'
};

const InterviewerSetup: React.FC<InterviewerSetupProps> = ({
  interviewer,
  setInterviewer,
  settings,
  setSettings,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [tempInterviewer, setTempInterviewer] = useState<Interviewer>(interviewer);

  const handleEditStart = () => {
    setTempInterviewer(interviewer);
    setIsEditing(true);
  };

  const handleEditSave = () => {
    setInterviewer(tempInterviewer);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setTempInterviewer(interviewer);
  };

  const handleResetToDefault = () => {
    setInterviewer(DEFAULT_INTERVIEWER);
  };

  const handleChange = (field: keyof Interviewer) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterviewer({
      ...interviewer,
      [field]: e.target.value
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Your Interviewer
          </Typography>
          {!isEditing ? (
            <IconButton 
              onClick={handleEditStart} 
              size="small" 
              color="primary"
              aria-label="edit interviewer"
            >
              <EditIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={handleEditSave} size="small" color="primary" aria-label="save changes">
                <CheckIcon />
              </IconButton>
              <IconButton onClick={handleEditCancel} size="small" color="error" aria-label="cancel editing">
                <CloseIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        {!isEditing ? (
          <Card variant="outlined" sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'interview.primary', 
                  width: 56, 
                  height: 56 
                }}
              >
                {interviewer.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>{interviewer.name}</Typography>
                <Typography variant="body1" color="text.secondary">{interviewer.role}</Typography>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{xs: 12, sm: 6}}>
                <CustomInput
                  fullWidth
                  label="Interviewer Name"
                  placeholder="Enter interviewer name"
                  value={tempInterviewer.name}
                  onChange={handleChange('name')}
                  size="small"
                />
              </Grid>
              <Grid size={{xs: 12, sm: 6}}>
                <CustomInput
                  fullWidth
                  label="Interviewer Role"
                  placeholder="Enter interviewer role"
                  value={tempInterviewer.role}
                  onChange={handleChange('role')}
                  size="small"
                />
              </Grid>
              <Grid size={{xs: 12}}>
                <Button 
                  size="small" 
                  variant="text" 
                  onClick={handleResetToDefault}
                  sx={{ mt: 1 }}
                >
                  Reset to default
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Interview Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{xs: 12, sm: 6}}>
            <FormControl fullWidth size="small">
              <FormLabel>Interview Type</FormLabel>
              <Select
                value={settings.type}
                onChange={(e) => setSettings({ ...settings, type: e.target.value as InterviewSettings['type'] })}
              >
                <MenuItem value="technical">Technical</MenuItem>
                <MenuItem value="behavioral">Behavioral</MenuItem>
                <MenuItem value="mixed">Mixed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{xs: 12, sm: 6}}>
            <FormControl fullWidth size="small">
            <FormLabel>Difficulty Level</FormLabel>
              <Select
                value={settings.difficulty}
                onChange={(e) => setSettings({ ...settings, difficulty: e.target.value as InterviewSettings['difficulty'] })}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={showComingSoon}
        autoHideDuration={3000}
        onClose={() => setShowComingSoon(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowComingSoon(false)} severity="info" sx={{ width: '100%' }}>
          Multiple attendees feature coming soon! Stay tuned for updates.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InterviewerSetup;