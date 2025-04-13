'use client';

// @mui
import { keyframes } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

//@project
import LogoSection from '@/icons/LogoIcon';
import { ReactNode } from 'react';

const rotateAnimation = keyframes`
  0% { transform: rotate(0deg) }
  100% { transform: rotate(-360deg) }
`;

const dotAnimation = keyframes`
  0% { transform: rotate(-360deg) }
  100% { transform: rotate(0deg) }
`;

/***************************  PAGE LOADER  ***************************/

export default function PageLoader(): ReactNode {
  const commonProps: CircularProgressProps & { 
    disableShrink: boolean; 
    size: number; 
    variant: 'determinate'; 
    thickness: number; 
    color: 'primary' 
  } = { 
    disableShrink: true, 
    size: 100, 
    variant: 'determinate', 
    thickness: 4, 
    color: 'primary' 
  };

  return (
    <Stack direction="row" sx={{ position: 'relative', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Avatar sx={{ width: 65, height: 65, bgcolor: 'transparent', '& .MuiBox-root': { height: 'fit-content', width: 28 } }}>
        <LogoSection width={28} height={28} />
      </Avatar>
      <CircularProgress
        {...commonProps}
        value={100}
        sx={{
          position: 'absolute',
          zIndex: 1,
          '& .MuiCircularProgress-circle': { strokeLinecap: 'round', strokeDasharray: '6 9.5 !important' },
          animation: `${dotAnimation} 6s linear infinite`
        }}
      />
      <CircularProgress
        {...commonProps}
        value={60}
        sx={{
          position: 'absolute',
          zIndex: 1,
          '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
          animation: `${rotateAnimation} 35s linear infinite`
        }}
      />
    </Stack>
  );
}
