import React, { useState } from 'react';
import JobDescriptionInput from './JobDescriptionInput';
import FileUpload from './FileUpload';
import InterviewerSetup from './InterviewerSetup';

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

  const handleSubmit = () => {
    if (!jobDescription) {
      alert('Job description is required');
      return;
    }
    onComplete({ jobDescription, pdfFile, interviewers });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Setup Interview</h1>
      
      <JobDescriptionInput
        value={jobDescription}
        onChange={setJobDescription}
      />
      
      <FileUpload
        onFileSelect={setPdfFile}
        selectedFile={pdfFile}
      />
      
      <InterviewerSetup
        interviewers={interviewers}
        setInterviewers={setInterviewers}
      />
      
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Complete Setup
      </button>
    </div>
  );
};

export default SetupInterview; 