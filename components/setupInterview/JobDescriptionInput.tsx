import React from 'react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Job Description <span className="text-red-500">*</span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here..."
        className="w-full h-48 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </div>
  );
};

export default JobDescriptionInput; 