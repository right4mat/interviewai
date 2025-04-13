import * as React from "react";
import { Box } from "@mui/material";
import GaugeComponent from 'react-gauge-component';

export default function CropCompassGauge({ value }: { value: number }): React.ReactElement {
  return (
    <Box sx={{  display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <GaugeComponent
        id="yield-performance-gauge"
        type="semicircle"
        arc={{
          width: 0.3,
          padding: 0.02,
          subArcs: [
            { limit: -110, color: '#D68060', showTick: true },
            { limit: -100, color: '#E6C875', showTick: true },
            { limit: -80, color: '#5D7761', showTick: true },
            { limit: -70, color: '#697F6E', showTick: true },
            { limit: -60, color: '#A9BE9C', showTick: true },
            { limit: -50, color: '#E6C875', showTick: true },
            { limit: 0, color: '#D68060', showTick: true }
          ]
        }}
        pointer={{
          elastic: true,
          animationDelay: 0,
          width: 8,
          color: '#697F6E'
        }}
        labels={{
          valueLabel: { 
            formatTextValue: value => 'Medium',
            style: { fontSize: '1.2rem', color: '#555555' }
          },
          tickLabels: {
            type: 'outer',
            ticks: [
              { value: -200 },
              { value: -150 },
              { value: -100 },
              { value: -80 },
              { value: -60 },
              { value: -50 },
              { value: 0 }
            ]
          }
        }}
        value={value}
        minValue={-200}
        maxValue={0}
        style={{ width: '100%', maxWidth: '500px' }}
      />
    </Box>
  );
} 