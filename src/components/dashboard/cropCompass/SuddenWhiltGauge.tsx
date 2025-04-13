import * as React from "react";
import { Typography, Box } from "@mui/material";
import GaugeComponent from 'react-gauge-component';

export default function SuddenWhiltGauge({ value }: { value: number }): React.ReactElement {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <GaugeComponent
        id="crop-acreage-gauge"
        type="semicircle"
        arc={{
          width: 0.3,
          padding: 0.02,
          subArcs: [
            { limit: 30, color: '#5D7761', showTick: true },
            { limit: 50, color: '#E6C875', showTick: true },
            { limit: 100, color: '#D68060', showTick: true }
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
            formatTextValue: value => {
              if (value <= 30) return 'Plant Will Recover';
              if (value <= 50) return 'Plant Might Recover';
              return 'Plant Death Imminent';
            },
            style: { fontSize: '1.2rem', color: '#555555' }
          },
          tickLabels: {
            type: 'outer',
            ticks: [
              { value: 0 },
              { value: 20 },
              { value: 40 },
              { value: 60 },
              { value: 80 },
              { value: 100 }
            ]
          }
        }}
        value={value}
        minValue={0}
        maxValue={100}
        style={{ width: '100%', maxWidth: '500px' }}
      />
 
    </Box>
  );
} 