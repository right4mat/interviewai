import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Image from 'next/image';

interface LogoProps {
  fontSize?: number | string;
}

const Logo: React.FC<LogoProps> = ({ 
 
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
        <Box sx={{ mr: 0.5, height: 20, overflow: 'show', alignItems: 'center', justifyContent: 'flex-start' ,  display: 'flex' }}>
          <Image 
            src="/assets/images/icons/icon.png" 
            alt="Logo Icon"
            style={{ objectFit: "contain" }}
            width={200}
            height={150}
          />
        </Box>
       

      </Box>
    </Box>
  );
};

export default Logo;
