import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

interface BadgeProps {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  size?: 'small' | 'medium' | 'large';
}

const Badge = ({
  backgroundColor,
  textColor = 'white',
  borderColor, 
  size = 'medium'
}: BadgeProps) => {
  const theme = useTheme();

  // Default colors based on theme
  const bgColor = backgroundColor || theme.palette.primary.main;
  const txtColor = textColor || theme.palette.primary.contrastText;
  const bdrColor = borderColor || theme.palette.primary.main;

  // Size configurations
  const sizeConfig = {
    small: {
      width: 180,
      height: 65,
      fontSize: '0.8rem',
      starSize: 14,
      laurelSize: 55,
    },
    medium: {
      width: 220,
      height: 80,
      fontSize: '0.875rem',
      starSize: 16,
      laurelSize: 70,
    },
    large: {
      width: 280,
      height: 100,
      fontSize: '1rem',
      starSize: 20,
      laurelSize: 90,
    },
  };

  const { width, height, fontSize, starSize, laurelSize } = sizeConfig[size];

  return (
    <Box
      sx={{
        position: 'relative',
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
    >
      {/* Left Laurel */}
      <Box
        component='img'
        src='/assets/images/svgs/laurel.svg'
        alt='Laurel Left'
        sx={{
          position: 'absolute',
          height: laurelSize,
          filter: `drop-shadow(0px 0px 1px ${bdrColor})`,
        }}
      />

      {/* Stars */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%', // Control width of star container
          justifyContent: 'center', // Center stars horizontally
        }}
      >
        {[...Array(5)].map((_, index) => (
          <Box
            key={index}
            component='img'
            src='/assets/images/svgs/star.svg'
            alt='Star'
            sx={{
              width: starSize,
              height: starSize,
              filter: `drop-shadow(0px 0px 1px ${bdrColor})`,
            }}
          />
        ))}
      </Stack>

      {/* Badge Content */}
      <Stack
        alignItems='center'
        spacing={0.5}
        sx={{ 
          pt: 4,
        }}
      >
        
        <Typography
          variant='body1'
          color='primary.main'
          sx={{
            fontSize: fontSize,
            textAlign: 'center',
            lineHeight: 1.2,
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            opacity: 0.8,
          }}
        >
          #1 interview prep
        </Typography>
      </Stack>
    </Box>
  );
};

export default Badge;
