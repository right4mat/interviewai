import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Gauge } from "@mui/x-charts/Gauge";
import { useTheme } from "@mui/material/styles";

interface ScoreProgressProps {
  score: number;
  size?: number;
  thickness?: number;
  showLabel?: boolean;
  fontSize?: number;
}

/**
 * A gauge component that displays a score value
 */
export default function ScoreProgress({ score, size = 50, thickness = 8, showLabel = false, fontSize = 0.9 }: ScoreProgressProps) {
  const theme = useTheme();

  // Determine color based on score
  const getScoreColor = (value: number) => {
    if (value >= 70) return theme.palette.success.main;
    if (value >= 50) return theme.palette.warning.main;
    return theme.palette.error.main;
  };
  
  return (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Gauge
        cornerRadius={20}
        value={Number(score.toFixed(0))}
        width={size}
        height={size}
        innerRadius={size / 2 - thickness}
        outerRadius={size / 2}
        text={({ value }) => `${value}`}
        sx={{
          "& .MuiGauge-valueText": {
            fontSize: `${fontSize}rem`,
            fontWeight: "bold"
          },
          "& .MuiGauge-referenceArc": {
            stroke: 'grey.200',
          },
          "& .MuiGauge-valueArc": {
            strokeColor: getScoreColor(score),
            fill: getScoreColor(score),
          }
        }}
      />
      {showLabel && (
        <Typography 
          variant="body2" 
          sx={{ ml: 1, fontWeight: 'medium', fontSize: `${fontSize}rem` }}
        >
          Score: {score}/100
        </Typography>
      )}
    </Box>
  );
}