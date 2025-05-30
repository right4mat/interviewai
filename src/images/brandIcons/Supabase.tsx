"use client";
import PropTypes from "prop-types";
import type { ReactNode } from "react";

// @mui
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

/***************************  IMAGE - MUI  ***************************/

interface MuiProps {
  imageSize?: {
    width?: number | { xs: number; sm: number; md: number };
    height?: number | { xs: number; sm: number; md: number };
  };
}

export default function Mui({ imageSize }: MuiProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        lineHeight: 0,
        "& svg": { width: imageSize?.width || { xs: 89, sm: 105, md: 80 }, height: imageSize?.height || { xs: 16, sm: 18, md: 26 } }
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="109" height="113" viewBox="0 0 109 113" fill="none">
        <path
          d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0625L99.1935 40.0625C107.384 40.0625 111.952 49.5226 106.859 55.9372L63.7076 110.284Z"
          fill="url(#paint0_linear)"
        />
        <path
          d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0625L99.1935 40.0625C107.384 40.0625 111.952 49.5226 106.859 55.9372L63.7076 110.284Z"
          fill="url(#paint1_linear)"
          fillOpacity="0.2"
        />
        <path
          d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
          fill="#3ECF8E"
        />
        <defs>
          <linearGradient id="paint0_linear" x1="53.9738" y1="54.9738" x2="94.1635" y2="71.8293" gradientUnits="userSpaceOnUse">
            <stop stopColor="#249361" />
            <stop offset="1" stopColor="#3ECF8E" />
          </linearGradient>
          <linearGradient id="paint1_linear" x1="36.1558" y1="30.5779" x2="54.4844" y2="65.0804" gradientUnits="userSpaceOnUse">
            <stop />
            <stop offset="1" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </Box>
  );
}
