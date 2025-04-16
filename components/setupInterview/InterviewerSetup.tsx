import React, { useState } from 'react';
import { Interviewer } from '@/types/interview';

interface InterviewerSetupProps {
  interviewers: Interviewer;
  setInterviewers: (interviewer: Interviewer) => void;
}

const InterviewerSetup: React.FC<InterviewerSetupProps> = ({
  interviewers,
  setInterviewers,
}) => {
  const handleNameChange = (name: string) => {
    setInterviewers({ ...interviewers, name });
  };

  const handleRoleChange = (role: string) => {
    setInterviewers({ ...interviewers, role });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-700">Interviewer</h2>
      
      <div className="space-y-4 p-4 border border-gray-200 rounded-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={interviewers.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="AI Interviewer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <input
              type="text"
              value={interviewers.role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Senior Technical Recruiter"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewerSetup; 