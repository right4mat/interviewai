import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import CustomInput from '@/components/shared/CustomizedInput';

interface Interviewer {
  name: string;
  role: string;
}

interface InterviewerSetupProps {
  interviewers: Interviewer[];
  setInterviewers: (interviewers: Interviewer[]) => void;
}

const InterviewerSetup: React.FC<InterviewerSetupProps> = ({
  interviewers,
  setInterviewers,
}) => {
  const [newInterviewer, setNewInterviewer] = useState<Interviewer>({
    name: '',
    role: '',
  });

  const MAX_INTERVIEWERS = 5;
  const isMaxInterviewersReached = interviewers.length >= MAX_INTERVIEWERS;

  const handleAddInterviewer = () => {
    if (newInterviewer.name && newInterviewer.role && !isMaxInterviewersReached) {
      setInterviewers([...interviewers, newInterviewer]);
      setNewInterviewer({ name: '', role: '' });
    }
  };

  const handleRemoveInterviewer = (index: number) => {
    const updatedInterviewers = interviewers.filter((_, i) => i !== index);
    setInterviewers(updatedInterviewers);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      <Stack spacing={2}>
        {interviewers.map((interviewer, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle1">{interviewer.name}</Typography>
                <Typography variant="body2" color="text.secondary">{interviewer.role}</Typography>
              </Box>
              <IconButton 
                color="error" 
                onClick={() => handleRemoveInterviewer(index)}
                aria-label="remove interviewer"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Stack>

      {isMaxInterviewersReached && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Maximum of {MAX_INTERVIEWERS} interviewers reached.
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomInput
              fullWidth
              placeholder="Name"
              value={newInterviewer.name}
              onChange={(e) =>
                setNewInterviewer({ ...newInterviewer, name: e.target.value })
              }
              size="small"
              disabled={isMaxInterviewersReached}
              InputProps={{
                sx: { borderRadius: 1.5 }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomInput
              fullWidth
              placeholder="Role"
              value={newInterviewer.role}
              onChange={(e) =>
                setNewInterviewer({ ...newInterviewer, role: e.target.value })
              }
              size="small"
              disabled={isMaxInterviewersReached}
              InputProps={{
                sx: { borderRadius: 1.5 }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              fullWidth
              variant={!newInterviewer.name || !newInterviewer.role || isMaxInterviewersReached ? "outlined" : "contained"}
              color="primary"
              onClick={handleAddInterviewer}
              disabled={!newInterviewer.name || !newInterviewer.role || isMaxInterviewersReached}
              sx={{ 
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 500,
                py: 1
              }}
            >
              Add Interviewer
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default InterviewerSetup;