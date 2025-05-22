"use client";
import PropTypes from "prop-types";
import { type ReactNode } from "react";

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
      <svg
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="2"
      >
        <g transform="translate(.722 .64) scale(6.375)">
          <circle cx="40" cy="40" r="40" />
          <path
            d="M66.448 70.009L30.73 24H24v31.987h5.384v-25.15l32.838 42.427a40.116 40.116 0 004.226-3.255z"
            fill="url(#prefix___Linear1)"
            fillRule="nonzero"
          />
          <path fill="url(#prefix___Linear2)" d="M51.111 24h5.333v32h-5.333z" />
        </g>
        <defs>
          <linearGradient
            id="prefix___Linear1"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientUnits="userSpaceOnUse"
            gradientTransform="rotate(51.103 -29.93 76.555) scale(25.1269)"
          >
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="prefix___Linear2"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientUnits="userSpaceOnUse"
            gradientTransform="rotate(90.218 14.934 38.787) scale(23.50017)"
          >
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </Box>
  );
}
