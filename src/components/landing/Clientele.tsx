import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/system";


export interface ClienteleConfig {
  title: string;
  clienteleList: any;
}

export function Clientele({ clienteleList, title }: ClienteleConfig) {
  const theme = useTheme();

  return (
    <Box id="clientele" sx={{ py: 4 }}>
      <Typography component="p" variant="subtitle2" align="center" sx={{ color: "text.secondary" }}>
        {title}
      </Typography>
      <Grid container sx={{ justifyContent: "center", mt: 0.5, opacity: 0.6 }} spacing={4}>
        {clienteleList.map((Logo:any, index: number) => (
          <Grid key={index}><Logo imageSize={{ width: 200, height: 160 }} /></Grid>
        ))}
      </Grid>
    </Box>
  );
}
