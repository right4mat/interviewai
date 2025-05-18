import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { brand } from "@/theme/themePrimitives";

interface QuestionsProgressProps {
  answered: number;
  total?: number;
  height?: number;
  color?: string;
}

/**
 * A linear progress component that displays question completion progress
 */
export default function QuestionsProgress({ 
  answered, 
  total = 10, 
  height = 20, 
  color = brand[500] 
}: QuestionsProgressProps) {
  const progressPercent = Math.round((answered / total) * 100);
  
  return (
    <Box sx={{ width: '100%', height: '100%', mr: 1, display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1, position: 'relative' }}>
        <LinearProgress 
          variant="determinate" 
          value={progressPercent}
          sx={{
            height: height,
            borderRadius: height / 2,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: height / 2,
              backgroundColor: color,
            },
          }}
        />
        
      </Box>
      <Box sx={{ minWidth: 60 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 'bold',
            color: 'text.primary',
          }}
        >
          {`${progressPercent}%`}
        </Typography>
      </Box>
    </Box>
  );
} 