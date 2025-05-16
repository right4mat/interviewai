import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomInput from '@/components/shared/CustomizedInput';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ value, onChange }) => {
  return (
    <Box sx={{ mb: 2 }}>

      <CustomInput
      sx={{
        backgroundColor: 'white',
      }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here..."
        rows={8}
        multiline
        fullWidth
        required
      />
    </Box>
  );
};

export default JobDescriptionInput;