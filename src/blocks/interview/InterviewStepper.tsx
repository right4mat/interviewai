import React, { useState } from 'react';
import Box from '@mui/material/Box';
import SetupInterview from './SetupInterview';
import Interview from './Interview';

interface InterviewData {
  jobDescription: string;
  pdfFile?: File;
  interviewers: Array<{
    name: string;
    role: string;
  }>;
}

const InterviewStepper: React.FC = () => {
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);

  const handleSetupComplete = (data: InterviewData) => {
    setInterviewData(data);
  };

  return (
    <Box>
      {!interviewData ? (
        <SetupInterview onComplete={handleSetupComplete} />
      ) : (
        <Interview
          jobDescription={interviewData.jobDescription}
          pdfFile={interviewData.pdfFile}
          interviewers={interviewData.interviewers}
        />
      )}
    </Box>
  );
};

export default InterviewStepper;
