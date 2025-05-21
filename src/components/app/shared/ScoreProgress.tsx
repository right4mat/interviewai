import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface ScoreProgressProps {
  score: number;
  size?: number;
  thickness?: number;
  showLabel?: boolean;
}

/**
 * A circular progress component that displays a score value
 */
export default function ScoreProgress({ score, size = 50, thickness = 8, showLabel = false }: ScoreProgressProps) {
  // Determine color based on score
  const getScoreColor = (value: number) => {
    if (value >= 70) return 'success.main';
    if (value >= 50) return 'warning.main';
    return 'error.main';
  };
  
  return (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress
        variant="determinate"
        value={score}
        size={size}
        thickness={thickness}
        sx={{ 
          color: getScoreColor(score),
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          fontWeight="bold"
          sx={{ fontSize: '0.9rem' }}
        >
          {`${score}`}
        </Typography>
      </Box>
      {showLabel && (
        <Typography 
          variant="body2" 
          sx={{ ml: 1, fontWeight: 'medium' }}
        >
          Score: {score}/100
        </Typography>
      )}
    </Box>
  );
} 