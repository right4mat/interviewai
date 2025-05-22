import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { type InterviewSettings, type Interviewer } from '@/types/interview';
import InterviewerCard from './InterviewerCard';
import InterviewSettingsCard from './InterviewSettingsCard';

interface InterviewerSetupProps {
  interviewer: Interviewer;
  setInterviewer: (interviewer: Interviewer) => void;
  settings: InterviewSettings;
  setSettings: (settings: InterviewSettings) => void;
}

const InterviewerSetup: React.FC<InterviewerSetupProps> = ({
  interviewer,
  setInterviewer,
  settings,
  setSettings,
}) => {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Interviewer Card */}
      <InterviewerCard 
        interviewer={interviewer}
        setInterviewer={setInterviewer}
      />

      {/* Interview Settings */}
      <InterviewSettingsCard 
        settings={settings}
        setSettings={setSettings}
      />

     
    </Box>
  );
};

export default InterviewerSetup;