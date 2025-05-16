import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Badge from './badge';

const BadgeDemo = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Badge Component Examples
      </Typography>
      
      <Grid container spacing={4}>
        {/* Default Badge */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h6">Default</Typography>
            <Badge />
          </Stack>
        </Grid>
        
        {/* Small Badge */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h6">Small Size</Typography>
            <Badge size="small" />
          </Stack>
        </Grid>
        
        {/* Large Badge */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h6">Large Size</Typography>
            <Badge size="large" />
          </Stack>
        </Grid>
        
        {/* Custom Colors */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h6">Success Variant</Typography>
            <Badge 
              backgroundColor="#4caf50" 
              textColor="#ffffff"
              borderColor="#2e7d32"
            />
          </Stack>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h6">Warning Variant</Typography>
            <Badge 
              backgroundColor="#ff9800" 
              textColor="#ffffff"
              borderColor="#e65100"
            />
          </Stack>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h6">Info Variant</Typography>
            <Badge 
              backgroundColor="#2196f3" 
              textColor="#ffffff"
              borderColor="#0d47a1"
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BadgeDemo; 