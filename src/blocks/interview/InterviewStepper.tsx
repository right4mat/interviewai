import React from 'react';
import SetupInterview from '@/blocks/interview/SetupInterview';
import Interview from './Interview';
import { useInterviewStore } from '@/stores/interviewStore';

const InterviewStepper: React.FC = () => {
  const { interviewData, clearInterviewData } = useInterviewStore();

  const handleBackToSetup = () => {
    clearInterviewData();
  };

  return (
    <>
      {!interviewData ? (
        <SetupInterview />
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
