"use client";
import  { ReactNode } from "react";

// @mui
import Stack from "@mui/material/Stack";

// @assets
import PageLoader from "@/images/graphics/PageLoader";

/***************************  COMMON - LOADER OVERLAY ***************************/

export default function LoaderOverlay(): ReactNode {
  return (
    <Stack
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        zIndex: 99999999
      }}
    >
      <PageLoader />
    </Stack>
  );
}
