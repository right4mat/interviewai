"use client";
import PropTypes from "prop-types";
import { ReactNode } from "react";

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
      <svg xmlns="http://www.w3.org/2000/svg" width="483" height="90" viewBox="0 0 483 90" fill="none">
        <path
          d="M19.8361 88.9451H0V18.2524H26.9054L39.8833 47.5846L46.8471 65.8381H48.2187L54.8659 47.5846L67.2108 18.2524H94.1162V88.9451H74.28V59.7184L75.0186 47.9011H73.647L69.6375 59.7184L59.0864 84.7246H35.0298L24.4787 59.7184L20.4692 47.9011H19.0976L19.8361 59.7184V88.9451Z"
          fill={theme.palette.primary.main}
        />
        <path
          d="M273.263 88.9451H259.336C252.723 88.9451 247.518 87.2921 243.72 83.986C239.992 80.68 238.128 75.5803 238.128 68.6869V26.5878H257.964V65.8381C257.964 67.9483 258.351 69.3551 259.125 70.0585C259.969 70.762 261.516 71.1137 263.767 71.1137H273.263V88.9451ZM273.263 52.0161H230.32V35.7673H273.263V52.0161Z"
          fill={theme.palette.primary.main}
        />
        <path
          d="M297.834 88.9451H277.998V35.7673H296.568V50.961L297.834 51.4885V88.9451ZM297.834 57.1861H294.141V49.6948H297.623C298.115 46.7405 299.065 44.1379 300.472 41.887C301.879 39.6361 303.778 37.8776 306.169 36.6114C308.631 35.3453 311.621 34.7122 315.138 34.7122C319.077 34.7122 322.242 35.5211 324.634 37.139C327.026 38.6865 328.749 40.8319 329.804 43.5752C330.929 46.3185 331.492 49.4838 331.492 53.0712V63.6223H311.656V57.3972C311.656 55.1463 311.164 53.5988 310.179 52.7547C309.194 51.8402 307.4 51.383 304.798 51.383C302.125 51.383 300.296 51.8402 299.311 52.7547C298.326 53.5988 297.834 55.0759 297.834 57.1861Z"
          fill={theme.palette.primary.main}
        />
        <path
          d="M365.348 90.0002C359.369 90.0002 354.058 89.0858 349.416 87.2569C344.773 85.428 341.151 82.4737 338.548 78.3939C335.946 74.3142 334.644 68.9683 334.644 62.3562C334.644 56.5882 335.946 51.6644 338.548 47.5846C341.151 43.4345 344.703 40.2692 349.205 38.0886C353.777 35.8377 359.017 34.7122 364.926 34.7122C371.046 34.7122 376.356 35.7322 380.858 37.772C385.36 39.7416 388.842 42.6959 391.304 46.635C393.766 50.5038 394.997 55.2869 394.997 60.9846C394.997 61.899 394.962 62.7431 394.891 63.5168C394.891 64.2202 394.821 65.0643 394.68 66.0491H347.622V56.0255H380.331L376.005 62.2507C376.005 61.6176 376.005 61.0197 376.005 60.457C376.005 59.8239 376.005 59.1909 376.005 58.5578C376.005 55.3221 375.161 53.0712 373.473 51.8051C371.855 50.5389 368.865 49.9059 364.504 49.9059C360.002 49.9059 356.942 50.6093 355.325 52.0161C353.777 53.4229 353.003 55.9552 353.003 59.6129V64.6775C353.003 68.4055 353.812 70.9378 355.43 72.2743C357.048 73.6108 360.108 74.279 364.61 74.279C368.619 74.279 371.292 73.9273 372.628 73.2239C374.035 72.4501 374.739 71.2895 374.739 69.742V68.5814H394.575V69.8475C394.575 73.7866 393.379 77.2685 390.987 80.2931C388.596 83.3178 385.219 85.7094 380.858 87.4679C376.497 89.1561 371.327 90.0002 365.348 90.0002Z"
          fill={theme.palette.primary.main}
        />
        <path
          d="M457.175 88.9451H438.605V77.1278H437.55V58.2413C437.55 55.5683 436.847 53.8801 435.44 53.1767C434.103 52.403 431.677 52.0161 428.16 52.0161C424.924 52.0161 422.673 52.403 421.407 53.1767C420.211 53.9505 419.613 55.4628 419.613 57.7137V58.1357H399.777V57.9247C399.777 53.2119 401.008 49.1321 403.47 45.6854C405.932 42.1683 409.414 39.4602 413.916 37.561C418.417 35.6618 423.658 34.7122 429.637 34.7122C435.827 34.7122 440.962 35.697 445.041 37.6665C449.121 39.5657 452.146 42.309 454.115 45.8964C456.155 49.4135 457.175 53.6691 457.175 58.6633V88.9451ZM417.503 90.0002C411.524 90.0002 406.881 88.6989 403.575 86.0963C400.34 83.4937 398.722 79.9414 398.722 75.4396C398.722 72.9074 399.32 70.6564 400.516 68.6869C401.711 66.7173 403.575 65.1347 406.108 63.9389C408.64 62.6727 411.911 61.8286 415.92 61.4066L438.605 59.1909V70.1641L421.196 72.1688C420.281 72.2391 419.613 72.4501 419.191 72.8018C418.839 73.1535 418.664 73.6108 418.664 74.1735C418.664 75.0176 419.05 75.5803 419.824 75.8617C420.668 76.0727 421.864 76.1782 423.412 76.1782C426.929 76.1782 429.707 76.0023 431.747 75.6506C433.787 75.2286 435.264 74.49 436.178 73.4349C437.093 72.3798 437.55 70.8675 437.55 68.8979L439.027 68.4759V77.7609H437.55C436.565 81.4889 434.42 84.4784 431.114 86.7293C427.808 88.9099 423.271 90.0002 417.503 90.0002Z"
          fill={theme.palette.primary.main}
        />
        <path d="M482.891 88.9451H463.055V18.2524H482.891V88.9451Z" fill={theme.palette.primary.main} />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M163.226 28.6991C163.226 44.5492 150.565 55.6045 132.733 55.6045C114.902 55.6045 100.447 46.6361 100.447 28.6991C100.447 11.3348 113.108 0 130.94 0C148.771 0 163.226 9.46175 163.226 28.6991ZM147.025 28.2363C147.025 35.9057 145.289 41.2551 132.27 41.2551C119.252 41.2551 116.648 36.9155 116.648 28.2363C116.648 19.8342 119.309 14.3496 131.402 14.3496C143.495 14.3496 147.025 19.7307 147.025 28.2363ZM207.784 88.9464H227.621V54.8663C227.621 50.9975 226.847 47.5508 225.299 44.5261C223.822 41.5015 221.501 39.1099 218.336 37.3514C215.241 35.5928 211.301 34.7136 206.518 34.7136C201.805 34.7136 197.937 35.5577 194.912 37.2459C191.958 38.8637 189.707 40.9739 188.159 43.5765C186.682 46.1792 185.733 48.9576 185.31 51.9119H184.255V32.1813H165.685V88.9464H185.522V61.5135C185.522 58.0668 186.225 55.7104 187.632 54.4442C189.109 53.1077 192.028 52.4395 196.389 52.4395C200.75 52.4395 203.74 53.1429 205.358 54.5497C206.976 55.8862 207.784 58.4185 207.784 62.1465V88.9464Z"
          fill={theme.palette.primary.main}
        />
      </svg>
    </Box>
  );
}
