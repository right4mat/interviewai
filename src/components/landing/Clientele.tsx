"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/system";
import { useT } from '@/i18n/client';

export interface ClienteleConfig {
  clienteleList: React.ReactNode[];
  videoSrc?: string; // Optional video source prop
}

export function Clientele({ clienteleList}: ClienteleConfig) {
  const theme = useTheme();
  const { t } = useT('landing');

  return (
    <Box 
      id="clientele" 
      sx={{ 
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '200px', // Adjust this value as needed
      }}
    >
      {/* Video Background */}


      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography component="p" variant="subtitle2" align="center" sx={{ color: "text.secondary", mb: 4 }}>
          {t('clientele.title')}
        </Typography>
        {/* <Typography component="p" variant="subtitle1" align="center" sx={{ color: "text.secondary", mb: 2 }}>
          {t('clientele.subtitle')}
        </Typography> */}
        <Grid container sx={{ justifyContent: "center", mt: 0.5, opacity: 0.6 }} spacing={4}>
          {clienteleList.map((Logo, index) => (
            <Grid  key={index}>{Logo}</Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
