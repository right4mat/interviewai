import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { Moon } from "lunarphase-js";



interface MoonPhaseDisplayProps {
  lunarAgePercent: number;
}

export default function MoonPhaseDisplay({ lunarAgePercent }: MoonPhaseDisplayProps) {
  // Calculate shadow based on lunar phase
  // 0 = new moon (full shadow from right)
  // 0.25 = first quarter (half shadow from left)
  // 0.5 = full moon (no shadow)
  // 0.75 = last quarter (half shadow from right)
  // 1 = new moon again (full shadow from right)
  
  let shadowWidth = 0;
  let shadowPosition: 'left' | 'right' = 'right';
  
  if (lunarAgePercent < 0.5) {
    // Waxing phase (new moon to full moon)
    shadowPosition = 'right';
    shadowWidth = 100 - (lunarAgePercent * 200); // 100% at new moon, 0% at full moon
  } else {
    // Waning phase (full moon to new moon)
    shadowPosition = 'left';
    shadowWidth = ((lunarAgePercent - 0.5) * 200); // 0% at full moon, 100% at new moon
  }
  
  // Ensure shadow width is within bounds
  shadowWidth = Math.max(0, Math.min(100, shadowWidth));

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "96px",
          height: "96px",
          borderRadius: "50%",
          bgcolor: "#E8E8E8", // Lighter color for the moon
          overflow: "hidden",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)"
        }}
      >
        {/* Shadow overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            [shadowPosition]: 0,
            height: "100%",
            width: `${shadowWidth}%`,
            bgcolor: "#333333", // Darker color for the shadow
            borderTopLeftRadius: shadowPosition === 'right' ? '50%' : '0',
            borderBottomLeftRadius: shadowPosition === 'right' ? '50%' : '0',
            borderTopRightRadius: shadowPosition === 'left' ? '50%' : '0',
            borderBottomRightRadius: shadowPosition === 'left' ? '50%' : '0'
          }}
        />
      </Box>
    </Box>
  );
}
