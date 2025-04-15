import React, { useState } from 'react';

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

  const handleAddInterviewer = () => {
    if (newInterviewer.name && newInterviewer.role) {
      setInterviewers([...interviewers, newInterviewer]);
      setNewInterviewer({ name: '', role: '' });
    }
  };

  const handleRemoveInterviewer = (index: number) => {
    const updatedInterviewers = interviewers.filter((_, i) => i !== index);
    setInterviewers(updatedInterviewers);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-700">Interviewers</h2>
      
      <div className="space-y-4">
        {interviewers.map((interviewer, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-md">
            <div className="flex-1">
              <p className="font-medium">{interviewer.name}</p>
              <p className="text-sm text-gray-600">{interviewer.role}</p>
            </div>
            <button
              onClick={() => handleRemoveInterviewer(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-4 p-4 border border-gray-200 rounded-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={newInterviewer.name}
              onChange={(e) =>
                setNewInterviewer({ ...newInterviewer, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <input
              type="text"
              value={newInterviewer.role}
              onChange={(e) =>
                setNewInterviewer({ ...newInterviewer, role: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={handleAddInterviewer}
          disabled={!newInterviewer.name || !newInterviewer.role}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          Add Interviewer
        </button>
      </div>
    </div>
  );
};

export default InterviewerSetup; 