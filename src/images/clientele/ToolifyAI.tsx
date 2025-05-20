"use client";
import React from "react";
import PropTypes from "prop-types";

// @mui
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

/***************************  IMAGE - ELDERS LIMITED  ***************************/

interface ImageSizeProps {
  width?: any;
  height?: any;
}

interface WesfarmersProps {
  imageSize?: ImageSizeProps;
}

export default function Wesfarmers({ imageSize }: WesfarmersProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        lineHeight: 0,
        "& svg": { width: imageSize?.width || { xs: 89, sm: 105, md: 132 }, height: imageSize?.height || { xs: 16, sm: 18, md: 26 } }
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 2048 450" width="910" height="200">
        <path
          transform="translate(206,88)"
          d="m0 0h37l19 4 17 6 19 10 11 8 14 12 9 10 9 13 11 21 6 18 4 22v25l-4 22-6 18-8 16-9 14-12 14-12 11-13 9-21 11-19 6-16 3-8 1h-20l-19-3-20-6-19-9-12-8-11-9-8-7-9-11-9-13-8-15-7-19-4-20v-35l5-23 8-20 8-14 12-16 16-16 16-11 17-9 21-7zm12 62-15 3-12 5-10 6-10 9-7 8-8 14-4 12-2 13v9l3 17 5 12 7 12 14 14 14 8 13 5 11 2h15l14-3 13-5 11-7 11-10 7-10 7-14 3-11 1-7v-15l-4-18-8-16-11-13-12-9-12-6-14-4-6-1z"
          fill={theme.palette.primary.main}
        />
        <path
          transform="translate(1849,162)"
          d="m0 0h11l22 2 21 5 15 6 9 6 5 4 7 11 4 12 1 7 1 117 2 8 5 5 3 2v10h-67v-18l-15 11-16 8-16 4-7 1h-16l-14-2-14-5-14-9-8-9-6-12-3-13v-14l3-14 7-14 8-9 14-9 16-6 20-4 39-5 13-4 5-4 1-2v-10l-4-6-6-4-9-2h-13l-10 2-8 4-5 8-4 11h-60l1-14 5-15 5-9 8-10 11-8 15-7 17-4zm36 106-12 4-32 6-12 4-7 5-4 7-1 4v10l4 8 6 5 9 3h12l13-3 13-7 7-8 4-10 1-5v-23z"
          fill={theme.palette.primary.main}
        />
        <path
          transform="translate(1036,175)"
          d="m0 0h26l18 4 17 8 11 8 10 9 10 13 8 16 5 19 1 10v11l-2 14-5 16-7 14-11 14-10 9-14 9-15 6-18 4h-23l-18-4-16-7-12-8-11-10-10-13-8-16-4-13-2-14v-14l2-14 6-18 6-11 10-13 8-8 13-9 12-6 16-5zm4 51-11 4-9 7-6 8-4 9-1 5v17l4 11 6 9 9 7 9 4 4 1h16l11-4 9-6 7-9 4-10 1-5v-14l-3-11-6-10-9-8-10-4-3-1z"
          fill={theme.palette.primary.main}
        />
        <path
          transform="translate(829,175)"
          d="m0 0h27l17 4 16 7 14 10 12 12 10 15 6 15 3 11 1 7v22l-4 18-5 12-6 11-8 10-10 10-14 9-13 6-15 4-6 1h-24l-17-4-15-6-12-8-10-9-9-10-8-13-6-15-3-14v-26l4-17 7-16 9-13 7-8 14-11 15-8 17-5zm4 51-12 5-9 7-6 10-3 8-1 6v10l3 12 5 9 8 8 9 5 8 2h15l10-3 9-6 8-9 4-9 2-16-2-12-6-12-4-5-9-6-11-4z"
          fill={theme.palette.primary.main}
        />
        <path
          transform="translate(1458,179)"
          d="m0 0h56l4 9 21 57 14 39 2-4 20-65 10-33 2-3h55l-1 5-19 55-17 48-20 57-8 20-8 16-9 13-11 12-13 9-11 5-14 4-18 2h-10v-50l17-2 10-4 8-7 6-11 1-7-18-43-20-48-18-43-12-29z"
          fill={theme.palette.primary.main}
        />
        <path transform="translate(585,110)" d="m0 0h182v53l-62 1-1 190h-56v-191h-63z" fill={theme.palette.primary.main} />
        <path
          transform="translate(1435,104)"
          d="m0 0h14l1 1v49l-1 1-14 1-8 3-5 5-3 7-2 8h32l1 1v49l-1 1h-32v124h-52v-124h-23l-1-1v-49l1-1h21l1-2 3-22 5-15 7-11 7-8 10-7 11-5 11-3z"
          fill={theme.palette.primary.main}
        />
        <path transform="translate(1172,99)" d="m0 0h52v255h-52l-1-1v-253z" fill={theme.palette.primary.main} />
        <path transform="translate(1987,184)" d="m0 0h51l1 1v174l-1 1h-52v-175z" fill={theme.palette.primary.main} />
        <path transform="translate(1263,179)" d="m0 0h51l1 1v174h-52l-1-3v-170z" fill={theme.palette.primary.main} />
        <path
          transform="translate(432,251)"
          d="m0 0 12 1 3 1-2 15-6 23-8 22-8 17-10 17-12 17-4-1-8-6-9-11-8-16-3-14v-11l3-14 7-14 9-10 10-7 10-5 12-3z"
          fill={theme.palette.primary.main}
        />
        <path
          transform="translate(132,369)"
          d="m0 0h13l14 3 13 7 12 11 8 13 4 11 2 11v13l-1 8-3 1-29-6-21-7-18-8-17-9-15-10-9-7 2-5 5-6 11-9 16-8z"
          fill={theme.palette.primary.main}
        />
        <path
          transform="translate(6,248)"
          d="m0 0h19l16 4 13 7 12 11 7 11 4 10 2 12-1 15-4 13-6 11-11 13-8 6-4-2-9-13-9-15-10-21-7-20-5-19-3-17v-5z"
          fill={theme.palette.primary.main}
        />
        <path
          transform="translate(49,85)"
          d="m0 0 5 2 9 8 8 11 5 10 3 9 1 6v16l-3 12-6 12-11 12-10 7-12 5-8 2-17 1-10-1v-8l5-23 9-27 10-21 13-21z"
          fill={theme.palette.primary.main}
        />
        <path
          transform="translate(296,371)"
          d="m0 0h21l14 4 11 6 13 11 6 8v3l-13 9-15 9-16 8-20 8-21 6-22 4h-5l-1-5v-18l4-15 7-14 10-11 10-7 12-5z"
          fill={theme.palette.primary.main}
        />
        <path
          transform="translate(253,3)"
          d="m0 0 13 1 21 5 18 6 18 8 19 10 17 12 5 4-1 4-11 12-14 9-15 5-5 1h-15l-13-3-13-7-10-9-7-10-6-13-2-9v-25z"
          fill={theme.palette.primary.main}
        />
        <path
          transform="translate(196,2)"
          d="m0 0h4l1 2v22l-3 12-4 10-8 11-8 8-14 8-10 3-13 1-14-2-15-6-11-8-10-10-3-4 2-4 13-9 15-9 21-10 20-7 19-5z"
          fill={theme.palette.primary.main}
        />
        <path
          transform="translate(400,88)"
          d="m0 0h3l14 21 8 14 10 23 6 19 5 22 1 13-3 1h-21l-15-4-13-7-11-10-6-9-5-11-2-8v-19l4-14 7-13 9-10z"
          fill={theme.palette.primary.main}
        />
        <path
          transform="translate(1671,294)"
          d="m0 0h14l9 3 9 7 6 9 3 10v8l-3 10-6 9-9 7-9 3h-13l-11-4-9-8-6-12-1-5v-8l3-10 6-9 9-7z"
          fill={theme.palette.primary.main}
        />
        <path
          transform="translate(2006,106)"
          d="m0 0h13l10 4 9 8 5 10 1 4v11l-4 11-7 8-12 6-5 1h-8l-9-3-9-6-6-9-3-8v-11l4-11 8-9 9-5z"
          fill={theme.palette.primary.main}
        />
        <path
          transform="translate(1284,101)"
          d="m0 0h9l10 3 8 6 6 8 3 8v13l-4 10-8 9-10 5-4 1h-11l-10-4-8-7-6-9-2-8v-7l3-10 6-8 7-6 6-3z"
          fill={theme.palette.primary.main}
        />
      </svg>
    </Box>
  );
}
