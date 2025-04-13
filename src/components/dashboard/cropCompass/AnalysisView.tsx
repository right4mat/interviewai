"use client";
import * as React from "react";
import { Grid, Card, Typography, Box } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ExploreIcon from "@mui/icons-material/Explore";
import SuddenWhiltGauge from "./SuddenWhiltGauge";
import CropCompassGauge from "./CropCompassGauge";
import { getCropCompassResult, getWhiltRisk, getWhiltRiskColor, getCropCompassColor, getComments } from "./utils";

interface AnalysisViewProps {
  onNext: () => void;
  netChargeBalance: number;
  whiltRisk: number;
  isDryTissue: boolean;
}

export default function AnalysisView({ onNext, netChargeBalance, whiltRisk, isDryTissue }: AnalysisViewProps): React.ReactElement {
  const whiltRiskColor = getWhiltRiskColor(whiltRisk);
  const cropCompassColor = getCropCompassColor(netChargeBalance);

  return (
    <Grid container spacing={3}>
      {!isDryTissue && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ p: 2, height: '100%', bgcolor: '#FAF8F5', borderColor: '#D0D0C8' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#555555', display: 'flex', alignItems: 'center' }}>
              <WarningAmberIcon sx={{ mr: 1, color: '#D68060' }} />
              Sudden Whilt Indicator
            </Typography>
            <SuddenWhiltGauge value={whiltRisk} />
            <Box sx={{ 
              mt: 2, 
              p: 1.5, 
              borderRadius: 1, 
              bgcolor: `${whiltRiskColor}10`, 
              border: `1px solid ${whiltRiskColor}30`,
              textAlign: 'center'
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium',  }}>
                {getWhiltRisk(whiltRisk)}
              </Typography>
            </Box>
          </Card>
        </Grid>
      )}
      <Grid size={{ xs: 12, md: isDryTissue ? 12 : 6 }}>
        <Card variant="outlined" sx={{ p: 2, height: '100%', bgcolor: '#FAF8F5', borderColor: '#D0D0C8' }} >
          <Typography variant="h6" sx={{ mb: 2, color: '#555555', display: 'flex', alignItems: 'center' }}>
            <ExploreIcon sx={{ mr: 1, color: '#5D7761' }} />
            Crop Compass
          </Typography>
          <CropCompassGauge value={netChargeBalance} />
          <Box sx={{ 
            mt: 2, 
            p: 1.5, 
            borderRadius: 1, 
            bgcolor: `${cropCompassColor}10`, 
            border: `1px solid ${cropCompassColor}30`,
            textAlign: 'center'
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', }}>
              {getCropCompassResult(netChargeBalance)}
            </Typography>
          </Box>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <Card variant="outlined" sx={{ p: 2, mt: 2, bgcolor: '#FAF8F5', borderColor: '#D0D0C8' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#555555' }}>
            Recommendations
          </Typography>
          <Box sx={{ 
            p: 2, 
            borderRadius: 1, 
            bgcolor: `${cropCompassColor}10`, 
            border: `1px solid ${cropCompassColor}30`
          }}>
            <Typography variant="body1">
              {getComments(netChargeBalance)}
            </Typography>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
} 