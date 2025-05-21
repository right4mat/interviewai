import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomInput from '@/components/shared/CustomizedInput';
import LinearProgress from '@mui/material/LinearProgress';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ value, onChange, loading = false }) => {
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
        disabled={loading}
      />
      {loading && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: 1, textAlign: 'center' }}
          >
            AI is reading the job description...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default JobDescriptionInput;