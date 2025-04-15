import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import JobDescriptionInput from '@/components/setupInterview/JobDescriptionInput';
import FileUpload from '@/components/setupInterview/FileUpload';
import InterviewerSetup from '@/components/setupInterview/InterviewerSetup';
import Grid from '@mui/material/Grid';

interface Interviewer {
  name: string;
  role: string;
}

interface SetupInterviewProps {
  onComplete: (data: {
    jobDescription: string;
    pdfFile?: File;
    interviewers: Interviewer[];
  }) => void;
}

const SetupInterview: React.FC<SetupInterviewProps> = ({ onComplete }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [pdfFile, setPdfFile] = useState<File | undefined>();
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [showInterviewers, setShowInterviewers] = useState(false);

  const handleSubmit = () => {
    if (!jobDescription) {
      alert('Job description is required');
      return;
    }
    onComplete({ jobDescription, pdfFile, interviewers });
  };

  return (
    <Container maxWidth="md" sx={{ width: '100%' }}>
        <Stack spacing={4} sx={{ width: '100%' }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Setup Interview
          </Typography>
          
          <Grid container spacing={3}>
            <Grid size={{xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }} fontWeight="medium">Job Description</Typography>
                <JobDescriptionInput
                  value={jobDescription}
                  onChange={setJobDescription}
                />
              </Paper>
            </Grid>
            
            <Grid size={{xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }} fontWeight="medium">Resume</Typography>
                <FileUpload
                  onFileSelect={setPdfFile}
                  selectedFile={pdfFile}
                />
              </Paper>
            </Grid>
            
            <Grid size={{xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: showInterviewers ? 2 : 0 
                }}>
                  <Typography variant="h6" fontWeight="medium">Interviewers</Typography>
                  <Button 
                    startIcon={<AddIcon />} 
                    onClick={() => setShowInterviewers(!showInterviewers)}
                    color="primary"
                    variant="text"
                    sx={{ fontWeight: 500 }}
                  >
                    {showInterviewers ? 'Hide' : 'Add custom interviewers'}
                  </Button>
                </Box>
                
                {showInterviewers && (
                  <InterviewerSetup
                    interviewers={interviewers}
                    setInterviewers={setInterviewers}
                  />
                )}
              </Paper>
            </Grid>
            
            <Grid size={{xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                size="large"
                disableElevation
                sx={{ 
                  py: 1.5, 
                  mt: 2,
                  fontWeight: 600,
                  borderRadius: 1.5,
                  textTransform: 'none'
                }}
              >
                Complete Setup
              </Button>
            </Grid>
          </Grid>
        </Stack>

    </Container>
  );
};

export default SetupInterview;