import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
}

const LogoIcon: React.FC<LogoProps> = ({ 
  width = 80,
  height = 80
}) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
          <Image 
            src="/assets/images/icons/icon3.png" 
            alt="Logo Icon"
            style={{ objectFit: "contain" }}
            width={width || 80}
            height={height || 80}
          />
      
       

      </Box>
    </Box>
  );
};

export default LogoIcon;
