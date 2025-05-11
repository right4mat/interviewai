import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomizedInput from '@/components/shared/CustomizedInput';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ value, onChange }) => {
  return (
    <Box sx={{ mb: 2 }}>

      <CustomizedInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here..."
        multiline
        rows={8}
        fullWidth
        required
      />
    </Box>
  );
};

export default JobDescriptionInput;