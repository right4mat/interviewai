import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import { Card, Collapse } from '@mui/material';
import CustomInput from '@/components/shared/CustomizedInput';
import { Interviewer } from '@/types/interview';

interface InterviewerCardProps {
  interviewer: Interviewer;
  setInterviewer: (interviewer: Interviewer) => void;
}

const DEFAULT_INTERVIEWER: Interviewer = {
  name: 'AI Interviewer',
  role: 'Senior Technical Recruiter'
};

const InterviewerCard: React.FC<InterviewerCardProps> = ({
  interviewer,
  setInterviewer,
}) => {
  const [isEditing, setIsEditing] = useState(false);
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
    setTempInterviewer({
      ...tempInterviewer,
      [field]: e.target.value
    });
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary' }}>
          Your Interviewer
        </Typography>
        {!isEditing ? (
          <IconButton 
            onClick={handleEditStart} 
            size="small"
            sx={{ 
              color: 'primary.main',
              bgcolor: 'primary.lighter',
              '&:hover': {
                bgcolor: 'primary.light',
              } 
            }}
            aria-label="edit interviewer"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              onClick={handleEditSave} 
              size="small" 
              sx={{ 
                color: 'success.main',
                bgcolor: 'success.lighter',
                '&:hover': {
                  bgcolor: 'success.light',
                } 
              }} 
              aria-label="save changes"
            >
              <CheckIcon fontSize="small" />
            </IconButton>
            <IconButton 
              onClick={handleEditCancel} 
              size="small" 
              sx={{ 
                color: 'error.main',
                bgcolor: 'error.lighter',
                '&:hover': {
                  bgcolor: 'error.light',
                } 
              }} 
              aria-label="cancel editing"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>

      <Collapse in={!isEditing}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, py: 1 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'primary.contrastText',
              width: 64, 
              height: 64,
              fontSize: 26,
              fontWeight: 'bold',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.08)'
            }}
          >
            {interviewer.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 500, mb: 0.5 }}>{interviewer.name}</Typography>
            <Typography variant="body1" color="text.secondary">{interviewer.role}</Typography>
          </Box>
        </Box>
      </Collapse>
      <Collapse in={isEditing}>
        <Box sx={{ mt: 1, p: 2, bgcolor: 'background.neutral', borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomInput
                fullWidth
                label="Interviewer Name"
                placeholder="Enter interviewer name"
                value={tempInterviewer.name}
                onChange={handleChange('name')}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomInput
                fullWidth
                label="Interviewer Role"
                placeholder="Enter interviewer role"
                value={tempInterviewer.role}
                onChange={handleChange('role')}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button 
                size="small" 
                variant="text" 
                onClick={handleResetToDefault}
                sx={{ mt: 1, color: 'primary.main' }}
              >
                Reset to default
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Card>
  );
};

export default InterviewerCard; 