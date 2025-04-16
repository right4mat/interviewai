import React, { useState } from 'react';
import Box from '@mui/material/Box';
import SetupInterview from './SetupInterview';
import Interview from './Interview';
import { Interviewer } from '@/types/interview';

interface InterviewData {
  jobDescription: string;
  pdfFile?: File;
  interviewers: Interviewer;
}

const InterviewStepper: React.FC = () => {
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);

  const handleSetupComplete = (data: InterviewData) => {
    setInterviewData(data);
  };

  const handleBackToSetup = () => {
    setInterviewData(null);
  };

  return (
    <>
      {!interviewData ? (
        <SetupInterview onComplete={handleSetupComplete} />
      ) : (
        <Interview
          jobDescription={interviewData.jobDescription}
          pdfFile={interviewData.pdfFile}
          interviewers={interviewData.interviewers}
          onBackToSetup={handleBackToSetup}
        />
      )}
    </>
  );
};

export default InterviewStepper;
