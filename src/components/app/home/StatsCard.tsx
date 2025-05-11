"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";
import { StatCardProps } from "./types";
import { AreaGradient } from "./AreaGradient";

const trendValues: Record<string, string> = { up: "+25%", down: "-25%", neutral: "+5%" };
const labelColors: Record<string, "success" | "error" | "default"> = {
  up: "success",
  down: "error",
  neutral: "default"
};

export function StatsCard({ title, value, interval, trend, data, color }: StatCardProps) {
  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack direction="column" sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}>
          <Stack sx={{ justifyContent: "space-between" }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h4" component="p">
                {value}
              </Typography>
              <Chip size="small" color={labelColors[trend]} label={trendValues[trend]} />
            </Stack>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {interval}
            </Typography>
          </Stack>
          {data.length > 0 && (
            <Box sx={{ width: "100%", height: 50 }}>
              <SparkLineChart
                colors={[color]}
                data={data}
                area
                showHighlight
                showTooltip
                sx={{
                  [`& .${areaElementClasses.root}`]: {
                    fill: `url(#area-gradient-${title})`
                  }
                }}
              >
                <AreaGradient color={color} id={`area-gradient-${title}`} />
              </SparkLineChart>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
} 